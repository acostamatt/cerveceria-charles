export const siteData = {
  name: "CHARLES.",
  tagline: "CRAFT BEER & BURGERS",
  location: "San Juan 1827",
  city: "Rosario, Argentina",
  hours: "Mar-Vie desde 18 hs • Sáb desde 19 hs",
  happyHour: "Happy Hour: 18:00 a 20:30 hs",
  instagram: "https://instagram.com/cerveceriacharles",
};

export interface Beer {
  id: string;
  name: string;
  color: string;
  ibu: number;
  abv: string;
  description: string;
  image: string;
  price?: string;
  tapNumber?: number;
  temp?: string;
}

export const beers: Beer[] = [
  {
    id: "ipa",
    name: "IPA",
    color: "Rubia",
    ibu: 55,
    abv: "5.0%",
    description: "Amargor intenso y notas cítricas. Un golpe de lúpulo directo al paladar.",
    image: "/images/beers/ipa.jpg",
    price: "$4.200",
    tapNumber: 12,
    temp: "4º C",
  },
  {
    id: "red-ipa",
    name: "RED IPA",
    color: "Roja",
    ibu: 60,
    abv: "6.3%",
    description: "Caramelo tostado fundido con el amargor potente del lúpulo. Fuerte y con carácter.",
    image: "/images/beers/red-ipa.jpg",
    price: "$4.500",
    tapNumber: 8,
    temp: "4º C",
  },
  {
    id: "honey",
    name: "HONEY",
    color: "Rubia",
    ibu: 23,
    abv: "4.8%",
    description: "Suave, dulce y refrescante con un toque de miel natural. Peligrosamente fácil de tomar.",
    image: "/images/beers/honey.jpg",
    price: "$4.000",
    tapNumber: 4,
    temp: "6º C",
  },
  {
    id: "porter",
    name: "PORTER",
    color: "Negra",
    ibu: 20,
    abv: "4.0%",
    description: "Maltas oscuras con notas profundas a café y chocolate amargo. Espuma densa.",
    image: "/images/beers/porter.jpg",
    price: "$4.300",
    tapNumber: 9,
    temp: "8º C",
  },
];

export interface FoodItem {
  id: string;
  name: string;
  price: string;
  description: string;
  tag: string;
  image: string;
}

export const food: FoodItem[] = [
  {
    id: "carlito-braseada",
    name: "Carlito de Carne Braseada",
    price: "$10.000",
    description: "Un clásico rosarino llevado al extremo. Carne braseada desmechada que se deshace en la boca, atrapada entre panes tostados.",
    tag: "NUEVO",
    image: "/images/food/carlito-braseada.jpg",
  },
  {
    id: "hamburguesa-charles",
    name: "Hamburguesa Charles",
    price: "$9.800",
    description: "Doble carne casera, panceta crujiente, cebolla de verdeo y una avalancha de queso cheddar.",
    tag: "CLÁSICO",
    image: "/images/food/burger-charles.jpg",
  },
  {
    id: "milanesa-picada",
    name: "Milanesa Picada",
    price: "$9.500",
    description: "El picoteo definitivo para acompañar pintas. Nuestra famosa milanesa cortada en bocados, lista para compartir.",
    tag: "",
    image: "/images/food/milanesa-picada.png",
  },
  {
    id: "pizza-ternera",
    name: "Pizza de Ternera",
    price: "$19.000",
    description: "Ternera desmechada sobre masa a la piedra con muzzarella fundida. 8 porciones de pura potencia.",
    tag: "PARA COMPARTIR",
    image: "/images/food/pizza-ternera.png",
  },
  {
    id: "papas-guacamole",
    name: "Papas Guacamole",
    price: "$9.000",
    description: "Papas rústicas coronadas con nuestro guacamole casero fresco.",
    tag: "",
    image: "/images/food/papas-guacamole.png",
  },
];
