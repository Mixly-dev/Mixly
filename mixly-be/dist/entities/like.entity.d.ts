import { User } from './user.entity';
import { Playlist } from './playlist.entity';
export declare class Like {
    id: string;
    user: User;
    userId: string;
    playlist: Playlist;
    playlistId: string;
    createdAt: Date;
}
