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
  precio: number | string;
  stock: number;
}

export interface ProductQuery {
  nombre?: string;
  descripcion?: string;
  timestamp?: string;
  codigo?: string;
  precio?: number;
  precioMin?: number;
  precioMax?: number;
  stock?: number;
  stockMin?: number;
  stockMax?: number;
}

export interface ProductBaseClass {
  get(id?: string | undefined): Promise<ProductI[]>;
  add(data: newProductI): Promise<ProductI>;
  update(id: string, newProductData: newProductI): Promise<ProductI>;
  delete(id: string): Promise<void>;
  query(options: ProductQuery): Promise<ProductI[]>;
}

export interface ProductTestClass {}
