import dotenv from "dotenv";
dotenv.config();

const venv = {
  PORT: process.env.PORT || 8080,
  MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || "user",
  MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || "pasw",
  MONGO_ATLAS_CLUSTER: process.env.MONGO_ATLAS_CLUSTER || "clusterUrl",
  MONGO_ATLAS_DBNAME: process.env.MONGO_ATLAS_DBNAME || "dbName",
  MONGO_LOCAL_DBNAME: process.env.MONGO_LOCAL_DBNAME || "dbNameLocal",
  FILE_SYSTEM_PERSISTENCIA:
    process.env.FILE_SYSTEM_PERSISTENCIA || "url json file",
  MONGO_LOCAL_IP: process.env.MONGO_LOCAL_IP || "localhost",
  MONGO_LOCAL_PORT: process.env.MONGO_LOCAL_PORT || "27017",
  SQLITE3_KNEX_ENV: process.env.SQLITE3_KNEX_ENV || "env de knexfile.js",
  MYSQL_KNEX_ENV: process.env.MYSQL_KNEX_ENV || "env de knexfile.js",
  SQLITE3_DB: process.env.SQLITE3_DB || "./db.sqlite3",
};

export default venv;
