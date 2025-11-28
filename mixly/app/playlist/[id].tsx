import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PLAYLIST_QUERY } from '../../graphql/queries';
import { LIKE_PLAYLIST_MUTATION, UNLIKE_PLAYLIST_MUTATION } from '../../graphql/mutations';
import { TrackList } from '../../components/playlist/TrackList';
import { useAuth } from '../../hooks/useAuth';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data, loading, refetch } = useQuery(PLAYLIST_QUERY, {
    variables: { id },
    skip: !id,
  });

  const [likePlaylist] = useMutation(LIKE_PLAYLIST_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [unlikePlaylist] = useMutation(UNLIKE_PLAYLIST_MUTATION, {
    onCompleted: () => refetch(),
  });

  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    if (data?.playlist?.isLiked) {
      unlikePlaylist({ variables: { playlistId: id } });
    } else {
      likePlaylist({ variables: { playlistId: id } });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  const playlist = data?.playlist;

  if (!playlist) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={60} color="#9CA3AF" />
          <Text className="text-gray-500 mt-4">Playlist not found</Text>
          <TouchableOpacity
            className="mt-4 px-6 py-2 bg-primary-600 rounded-full"
            onPress={() => router.back()}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Cover & Info */}
        <View className="items-center px-6 pb-6">
          <View className="w-48 h-48 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
            {playlist.coverImageUrl ? (
              <Image
                source={{ uri: playlist.coverImageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center bg-primary-100">
                <Ionicons name="musical-notes" size={64} color="#0ea5e9" />
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-gray-800 mt-4 text-center">
            {playlist.title}
          </Text>
          
          {playlist.description && (
            <Text className="text-gray-500 text-center mt-2">{playlist.description}</Text>
          )}

          <TouchableOpacity 
            className="flex-row items-center mt-2"
            onPress={() => router.push(`/user/${playlist.owner.id}`)}
          >
            <Text className="text-primary-600">@{playlist.owner.username}</Text>
          </TouchableOpacity>

          <View className="flex-row items-center mt-4">
            <View className="flex-row items-center mr-6">
              <Ionicons name="musical-note" size={18} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{playlist.trackCount} tracks</Text>
            </View>
            <TouchableOpacity 
              className="flex-row items-center"
              onPress={handleLikeToggle}
            >
              <Ionicons 
                name={playlist.isLiked ? 'heart' : 'heart-outline'} 
                size={18} 
                color={playlist.isLiked ? '#ef4444' : '#6B7280'} 
              />
              <Text className="text-gray-600 ml-1">{playlist.likeCount}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tracks */}
        <View className="bg-white rounded-t-3xl pt-4">
          <Text className="text-lg font-semibold text-gray-800 px-4 mb-2">Tracks</Text>
          <TrackList tracks={playlist.tracks || []} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
