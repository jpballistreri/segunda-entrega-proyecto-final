import fs from "fs";
import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
} from "../products.interface";
import moment from "moment";

export class ProductosFSDAO implements ProductBaseClass {
  private productos: ProductI[] = [];
  private nombreArchivo: string;
  private mockData: ProductI[] = [];

  constructor(fileName: string) {
    this.mockData = [
      {
        _id: "1",
        timestamp: "2021-09-19T12:04:09-03:00",
        nombre: "pizza muzarella",
        descripcion: "pizza de salsa de tomate y muzarella",
        codigo: "muzza",
        foto: "muzza.png",
        precio: 600,
        stock: 500,
      },
      {
        _id: "2",
        timestamp: "2021-09-19T12:20:09-03:00",
        nombre: "pizza fugazzetta",
        descripcion: "pizza de cebolla y muzarrella",
        codigo: "fugazz",
        foto: "fugazzetta.png",
        precio: 700,
        stock: 300,
      },
      {
        _id: "3",
        timestamp: "2021-09-19T12:23:09-03:00",
        nombre: "empanada de carne",
        descripcion: "empanada de carne picada fina",
        codigo: "emp_carne",
        foto: "empanadacarne.png",
        precio: 100,
        stock: 1000,
      },
    ];

    this.mockData.forEach((aMock) => this.productos.push(aMock));

    this.nombreArchivo = fileName;
    this.leer(this.nombreArchivo);
  }

  async leer(archivo: string): Promise<void> {
    //Lee el archivo json, si no lo encuentra, crea uno vacio.
    try {
      this.productos = JSON.parse(await fs.promises.readFile(archivo, "utf-8"));
    } catch (err) {
      console.log(
        "Archivo products.json no encontrado\nCreando archivo products.json con mockData."
      );
      await fs.promises.writeFile(
        this.nombreArchivo,
        JSON.stringify(this.mockData, null, "\t")
      );
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
    if (
      !data.nombre ||
      !data.descripcion ||
      !data.codigo ||
      !data.foto ||
      !data.precio ||
      !data.stock ||
      typeof data.nombre !== "string" ||
      isNaN(data.precio)
    )
      throw new Error("invalid data");
    await this.leer(this.nombreArchivo);

    const newItem: ProductI = {
      _id: ((await this.findLastId()) + 1).toString(),
      timestamp: moment().format(),
      nombre: data.nombre,
      descripcion: data.descripcion,
      codigo: data.codigo,
      foto: data.foto,
      precio: data.precio,
      stock: data.stock,
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

    if (options.nombre) {
      let nombre = options.nombre;
      query.push((aProduct: ProductI) => aProduct.nombre.includes(nombre));
    }

    if (options.descripcion) {
      let descripcion = options.descripcion;
      query.push((aProduct: ProductI) =>
        aProduct.descripcion.includes(descripcion)
      );
    }

    if (options.precio)
      query.push((aProduct: ProductI) => aProduct.precio == options.precio);

    if (options.precioMin) {
      let precioMin = options.precioMin;
      query.push((aProduct: ProductI) => aProduct.precio >= precioMin);
    }

    if (options.precioMax) {
      let precioMax = options.precioMax;
      query.push((aProduct: ProductI) => aProduct.precio <= precioMax);
    }

    if (options.stock)
      query.push((aProduct: ProductI) => aProduct.stock == options.stock);

    if (options.stockMin) {
      let stockMin = options.stockMin;
      query.push((aProduct: ProductI) => aProduct.stock >= stockMin);
    }

    if (options.stockMax) {
      let stockMax = options.stockMax;
      query.push((aProduct: ProductI) => aProduct.stock <= stockMax);
    }

    return this.productos.filter((aProduct) => query.every((x) => x(aProduct)));
  }
}
