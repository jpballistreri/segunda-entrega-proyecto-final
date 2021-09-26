import {
  newProductI,
  ProductI,
  ProductSqlI,
} from "../models/products/products.interface";
import { FactoryDAO } from "../models/cart/cart.factory";
import { TipoPersistencia } from "../models/cart/cart.factory";
import { ProductQuery } from "../models/products/products.interface";
import { productsAPI } from "./productos";

/**
 * Con esta variable elegimos el tipo de persistencia
 */
const tipo = TipoPersistencia.Memoria;

class cartAPI {
  private productos;

  constructor() {
    this.productos = FactoryDAO.get(tipo);
  }

  async getProducts(
    id: string | undefined = undefined
  ): Promise<ProductI[] | ProductSqlI[]> {
    if (id) {
      return this.productos.get(id);
    }

    return this.productos.get();
  }

  async addProduct(
    producto: ProductI[] | ProductSqlI[]
  ): Promise<ProductI | ProductSqlI> {
    return this.productos.add(producto);
  }

  async deleteProduct(id: string) {
    await this.productos.delete(id);
  }

  async query(options: ProductQuery) {
    return await this.productos.query(options);
  }
}

export const cartApi = new cartAPI();
