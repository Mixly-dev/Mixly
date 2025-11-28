import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../../graphql/mutations';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { saveTokens } = useAuth();

  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: async (data) => {
      await saveTokens(data.register.accessToken, data.register.refreshToken);
      router.replace('/(tabs)');
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleRegister = () => {
    setError('');
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    register({
      variables: {
        input: { email, username, password, displayName: displayName || undefined },
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-6 py-8">
          <Text className="text-3xl font-bold text-center text-primary-600 mb-8">
            Mixly
          </Text>
          <Text className="text-xl font-semibold text-center text-gray-800 mb-6">
            Create Account
          </Text>

          {error ? (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-600 text-center">{error}</Text>
            </View>
          ) : null}

          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-800"
            placeholder="Email *"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-800"
            placeholder="Username *"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-800"
            placeholder="Display Name (optional)"
            placeholderTextColor="#9CA3AF"
            value={displayName}
            onChangeText={setDisplayName}
          />

          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-lg mb-4 text-gray-800"
            placeholder="Password *"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-lg mb-6 text-gray-800"
            placeholder="Confirm Password *"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="bg-primary-600 py-4 rounded-lg mb-4"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-primary-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
