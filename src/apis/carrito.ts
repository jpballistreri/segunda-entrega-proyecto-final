import {
  newProductI,
  ProductI,
  ProductSqlI,
} from "../models/products/products.interface";
import { FactoryDAO } from "../models/cart/cart.factory";
import { TipoPersistencia } from "../models/cart/cart.factory";
import { ProductQuery } from "../models/products/products.interface";

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

  async addProduct(productData: newProductI): Promise<ProductI | ProductSqlI> {
    const newProduct = await this.productos.add(productData);
    return newProduct;
  }

  async deleteProduct(id: string) {
    await this.productos.delete(id);
  }

  async query(options: ProductQuery) {
    return await this.productos.query(options);
  }
}

export const cartApi = new cartAPI();
