import { Resolver, Query, Args } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { SearchFilters, SearchResult, TimeRange } from './dto/search.dto';
import { PlaylistConnection, PaginationInput } from '../playlist/dto/playlist.dto';

@Resolver()
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query(() => SearchResult)
  async search(
    @Args('query') query: string,
    @Args('filters', { nullable: true }) filters?: SearchFilters,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<SearchResult> {
    return this.searchService.search(query, filters || {}, pagination || {});
  }

  @Query(() => PlaylistConnection)
  async trending(
    @Args('timeRange', { type: () => TimeRange, nullable: true, defaultValue: TimeRange.WEEK })
    timeRange: TimeRange,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PlaylistConnection> {
    return this.searchService.getTrending(timeRange, pagination || {});
  }
}
