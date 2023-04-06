import { Body, Controller, Param, Delete, Get, Post, Put, Patch, UseInterceptors, UploadedFile,Res } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import{NotFoundException} from '@nestjs/common'
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {v4 as uuidv4} from 'uuid';
import path, { extname } from 'path';
import { Observable, of } from 'rxjs';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {} 

  //   @Post('/addUser')
  //  async saveUser(@Body() userDetails){
  //     console.log("Added user details are: " +JSON.stringify(userDetails));
  //     return await this.userService.create(userDetails)
  //   }

    @Post('/addUser')
    async saveUser(@Body() createUserDto: CreateUserDto[]): Promise<User[]>{
    return await this.userService.create(createUserDto);
     }

   //get all user details
    @Get()
    async findAll(): Promise<any> {
    const allUsers=await this.userService.findAll();
    return `List of all users present: `  +allUsers;
    }
    //get perticuler user by their id
    @Get('/:id')
    async findById(@Param('id') id:string): Promise<string>{
      const getuser= await this.userService.findById(id);
      if(!getuser){
        return `User with id: ${id} is not present`
      }
      console.log(`The user details of ${id} is ${getuser}`);
      return `The user details of ${id} is: `+getuser;
    }


//update password key "test123"
//update password as encrypted password


/*for password updation created put API from id only*/
      // @Put('/updateUser/:id')
      // async update(@Param('id') id , @Body() password:string): Promise<User> {
      // return await this.userService.update(id, password);
      // }


/* for update a password entity for all documents by updateMany() (Uses this method for encrypt password)*/
      @Put('/updateUser')
      async update(@Body('password') password:string, createUserDto:CreateUserDto[]): Promise<string> {
      return await this.userService.update(password, createUserDto);
      }



/* newpassword entity added to database by theire id's*/ 
      // @Put('/updateUser/:id')
      // async update(@Param('id') id:string, @Body() createUserDto:CreateUserDto[]): Promise<User> {
      // return await this.userService.update(id, createUserDto);
      // }
  

//task: reset password by id

  @Patch('/resetpassword/:id')
  async resetPassword(@Param('id') id: string ,@Body() req:{oldPassword:string,newPassword:string}): Promise<any> {
    console.log('req',req)
    const user = await this.userService.findById(id);
    if (!user) {
    return `User with ID ${id} not found`;
    }

    const updatedUser = await this.userService.updatePassword(id,req.oldPassword,req.newPassword,user.password);
    if (!updatedUser) {
      return 'Failed to update user password';
    }
    return `Password updated successfully for user id ${id}`;
  }

/* upload the profile picture */
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profilepictures',
      filename:(req, file, cb)=>{
        const filename:string=Array(32).fill(null).map(()=>(Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null,`${filename}${extname(file.originalname)}`)
      }
    })
  }))

  // async addProfile(@UploadedFile() file) {
  //   console.log(file);
  //   return {
  //     path: file.path,
  //     filename: file.originalname,
  //     mimetype: file.mimetype
  //   };
  // }
  async uploadProfile(@Param('id') id:string, @UploadedFile() file) {
    console.log(file);
    const checkuser= await this.userService.findById(id);
    if(!checkuser){
      return `user doesnot exists`
    }
    const filename:string = Array(32).fill(null).map(()=>(Math.round(Math.random() * 16)).toString(16)).join('');
    //instead of using this filename we can also use ${file.name}
    const uploadresult= await this.userService.setProfile(id, `${filename}`);
    console.log(uploadresult);
    return `profile picture updated for user ${id}`;
    
  }

/*Access_Token of user */
  @Post('/signup')
    async createUser(createUserDto:CreateUserDto[]): Promise<User> {
        const result = await this.userService.createAuthUser(createUserDto);
        return result;
  }



/*Delete User present in DB by their id*/
  @Delete('/deleteUser/:id')
  async deleteUser(@Param('id') id:string): Promise<any>{
    const usercheck= await this.userService.deleteUser(id);
    if (!usercheck){
      return `this ${id} user is not present`
    }
    return `User of ${id} is deleted successfully`
  }

}
