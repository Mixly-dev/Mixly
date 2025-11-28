import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        username
        displayName
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        email
        username
        displayName
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      user {
        id
        email
        username
      }
    }
  }
`;

export const CREATE_PLAYLIST_MUTATION = gql`
  mutation CreatePlaylist($input: CreatePlaylistInput!) {
    createPlaylist(input: $input) {
      id
      title
      description
      visibility
    }
  }
`;

export const UPDATE_PLAYLIST_MUTATION = gql`
  mutation UpdatePlaylist($id: ID!, $input: UpdatePlaylistInput!) {
    updatePlaylist(id: $id, input: $input) {
      id
      title
      description
      coverImageUrl
      visibility
    }
  }
`;

export const DELETE_PLAYLIST_MUTATION = gql`
  mutation DeletePlaylist($id: ID!) {
    deletePlaylist(id: $id)
  }
`;

export const ADD_TRACK_MUTATION = gql`
  mutation AddTrackToPlaylist($playlistId: ID!, $track: TrackInput!) {
    addTrackToPlaylist(playlistId: $playlistId, track: $track) {
      id
      trackCount
      tracks {
        id
        title
        artist
        position
      }
    }
  }
`;

export const REMOVE_TRACK_MUTATION = gql`
  mutation RemoveTrackFromPlaylist($playlistId: ID!, $trackId: ID!) {
    removeTrackFromPlaylist(playlistId: $playlistId, trackId: $trackId) {
      id
      trackCount
    }
  }
`;

export const REORDER_TRACKS_MUTATION = gql`
  mutation ReorderPlaylistTracks($playlistId: ID!, $trackIds: [ID!]!) {
    reorderPlaylistTracks(playlistId: $playlistId, trackIds: $trackIds) {
      id
      tracks {
        id
        position
      }
    }
  }
`;

export const FOLLOW_MUTATION = gql`
  mutation Follow($userId: ID!) {
    follow(userId: $userId)
  }
`;

export const UNFOLLOW_MUTATION = gql`
  mutation Unfollow($userId: ID!) {
    unfollow(userId: $userId)
  }
`;

export const LIKE_PLAYLIST_MUTATION = gql`
  mutation LikePlaylist($playlistId: ID!) {
    likePlaylist(playlistId: $playlistId)
  }
`;

export const UNLIKE_PLAYLIST_MUTATION = gql`
  mutation UnlikePlaylist($playlistId: ID!) {
    unlikePlaylist(playlistId: $playlistId)
  }
`;

export const GENERATE_SHARE_LINK_MUTATION = gql`
  mutation GeneratePlaylistShareLink($playlistId: ID!) {
    generatePlaylistShareLink(playlistId: $playlistId)
  }
`;
