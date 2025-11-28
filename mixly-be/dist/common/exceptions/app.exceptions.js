"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotFollowSelfException = exports.NotLikedException = exports.AlreadyLikedException = exports.NotFollowingException = exports.AlreadyFollowingException = exports.TrackNotFoundException = exports.PlaylistInvalidInputException = exports.PlaylistAccessDeniedException = exports.PlaylistNotFoundException = exports.UsernameExistsException = exports.EmailExistsException = exports.TokenInvalidException = exports.TokenExpiredException = exports.UserNotFoundException = exports.InvalidCredentialsException = exports.AppException = void 0;
const common_1 = require("@nestjs/common");
class AppException extends common_1.HttpException {
    constructor(code, message, status, details) {
        super({ code, message, details }, status);
        this.code = code;
        this.details = details;
    }
}
exports.AppException = AppException;
class InvalidCredentialsException extends AppException {
    constructor() {
        super('AUTH_INVALID_CREDENTIALS', 'Email or password is incorrect', common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class UserNotFoundException extends AppException {
    constructor() {
        super('AUTH_USER_NOT_FOUND', 'User does not exist', common_1.HttpStatus.NOT_FOUND);
    }
}
exports.UserNotFoundException = UserNotFoundException;
class TokenExpiredException extends AppException {
    constructor() {
        super('AUTH_TOKEN_EXPIRED', 'Access token has expired', common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.TokenExpiredException = TokenExpiredException;
class TokenInvalidException extends AppException {
    constructor() {
        super('AUTH_TOKEN_INVALID', 'Token is malformed or invalid', common_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.TokenInvalidException = TokenInvalidException;
class EmailExistsException extends AppException {
    constructor() {
        super('AUTH_EMAIL_EXISTS', 'Email already registered', common_1.HttpStatus.CONFLICT);
    }
}
exports.EmailExistsException = EmailExistsException;
class UsernameExistsException extends AppException {
    constructor() {
        super('AUTH_USERNAME_EXISTS', 'Username already taken', common_1.HttpStatus.CONFLICT);
    }
}
exports.UsernameExistsException = UsernameExistsException;
class PlaylistNotFoundException extends AppException {
    constructor() {
        super('PLAYLIST_NOT_FOUND', 'Playlist does not exist', common_1.HttpStatus.NOT_FOUND);
    }
}
exports.PlaylistNotFoundException = PlaylistNotFoundException;
class PlaylistAccessDeniedException extends AppException {
    constructor() {
        super('PLAYLIST_ACCESS_DENIED', 'User does not have access to this playlist', common_1.HttpStatus.FORBIDDEN);
    }
}
exports.PlaylistAccessDeniedException = PlaylistAccessDeniedException;
class PlaylistInvalidInputException extends AppException {
    constructor(details) {
        super('PLAYLIST_INVALID_INPUT', 'Invalid playlist data provided', common_1.HttpStatus.BAD_REQUEST, details);
    }
}
exports.PlaylistInvalidInputException = PlaylistInvalidInputException;
class TrackNotFoundException extends AppException {
    constructor() {
        super('TRACK_NOT_FOUND', 'Track does not exist in playlist', common_1.HttpStatus.NOT_FOUND);
    }
}
exports.TrackNotFoundException = TrackNotFoundException;
class AlreadyFollowingException extends AppException {
    constructor() {
        super('ALREADY_FOLLOWING', 'Already following this user', common_1.HttpStatus.CONFLICT);
    }
}
exports.AlreadyFollowingException = AlreadyFollowingException;
class NotFollowingException extends AppException {
    constructor() {
        super('NOT_FOLLOWING', 'Not following this user', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.NotFollowingException = NotFollowingException;
class AlreadyLikedException extends AppException {
    constructor() {
        super('ALREADY_LIKED', 'Already liked this playlist', common_1.HttpStatus.CONFLICT);
    }
}
exports.AlreadyLikedException = AlreadyLikedException;
class NotLikedException extends AppException {
    constructor() {
        super('NOT_LIKED', "Haven't liked this playlist", common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.NotLikedException = NotLikedException;
class CannotFollowSelfException extends AppException {
    constructor() {
        super('CANNOT_FOLLOW_SELF', 'You cannot follow yourself', common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.CannotFollowSelfException = CannotFollowSelfException;
//# sourceMappingURL=app.exceptions.js.map