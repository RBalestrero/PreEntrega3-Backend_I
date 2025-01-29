import { model, Schema } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';


const productCollection = 'products'

const productSchema = new Schema({
    title: String,
    description: String,
    file: String,
    code: Number,
    price: Number,
    category: String,
    stock: Number,
    thumbnail: String
})

productSchema.plugin(mongoosePaginate);

export const ProductModel = model(productCollection, productSchema)