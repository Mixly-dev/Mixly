import { Repository } from 'typeorm';
import { Playlist, User, Like } from '../entities';
import { SearchFilters, SearchResult, TimeRange } from './dto/search.dto';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';
export declare class SearchService {
    private playlistRepository;
    private userRepository;
    private likeRepository;
    constructor(playlistRepository: Repository<Playlist>, userRepository: Repository<User>, likeRepository: Repository<Like>);
    search(query: string, filters: SearchFilters, pagination: PaginationInput): Promise<SearchResult>;
    private searchPlaylists;
    private searchUsers;
    getTrending(timeRange: TimeRange, pagination: PaginationInput): Promise<PlaylistConnection>;
}
