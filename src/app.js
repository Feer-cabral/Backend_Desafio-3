// Primero importamos express
import express from "express";
// Luego creamos la app
const app = express();
// Configuramos el puerto que vamos a utilizar
const PUERTO = 8080;
// Indicamos a la app que se va a utilizar el formato JSON para los datos
app.use(express.json());
// Tambien que se va a trabajar con datos complejos
app.use(express.urlencoded({ extended: true }));

import fileSystem from "fs";
class ProductManager {
  constructor() {
    this.path = "./products.json";
  }

  writeProducts() {
    fileSystem.writeFileSync(this.path, JSON.stringify([], null, 2));
  }

  getProducts() {
    const products = fileSystem.readFileSync(this.path, "utf-8");

    return JSON.parse(products);
  }

  addProduct(product) {
    const products = this.getProducts();

    product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    products.push(product);

    fileSystem.writeFileSync(this.path, JSON.stringify(products, null, 2));
  }

  getProductById(id) {
    const products = this.getProducts();

    const product = products.find((product) => product.id == id);

    if (!product) {
      console.log("Producto NO encontrado");
    } else {
      return product;
    }
  }

  updateProduct(id, updatedProduct) {
    const products = this.getProducts();

    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.log("Producto NO encontrado");
    } else {
      products[index] = { ...products[index], ...updatedProduct };

      fileSystem.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }
  }

  deleteProduct(id) {
    const products = this.getProducts();

    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.log("Producto NO encontrado");
    } else {
      products.splice(index, 1);

      fileSystem.writeFileSync(this.path, JSON.stringify(products, null, 2));
    }
  }
}

// Creamos la instancia
const productManager = new ProductManager();
productManager.writeProducts();

productManager.addProduct({
  title: "Smart TV LG 32 pulgadas",
  description: "Smart TV nueva de 32 pulgadas con resolución Full HD",
  price: 150000,
  thumbnail: "sin imagen",
  code: "smart32",
  stock: 20,
});
productManager.addProduct({
  title: "Samsung Galaxy S22",
  description: "Smart Phone Samsung Galaxy S22",
  price: 200000,
  thumbnail: "sin imagen",
  code: "s22",
  stock: 15,
});
productManager.addProduct({
  title: "Play Station 5",
  description: "Consola de videojuegos Sony Play Station 5",
  price: 500000,
  thumbnail: "sin imagen",
  code: "ps5",
  stock: 10,
});
productManager.addProduct({
  title: "PC Gamer AMD Ryzen 5",
  description: "PC Gaming AMD Ryzen 5",
  price: 350000,
  thumbnail: "sin imagen",
  code: "pcamd",
  stock: 5,
});
productManager.addProduct({
  title: "Notebook HP 15 pulgadas",
  description: "Notebook HP 15 pulgadas con resolución Full HD",
  price: 250000,
  thumbnail: "sin imagen",
  code: "hp15",
  stock: 20,
});
productManager.addProduct({
  title: "Bicicleta MTB",
  description: "Bicicleta MTB con 2 velocidades, rodado 26",
  price: 150000,
  thumbnail: "sin imagen",
  code: "mtb",
  stock: 15,
});
productManager.addProduct({
  title: "Play Station 4",
  description: "Consola de videojuegos Sony Play Station 4",
  price: 300000,
  thumbnail: "sin imagen",
  code: "ps4",
  stock: 10,
});
productManager.addProduct({
  title: "Lavarropa LG 10 kilos",
  description: "Lavarropa LG con capacidad de 10 kilos con 3 velocidades",
  price: 200000,
  thumbnail: "sin imagen",
  code: "lavarropa",
  stock: 25,
});
productManager.addProduct({
  title: "Cocina Electrolux 10 pies",
  description: "Cocina Electrolux con capacidad de 10 órdenes",
  price: 250000,
  thumbnail: "sin imagen",
  code: "electrolux",
  stock: 30,
});
productManager.addProduct({
  title: "Ventilador Liliana",
  description: "Ventilador Liliana con 3 velocidades",
  price: 100000,
  thumbnail: "sin imagen",
  code: "liliana",
  stock: 10,
});

// Ahora vamos a crear las rutas
app.get("/products", (req, res) => {
  res.send(productManager.getProducts());
});

// Usamos la funcion listen para escuchar el puerto
app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

// Recibimos por query param un limite de productos, en la ruta usamos "product" para que no se pise con la ruta que usamos anteriormente
app.get("/product", (req, res) => {
  let { limit } = req.query;
  // Si existe un limite lo aplicamos y sino que muestre todos los productos
  if (limit) {
    let conLimite = productManager.getProducts().slice(0, limit); // Metodo slice para cortar el arreglo, inicializa en 0 y corta en el limite
    res.send(conLimite);
  } else {
    res.send(productManager.getProducts());
  }
});

// Vamos a recibir por request param el id del producto solicitado
app.get("/products/:pid", (req, res) => {
  // Obtenemos el id de la url
  let { pid } = req.params;
  // Utilizamos el metodo de la clase para buscar el producto por su id
  const productoEncontrado = productManager.getProductById(pid);
  // Si encuentra ese id lo enviamos, de lo contrario devolvemos un mensaje de error
  if (productoEncontrado) {
    res.send(productoEncontrado);
  } else {
    res.send("No existe ningun producto con ese ID");
  }
});
