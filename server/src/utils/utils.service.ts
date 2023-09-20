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
    getCurrentDate = () => {
        const GMTNow = new Date();
        const GMTHours = GMTNow.getHours();
        const turkeyHours = GMTHours + 3;
    
        const turkeyNow = new Date(GMTNow);
        turkeyNow.setHours(turkeyHours);
        
        return turkeyNow.toUTCString();
      }
}
