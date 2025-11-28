import { User } from './user.entity';
import { PlaylistTrack } from './playlist-track.entity';
export declare enum PlaylistVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}
export declare class Playlist {
    id: string;
    title: string;
    description: string;
    coverImageUrl: string;
    visibility: PlaylistVisibility;
    shareCode: string;
    genre: string;
    owner: User;
    ownerId: string;
    playlistTracks: PlaylistTrack[];
    trackCount: number;
    likeCount: number;
    isLiked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
