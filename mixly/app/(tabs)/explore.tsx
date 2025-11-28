import { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLazyQuery, useQuery } from '@apollo/client';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SEARCH_QUERY, TRENDING_QUERY } from '../../graphql/queries';
import { PlaylistCard } from '../../components/playlist/PlaylistCard';

const styles = {
  container: 'flex-1 bg-gray-50',
  header: 'px-4 py-4',
  title: 'text-2xl font-bold text-gray-800',
  searchContainer: 'px-4 mb-4',
  searchInputWrapper: 'flex-row items-center bg-gray-100 rounded-xl px-4',
  searchIcon: 'mr-2',
  searchInput: 'flex-1 py-3 text-gray-800',
  clearButton: 'p-2',
  sectionTitle: 'text-lg font-semibold text-gray-800 px-4 mb-3',
  loadingContainer: 'flex-1 items-center justify-center',
  emptyContainer: 'flex-1 items-center justify-center px-6',
  emptyText: 'text-gray-500 text-center mt-4',
  listContent: 'px-4 pb-4',
  filterContainer: 'flex-row px-4 mb-4',
  filterButton: 'px-4 py-2 rounded-full mr-2',
  filterButtonActive: 'bg-primary-600',
  filterButtonInactive: 'bg-gray-200',
  filterTextActive: 'text-white font-medium',
  filterTextInactive: 'text-gray-600',
};

const GENRES = ['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical'];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: trendingData, loading: trendingLoading } = useQuery(TRENDING_QUERY, {
    variables: { timeRange: 'WEEK', pagination: { first: 10 } },
  });

  const [search, { data: searchData, loading: searchLoading }] = useLazyQuery(SEARCH_QUERY);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.length >= 2) {
      search({
        variables: {
          query: text,
          filters: selectedGenre ? { genre: selectedGenre } : undefined,
          pagination: { first: 20 },
        },
      });
    }
  }, [search, selectedGenre]);

  const handleGenreFilter = (genre: string) => {
    const newGenre = selectedGenre === genre ? null : genre;
    setSelectedGenre(newGenre);
    if (searchQuery.length >= 2) {
      search({
        variables: {
          query: searchQuery,
          filters: newGenre ? { genre: newGenre } : undefined,
          pagination: { first: 20 },
        },
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const isSearching = searchQuery.length >= 2;
  const searchResults = searchData?.search?.playlists?.edges?.map((e: any) => e.node) || [];
  const trendingPlaylists = trendingData?.trending?.edges?.map((e: any) => e.node) || [];

  return (
    <SafeAreaView className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.title}>Explore</Text>
      </View>

      {/* Search Input */}
      <View className={styles.searchContainer}>
        <View className={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className={styles.searchInput}
            placeholder="Search playlists..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity className={styles.clearButton} onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Genre Filters */}
      <FlatList
        horizontal
        data={GENRES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`${styles.filterButton} ${
              selectedGenre === item ? styles.filterButtonActive : styles.filterButtonInactive
            }`}
            onPress={() => handleGenreFilter(item)}
          >
            <Text
              className={
                selectedGenre === item ? styles.filterTextActive : styles.filterTextInactive
              }
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Content */}
      {searchLoading || trendingLoading ? (
        <View className={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : isSearching ? (
        <>
          <Text className={styles.sectionTitle}>Search Results</Text>
          {searchResults.length === 0 ? (
            <View className={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="#9CA3AF" />
              <Text className={styles.emptyText}>No playlists found for "{searchQuery}"</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <PlaylistCard
                  playlist={item}
                  onPress={() => router.push(`/playlist/${item.id}`)}
                  showOwner
                />
              )}
            />
          )}
        </>
      ) : (
        <>
          <Text className={styles.sectionTitle}>Trending This Week</Text>
          <FlatList
            data={trendingPlaylists}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <PlaylistCard
                playlist={item}
                onPress={() => router.push(`/playlist/${item.id}`)}
                showOwner
              />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
}
