import * as bcrypt from 'bcrypt';

export function encodePassword(randomPassword:string){
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(randomPassword, SALT);
}
