import { PlaylistService } from './playlist.service';
import { Playlist, Track } from '../entities';
import { User } from '../entities/user.entity';
import { CreatePlaylistInput, UpdatePlaylistInput, TrackInput, PaginationInput, PlaylistConnection } from './dto/playlist.dto';
export declare class PlaylistResolver {
    private playlistService;
    constructor(playlistService: PlaylistService);
    playlist(id: string, user?: User): Promise<Playlist | null>;
    playlistByShareCode(shareCode: string, user?: User): Promise<Playlist | null>;
    myPlaylists(user: User, pagination?: PaginationInput): Promise<PlaylistConnection>;
    createPlaylist(user: User, input: CreatePlaylistInput): Promise<Playlist>;
    updatePlaylist(user: User, id: string, input: UpdatePlaylistInput): Promise<Playlist>;
    deletePlaylist(user: User, id: string): Promise<boolean>;
    addTrackToPlaylist(user: User, playlistId: string, track: TrackInput): Promise<Playlist>;
    removeTrackFromPlaylist(user: User, playlistId: string, trackId: string): Promise<Playlist>;
    reorderPlaylistTracks(user: User, playlistId: string, trackIds: string[]): Promise<Playlist>;
    generatePlaylistShareLink(user: User, playlistId: string): Promise<string>;
    tracks(playlist: Playlist): Track[];
}
