import { ProductosMemDAO } from "./DAOs/productosMemory";
import { ProductosFSDAO } from "./DAOs/productosFs";
import { ProductosAtlasDAO } from "./DAOs/productosMongo";
import { ProductosSqlite3DAO } from "./DAOs/productosSqlite3";
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
    switch (tipo) {
      case TipoPersistencia.FileSystem:
        console.log("RETORNANDO INSTANCIA CLASE FS");
        return new ProductosFSDAO();

      case TipoPersistencia.MongoAtlas:
        console.log("RETORNANDO INSTANCIA CLASE MONGO ATLAS");
        return new ProductosAtlasDAO();

      case TipoPersistencia.LocalMongo:
        console.log("RETORNANDO INSTANCIA CLASE MONGO LOCAL");
        return new ProductosAtlasDAO(true);

      case TipoPersistencia.SQLITE3:
        console.log("RETORNANDO INSTANCIA CLASE SQLITE3");
        return new ProductosSqlite3DAO(true);

      case TipoPersistencia.MYSQL:
        console.log("RETORNANDO INSTANCIA CLASE MYSQL");
        return new ProductosSqlite3DAO();

      default:
        console.log("RETORNANDO INSTANCIA CLASE MEMORIA");
        return new ProductosMemDAO();
    }
  }
}
