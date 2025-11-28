import { HttpException, HttpStatus } from '@nestjs/common';
export declare class AppException extends HttpException {
    readonly code: string;
    readonly details?: Record<string, any>;
    constructor(code: string, message: string, status: HttpStatus, details?: Record<string, any>);
}
export declare class InvalidCredentialsException extends AppException {
    constructor();
}
export declare class UserNotFoundException extends AppException {
    constructor();
}
export declare class TokenExpiredException extends AppException {
    constructor();
}
export declare class TokenInvalidException extends AppException {
    constructor();
}
export declare class EmailExistsException extends AppException {
    constructor();
}
export declare class UsernameExistsException extends AppException {
    constructor();
}
export declare class PlaylistNotFoundException extends AppException {
    constructor();
}
export declare class PlaylistAccessDeniedException extends AppException {
    constructor();
}
export declare class PlaylistInvalidInputException extends AppException {
    constructor(details?: Record<string, any>);
}
export declare class TrackNotFoundException extends AppException {
    constructor();
}
export declare class AlreadyFollowingException extends AppException {
    constructor();
}
export declare class NotFollowingException extends AppException {
    constructor();
}
export declare class AlreadyLikedException extends AppException {
    constructor();
}
export declare class NotLikedException extends AppException {
    constructor();
}
export declare class CannotFollowSelfException extends AppException {
    constructor();
}
