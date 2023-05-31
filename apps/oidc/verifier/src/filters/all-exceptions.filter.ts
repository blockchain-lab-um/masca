import { DetailedError } from '@blockchain-lab-um/oidc-rp-plugin';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): FastifyReply {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let error: DetailedError;
    let httpStatus;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      error = new DetailedError(
        'http_exception',
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : JSON.stringify(exceptionResponse)
      );

      httpStatus = exception.getStatus();
    } else if (exception instanceof DetailedError) {
      error = exception;
      httpStatus = exception.statusCode;
    } else {
      error = new DetailedError(
        'internal_server_error',
        'The server encountered an internal error and was unable to complete your request.'
      );
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return response
      .code(httpStatus)
      .type('application/json')
      .send(error.toJSON());
  }
}

export default AllExceptionsFilter;
