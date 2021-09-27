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

  async add(newProduct: ProductI): Promise<ProductI> {
    //console.log("Agregando producto al carrito");
    console.log(newProduct);
    this.productos.push(newProduct[0]);
    return newProduct[0];
  }

  async delete(id: string): Promise<void> {
    const index = await this.findIndex(id);
    this.productos.splice(index, 1);
  }
}
