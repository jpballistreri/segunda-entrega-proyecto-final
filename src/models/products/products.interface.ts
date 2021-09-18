export interface newProductI {
  nombre: string;
  precio: number;
  thumbnail?: string;
}

export interface ProductI {
  _id: string;
  nombre: string;
  precio: number;
  thumbnail?: string;
}

export interface ProductQuery {
  nombre?: string;
  precio?: number;
}

export interface ProductBaseClass {
  get(id?: string | undefined): Promise<ProductI[]>;
  add(data: newProductI): Promise<ProductI>;
  update(id: string, newProductData: newProductI): Promise<ProductI>;
  delete(id: string): Promise<void>;
  query(options: ProductQuery): Promise<ProductI[]>;
}
