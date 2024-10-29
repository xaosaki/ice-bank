import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.printf(({ timestamp, level, message }) => {
//       return `${timestamp} [${level}]: ${message}`;
//     })
//   ),
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: 'logs/combined.log' })
//   ]
// });

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`${method} ${url} ${Date.now() - now}ms`, context.getClass().name)
        )
      );
  }
}
