import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService) { }

    async validateUser(id:string):Promise<any>{
        const userCheck= await this.userService.findById(id);
        if(!userCheck){
            return null;
        }
        return userCheck;
    }
    async login(user:any){
        const payload={id:user.id, emailid:user.emailid}
        return {access_token: this.jwtService.sign(payload)}
    }
}
