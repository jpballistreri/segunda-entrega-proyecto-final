//import sqlite3 from "sqlite3";
import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
  ProductTestClass,
} from "../products.interface";
import Config from "../../../config";
import moment from "moment";
import knex from "knex";
import dbConfig from "../../../../knexfile";

export class ProductosSqlite3DAO implements ProductTestClass {
  //private srv: string;
  private productos;
  private connection;

  constructor() {
    const mockData = [
      {
        timestamp: "0000",
        nombre: "Pizza Muzzarella",
        descripcion: "salsa de tomate y muzarella",
        codigo: "muzza",
        foto: "pizza_muzza.png",
        precio: 600,
        stock: 200,
      },
      {
        timestamp: "1111",
        nombre: "Pizza Napolitana",
        descripcion: "salsa de tomate, muzarella y tomates",
        codigo: "napo",
        foto: "pizza_napo.png",
        precio: 750,
        stock: 200,
      },
      {
        timestamp: "2222",
        nombre: "Pizza Anchoas",
        descripcion: "salsa de tomate, muzarella y anchoas",
        codigo: "anchoas",
        foto: "pizza_anchoas.png",
        precio: 800,
        stock: 20,
      },
    ];

    const options = dbConfig[`${Config.SQLITE3_KNEX_ENV}`];
    this.connection = knex(options);
    this.connection.schema.hasTable("productos").then((exists) => {
      if (!exists) {
        console.log("Creando Tabla productos");

        this.connection.schema
          .createTable("productos", (productosTable) => {
            productosTable.increments();
            productosTable.string("nombre").notNullable();
            productosTable.string("descripcion").notNullable();
            productosTable.string("codigo").notNullable();
            productosTable.string("foto").notNullable();
            productosTable.decimal("precio", 14, 2).notNullable();
            productosTable.integer("stock").notNullable();
            productosTable.string("timestamp").notNullable();
          })
          .then(() => {
            console.log("Done");
          });
      }

      this.connection("productos")
        .count()
        .then((res) => {
          const countResult = res[0]["count(*)"];
          if (countResult == 0) {
            this.connection("productos")
              .insert(mockData)
              .then(() => console.log("Data Mock insertada correctamente."));
          }
        });
    });
  }

  async get(id?: string): Promise<ProductI[] | undefined> {
    let output: ProductI[] = [];

    if (id) output = this.connection("productos").where("id", id);
    else {
      output = this.connection("productos");
    }
    //console.log(output);
    return output;
  }

  async add(data: newProductI): Promise<ProductI> {
    data.timestamp = moment().format();

    const insertNuevoProducto = async () => {
      const id = await this.connection("productos").insert(data);

      return await this.connection("productos").where("id", await id);
    };

    const nuevoProducto = async () => {
      return await this.connection("productos").where(
        "id",
        await insertNuevoProducto()
      );
    };

    return await insertNuevoProducto();
  }
}
