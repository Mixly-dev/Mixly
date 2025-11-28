import { SocialService } from './social.service';
import { User } from '../entities/user.entity';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';
export declare class SocialResolver {
    private socialService;
    constructor(socialService: SocialService);
    follow(user: User, userId: string): Promise<boolean>;
    unfollow(user: User, userId: string): Promise<boolean>;
    likePlaylist(user: User, playlistId: string): Promise<boolean>;
    unlikePlaylist(user: User, playlistId: string): Promise<boolean>;
    feed(user: User, pagination?: PaginationInput): Promise<PlaylistConnection>;
}
