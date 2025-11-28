import { PlaylistConnection } from '../../playlist/dto/playlist.dto';
import { UserConnection } from '../../social/dto/social.dto';
export declare enum TimeRange {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    ALL_TIME = "ALL_TIME"
}
export declare class SearchFilters {
    genre?: string;
    category?: string;
}
export declare class SearchResult {
    playlists: PlaylistConnection;
    users: UserConnection;
}
