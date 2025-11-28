import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { AppException } from '../exceptions/app.exceptions';

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    
    if (exception instanceof AppException) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: exception.code,
          statusCode: exception.getStatus(),
          details: exception.details,
        },
      });
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message = typeof response === 'string' 
        ? response 
        : (response as any).message || exception.message;

      return new GraphQLError(Array.isArray(message) ? message[0] : message, {
        extensions: {
          code: 'HTTP_EXCEPTION',
          statusCode: exception.getStatus(),
        },
      });
    }

    if (exception instanceof GraphQLError) {
      return exception;
    }

    // Unknown error
    console.error('Unhandled exception:', exception);
    return new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    });
  }
}
