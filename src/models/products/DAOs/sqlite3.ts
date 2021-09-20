import sqlite3 from "sqlite3";
import {
  newProductI,
  ProductI,
  ProductBaseClass,
  ProductQuery,
  ProductTestClass,
} from "../products.interface";
import Config from "../../../config";
import moment from "moment";

export class ProductosSqlite3DAO implements ProductTestClass {
  private srv: string;
  private productos;

  constructor() {
    let db = new sqlite3.Database(":memory:", (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Connected to the in-memory SQlite database.");
    });
  }
}
