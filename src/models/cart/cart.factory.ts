//import { CarritoAtlasDAO } from "./DAOs/carritoMongo";
import { CarritoMemDAO } from "./DAOs/carritoMemory";

import Config from "../../config";

export enum TipoPersistencia {
  Memoria = "MEM",
  FileSystem = "FS",
  MYSQL = "MYSQL",
  SQLITE3 = "SQLITE3",
  LocalMongo = "LOCAL-MONGO",
  MongoAtlas = "MONGO-ATLAS",
  Firebase = "FIREBASE",
}

export class FactoryDAO {
  static get(tipo: TipoPersistencia) {
    console.log("CARRITO");
    switch (tipo) {
      //case TipoPersistencia.FileSystem:
      //  console.log("RETORNANDO INSTANCIA CLASE FS");
      //  return new ProductosFSDAO();

      //case TipoPersistencia.MongoAtlas:
      //  console.log("RETORNANDO INSTANCIA CLASE MONGO ATLAS");
      //  return new CarritoAtlasDAO();
      //
      //case TipoPersistencia.LocalMongo:
      //  console.log("RETORNANDO INSTANCIA CLASE MONGO LOCAL");
      //  return new CarritoAtlasDAO(true);

      //case TipoPersistencia.SQLITE3:
      //  console.log("RETORNANDO INSTANCIA CLASE SQLITE3");
      //  return new ProductosSqlite3DAO(true);

      //case TipoPersistencia.MYSQL:
      //  console.log("RETORNANDO INSTANCIA CLASE MYSQL");
      //  return new ProductosSqlite3DAO();

      //case TipoPersistencia.Firebase:
      //  console.log("RETORNANDO INSTANCIA CLASE FIREBASE");
      //  return new ProductosFirebaseDAO();

      default:
        console.log("RETORNANDO INSTANCIA CLASE MEMORIA");
        return new CarritoMemDAO();
    }
  }
}
