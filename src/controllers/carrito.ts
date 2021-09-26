import { Request, Response, NextFunction } from "express";
import { cartApi } from "../apis/carrito";
import { productsAPI } from "../apis/productos";
import { ProductQuery } from "../models/products/products.interface";

class Carrito {
  async checkAddProducts(req: Request, res: Response, next: NextFunction) {
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;

    if (
      !nombre ||
      !descripcion ||
      !codigo ||
      !foto ||
      !precio ||
      !stock ||
      typeof nombre !== "string" ||
      isNaN(precio)
    ) {
      return res.status(400).json({
        msg: "Campos del body invalidos",
      });
    }

    next();
  }

  async checkProductExists(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const producto = await cartApi.getProducts(id);

    if (producto.length == 0) {
      return res.status(404).json({
        msg: "producto no encontrado",
      });
    }
    next();
  }

  async getProducts(req: Request, res: Response) {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      timestamp,
      codigo,
      precio,
      precioMin,
      precioMax,
      stock,
      stockMin,
      stockMax,
    } = req.query;
    if (id) {
      const result = await cartApi.getProducts(id);
      if (!result.length)
        return res.status(404).json({
          data: "objeto no encontrado",
        });

      return res.json({
        data: result,
      });
    }

    const query: ProductQuery = {};

    if (nombre) query.nombre = nombre.toString();
    if (timestamp) query.timestamp = timestamp.toString();
    if (descripcion) query.descripcion = descripcion.toString();
    if (codigo) query.codigo = codigo.toString();
    if (precio) query.precio = Number(precio);
    if (precioMin) query.precioMin = Number(precioMin);
    if (precioMax) query.precioMax = Number(precioMax);
    if (stock) query.stock = Number(stock);
    if (stockMin) query.stockMin = Number(stockMin);
    if (stockMax) query.stockMax = Number(stockMax);

    if (Object.keys(query).length) {
      return res.json({
        data: await cartApi.query(query),
      });
    }

    res.json({
      data: await cartApi.getProducts(),
    });
  }

  async addProducts(req: Request, res: Response) {
    const producto = await productsAPI.getProducts(req.params.id);
    const newProduct = await cartApi.addProduct(producto);
    res.json({
      msg: "producto agregado con exito",
      data: newProduct,
    });
  }

  async deleteProducts(req: Request, res: Response) {
    const id = req.params.id;
    await cartApi.deleteProduct(id);
    res.json({
      msg: "producto borrado",
    });
  }
}

export const cartController = new Carrito();
