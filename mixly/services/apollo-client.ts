import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  let token = null;
  try {
    token = await SecureStore.getItemAsync('accessToken');
  } catch (e) {
    // SecureStore not available (web)
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
