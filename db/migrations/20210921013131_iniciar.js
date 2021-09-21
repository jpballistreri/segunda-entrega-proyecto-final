exports.up = function (knex) {
  return knex.schema.createTable("productos", (productosTable) => {
    productosTable.increments();
    productosTable.string("nombre").notNullable();
    productosTable.string("descripcion").notNullable();
    productosTable.string("codigo").notNullable();
    productosTable.string("foto").notNullable();
    productosTable.decimal("precio", 14, 2).notNullable();
    productosTable.integer("stock").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("productos");
};
