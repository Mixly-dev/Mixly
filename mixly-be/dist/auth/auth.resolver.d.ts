import { AuthService } from './auth.service';
import { RegisterInput, LoginInput, AuthPayload } from './dto/auth.dto';
import { User } from '../entities/user.entity';
export declare class AuthResolver {
    private authService;
    constructor(authService: AuthService);
    register(input: RegisterInput): Promise<AuthPayload>;
    login(input: LoginInput): Promise<AuthPayload>;
    refreshToken(refreshToken: string): Promise<AuthPayload>;
    me(user: User): Promise<User>;
}
