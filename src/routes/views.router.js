import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try{
        
        const {limit, page, sort} = req.query;
        const response = await fetch(`http://localhost:8080/api/products?limit=${limit}&page=${page}sort=${sort}`,{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        // res.render("product");
        res.render("products", {
            products: data.payload,
            status: data.status
        });
    }
    catch(error){
        res.status(500).json({error: error.message});
    }

});

router.get("/product/:pid", async (req, res) => {

    try{
        const {pid} = req.params;
        const response = await fetch(`http://localhost:8080/api/products/${pid}`,{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });
        const data = await response.json();
        
        res.render('product', {
            products: data.payload,
            status: data.status
        });

    }
    catch(error){
        res.status(500).json({error: error.message});
    }

});

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

export default router;