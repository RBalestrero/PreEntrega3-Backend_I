import { Router } from "express";
import { cartManager } from "../../../managers/cart.manager.js";
import { CartModel } from "../../../models/cart.model.js";
const router = Router();

router.post("/", async (req, res) => {
  try {
    // if (!req.body.products) throw new Error("products is required");
    const cart = await CartModel.create(req.body);
    res.status(201).json({ payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartFinded = await CartModel.findById(cid).populate(
      "productos.producto"
    );
    const status = cartFinded ? 200 : 404;
    res.status(status).json({ payload: cartFinded });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { productos } = req.body;
    const cartFinded = await CartModel.findById(cid).lean();
    if (!cartFinded) res.status(404).json({ error: "Error" });

    const newCart = {
      ...cartFinded,
      productos,
    };

    const cart = await CartModel.findByIdAndUpdate(cid, newCart, {
      new: true,
    });

    res.status(201).json({ payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { cantidad } = req.body;

    console.log(req.body);

    // Validar que la cantidad sea un número válido
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    // Buscar el carrito
    const cartFinded = await CartModel.findById(cid);
    if (!cartFinded) return res.status(404).json({ error: "Carrito no encontrado" });

    // Buscar el producto en el carrito
    const productIndex = cartFinded.productos.findIndex((p) => p.producto.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ error: "Producto no encontrado en el carrito" });

    // Actualizar la cantidad del producto en el array
    cartFinded.productos[productIndex].cantidad = cantidad;

    // Guardar los cambios
    const updatedCart = await cartFinded.save();

    res.status(200).json({ payload: updatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartFinded = await CartModel.findById(cid);
    if (!cartFinded) res.status(404).json({ error: "Error" });
    const product = cartFinded.products.find(
      (product) => product.product._id.toString() === pid
    );
    if (!product) res.status(404).json({ error: "Error" });
    const newProduct = {
      ...product,
      cantidad: product.cantidad + 1,
    };

    const cart = await CartModel.findByIdAndUpdate(
      cid,
      {
        $set: {
          "products.$": newProduct,
        },
      },
      {
        new: true,
      }
    ).populate("products.product");

    res.status(201).json({ payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cartFinded = await CartModel.findById(cid);
    if (!cartFinded) return res.status(404).json({ error: "Carrito no encontrado" });

    const filteredProducts = cartFinded.productos.filter(product => product.producto.toString() !== pid);
    
    if (filteredProducts.length === cartFinded.productos.length) {
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    }

    const result = await CartModel.findByIdAndUpdate(cid, { productos: filteredProducts }, { new: true });

    res.status(200).json({ payload: result });
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await CartModel.findByIdAndUpdate(cid, { productos: [] }, { new: true });
    if (!result) return res.status(404).json({ error: "Carrito no encontrado" });

    res.status(200).json({ payload: result });
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
