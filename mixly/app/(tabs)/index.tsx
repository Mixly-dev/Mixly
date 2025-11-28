import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MY_PLAYLISTS_QUERY } from '../../graphql/queries';
import { PlaylistCard } from '../../components/playlist/PlaylistCard';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const { data, loading, refetch } = useQuery(MY_PLAYLISTS_QUERY, {
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
          <Ionicons name="musical-notes" size={80} color="#0ea5e9" />
          <Text className="text-2xl font-bold text-gray-800 mt-6">Welcome to Mixly</Text>
          <Text className="text-gray-500 text-center mt-2">
            Sign in to create and share your playlists
          </Text>
          <TouchableOpacity
            className="bg-primary-600 px-8 py-4 rounded-full mt-8"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-white font-semibold text-lg">Get Started</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const playlists = data?.myPlaylists?.edges?.map((edge: any) => edge.node) || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-2xl font-bold text-gray-800">My Playlists</Text>
        <TouchableOpacity
          className="bg-primary-600 w-10 h-10 rounded-full items-center justify-center"
          onPress={() => router.push('/modal')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : playlists.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="disc-outline" size={60} color="#9CA3AF" />
          <Text className="text-gray-500 text-center mt-4">
            You haven't created any playlists yet
          </Text>
          <TouchableOpacity
            className="bg-primary-600 px-6 py-3 rounded-full mt-6"
            onPress={() => router.push('/modal')}
          >
            <Text className="text-white font-semibold">Create Playlist</Text>
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
            />
          )}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}
