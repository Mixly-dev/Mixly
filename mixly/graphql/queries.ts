import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      username
      displayName
      avatarUrl
      bio
      playlistCount
      followerCount
      followingCount
    }
  }
`;

export const USER_QUERY = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      email
      username
      displayName
      avatarUrl
      bio
      playlistCount
      followerCount
      followingCount
    }
  }
`;

export const PLAYLIST_QUERY = gql`
  query Playlist($id: ID!) {
    playlist(id: $id) {
      id
      title
      description
      coverImageUrl
      visibility
      shareCode
      trackCount
      likeCount
      isLiked
      owner {
        id
        username
        displayName
        avatarUrl
      }
      tracks {
        id
        title
        artist
        album
        duration
        coverImageUrl
        position
      }
    }
  }
`;

export const MY_PLAYLISTS_QUERY = gql`
  query MyPlaylists($pagination: PaginationInput) {
    myPlaylists(pagination: $pagination) {
      edges {
        node {
          id
          title
          description
          coverImageUrl
          visibility
          trackCount
          likeCount
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const FEED_QUERY = gql`
  query Feed($pagination: PaginationInput) {
    feed(pagination: $pagination) {
      edges {
        node {
          id
          title
          description
          coverImageUrl
          trackCount
          likeCount
          isLiked
          owner {
            id
            username
            displayName
            avatarUrl
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const TRENDING_QUERY = gql`
  query Trending($timeRange: TimeRange, $pagination: PaginationInput) {
    trending(timeRange: $timeRange, pagination: $pagination) {
      edges {
        node {
          id
          title
          description
          coverImageUrl
          trackCount
          likeCount
          owner {
            id
            username
            avatarUrl
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const SEARCH_QUERY = gql`
  query Search($query: String!, $filters: SearchFilters, $pagination: PaginationInput) {
    search(query: $query, filters: $filters, pagination: $pagination) {
      playlists {
        edges {
          node {
            id
            title
            description
            coverImageUrl
            trackCount
            likeCount
            owner {
              id
              username
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
      users {
        edges {
          node {
            id
            username
            displayName
            avatarUrl
            playlistCount
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
