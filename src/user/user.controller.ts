import { Body, Controller, Param, Delete, Get, Post, Put, Patch } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import{NotFoundException} from '@nestjs/common'


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
    async findAll(): Promise<User[]> {
    return this.userService.findAll();
    }


//update password key "test123"
//update password as encrypted password


/*for password updation created put API from id only*/
      // @Put('/updateUser/:id')
      // async update(@Param('id') id , @Body() password:string): Promise<User> {
      // return await this.userService.update(id, password);
      // }

/* for update a password entity for all documents by updateMany() */
      @Put('/updateUser')
      async update(@Body('password') password:string, createUserDto:CreateUserDto[]): Promise<string> {
      return await this.userService.update(password, createUserDto);
      }


//reset password by id
//if newpassword matches to oldpassword allow user to reset the password
//newpass
//oldpass


/* newpassword entity added to database by theire id's*/ 
      // @Put('/updateUser/:id')
      // async update(@Param('id') id:string, @Body() createUserDto:CreateUserDto[]): Promise<User> {
      // return await this.userService.update(id, createUserDto);
      // }


    // @Get(':id')
    // findAll(@Body() params): string {
    //  console.log(params.id);
    //  return `existing users of id ${params.id}`
    //  //return `Perticuler user id's student will display: ${params.id}`;
    // }
  
    // @Put('/updateUser/:id')
    // update(@Body('id') id: string, @Body() UserDetails) {
    //   return `This action updates a ${id} user`;
    // }
  
    // @Delete('/deleteUser/:id')
    // remove(@Body('id') id:string){
    //   return `This action perform delete ${id} user`;
    // }


// @Put('isMatch/:id')
//     async hashPass(@Param('id') id:string, @Body() body: { oldpass: string, newpass:string }):Promise<any> {
//     // To Fetch the user from the database by their id
//     const user = await this.userService.hashPass(id, body.oldpass, body.newpass);

//     // Compare the entered password with the stored password 
//     const isPasswordValid = await this.userService.hashPass(id, body.oldpass, user.newpass);

//     if (isPasswordValid) {
//       return 'User can reset the password'
//     } else {
//       return 'This user can not reset the password'
//     }
//   }

@Patch('/resetpassword/:id')
  async resetPassword(@Param('id') id: string ,@Body('password') newPassword: string ): Promise<any> {
    const user = await this.userService.findById(id);
    if (!user) {
     return `User with ID ${id} not found`;
    }

    const updatedUser = await this.userService.updatePassword(user, newPassword);
    if (!updatedUser) {
      return 'Failed to update user password';
    }
    return `Password updated successfully for user id ${id}`;
  }

  @Delete('/deleteUser/:id')
  async deleteUser(@Param('id') id:string): Promise<any>{
    const usercheck= await this.userService.deleteUser(id);
    if (!usercheck){
      throw new NotFoundException(`this ${id} user is not present`)
    }
    return `User of ${id} is deleted successfully`
  }
}