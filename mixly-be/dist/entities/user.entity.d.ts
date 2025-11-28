import { Playlist } from './playlist.entity';
export declare class User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    passwordHash: string;
    avatarUrl: string;
    bio: string;
    playlists: Playlist[];
    playlistCount: number;
    followerCount: number;
    followingCount: number;
    createdAt: Date;
    updatedAt: Date;
}
