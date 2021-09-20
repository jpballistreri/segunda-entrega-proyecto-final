import mongoose from "mongoose";
import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
} from "../products.interface";
import Config from "../../../config";

const productsSchema = new mongoose.Schema<ProductI>({
  timestamp: String,
  nombre: String,
  descripcion: String,
  codigo: String,
  foto: String,
  precio: Number,
  stock: Number,
});

export class ProductosAtlasDAO implements ProductBaseClass {
  private srv: string;
  private productos;

  constructor(local: boolean = false) {
    if (local)
      this.srv = `mongodb://${Config.MONGO_LOCAL_IP}:${Config.MONGO_LOCAL_PORT}/${Config.MONGO_LOCAL_DBNAME}`;
    else
      this.srv = `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(this.srv);
    this.productos = mongoose.model<ProductI>("producto", productsSchema);
  }

  async get(id?: string): Promise<ProductI[]> {
    let output: ProductI[] = [];
    try {
      if (id) {
        const document = await this.productos.findById(id);
        if (document) output.push(document);
      } else {
        output = await this.productos.find();
      }

      return output;
    } catch (err) {
      return output;
    }
  }

  async add(data: newProductI): Promise<ProductI> {
    if (!data.nombre || !data.precio) throw new Error("invalid data");

    const newProduct = new this.productos(data);
    await newProduct.save();

    return newProduct;
  }

  async update(id: string, newProductData: newProductI): Promise<ProductI> {
    return this.productos.findByIdAndUpdate(id, newProductData);
  }

  async delete(id: string) {
    await this.productos.findByIdAndDelete(id);
  }

  async query(options: ProductQuery): Promise<ProductI[]> {
    let query: ProductQuery = {};

    let match: any = {};

    if (options.nombre) {
      console.log("nombre..");
      match.nombre = { $regex: options.nombre };
    }

    if (options.descripcion) {
      console.log("descripcion");
      let descripcion = options.descripcion;
      match.descripcion = { $regex: descripcion };
    }

    if (options.precioMin) {
      if (!match.precio) {
        match.precio = { $gte: options.precioMin };
      } else {
        match.precio["$gte"] = options.precioMin;
      }
    }

    if (options.precioMax) {
      if (!match.precio) {
        match.precio = { $lte: options.precioMax };
      } else {
        match.precio["$lte"] = options.precioMax;
      }
    }

    if (options.precio) {
      match.precio = options.precio;
    }

    if (options.stockMin) {
      if (!match.stock) {
        match.stock = { $gte: options.stockMin };
      } else {
        match.stock["$gte"] = options.stockMin;
      }
    }

    if (options.stockMax) {
      if (!match.stock) {
        match.stock = { $lte: options.stockMax };
      } else {
        match.stock["$lte"] = options.stockMax;
      }
    }

    if (options.stock) {
      match.stock = options.stock;
    }

    return this.productos.aggregate([
      {
        $match: match,
      },
    ]);
  }
}
