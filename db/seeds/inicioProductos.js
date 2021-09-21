const initProductos = [
  {
    id: 1,
    nombre: "Pizza Muzzarella",
    descripcion: "salsa de tomate y muzarella",
    codigo: "muzza",
    foto: "pizza_muzza.png",
    precio: 600,
    stock: 200,
  },
  {
    id: 2,
    nombre: "Pizza Napolitana",
    descripcion: "salsa de tomate, muzarella y tomates",
    codigo: "napo",
    foto: "pizza_napo.png",
    precio: 750,
    stock: 200,
  },
  {
    id: 3,
    nombre: "Pizza Anchoas",
    descripcion: "salsa de tomate, muzarella y anchoas",
    codigo: "anchoas",
    foto: "pizza_anchoas.png",
    precio: 800,
    stock: 20,
  },
];

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("productos")
    .del()
    .then(() => knex("productos").insert(initProductos));
};
