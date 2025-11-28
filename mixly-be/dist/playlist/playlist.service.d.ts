import { Repository } from 'typeorm';
import { Playlist, Track, PlaylistTrack, Like } from '../entities';
import { CreatePlaylistInput, UpdatePlaylistInput, TrackInput, PaginationInput, PlaylistConnection } from './dto/playlist.dto';
export declare class PlaylistService {
    private playlistRepository;
    private trackRepository;
    private playlistTrackRepository;
    private likeRepository;
    constructor(playlistRepository: Repository<Playlist>, trackRepository: Repository<Track>, playlistTrackRepository: Repository<PlaylistTrack>, likeRepository: Repository<Like>);
    create(userId: string, input: CreatePlaylistInput): Promise<Playlist>;
    update(playlistId: string, userId: string, input: UpdatePlaylistInput): Promise<Playlist>;
    delete(playlistId: string, userId: string): Promise<boolean>;
    findById(playlistId: string, requesterId?: string): Promise<Playlist | null>;
    findByIdOrFail(playlistId: string): Promise<Playlist>;
    findByUser(userId: string, pagination: PaginationInput, requesterId?: string): Promise<PlaylistConnection>;
    findByShareCode(shareCode: string, requesterId?: string): Promise<Playlist | null>;
    generateShareLink(playlistId: string, userId: string): Promise<string>;
    addTrack(playlistId: string, userId: string, trackInput: TrackInput): Promise<Playlist>;
    removeTrack(playlistId: string, userId: string, trackId: string): Promise<Playlist>;
    reorderTracks(playlistId: string, userId: string, trackIds: string[]): Promise<Playlist>;
    private enrichPlaylist;
}
