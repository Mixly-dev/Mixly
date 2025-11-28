import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery, useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PLAYLIST_QUERY } from '../../graphql/queries';
import { LIKE_PLAYLIST_MUTATION, UNLIKE_PLAYLIST_MUTATION } from '../../graphql/mutations';
import { useAuth } from '../../hooks/useAuth';

// Temp data - 나중에 DB 데이터로 교체
const TEMP_PLAYLIST = {
  id: '1',
  title: '최신 기리보이',
  coverImages: [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4',
  ],
  owner: {
    id: '1',
    username: 'siyoi.donut.kiwoogi',
    avatar: 'https://picsum.photos/40/40?random=5',
  },
  stats: {
    likes: 19,
    tracks: 1,
    duration: '1시간 이상',
    visibility: '공개',
  },
  tracks: [
    {
      id: '1',
      title: 'My Job is Cool (feat. ZICO, J-Tong)',
      artist: '기리보이',
      duration: '3:23',
      coverImage: 'https://picsum.photos/60/60?random=6',
      hasExplicit: true,
    },
    {
      id: '2',
      title: '함주기',
      artist: '기리보이',
      duration: '3:09',
      coverImage: 'https://picsum.photos/60/60?random=7',
      hasExplicit: false,
    },
    {
      id: '3',
      title: '이번 주 금요일',
      artist: '기리보이',
      duration: '2:42',
      coverImage: 'https://picsum.photos/60/60?random=8',
      hasExplicit: false,
    },
    {
      id: '4',
      title: '사람인 것 같은데',
      artist: '기리보이',
      duration: '3:03',
      coverImage: 'https://picsum.photos/60/60?random=9',
      hasExplicit: false,
    },
  ],
  isLiked: false,
};

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  // DB 쿼리 (현재는 skip하고 temp 데이터 사용)
  const { data, loading, refetch } = useQuery(PLAYLIST_QUERY, {
    variables: { id },
    skip: true, // temp 데이터 사용 중이므로 skip
  });

  const [likePlaylist] = useMutation(LIKE_PLAYLIST_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [unlikePlaylist] = useMutation(UNLIKE_PLAYLIST_MUTATION, {
    onCompleted: () => refetch(),
  });

  // DB 데이터 또는 temp 데이터 사용
  const playlist = data?.playlist || TEMP_PLAYLIST;

  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    if (playlist.isLiked) {
      unlikePlaylist({ variables: { playlistId: id } });
    } else {
      likePlaylist({ variables: { playlistId: id } });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="chevron-back" size={28} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="search" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Cover Grid (2x2) */}
        <View className="items-center px-6 pt-4">
          <View className="w-72 h-72 flex-row flex-wrap">
            {playlist.coverImages?.map((img, idx) => (
              <View key={idx} className="w-1/2 h-1/2 p-0.5">
                <Image
                  source={{ uri: img }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>

          {/* Title */}
          <Text className="text-white text-2xl font-bold mt-6 text-center">
            {playlist.title}
          </Text>

          {/* Owner */}
          <TouchableOpacity 
            className="flex-row items-center mt-3"
            onPress={() => router.push(`/user/${playlist.owner.id}`)}
          >
            <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-2">
              <Text className="text-white text-xs font-bold">S</Text>
            </View>
            <Text className="text-white text-sm">{playlist.owner.username}</Text>
          </TouchableOpacity>

          {/* Stats */}
          <Text className="text-gray-400 text-xs mt-2">
            조회수 {playlist.stats.likes}회 · {playlist.stats.tracks}시간 이상 · 8분 전 · {playlist.stats.visibility}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-around w-full mt-6 px-4">
            <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center">
              <Ionicons name="download-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
            
            <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center">
              <Ionicons name="pencil-outline" size={24} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity className="w-16 h-16 rounded-full bg-white items-center justify-center">
              <Ionicons name="play" size={32} color="#000000" />
            </TouchableOpacity>

            <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center">
              <Ionicons name="share-outline" size={24} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity className="w-12 h-12 rounded-full bg-gray-800 items-center justify-center">
              <Ionicons name="ellipsis-vertical" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add Track Button */}
        <View className="flex-row items-center px-6 py-6 border-b border-gray-800">
          <TouchableOpacity className="flex-row items-center">
            <View className="w-12 h-12 rounded bg-gray-800 items-center justify-center mr-4">
              <Ionicons name="add" size={28} color="#ffffff" />
            </View>
            <Text className="text-white text-base font-medium">노래 추가</Text>
          </TouchableOpacity>
        </View>

        {/* Track List */}
        <View className="px-6 pb-8">
          {playlist.tracks.map((track, index) => (
            <TouchableOpacity 
              key={track.id}
              className="flex-row items-center py-3"
            >
              <Image
                source={{ uri: track.coverImage }}
                className="w-14 h-14 rounded mr-3"
                resizeMode="cover"
              />
              <View className="flex-1">
                <View className="flex-row items-center">
                  {track.hasExplicit && (
                    <View className="w-4 h-4 bg-gray-600 rounded-sm items-center justify-center mr-2">
                      <Text className="text-white text-xs font-bold">E</Text>
                    </View>
                  )}
                  <Text className="text-white text-base flex-1" numberOfLines={1}>
                    {track.title}
                  </Text>
                </View>
                <Text className="text-gray-400 text-sm mt-1">
                  {track.artist} · {track.duration}
                </Text>
              </View>
              <TouchableOpacity className="p-2">
                <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
