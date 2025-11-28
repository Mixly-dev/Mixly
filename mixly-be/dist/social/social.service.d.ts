import { Repository } from 'typeorm';
import { Follow, Like, Playlist, User } from '../entities';
import { UserConnection } from './dto/social.dto';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';
export declare class SocialService {
    private followRepository;
    private likeRepository;
    private playlistRepository;
    private userRepository;
    constructor(followRepository: Repository<Follow>, likeRepository: Repository<Like>, playlistRepository: Repository<Playlist>, userRepository: Repository<User>);
    follow(followerId: string, followeeId: string): Promise<boolean>;
    unfollow(followerId: string, followeeId: string): Promise<boolean>;
    likePlaylist(userId: string, playlistId: string): Promise<boolean>;
    unlikePlaylist(userId: string, playlistId: string): Promise<boolean>;
    getFollowers(userId: string, pagination: PaginationInput): Promise<UserConnection>;
    getFollowing(userId: string, pagination: PaginationInput): Promise<UserConnection>;
    getFeed(userId: string, pagination: PaginationInput): Promise<PlaylistConnection>;
    isFollowing(followerId: string, followeeId: string): Promise<boolean>;
}
