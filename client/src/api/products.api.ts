export type ProductCategory = {
  _id: string;
  id: string;
  name: string;
  slug: string;
};

export interface Product {
  _id: string;
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  image: string;
  price: string;
  description: string;
  origin: string;
  brewingInstructions: {
    temperature: number;
    steepTime: number;
  };
  weightGrams: number;
}

export interface ProductsResponse {
  metadata: {
    total: number;
    page: number;
    totalPages: number;
  };
  data: Product[];
}
