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

export interface ProductSqlI {
  id: string;
  nombre: string;
  descripcion: string;
  codigo: string;
  foto: string;
  precio: number | string;
  stock: number;
  timestamp: string;
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

export interface ProductoCarrito {
  id: number;
  nombre: string;
  descripcion: string;
  codigo: string;
  foto: string;
  precio: number | string;
  stock: number;
  timestamp: string;
}

export interface Carrito {
  id: number;
  timestamp: string;
  producto: Array<ProductoCarrito>;
}

export interface ProductBaseClass {
  get(id?: string): Promise<ProductI[]>;
  add(data: newProductI): Promise<ProductI>;
  update(id: string, newProductData: newProductI): Promise<ProductI>;
  delete(id: string): Promise<void>;
  query(options: ProductQuery): Promise<ProductI[]>;
}

export interface ProductBaseClassSql {
  get(id?: string): Promise<ProductSqlI[]>;
  add(data: newProductI): Promise<ProductSqlI>;
  update(id: string, newProductData: newProductI): Promise<ProductSqlI>;
  delete(id: string): Promise<void>;
  query(options: ProductQuery): Promise<ProductSqlI[]>;
}

export interface CarritoBaseClass {
  get(id?: string): Promise<ProductI[]>;
  //add(data: newProductI): Promise<ProductSqlI>;
  //delete(id: string): Promise<void>;
  //query(options: ProductQuery): Promise<ProductSqlI[]>;
}
