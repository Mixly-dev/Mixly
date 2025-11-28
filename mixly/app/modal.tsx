import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CREATE_PLAYLIST_MUTATION } from '../graphql/mutations';
import { MY_PLAYLISTS_QUERY } from '../graphql/queries';

export default function CreatePlaylistModal() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [genre, setGenre] = useState('');
  const [error, setError] = useState('');

  const [createPlaylist, { loading }] = useMutation(CREATE_PLAYLIST_MUTATION, {
    refetchQueries: [{ query: MY_PLAYLISTS_QUERY, variables: { pagination: { first: 20 } } }],
    onCompleted: (data) => {
      router.back();
      router.push(`/playlist/${data.createPlaylist.id}`);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleCreate = () => {
    setError('');
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    createPlaylist({
      variables: {
        input: {
          title: title.trim(),
          description: description.trim() || undefined,
          visibility: isPublic ? 'PUBLIC' : 'PRIVATE',
          genre: genre.trim() || undefined,
        },
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">New Playlist</Text>
            <TouchableOpacity onPress={handleCreate} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#0ea5e9" />
              ) : (
                <Text className="text-primary-600 font-semibold">Create</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="p-6">
            {error ? (
              <View className="bg-red-100 p-3 rounded-lg mb-4">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            ) : null}

            {/* Cover placeholder */}
            <View className="items-center mb-6">
              <View className="w-32 h-32 bg-gray-100 rounded-xl items-center justify-center">
                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm mt-2">Add Cover</Text>
              </View>
            </View>

            {/* Title */}
            <Text className="text-gray-700 font-medium mb-2">Title *</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-800"
              placeholder="My Awesome Playlist"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            {/* Description */}
            <Text className="text-gray-700 font-medium mb-2">Description</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-800"
              placeholder="What's this playlist about?"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={500}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />

            {/* Genre */}
            <Text className="text-gray-700 font-medium mb-2">Genre</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-800"
              placeholder="e.g., Pop, Rock, Jazz"
              placeholderTextColor="#9CA3AF"
              value={genre}
              onChangeText={setGenre}
            />

            {/* Visibility */}
            <View className="flex-row items-center justify-between py-4 border-t border-gray-100">
              <View>
                <Text className="text-gray-800 font-medium">Public Playlist</Text>
                <Text className="text-gray-500 text-sm">Anyone can see this playlist</Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: '#D1D5DB', true: '#0ea5e9' }}
                thumbColor="white"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
