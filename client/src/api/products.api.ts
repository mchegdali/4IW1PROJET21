export type ProductCategory = {
  _id: string;
  name: string;
  slug: string;
};

export interface Product {
  _id: string;
  slug: string;
  name: string;
  category: ProductCategory;
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
