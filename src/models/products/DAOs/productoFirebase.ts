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
    let doc: ProductI;

    if (id) {
      const idRef = this.productos.doc(id);
      const doc = await idRef.get();
      if (!doc.exists) {
        return [];
      } else {
        let data = doc.data();
        data.id = id;
        return [data];
      }
    }

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
    await this.productos.doc(id).set(newProductData);

    const idRef = await this.productos.doc(id);
    const doc = await idRef.get();

    return await doc.data();
  }

  async delete(id: string) {
    await this.productos.doc(id).delete();
  }
  async query(options: ProductQuery): Promise<ProductI[]> {
    //FALTA CASE SENSITIVE
    let query: ProductQuery = {};

    let match: any = {};

    if (options.nombre) {
      console.log(options.nombre);

      let resultado = await this.productos
        .where("nombre", "==", options.nombre)
        .get();

      const fin: any = [];
      resultado.forEach((doc) => {
        console.log("llop");
        console.log(doc.id, "=>", doc.data());
        fin.push(doc.data());
      });
      return fin;
    }

    //if (options.descripcion) {
    //  match.descripcion = { $regex: options.descripcion };
    //}

    if (options.codigo) {
      //.where("nombre", "==", "Pizza Napolitana")
      const fin: any = [];
      const resultado = await this.productos
        .where("codigo", "==", options.codigo)
        .get();

      resultado.forEach((doc) => {
        fin.push(doc.data());
      });
      return fin;
    }

    //if (options.timestamp) {
    //  match.timestamp = { $regex: options.timestamp };
    //}

    if (options.precioMin) {
      const fin: any = [];
      const resultado = await this.productos
        .where("precio", ">", options.precioMin)
        .get();
      resultado.forEach((doc) => {
        fin.push(doc.data());
      });
      return fin;
    }

    if (options.precioMax) {
      const fin: any = [];
      const resultado = await this.productos
        .where("precio", "<", options.precioMax)
        .get();
      resultado.forEach((doc) => {
        fin.push(doc.data());
      });
      return fin;
    }

    if (options.precio) {
      const fin: any = [];
      const resultado = await this.productos
        .where("precio", "==", options.precio)
        .get();
      resultado.forEach((doc) => {
        fin.push(doc.data());
      });
      return fin;
    }

    if (options.stockMin) {
      const fin: any = [];
      const resultado = await this.productos
        .where("stock", ">", options.stockMin)
        .get();
      resultado.forEach((doc) => {
        fin.push(doc.data());
      });
      return fin;
    }

    if (options.stockMax) {
      const fin: any = [];
      const resultado = await this.productos
        .where("stock", "<", options.stockMax)
        .get();
      resultado.forEach((doc) => {
        fin.push(doc.data());
      });
      return fin;
    }

    if (options.stock) {
      const fin: any = [];
      const resultado = await this.productos
        .where("stock", "==", options.stock)
        .get();
      resultado.forEach((doc) => {
        fin.push(doc.data());
      });
      return fin;
    }

    return [];
  }
}
