// GraphQL Types for Mixly

export type Maybe<T> = T | null;
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
};

export enum PlaylistVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum TimeRange {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  ALL_TIME = 'ALL_TIME',
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: Maybe<string>;
  avatarUrl?: Maybe<string>;
  bio?: Maybe<string>;
  playlists: Playlist[];
  playlistCount: number;
  followerCount: number;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  title: string;
  description?: Maybe<string>;
  coverImageUrl?: Maybe<string>;
  visibility: PlaylistVisibility;
  shareCode?: Maybe<string>;
  genre?: Maybe<string>;
  owner: User;
  tracks: Track[];
  trackCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: Maybe<string>;
  duration: number;
  coverImageUrl?: Maybe<string>;
  externalUrl?: Maybe<string>;
  position: number;
}


export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Input Types
export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName?: Maybe<string>;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreatePlaylistInput {
  title: string;
  description?: Maybe<string>;
  visibility?: Maybe<PlaylistVisibility>;
  genre?: Maybe<string>;
}

export interface UpdatePlaylistInput {
  title?: Maybe<string>;
  description?: Maybe<string>;
  coverImageUrl?: Maybe<string>;
  visibility?: Maybe<PlaylistVisibility>;
  genre?: Maybe<string>;
}

export interface TrackInput {
  title: string;
  artist: string;
  album?: Maybe<string>;
  duration: number;
  coverImageUrl?: Maybe<string>;
  externalUrl?: Maybe<string>;
}

export interface SearchFilters {
  genre?: Maybe<string>;
  category?: Maybe<string>;
}

export interface PaginationInput {
  first?: Maybe<number>;
  after?: Maybe<string>;
}

// Connection Types
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: Maybe<string>;
  endCursor?: Maybe<string>;
}

export interface PlaylistEdge {
  node: Playlist;
  cursor: string;
}

export interface PlaylistConnection {
  edges: PlaylistEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface UserEdge {
  node: User;
  cursor: string;
}

export interface UserConnection {
  edges: UserEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}

export interface SearchResult {
  playlists: PlaylistConnection;
  users: UserConnection;
}
