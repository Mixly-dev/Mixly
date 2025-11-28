import { SearchService } from './search.service';
import { SearchFilters, SearchResult, TimeRange } from './dto/search.dto';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';
export declare class SearchResolver {
    private searchService;
    constructor(searchService: SearchService);
    search(query: string, filters?: SearchFilters, pagination?: PaginationInput): Promise<SearchResult>;
    trending(timeRange: TimeRange, pagination?: PaginationInput): Promise<PlaylistConnection>;
}
