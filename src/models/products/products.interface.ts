export interface newProductI {
  timestamp: string;
  nombre: string;
  descripcion: string;
  codigo: string;
  foto: string;
  precio: number;
  stock: number;
}

export interface ProductI {
  _id: string;
  timestamp: string;
  nombre: string;
  descripcion: string;
  codigo: string;
  foto: string;
  precio: number;
  stock: number;
}

export interface ProductQuery {
  nombre?: string;
  precio?: number;
  stock?: number;
  precioMin?: number | undefined;
  precioMax?: number | undefined;
}

export interface ProductBaseClass {
  get(id?: string | undefined): Promise<ProductI[]>;
  add(data: newProductI): Promise<ProductI>;
  update(id: string, newProductData: newProductI): Promise<ProductI>;
  delete(id: string): Promise<void>;
  query(options: ProductQuery): Promise<ProductI[]>;
}
