export interface Product {
  id: number;
  name: string;
  mainCategory: string; // Ex: Calçados, Bolsas, Acessórios
  category: string;     // Ex: Reparos, Pintura, Limpeza
  price: number;
  description: string;
  image: string;
  rating: number;
  instagram_url?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendedProductIds?: number[];
}

export enum PageView {
  HOME = 'HOME',
  CHECKOUT = 'CHECKOUT'
}