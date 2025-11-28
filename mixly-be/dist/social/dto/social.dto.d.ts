import { User } from '../../entities/user.entity';
export declare class UserEdge {
    node: User;
    cursor: string;
}
export declare class PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}
export declare class UserConnection {
    edges: UserEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}
