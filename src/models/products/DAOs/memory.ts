import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
} from "../products.interface";
import moment from "moment";

export class ProductosMemDAO implements ProductBaseClass {
  private productos: ProductI[] = [];

  constructor() {
    const mockData = [
      {
        _id: "0",
        timestamp: "0",
        nombre: "pizza test",
        descripcion: "muzarella",
        codigo: "muzza",
        foto: "muzza.png",
        precio: 600,
        stock: 100,
      },
    ];

    mockData.forEach((aMock) => this.productos.push(aMock));
  }

  async findIndex(id: string) {
    return this.productos.findIndex((aProduct) => aProduct._id == id);
  }

  //find(id: string): ProductI | undefined {
  //  return this.productos.find((aProduct) => aProduct._id === id);
  //}

  async findLastId(): Promise<number> {
    if (this.productos.length == 0) {
      return 0;
    }
    return parseInt(this.productos[this.productos.length - 1]._id);
  }

  async get(id?: string): Promise<ProductI[]> {
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

    return newItem;
  }

  async update(id: string, newProductData: newProductI): Promise<ProductI> {
    const index = await this.findIndex(id);
    const oldProduct = this.productos[index];

    const updatedProduct: ProductI = { ...oldProduct, ...newProductData };
    this.productos.splice(index, 1, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    const index = await this.findIndex(id);
    this.productos.splice(index, 1);
  }

  async query(options: ProductQuery): Promise<ProductI[]> {
    type Conditions = (aProduct: ProductI) => boolean;
    const query: Conditions[] = [];

    if (options.nombre) {
      let nombre = options.nombre;
      query.push((aProduct: ProductI) => aProduct.nombre.includes(nombre));
    }
    if (options.precio)
      query.push((aProduct: ProductI) => aProduct.precio == options.precio);

    if (options.stock)
      query.push((aProduct: ProductI) => aProduct.stock == options.stock);

    if (options.precioMin) {
      let precioMin = options.precioMin;
      query.push((aProduct: ProductI) => aProduct.precio >= precioMin);
    }

    if (options.precioMax) {
      let precioMax = options.precioMax;
      query.push((aProduct: ProductI) => aProduct.precio <= precioMax);
    }

    return this.productos.filter((aProduct) => query.every((x) => x(aProduct)));
  }
}
