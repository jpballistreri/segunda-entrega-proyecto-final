import {
  newProductI,
  ProductI,
  CarritoBaseClass,
  ProductQuery,
} from "../../products/products.interface";
import moment from "moment";
import { productsAPI } from "../../../apis/productos";

export class CarritoMemDAO implements CarritoBaseClass {
  private productos: ProductI[] = [];

  constructor() {
    const mockData = [
      {
        id: "1",
        timestamp: "2021-09-19T12:04:09-03:00",
        producto: [
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
            timestamp: "2021-09-19T12:23:09-03:00",
            nombre: "empanada de carne",
            descripcion: "empanada de carne picada fina especial",
            codigo: "emp_carne",
            foto: "empanadacarne.png",
            precio: 100,
            stock: 1000,
          },
        ],
      },
    ];

    mockData[0].producto.forEach((aMock) => this.productos.push(aMock));
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
      return this.productos.filter((aProduct) => aProduct._id == id);
    }
    return this.productos;
  }

  async add(newProduct: ProductI[]): Promise<ProductI> {
    //console.log("Agregando producto al carrito");
    this.productos.push(newProduct[0]);
    return newProduct[0];
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

    if (options.descripcion) {
      let descripcion = options.descripcion;
      query.push((aProduct: ProductI) =>
        aProduct.descripcion.includes(descripcion)
      );
    }

    if (options.timestamp) {
      let timestamp = options.timestamp;
      query.push((aProduct: ProductI) =>
        aProduct.timestamp.includes(timestamp)
      );
    }

    if (options.codigo) {
      let codigo = options.codigo;
      query.push((aProduct: ProductI) => aProduct.codigo.includes(codigo));
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
      query.push((aProduct: ProductI) => aProduct.stock >= stockMax);
    }

    return this.productos.filter((aProduct) => query.every((x) => x(aProduct)));
  }
}
