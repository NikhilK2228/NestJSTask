import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";


export type ProductDocument = Document<Product>;

@Schema()
export class Product extends Document{
    @Prop()
    title:string;

    @Prop()
    description:string;

    @Prop()
    price:string;

    @Prop({ type: Date,default: Date.now})
    createdAt: Date

}

export const ProductSchema = SchemaFactory.createForClass(Product);