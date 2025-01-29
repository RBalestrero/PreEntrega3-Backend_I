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
    const cartFinded = await CartModel.findById(cid).populate('products.product');
    const status = cartFinded ? 200 : 404;
    res.status(status).json({ payload: cartFinded?.products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cartFinded = await CartModel.findById(cid).lean();
    if(!cartFinded) res.status(404).json({ error: "Error" });

    const newCart = {
      ...cartFinded,
      products
    };

    const cart = await CartModel.findByIdAndUpdate(cid, newCart, {
      new: true,
    }).populate('products.product');

    res.status(201).json({ payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cartFinded = await CartModel.findById(cid);
    if(!cartFinded) res.status(404).json({ error: "Error" });
    const product = cartFinded.products.find(product => product.product._id.toString() === pid);
    if(!product) res.status(404).json({ error: "Error" });
    const newProduct = {
      ...product,
      cantidad: product.cantidad + 1
    };

    const cart = await CartModel.findByIdAndUpdate(cid, {
      $set: {
        "products.$": newProduct
      }
    }, {
      new: true,
    }).populate('products.product');

    res.status(201).json({ payload: cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await cartModel.deleteOne({ _id: req.params.cid });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;