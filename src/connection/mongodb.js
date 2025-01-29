import { connect } from 'mongoose';

export const mongoConnection = async () => {
    try{
        await connect("mongodb://localhost:27017/Entrega3");
    } catch (e){
        throw new Error(e);
    }
};