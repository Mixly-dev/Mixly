import { User } from './user.entity';
export declare class Follow {
    id: string;
    follower: User;
    followerId: string;
    followee: User;
    followeeId: string;
    createdAt: Date;
}
