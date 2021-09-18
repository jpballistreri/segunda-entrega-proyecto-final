import fs from "fs";
import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
} from "../products.interface";

export class ProductosFSDAO implements ProductBaseClass {
  private productos: ProductI[] = [];
  private nombreArchivo: string;

  constructor(fileName: string) {
    //const mockData = [
    //  { _id: "1", nombre: "lapiz", precio: 200 },
    //  { _id: "2", nombre: "cartuchera", precio: 250 },
    //  { _id: "3", nombre: "boligoma", precio: 260 },
    //];
    this.nombreArchivo = fileName;
    this.leer(this.nombreArchivo);
  }

  async leer(archivo: string): Promise<void> {
    //Lee el archivo json, si no lo encuentra, crea uno vacio.
    try {
      this.productos = JSON.parse(await fs.promises.readFile(archivo, "utf-8"));
    } catch (err) {
      await fs.promises.writeFile(this.nombreArchivo, JSON.stringify([]));
      this.productos = JSON.parse(await fs.promises.readFile(archivo, "utf-8"));
    }
  }

  async guardar(): Promise<void> {
    await fs.promises.writeFile(
      this.nombreArchivo,
      JSON.stringify(this.productos, null, "\t")
    );
  }

  async findIndex(id: string): Promise<number> {
    await this.leer(this.nombreArchivo);
    return this.productos.findIndex((aProduct: ProductI) => aProduct._id == id);
  }

  async findLastId(): Promise<number> {
    if (this.productos.length == 0) {
      return 0;
    }
    return parseInt(this.productos[this.productos.length - 1]._id);
  }

  //async find(id: string): Promise<ProductI | undefined> {
  //  await this.leer(this.nombreArchivo);
  //
  //  return this.productos.find((aProduct) => aProduct._id === id);
  //}

  async get(id?: string): Promise<ProductI[]> {
    await this.leer(this.nombreArchivo);

    if (id) {
      return this.productos.filter((aProduct) => aProduct._id === id);
    }
    return this.productos;
  }

  async add(data: newProductI): Promise<ProductI> {
    if (!data.nombre || !data.precio) throw new Error("invalid data");

    await this.leer(this.nombreArchivo);

    let thumbnail = "";
    if (data.thumbnail) {
      thumbnail = data.thumbnail;
    }

    const newItem: ProductI = {
      _id: ((await this.findLastId()) + 1).toString(),
      nombre: data.nombre,
      precio: data.precio,
      thumbnail: thumbnail,
    };

    this.productos.push(newItem);

    await this.guardar();

    return newItem;
  }

  async update(id: string, newProductData: newProductI): Promise<ProductI> {
    await this.leer(this.nombreArchivo);

    const index = await this.findIndex(id);
    const oldProduct = this.productos[index];

    const updatedProduct: ProductI = { ...oldProduct, ...newProductData };
    this.productos.splice(index, 1, updatedProduct);

    await this.guardar();

    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    await this.leer(this.nombreArchivo);

    const index = await this.findIndex(id);
    this.productos.splice(index, 1);
    await this.guardar();
  }

  async query(options: ProductQuery): Promise<ProductI[]> {
    await this.leer(this.nombreArchivo);
    type Conditions = (aProduct: ProductI) => boolean;
    const query: Conditions[] = [];

    if (options.nombre)
      query.push((aProduct: ProductI) => aProduct.nombre == options.nombre);

    if (options.precio)
      query.push((aProduct: ProductI) => aProduct.precio == options.precio);

    return this.productos.filter((aProduct) => query.every((x) => x(aProduct)));
  }
}
