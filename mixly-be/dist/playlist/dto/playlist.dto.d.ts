import { PlaylistVisibility, Playlist } from '../../entities/playlist.entity';
import { PageInfo } from '../../common/dto/pagination.dto';
export declare class CreatePlaylistInput {
    title: string;
    description?: string;
    visibility?: PlaylistVisibility;
    genre?: string;
}
export declare class UpdatePlaylistInput {
    title?: string;
    description?: string;
    coverImageUrl?: string;
    visibility?: PlaylistVisibility;
    genre?: string;
}
export declare class TrackInput {
    title: string;
    artist: string;
    album?: string;
    duration: number;
    coverImageUrl?: string;
    externalUrl?: string;
}
export declare class PaginationInput {
    first?: number;
    after?: string;
}
export declare class PlaylistEdge {
    node: Playlist;
    cursor: string;
}
export declare class PlaylistConnection {
    edges: PlaylistEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}
