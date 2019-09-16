import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { Reflector, ModuleRef } from "@nestjs/core";

@Injectable()
export class LogInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');

        // const permits = this.reflector.get<string[]>('permits', context.getHandler());
        // console.log('LogInterceptor permits：', permits)

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => console.log(`After... ${Date.now() - now}ms`)));
    }
}