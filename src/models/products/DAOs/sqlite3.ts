//import sqlite3 from "sqlite3";
import {
  newProductI,
  ProductI,
  ProductBaseClassSql,
  ProductQuery,
  ProductSqlI,
  ProductTestClass,
} from "../products.interface";
import Config from "../../../config";
import moment from "moment";
import knex from "knex";
import dbConfig from "../../../../knexfile";

export class ProductosSqlite3DAO implements ProductBaseClassSql {
  //private srv: string;
  private productos;
  private connection;

  constructor() {
    const mockData: newProductI[] = [
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

  async get(id?: string): Promise<ProductSqlI[]> {
    let output: ProductSqlI[] = [];

    if (id) output = await this.connection("productos").where("id", id);
    else {
      output = await this.connection("productos");
    }
    //console.log(output);
    return output;
  }

  async add(data: newProductI): Promise<ProductSqlI> {
    data.timestamp = moment().format();

    const insertData = async (): Promise<ProductSqlI> => {
      const id = await this.connection("productos").insert(data);
      const insert: ProductSqlI = await this.connection("productos").where(
        "id",
        id
      );
      console.log(insert);
      return insert;
    };

    return await insertData();
  }

  async update(id: string, data: newProductI): Promise<ProductSqlI> {
    const updateData = async (): Promise<ProductSqlI> => {
      await this.connection("productos").where("id", id).update(data);
      const nuevoProducto: ProductSqlI = await this.connection(
        "productos"
      ).where("id", id);

      return nuevoProducto;
    };

    return await updateData();
  }

  async delete(id: string) {
    await this.connection("productos").where("id", id).del();
  }

  async query(options: ProductQuery): Promise<ProductSqlI[]> {
    let queryString = "SELECT  * from productos where ";

    var query = this.connection("productos");

    if (options.nombre) {
      query.where("nombre", "LIKE", `%${options.nombre}%`);
    }
    if (options.descripcion) {
      query.where("descripcion", "LIKE", `%${options.descripcion}%`);
    }
    if (options.codigo) {
      query.where("codigo", "LIKE", `%${options.codigo}%`);
    }
    if (options.timestamp) {
      query.where("timestamp", "LIKE", `%${options.timestamp}%`);
    }
    if (options.precioMin) {
      query.where("precio", ">=", `${options.precioMin}`);
    }
    if (options.precioMax) {
      query.where("precio", "<=", `${options.precioMax}`);
    }
    if (options.precio) {
      query.where("precio", "=", `${options.precio}`);
    }
    if (options.stockMin) {
      query.where("stock", ">=", `${options.stockMin}`);
    }
    if (options.stockMax) {
      query.where("stock", "<=", `${options.stockMax}`);
    }
    if (options.stock) {
      query.where("stock", "=", `${options.stock}`);
    }

    return query.then((results: ProductSqlI[]) => {
      return results;
    });
  }
}
