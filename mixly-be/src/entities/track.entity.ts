import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('tracks')
export class Track {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  artist: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  album: string;

  @Field(() => Int)
  @Column()
  duration: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  coverImageUrl: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  externalUrl: string;

  @Field(() => Int)
  position: number;
}
