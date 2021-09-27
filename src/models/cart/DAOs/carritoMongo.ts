import mongoose from "mongoose";
import {
  newProductI,
  ProductI,
  CarritoBaseClass,
  ProductQuery,
  Carrito,
} from "../../products/products.interface";
import moment from "moment";
import { productsAPI } from "../../../apis/productos";
import Config from "../../../config";

const productsSchema = new mongoose.Schema({
  timestamp: String,
  producto: [
    {
      _id: String,
      nombre: String,
      descripcion: String,
      codigo: String,
      foto: String,
      precio: Number,
      stock: Number,
    },
  ],
});

export class CarritoMongoDAO implements CarritoBaseClass {
  private productos;
  private srv;
  private id_hardcodeado = "615114aaa1ca5ed6b4ee728d";

  constructor(local: boolean = false) {
    const mockData = {
      timestamp: moment().format(),
      producto: [
        {
          _id: "mockData1",
          timestamp: "2021-09-19T12:04:09-03:00",
          nombre: "pizza muzarella",
          descripcion: "pizza de salsa de tomate y muzarella",
          codigo: "muzza",
          foto: "muzza.png",
          precio: 600,
          stock: 500,
        },
        {
          _id: "mockData2",
          timestamp: "2021-09-19T12:23:09-03:00",
          nombre: "empanada de carne",
          descripcion: "empanada de carne picada fina especial",
          codigo: "emp_carne",
          foto: "empanadacarne.png",
          precio: 100,
          stock: 1000,
        },
      ],
    };

    if (local)
      this.srv = `mongodb://${Config.MONGO_LOCAL_IP}:${Config.MONGO_LOCAL_PORT}/${Config.MONGO_LOCAL_DBNAME}`;
    else
      this.srv = `mongodb+srv://${Config.MONGO_ATLAS_USER}:${Config.MONGO_ATLAS_PASSWORD}@${Config.MONGO_ATLAS_CLUSTER}/${Config.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`;
    mongoose.connect(this.srv);
    this.productos = mongoose.model<Carrito>("carrito", productsSchema);

    this.productos.count({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result == 0) {
          console.log("Collection vacía");
          //mockData.timestamp = moment().format();
          const newProduct = new this.productos(mockData);
          newProduct
            .save()

            .then(function () {
              console.log("Mock Data Ingresada"); // Success
            })
            .catch(function (error) {
              console.log(error); // Failure
            });
        }
      }
    });
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
    const carrito = await this.productos.findById(this.id_hardcodeado);
    if (id) {
      return carrito.producto.filter((aProduct) => aProduct._id == id);
    }
    return carrito.producto;
  }

  async add(data: ProductI): Promise<ProductI> {
    data = data[0];
    if (!data.nombre || !data.precio) throw new Error("invalid data");
    const carrito = await this.productos.findById(this.id_hardcodeado);
    carrito.producto.push(data);
    carrito.save();

    return data;
  }

  async delete(id: string): Promise<void> {
    const carrito = await this.productos.findById(this.id_hardcodeado);
    await carrito.producto.pull({ _id: id });
    carrito.save();
  }
}
