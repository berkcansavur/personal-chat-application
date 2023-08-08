import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs'
import { plainToClass } from 'class-transformer'
interface ClassConstructor{
    new(...args: any[]): {}
}
export function SerializeEvents(dto:ClassConstructor){
    return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor{
    constructor(private dto : any){}
    
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{
        // Handling request before execution of request handler
        console.log('before handler',context.switchToHttp().getRequest());
        // Possible authentication can be done in this layer
        return handler.handle().pipe(
            map((data:any)=>{
                // Run something before response is sent out
                console.log(' After response is sent out');
                return plainToClass(
                    this.dto,
                    data,
                    {
                        excludeExtraneousValues:true
                    });
            })
        )
    }
}