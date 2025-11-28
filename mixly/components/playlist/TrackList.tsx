import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  position: number;
}

interface TrackListProps {
  tracks: Track[];
  editable?: boolean;
  onRemove?: (trackId: string) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function TrackItem({ track, editable, onRemove }: { track: Track; editable?: boolean; onRemove?: (id: string) => void }) {
  return (
    <View className="flex-row items-center py-3 px-4 border-b border-gray-100">
      <Text className="w-8 text-gray-400 text-sm">{track.position}</Text>
      <View className="flex-1 ml-2">
        <Text className="text-gray-800 font-medium" numberOfLines={1}>
          {track.title}
        </Text>
        <Text className="text-gray-500 text-sm" numberOfLines={1}>
          {track.artist}
          {track.album && ` • ${track.album}`}
        </Text>
      </View>
      <Text className="text-gray-400 text-sm mr-2">{formatDuration(track.duration)}</Text>
      {editable && onRemove && (
        <TouchableOpacity onPress={() => onRemove(track.id)} className="p-2">
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export function TrackList({ tracks, editable = false, onRemove }: TrackListProps) {
  if (tracks.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="musical-note-outline" size={48} color="#9CA3AF" />
        <Text className="text-gray-500 mt-4">No tracks yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tracks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TrackItem track={item} editable={editable} onRemove={onRemove} />
      )}
      scrollEnabled={false}
    />
  );
}
