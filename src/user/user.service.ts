import { Injectable, NotFoundException, UploadedFile} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword, comparePassword } from './utils/bcrypt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly jwtService:JwtService) {}
  
  getHello(): String{
    return 'Hello World...';
  }

/*for single user entity add */
  // async create(createUserDto: CreateUserDto): Promise<User> {
  //   console.log(createUserDto);
  //   const createUser = new this.userModel(createUserDto);
  //   return createUser.save();
  // }

/*many users entity get */
  async create( createUserDto: CreateUserDto[]): Promise<User[]> {
    return this.userModel.insertMany(createUserDto);
  }

  async findAll(): Promise<User[]> {
    // console.log(UserDocument);
    console.log(JSON.stringify(User))
    return this.userModel.find().exec();
  }

/* for update a password entity for all documents by updateMany() as encrypted password*/

  async update(password: string, createUserDto:CreateUserDto[]): Promise<string>{
    const encrypPass = encodePassword(password);
    console.log(encrypPass);
    let updateduser =  await this.userModel.updateMany({}, {$set:{password:encrypPass}});
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

    async updatePassword(id: string, oldPassword:string,newPassword:string, savedPassword:string): Promise<any> {
      const isValidPass= comparePassword(oldPassword,savedPassword);
      if(!isValidPass){
        console.log ('This is not a valid password');
      }
      let newpass = await encodePassword(newPassword);
      console.log("newpassword in encryptedform: " +newpass);
      return await this.userModel.findByIdAndUpdate(id, {password:newpass});
    }

/* profile picture upload  */
    async setProfile(id: string, profilePic:string):Promise<any>{
      return await this.userModel.findByIdAndUpdate(id, {profilepicture:profilePic})
    }

/* for Access_Token of user present by theire emailid*/
    async findOne(emailid):Promise<any>{
      const user= await this.userModel.findOne(emailid);
      if(!user){
        console.log('This User Not Exists..')
        throw new NotFoundException ('This User Not Exists..')
      }
      const payload={id:user.id,username:user.username, emailid:user.emailid};
      console.log(payload);
      return {access_token: this.jwtService.sign(payload)}
    }

/*Delete user present in DB by their id*/
    async deleteUser(id: string): Promise<User>{
      return await this.userModel.findByIdAndDelete(id);
    }
}
