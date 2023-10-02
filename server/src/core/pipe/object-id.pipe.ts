import { Injectable, PipeTransform } from "@nestjs/common";
import { Types, isValidObjectId } from "mongoose";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
    transform(value: string) {
        const isValid = isValidObjectId(value);
        if(!isValid) {
            throw new Error('Invalid objectId');
        }
        return new Types.ObjectId(value);
    }
}