import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';


@Module({
  
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name:User.name, schema:UserSchema},{ name: User.name, schema: UserSchema }]), JwtModule.register({secret:'secretKey',signOptions:{expiresIn: '100s'}})],

  controllers: [UserController],
  providers: [UserService],
  exports:[ UserService]
})
export class UserModule {}
