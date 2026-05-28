/**
 * useAudioEngine — Web Audio API hook
 * Pillar 3: Ambient industrial hum + beer-can-pop SFX
 * Must be "use client" only — called from Navbar.tsx
 */

import { useRef, useCallback } from "react";

interface AudioEngine {
  startAmbient: () => void;
  stopAmbient: () => void;
  playCanPop: () => void;
}

export function useAudioEngine(): AudioEngine {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  /** ─── AMBIENT INDUSTRIAL HUM ───────────────────────────────────────
   *  Three layers stacked:
   *  1. Sub-bass drone  ~42 Hz   (sinusoid, very subtle)
   *  2. Mid rumble      ~110 Hz  (sawtooth filtered — boiler/crowd blend)
   *  3. Pink-noise wash (filtered white noise for HVAC/crowd chatter)
   */
  const startAmbient = useCallback(() => {
    const ctx = getCtx();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2.5);
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Layer 1 — sub-bass drone
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 42;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.35;
    drone.connect(droneGain).connect(masterGain);
    drone.start();

    // Layer 2 — mid sawtooth through lowpass (crowd murmur)
    const crowd = ctx.createOscillator();
    crowd.type = "sawtooth";
    crowd.frequency.value = 110;
    const crowdFilter = ctx.createBiquadFilter();
    crowdFilter.type = "lowpass";
    crowdFilter.frequency.value = 280;
    crowdFilter.Q.value = 0.6;
    const crowdGain = ctx.createGain();
    crowdGain.gain.value = 0.12;
    crowd.connect(crowdFilter).connect(crowdGain).connect(masterGain);
    crowd.start();

    // Slow LFO wobble on crowd freq for organic feel
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 4;
    lfo.connect(lfoGain).connect(crowd.frequency);
    lfo.start();

    // Layer 3 — pink-noise via filtered white noise buffer
    const bufferSize = ctx.sampleRate * 3; // 3 s loop
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 380;
    noiseFilter.Q.value = 0.4;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.18;
    noiseSource.connect(noiseFilter).connect(noiseGain).connect(masterGain);
    noiseSource.start();

    nodesRef.current = [drone, crowd, lfo, noiseSource];
  }, [getCtx]);

  const stopAmbient = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !gainRef.current) return;
    const gain = gainRef.current;
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    const nodes = nodesRef.current;
    setTimeout(() => {
      nodes.forEach((n) => {
        try { (n as OscillatorNode | AudioBufferSourceNode).stop(); } catch { /* already stopped */ }
      });
      nodesRef.current = [];
    }, 1600);
  }, []);

  /** ─── BEER CAN POP SFX ─────────────────────────────────────────────
   *  Playback of real audio file for maximum fidelity
   */
  const playCanPop = useCallback(() => {
    try {
      const audio = new Audio("/sounds/can_open.mp3");
      audio.volume = 0.8;
      audio.play().catch(e => console.warn("Audio play failed:", e));
    } catch (e) {
      console.warn("Audio API not supported", e);
    }
  }, []);

  return { startAmbient, stopAmbient, playCanPop };
}
