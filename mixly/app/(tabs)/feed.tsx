import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FEED_QUERY } from '../../graphql/queries';
import { PlaylistCard } from '../../components/playlist/PlaylistCard';
import { useAuth } from '../../hooks/useAuth';

export default function FeedScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    skip: !isAuthenticated,
    variables: { pagination: { first: 20 } },
  });

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="people" size={80} color="#0ea5e9" />
          <Text className="text-2xl font-bold text-gray-800 mt-6">Your Feed</Text>
          <Text className="text-gray-500 text-center mt-2">
            Sign in to see playlists from people you follow
          </Text>
          <TouchableOpacity
            className="bg-primary-600 px-8 py-4 rounded-full mt-8"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-white font-semibold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const playlists = data?.feed?.edges?.map((edge: any) => edge.node) || [];
  const hasNextPage = data?.feed?.pageInfo?.hasNextPage;
  const endCursor = data?.feed?.pageInfo?.endCursor;

  const loadMore = () => {
    if (hasNextPage && endCursor) {
      fetchMore({
        variables: { pagination: { first: 20, after: endCursor } },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-gray-800">Feed</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : playlists.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="people-outline" size={60} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-4">
            Follow some users to see their playlists here
          </Text>
          <TouchableOpacity
            className="bg-primary-600 px-6 py-3 rounded-full mt-6"
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Text className="text-white font-semibold">Discover Users</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <PlaylistCard
              playlist={item}
              onPress={() => router.push(`/playlist/${item.id}`)}
              showOwner
            />
          )}
          onRefresh={refetch}
          refreshing={loading}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </SafeAreaView>
  );
}
