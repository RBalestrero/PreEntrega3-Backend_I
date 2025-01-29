import express from "express";
import productRouter from "./routes/api/products/products.router.js";
import cartRouter from "./routes/api/carts/carts.router.js";
import realTimeProductsRouter from "./routes/views.router.js";
import path from 'path';
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { __dirname } from './utils.js';
import { prodManager } from "./managers/product.manager.js";
import { initMongoDB } from "./connection/mongodb.js";

const app = express();
const httpServer = app.listen(8080, () => console.log("server ok puerto 8080"));

// Creamos el servidor para sockets viviendo dentro de nuestro servidor principal
const socketServer = new Server(httpServer);

// Configuramos el servidor para que pueda manejar los sockets
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);


app.use('/static', express.static(path.join(process.cwd(), "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

socketServer.on('connection', (socket) => {
    socket.on("getProducts", async () => {
        try {
            const productos = await prodManager.getAll();
            socket.emit("productos", productos);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("getProductsHome", async () => {
        try {
            const productos = await prodManager.getAll();
            socket.emit("productosHome", productos);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            await prodManager.delete(id);
            const productos = await prodManager.getAll();
            socketServer.emit("productos", productos);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("addProduct", async (product) => {
        try {
            await prodManager.create(product);
            const productos = await prodManager.getAll();
            socketServer.emit("productos", productos);
        } catch (error) {
            console.log(error);
        }
    });
});

// Conectamos a mongoDB

initMongoDB()
    .then(() => console.log("MongoDB conectado"))
    .catch((error)=> console.log(error));

