import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export function encodePassword(randomPassword:string){
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(randomPassword, SALT);
}





// export function hashPass(oldpass:string):Promise<string>{
//     const saltRounds= 10;
//     const salt= bcrypt.gensalt(saltRounds);
//     const hash = bcrypt.hash(oldpass, salt);
//     return hash;
// }

/*For utilsservice.ts */
// @Injectable()
// export class PasswordService {
//     async newpass(password: string): Promise<string> {
//       const saltRounds = 10;
//       const salt = await bcrypt.genSalt(saltRounds);
//       const hash = await bcrypt.hash(password, salt);
//       return hash;
//     }
//     async comparePassword(oldpass:string, newpass:string): Promise<boolean> {
//         const isMatch = await bcrypt.compare(oldpass, newpass);
//         return isMatch;
//       }
// }
