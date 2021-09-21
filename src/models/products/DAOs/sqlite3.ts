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
    const options = dbConfig[`${Config.SQLITE3_KNEX_ENV}`];
    this.connection = knex(options);
    this.connection.schema.hasTable("productos").then((exists) => {
      if (!exists) {
        console.log("Creamos la tabla productos!");

        this.connection.schema
          .createTable("productos", (productosTable) => {
            productosTable.increments();
            productosTable.string("timestamp").notNullable();
            productosTable.string("nombre").notNullable();
            productosTable.string("descripcion").notNullable();
            productosTable.string("codigo").notNullable();
            productosTable.string("foto").notNullable();
            productosTable.decimal("precio", 14, 2).notNullable();
            productosTable.integer("stock").notNullable();
          })
          .then(() => {
            console.log("Done");
          });
      }
    });
  }

  async get(id?: string): Promise<ProductI[] | undefined> {
    let output: ProductI[] = [];

    if (id) output = this.connection("productos").where("id", id);
    else {
      output = this.connection("productos");
    }
    console.log(output);
    return output;
  }

  async add(data: newProductI): Promise<ProductI> {
    data.timestamp = moment().format();
    this.connection("productos").insert(data);
    console.log(data);
    return this.connection("productos");
  }
}
