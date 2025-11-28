import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: HttpStatus,
    public readonly details?: Record<string, any>,
  ) {
    super({ code, message, details }, status);
  }
}

// Auth Exceptions
export class InvalidCredentialsException extends AppException {
  constructor() {
    super('AUTH_INVALID_CREDENTIALS', 'Email or password is incorrect', HttpStatus.UNAUTHORIZED);
  }
}

export class UserNotFoundException extends AppException {
  constructor() {
    super('AUTH_USER_NOT_FOUND', 'User does not exist', HttpStatus.NOT_FOUND);
  }
}

export class TokenExpiredException extends AppException {
  constructor() {
    super('AUTH_TOKEN_EXPIRED', 'Access token has expired', HttpStatus.UNAUTHORIZED);
  }
}

export class TokenInvalidException extends AppException {
  constructor() {
    super('AUTH_TOKEN_INVALID', 'Token is malformed or invalid', HttpStatus.UNAUTHORIZED);
  }
}

export class EmailExistsException extends AppException {
  constructor() {
    super('AUTH_EMAIL_EXISTS', 'Email already registered', HttpStatus.CONFLICT);
  }
}

export class UsernameExistsException extends AppException {
  constructor() {
    super('AUTH_USERNAME_EXISTS', 'Username already taken', HttpStatus.CONFLICT);
  }
}

// Playlist Exceptions
export class PlaylistNotFoundException extends AppException {
  constructor() {
    super('PLAYLIST_NOT_FOUND', 'Playlist does not exist', HttpStatus.NOT_FOUND);
  }
}

export class PlaylistAccessDeniedException extends AppException {
  constructor() {
    super('PLAYLIST_ACCESS_DENIED', 'User does not have access to this playlist', HttpStatus.FORBIDDEN);
  }
}

export class PlaylistInvalidInputException extends AppException {
  constructor(details?: Record<string, any>) {
    super('PLAYLIST_INVALID_INPUT', 'Invalid playlist data provided', HttpStatus.BAD_REQUEST, details);
  }
}

export class TrackNotFoundException extends AppException {
  constructor() {
    super('TRACK_NOT_FOUND', 'Track does not exist in playlist', HttpStatus.NOT_FOUND);
  }
}

// Social Exceptions
export class AlreadyFollowingException extends AppException {
  constructor() {
    super('ALREADY_FOLLOWING', 'Already following this user', HttpStatus.CONFLICT);
  }
}

export class NotFollowingException extends AppException {
  constructor() {
    super('NOT_FOLLOWING', 'Not following this user', HttpStatus.BAD_REQUEST);
  }
}

export class AlreadyLikedException extends AppException {
  constructor() {
    super('ALREADY_LIKED', 'Already liked this playlist', HttpStatus.CONFLICT);
  }
}

export class NotLikedException extends AppException {
  constructor() {
    super('NOT_LIKED', "Haven't liked this playlist", HttpStatus.BAD_REQUEST);
  }
}

export class CannotFollowSelfException extends AppException {
  constructor() {
    super('CANNOT_FOLLOW_SELF', 'You cannot follow yourself', HttpStatus.BAD_REQUEST);
  }
}
