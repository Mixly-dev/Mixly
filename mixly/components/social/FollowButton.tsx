import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useMutation } from '@apollo/client';
import { FOLLOW_MUTATION, UNFOLLOW_MUTATION } from '../../graphql/mutations';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onToggle?: () => void;
}

export function FollowButton({ userId, isFollowing, onToggle }: FollowButtonProps) {
  const [follow, { loading: followLoading }] = useMutation(FOLLOW_MUTATION, {
    variables: { userId },
    onCompleted: onToggle,
  });

  const [unfollow, { loading: unfollowLoading }] = useMutation(UNFOLLOW_MUTATION, {
    variables: { userId },
    onCompleted: onToggle,
  });

  const loading = followLoading || unfollowLoading;

  const handlePress = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <TouchableOpacity
      className={`px-6 py-2 rounded-full ${isFollowing ? 'bg-gray-200' : 'bg-primary-600'}`}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isFollowing ? '#374151' : 'white'} />
      ) : (
        <Text className={`font-semibold ${isFollowing ? 'text-gray-700' : 'text-white'}`}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      )}
    </TouchableOpacity>
  );
}
