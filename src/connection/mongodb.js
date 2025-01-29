import mongoose from 'mongoose';
import UserModel from '../models/user.model.js';

export const initMongoDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/Entrega3");
        const response = await UserModel.find({});
        console.log(response);
    } catch (e){
        throw new Error(e);
    }
};