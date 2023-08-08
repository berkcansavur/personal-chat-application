import { Injectable } from '@nestjs/common';
import { promisify } from "util";
import { randomBytes, scrypt as _scrypt} from "crypto";
const scrypt = promisify(_scrypt);
export const jwtConstants = {
    secret: 'secretKey',
}
@Injectable()
export class UtilsService {
    async hashPassword(password: string){
        const salt = randomBytes(8).toString('hex');
    
            const hash = await scrypt(password, salt, 32) as Buffer;
    
            const generatedPassword = salt + '.' + hash.toString('hex');
            
            return generatedPassword;
      }
}
