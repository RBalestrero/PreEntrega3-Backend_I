import express from "express";

const router = express.Router();

// router.get("/", (req, res) => {
//     res.render("home");
// });

router.get("/", async (req, res) => {
    const {limit, page, sort} = req.query;
    const response = await fetch(`http://localhost:8080/api/products?limit=${limit}&page=${page}sort=${sort}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
    const data = await response.json();
    res.render("products", {
        products: data.payload,
        status: data.status
    });

});

router.get("/products/:id", (req, res) => {
    res.render("product");
});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export default router;