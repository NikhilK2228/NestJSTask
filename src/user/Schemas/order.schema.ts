import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Types } from "mongoose";

export type OrderDocument = Document<Order>;


@Schema()
export class Order extends Document{

    // @Prop({type:Types.ObjectId, ref:'User'})
    // ownerid:string;

    @Prop()
    totalprice:number;

    @Prop({type:Types.ObjectId, ref:'User'})
    userid:string;

    @Prop({type:Types.ObjectId,ref: 'Product'})
    productid:string;

    @Prop()
    quantity:number;

    @Prop({ type: Date,default: Date.now})
    createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);