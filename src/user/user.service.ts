import { Injectable, NotFoundException} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword } from './utils/bcrypt';
import { bcrypt } from "bcrypt";



@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  //private readonly users: User[] = [];
  getHello(): String{
    return 'Hello World...';
  }

  /*for single entity get */
  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   console.log(createUserDto);
  //   const createUser = new this.userModel(createUserDto);
  //   return createUser.save();
  // }

  /*many users entity get */
  async create( createUserDto: CreateUserDto[]): Promise<User[]> {
    return this.userModel.insertMany(createUserDto);
  }


  /*for to encryption the password of users */
    // async create( createUserDto: CreateUserDto): Promise<User[]> {
    //   const password = encodePassword(createUserDto.password);
    //   console.log(password);
    //   const saveUser = this.userModel.create({...CreateUserDto, password});
    //   return this.userModel.save(saveUser);
    // }


  async findAll(): Promise<User[]> {
    // console.log(UserDocument);
    console.log(JSON.stringify(User))
    return this.userModel.find().exec();
  }

/* for update a password entity for all documents by updateMany() as encrypted password*/

  async update(password: string, createUserDto:CreateUserDto[]): Promise<string>{
    const encrypPass = encodePassword(password);
    console.log(encrypPass);
    let updateduser =  await this.userModel.updateMany({}, {$set:{password:encrypPass}  });
    console.log(updateduser);
    return `password updated successfully`
  }


/*to decode the password and compare with the old password to the new password */
  // async hashPass(id:string, oldpass:string, newpass:string): Promise<any> {
  //   const hashedPassword = hashPass(oldpass);
  //   console.log(hashedPassword);
  //   const isMatch = await this.userModel.findByIdAndUpdate(id, bcrypt.compare(oldpass, newpass)) 
  //   return isMatch;
  // }


    //return this.userModel.update(createUserDto.id, createUserDto);

    // const userIndex = this.users.findIndex(user => user.id === id);
    // if (userIndex === -1) {
    //   throw new NotFoundException(`User with ID ${id} not found`);
    // }
    // const user: User = {
    //   ...this.users[userIndex],
    //   ...createUserDto,
    // };
    // this.users[userIndex] = user;
    // return user;
  //}


  /*For to reset the password of user by its id */
  // async update(id:string, createUserDto:CreateUserDto[]): Promise<string>{
  //   return this.userModel.findByIdAndUpdate(id, createUserDto);
  // }

/* to add entity newpassword*/
    // async update(id:string, createUserDto:CreateUserDto[]): Promise<User>{
    // console.log('user updated');
    // return await this.userModel.findByIdAndUpdate(id, createUserDto);
    // }
    
/*get the user by theire id and reset the password*/
    async findById(id: string): Promise<any> {
      return this.userModel.findById(id);
    }
    async updatePassword(user: User, newPassword: string): Promise<User> {
      user.password = newPassword;
      return await this.userModel.findByIdAndUpdate(user);
    }

    // async deleteUser(id: string): Promise<User>{
    //   return await this.userModel.findByIdAndDelete(id);
    // }
}