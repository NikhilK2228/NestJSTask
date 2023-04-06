import { Module, forwardRef } from "@nestjs/common"
import { UserModule } from "src/user/user.module";
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from '@nestjs/jwt';
//import { AuthController } from './auth.controller';
import { UserService } from "src/user/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schemas/user.schema";
import { LocalStrategy } from "./strategy/strategy.auth";
//import { forwardRef } from "@nestjs/common";
import { AppModule } from "src/app.module";



@Module({
  imports: [ JwtModule.register({secret:'secretKey',signOptions:{expiresIn: '100s'}})],
  providers: [AuthService, LocalStrategy],
  controllers: [],
  exports:[AuthService]
})
export class AuthModule {}