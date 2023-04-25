import { Injectable, NotFoundException, UploadedFile } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword, comparePassword } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Order } from './Schemas/order.schema';
import { Product } from './Schemas/product.schema';
import { CreateProductDTO } from './dto/product.dto';
import { CreateOrderDto } from './dto/order.dto';



@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly jwtService: JwtService
  ) { }

  getHello(): String {
    return 'Hello World...';
  }

  /*for single user entity add */
  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   console.log(createUserDto);
  //   const createUser = new this.userModel(createUserDto);
  //   return createUser.save();
  // }

  /*many users entity get */
  async create(createUserDto: CreateUserDto[]): Promise<User[]> {
    return this.userModel.insertMany(createUserDto);
  }

  async findAll(): Promise<User[]> {
    // console.log(UserDocument);
    console.log(JSON.stringify(User))
    return this.userModel.find().exec();
  }

  /* for update a password entity for all documents by updateMany() as encrypted password*/

  async update(password: string, createUserDto: CreateUserDto[]): Promise<string> {
    const encrypPass = encodePassword(password);
    console.log(encrypPass);
    let updateduser = await this.userModel.updateMany({}, { $set: { password: encrypPass } });
    console.log(updateduser);
    return `password updated successfully for all users as in encrypted form`
  }


  /*to decode the password and compare with the old password */

  /* to add entity newpassword*/
  // async update(id:string, createUserDto:CreateUserDto[]): Promise<User>{
  // console.log('user updated');
  // return await this.userModel.findByIdAndUpdate(id, createUserDto);
  // }


  /*get the user by theire id and reset the password*/
  async findById(id: string): Promise<any> {
    return this.userModel.findById(id);
  }

  async updatePassword(id: string, oldPassword: string, newPassword: string, savedPassword: string): Promise<any> {
    const isValidPass = comparePassword(oldPassword, savedPassword);
    if (!isValidPass) {
      console.log('This is not a valid password');
    }
    let newpass = await encodePassword(newPassword);
    console.log("newpassword in encryptedform: " + newpass);
    return await this.userModel.findByIdAndUpdate(id, { password: newpass });
  }

  /* profile picture upload  */
  async setProfile(id: string, profilePic: string): Promise<any> {
    return await this.userModel.findByIdAndUpdate(id, { profilepicture: profilePic })
  }

  /* for Access_Token of user present by theire emailid*/
  async findOne(emailid): Promise<any> {
    const user = await this.userModel.findOne(emailid);
    if (!user) {
      console.log('This User Not Exists..')
      throw new NotFoundException('This User Not Exists..')
    }
    const payload = { id: user.id, username: user.username, emailid: user.emailid, address: user.address };
    console.log(payload);
    return { access_token: this.jwtService.sign(payload) }
  }

  /*Delete user present in DB by their id*/
  async deleteUser(id: string): Promise<User> {
    return await this.userModel.findByIdAndDelete(id);
  }

  /*order and product details */
  async createProduct(productdto: CreateProductDTO): Promise<Product> {
    const createdProduct = new this.productModel(productdto);
    await createdProduct.save();
    console.log(createdProduct);
    return createdProduct;
  }

  async createOrder(createorderdto: CreateOrderDto[]): Promise<Order> {
    const orderCreated = new this.orderModel(createorderdto);
    return orderCreated.save();
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.orderModel.find();
  }

  async getOrderId(id: string): Promise<Order> {
    const getOrderById = await this.orderModel.findById(id);
    if (!getOrderById) {
      console.log('Order not found')
      throw new NotFoundException('Order not found');
    }
    console.log(getOrderById);
    return getOrderById;
  }

  async getUserOrders(userid: string): Promise<Order[]> {
    //console.log(userid);
    const userOrderedCheck = await this.orderModel.findOne({ userid });
    //console.log(userOrderedCheck);
    if (!userOrderedCheck) {
      console.log('This user not having any orders')
      throw new NotFoundException('User of this id is not having any orders')
    }
    const userOrders = await this.orderModel.aggregate([
      { $match: { userid: userid } },
      {
        $lookup: {
          from: "users",
          let: { userid: { $convert: { input: "$userid", to: "objectId" } } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userid"] } } }],
          as: "user_collab"
        }
      },
      {
        $lookup: {
          from: "products",
          let: { productid: { $convert: { input: "$productid", to: "objectId" } } },
          pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$productid"] } } }],
          as: "product_collab"
        }
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ["$user_collab.username", 0] },
          productTitle: { $arrayElemAt: ["$product_collab.title", 0] },
          productDiscription: { $arrayElemAt: ["$product_collab.description", 0] }
        }
      },
      { $project: { "user_collab": 0, "product_collab": 0, "createdAt": 0, "userid": 0, "productid": 0, "__v": 0 } }
    ]);
    console.log(userOrders);
    return userOrders;
  }

}
