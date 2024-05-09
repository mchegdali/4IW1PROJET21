export interface Product {
  _id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  description: string;
}

export interface ProductsResponse {
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  data: Product[];
}
