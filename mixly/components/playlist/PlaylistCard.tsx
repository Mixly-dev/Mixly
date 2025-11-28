import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaylistCardProps {
  playlist: {
    id: string;
    title: string;
    description?: string;
    coverImageUrl?: string;
    trackCount: number;
    likeCount: number;
    isLiked?: boolean;
    owner?: {
      username: string;
      avatarUrl?: string;
    };
  };
  onPress: () => void;
  onLike?: () => void;
  showOwner?: boolean;
}

export function PlaylistCard({ playlist, onPress, onLike, showOwner = false }: PlaylistCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row p-4">
        <View className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
          {playlist.coverImageUrl ? (
            <Image
              source={{ uri: playlist.coverImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-primary-100">
              <Ionicons name="musical-notes" size={32} color="#0ea5e9" />
            </View>
          )}
        </View>

        <View className="flex-1 ml-4 justify-center">
          <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
            {playlist.title}
          </Text>
          {playlist.description && (
            <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
              {playlist.description}
            </Text>
          )}
          {showOwner && playlist.owner && (
            <Text className="text-gray-400 text-sm mt-1">
              by @{playlist.owner.username}
            </Text>
          )}
          <View className="flex-row items-center mt-2">
            <Ionicons name="musical-note" size={14} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm ml-1">{playlist.trackCount} tracks</Text>
            <View className="flex-row items-center ml-4">
              <Ionicons name="heart" size={14} color="#9CA3AF" />
              <Text className="text-gray-400 text-sm ml-1">{playlist.likeCount}</Text>
            </View>
          </View>
        </View>

        {onLike && (
          <TouchableOpacity
            className="justify-center px-2"
            onPress={(e) => {
              e.stopPropagation();
              onLike();
            }}
          >
            <Ionicons
              name={playlist.isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={playlist.isLiked ? '#ef4444' : '#9CA3AF'}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
