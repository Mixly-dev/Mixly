import { Playlist } from './playlist.entity';
import { Track } from './track.entity';
export declare class PlaylistTrack {
    id: string;
    playlist: Playlist;
    playlistId: string;
    track: Track;
    trackId: string;
    position: number;
}
