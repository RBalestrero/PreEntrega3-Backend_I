import { query, Router } from "express";
import { prodManager } from "../../../managers/product.manager.js";
import { ProductModel } from "../../../models/product.model.js";
import { uploader } from "../../../utils.js";
import paginate from 'mongoose-paginate-v2';

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = "", ...query } = req.query;
    const sortManager = {
      asc: 1,
      desc: -1,
    };

    const products = await ProductModel.paginate(
      {
        ...query,
      },
      {
        limit,
        page,
        ...(sort && { sort: { price: sortManager[sort] } }),
        customLabels: { docs: 'payload'}
      }
    );

    res.json({
      ...products,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await prodManager.getById(req.params.pid);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", uploader.single("file"), async (req, res) => { 
  try {
    if (!req.file) throw new Error("Ocurrio un error al subir el archivo");
    if (!req.body.title) throw new Error("title is required");
    if (!req.body.description) throw new Error("description is required");
    if (!req.body.code) throw new Error("code is required");
    if (!req.body.price) throw new Error("price is required");
    if (!req.body.stock) throw new Error("stock is required");
    if (!req.body.category) throw new Error("category is required");

    const product = req.body;
    const result = await ProductModel.create({
      ...product,
      thumbnail: req.file.path.split('public')[1],
    });
    res.status(201).json({payload: result});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post("/", async (req, res) => {
//   try {
//     if (!req.body.title) throw new Error("title is required");
//     if (!req.body.description) throw new Error("description is required");
//     if (!req.body.code) throw new Error("code is required");
//     if (!req.body.price) throw new Error("price is required");
//     if (!req.body.stock) throw new Error("stock is required");
//     if (!req.body.category) throw new Error("category is required");
//     req.body.status = req.body.status || true;
//     const product = await prodManager.create(req.body);
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.put("/:pid", async (req, res) => {
  try {
    const product = await prodManager.update(req.body, req.params.pid);
    res.send(`${product.title} se actualizo correctamente`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const result = await ProductModel.findByIdAndDelete(req.params.pid);
    res.status(201).json({payload: result});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
