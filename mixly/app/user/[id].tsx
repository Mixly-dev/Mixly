import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { USER_QUERY } from '../../graphql/queries';
import { FollowButton } from '../../components/social/FollowButton';
import { useAuth } from '../../hooks/useAuth';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const { data, loading, refetch } = useQuery(USER_QUERY, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  const user = data?.user;

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <Ionicons name="person-outline" size={60} color="#9CA3AF" />
          <Text className="text-gray-500 mt-4">User not found</Text>
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
          <Text className="text-lg font-semibold text-gray-800 ml-2">Profile</Text>
        </View>

        {/* Profile Info */}
        <View className="items-center px-6 py-6">
          <View className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
            {user.avatarUrl ? (
              <Image
                source={{ uri: user.avatarUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center bg-primary-100">
                <Ionicons name="person" size={40} color="#0ea5e9" />
              </View>
            )}
          </View>

          <Text className="text-xl font-bold text-gray-800 mt-4">
            {user.displayName || user.username}
          </Text>
          <Text className="text-gray-500">@{user.username}</Text>

          {user.bio && (
            <Text className="text-gray-600 text-center mt-3 px-4">{user.bio}</Text>
          )}

          {/* Stats */}
          <View className="flex-row mt-6">
            <View className="items-center px-6">
              <Text className="text-xl font-bold text-gray-800">{user.playlistCount}</Text>
              <Text className="text-gray-500 text-sm">Playlists</Text>
            </View>
            <View className="items-center px-6 border-l border-r border-gray-200">
              <Text className="text-xl font-bold text-gray-800">{user.followerCount}</Text>
              <Text className="text-gray-500 text-sm">Followers</Text>
            </View>
            <View className="items-center px-6">
              <Text className="text-xl font-bold text-gray-800">{user.followingCount}</Text>
              <Text className="text-gray-500 text-sm">Following</Text>
            </View>
          </View>

          {/* Follow Button */}
          {isAuthenticated && (
            <View className="mt-6">
              <FollowButton
                userId={user.id}
                isFollowing={false}
                onToggle={() => refetch()}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
