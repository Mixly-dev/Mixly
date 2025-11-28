import { User } from '../../entities/user.entity';
export declare class RegisterInput {
    email: string;
    username: string;
    password: string;
    displayName?: string;
}
export declare class LoginInput {
    email: string;
    password: string;
}
export declare class AuthPayload {
    accessToken: string;
    refreshToken: string;
    user: User;
}
