import { Module} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { Order, OrderSchema } from './Schemas/order.schema';
import { Product, ProductSchema } from './Schemas/product.schema';


@Module({
  
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name:User.name, schema:UserSchema},{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{name:Order.name,schema:OrderSchema}]), 
  MongooseModule.forFeature([{name:Product.name,schema:ProductSchema}]),
  JwtModule.register({secret:'secretKey',signOptions:{expiresIn: '100s'}})],

  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
