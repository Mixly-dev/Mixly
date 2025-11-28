import { User } from '../../entities/user.entity';
import { PageInfo } from '../../common/dto/pagination.dto';
export declare class UserEdge {
    node: User;
    cursor: string;
}
export declare class UserConnection {
    edges: UserEdge[];
    pageInfo: PageInfo;
    totalCount: number;
}
