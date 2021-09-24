import admin from "firebase-admin";
import Config from "../../../config";
import serviceAccount from "../../../../firebase.json";
import {
  newProductI,
  ProductI,
  ProductBaseClassSql,
  ProductQuery,
  ProductSqlI,
  ProductBaseClass,
} from "../products.interface";
import moment from "moment";

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

export class ProductosFirebaseDAO implements ProductBaseClass {
  private productos;
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
    admin.initializeApp({
      credential: admin.credential.cert(params),
    });
    const db = admin.firestore();
    this.productos = db.collection("productos");

    (async () => {
      try {
        const resultado = await this.productos.get();
        let docs = resultado.docs;
        if (docs.length == 0) {
          console.log("Collection vacía");
          console.log("Cargando Mock Data");
          mockData.forEach(async (obj) => {
            const newDoc = this.productos.doc();
            await newDoc.create(obj);
          });
        }
      } catch (err) {
        console.log(`Error ${err}`);
      }
    })();
  }

  async get(id?: string): Promise<ProductI[]> {
    let output: ProductI[] = [];
    let resultado = await this.productos.get();
    let docs = resultado.docs;

    output = docs.map((aDoc) => ({
      id: aDoc.id,
      data: aDoc.data(),
    }));

    return output;
  }
  async add(data: newProductI): Promise<ProductI> {
    if (!data.nombre || !data.precio) throw new Error("invalid data");
    data.timestamp = moment().format();
    const newDoc = this.productos.doc();
    await newDoc.create(data);
    console.log();

    return newDoc;
  }

  async update(id: string, newProductData: newProductI): Promise<ProductI> {
    return this.productos.findByIdAndUpdate(id, newProductData);
  }

  async delete(id: string) {
    await this.productos.findByIdAndDelete(id);
  }
  async query(options: ProductQuery): Promise<ProductI[]> {
    let query: ProductQuery = {};

    let match: any = {};

    if (options.nombre) {
      match.nombre = { $regex: options.nombre };
    }

    if (options.descripcion) {
      match.descripcion = { $regex: options.descripcion };
    }

    if (options.codigo) {
      match.codigo = { $regex: options.codigo };
    }

    if (options.timestamp) {
      match.timestamp = { $regex: options.timestamp };
    }

    if (options.precioMin) {
      if (!match.precio) {
        match.precio = { $gte: options.precioMin };
      } else {
        match.precio["$gte"] = options.precioMin;
      }
    }

    if (options.precioMax) {
      if (!match.precio) {
        match.precio = { $lte: options.precioMax };
      } else {
        match.precio["$lte"] = options.precioMax;
      }
    }

    if (options.precio) {
      match.precio = options.precio;
    }

    if (options.stockMin) {
      if (!match.stock) {
        match.stock = { $gte: options.stockMin };
      } else {
        match.stock["$gte"] = options.stockMin;
      }
    }

    if (options.stockMax) {
      if (!match.stock) {
        match.stock = { $lte: options.stockMax };
      } else {
        match.stock["$lte"] = options.stockMax;
      }
    }

    if (options.stock) {
      match.stock = options.stock;
    }

    return this.productos.aggregate([
      {
        $match: match,
      },
    ]);
  }
}
