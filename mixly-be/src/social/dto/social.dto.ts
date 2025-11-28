import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from '../../entities/user.entity';
import { PageInfo } from '../../common/dto/pagination.dto';

@ObjectType()
export class UserEdge {
  @Field(() => User)
  node: User;

  @Field()
  cursor: string;
}

@ObjectType()
export class UserConnection {
  @Field(() => [UserEdge])
  edges: UserEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;

  @Field(() => Int)
  totalCount: number;
}
