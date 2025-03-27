export interface Ticket {
  id: string;
  event: string;
  info: string;
  date: string;
  location: string;
  price: number;
  available: number;
  image: string;
  featured: boolean;
  trending: boolean;
  special: boolean;
  status: string;
  category: string;
}
