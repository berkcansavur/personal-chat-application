import { Injectable, PipeTransform } from "@nestjs/common";
import { Types, isValidObjectId } from "mongoose";
import { InvalidIdException } from "../exceptions/invalid-id.exceptions";

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
    transform(value: string) {
        const isValid = isValidObjectId(value);
        if(!isValid) {
            throw new InvalidIdException();
        }
        return new Types.ObjectId(value);
    }
}