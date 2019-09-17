import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable()
export class LogInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        return next
            .handle()
            .pipe(
                tap(() => {

                })
            )
    }
}