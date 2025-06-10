import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const textColor = isDark ? '#F9FAFB' : '#111827';
  const bgColor = isDark ? '#111827' : '#F9FAFB';
  const cardBgColor = isDark ? '#1F2937' : '#FFFFFF';
  const inputBgColor = isDark ? '#374151' : '#F3F4F6';
  const borderColor = isDark ? '#4B5563' : '#D1D5DB';

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        // Navigation will be handled by the root layout based on auth state
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: bgColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Title */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>MuscleDia</Text>
            <Text style={[styles.subtitle, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
              Level up your fitness journey
            </Text>
          </View>

          {/* Login Form */}
          <View style={[styles.form, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.formTitle, { color: textColor }]}>Welcome Back!</Text>
            
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: textColor }]}>Email</Text>
              <View style={[styles.inputWrapper, { backgroundColor: inputBgColor, borderColor }]}>
                <Mail size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: textColor }]}>Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: inputBgColor, borderColor }]}>
                <Lock size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  ) : (
                    <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#6D28D9',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    color: '#6D28D9',
    fontWeight: '600',
  },
}); 