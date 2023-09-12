import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger
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
    private readonly logger = new Logger();
    constructor(private dto : any){}
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any>{
        // Handling request before execution of request handler
        console.log('before handler',context.switchToHttp().getRequest());
        // Possible authentication can be done in this layer
        return handler.handle().pipe(
            map((data:any)=>{
                // Run something before response is sent out
                const { logger } = this;
                logger.debug(`[Application Logger]: request:${JSON.stringify(context.switchToHttp().getRequest())}, data: ${JSON.stringify(data)}, }`)
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