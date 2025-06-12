import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { CharacterService } from '@/services/characterService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ruler, Weight, Target, User, ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// Gender options
const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

export default function OnboardingScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Form state
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [goal, setGoal] = useState('Get stronger');
  const [isLoading, setIsLoading] = useState(false);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  // Check user state on component mount
  useEffect(() => {
    if (!user?.id) {
      console.log(
        'Warning: No user ID found in onboarding. User may not be authenticated.'
      );
    } else {
      console.log('User authenticated in onboarding:', user.id);
    }
  }, [user]);

  // Theme colors
  const textColor = isDark ? '#F9FAFB' : '#111827';
  const bgColor = isDark ? '#111827' : '#F9FAFB';
  const cardBgColor = isDark ? '#1F2937' : '#FFFFFF';
  const inputBgColor = isDark ? '#374151' : '#F3F4F6';
  const borderColor = isDark ? '#4B5563' : '#D1D5DB';

  const handleCompleteSetup = async () => {
    if (isLoading) return;

    if (!user?.id) {
      Alert.alert('Error', 'User information not found. Please log in again.');
      console.error('No user ID available for character creation/update');
      return;
    }

    setIsLoading(true);
    setDebugMessage(null);

    try {
      setDebugMessage('Checking for existing character...');

      // First check if character exists
      const { character, error: fetchError } =
        await CharacterService.getCharacterByUserId(user.id);

      if (fetchError) {
        setDebugMessage(`Character fetch error: ${fetchError}`);
        throw new Error(fetchError);
      }

      if (!character) {
        setDebugMessage('No character found, creating new character...');
        // Create new character
        const {
          success,
          error,
          character: newChar,
        } = await CharacterService.createCharacter(
          user.id,
          user.name || 'Adventurer',
          gender
        );

        if (!success) {
          setDebugMessage(`Character creation error: ${error}`);
          throw new Error(error || 'Failed to create character');
        }

        setDebugMessage('Character created, updating with form data...');

        // Update the newly created character with form data
        await CharacterService.updateCharacter(newChar?.id || '', {
          gender,
          height: parseInt(height) || 170,
          weight: parseInt(weight) || 70,
          goal,
        });
      } else {
        setDebugMessage('Updating existing character...');
        // Update existing character
        await CharacterService.updateCharacter(character.id, {
          gender,
          height: parseInt(height) || 170,
          weight: parseInt(weight) || 70,
          goal,
        });
      }

      setDebugMessage('Onboarding complete, navigating to main app...');

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Onboarding error:', error);
      setDebugMessage(`Error: ${error?.message || 'Unknown error'}`);
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#111827', '#1F2937'] : ['#F9FAFB', '#F3F4F6']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              Complete Your Profile
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? '#D1D5DB' : '#4B5563' },
              ]}
            >
              Let's personalize your fitness journey
            </Text>

            {/* Debug message for development */}
            {debugMessage && (
              <Text
                style={[
                  styles.debugText,
                  { color: isDark ? '#F87171' : '#DC2626' },
                ]}
              >
                {debugMessage}
              </Text>
            )}
          </View>

          <View style={[styles.form, { backgroundColor: cardBgColor }]}>
            {/* Gender Selection */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <User size={20} color={Colors.primary} />
                <Text style={[styles.label, { color: textColor }]}>Gender</Text>
              </View>
              <View style={styles.genderOptions}>
                {GENDER_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      gender === option.value && styles.genderOptionSelected,
                      { borderColor },
                    ]}
                    onPress={() => setGender(option.value as 'male' | 'female')}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        {
                          color:
                            gender === option.value
                              ? Colors.primary
                              : textColor,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Height Input */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Ruler size={20} color={Colors.primary} />
                <Text style={[styles.label, { color: textColor }]}>
                  Height (cm)
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBgColor,
                    color: textColor,
                    borderColor,
                  },
                ]}
                value={height}
                onChangeText={setHeight}
                placeholder="Enter your height"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                keyboardType="numeric"
              />
            </View>

            {/* Weight Input */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Weight size={20} color={Colors.primary} />
                <Text style={[styles.label, { color: textColor }]}>
                  Weight (kg)
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBgColor,
                    color: textColor,
                    borderColor,
                  },
                ]}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter your weight"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                keyboardType="numeric"
              />
            </View>

            {/* Fitness Goal Input */}
            <View style={styles.inputContainer}>
              <View style={styles.labelContainer}>
                <Target size={20} color={Colors.primary} />
                <Text style={[styles.label, { color: textColor }]}>
                  Fitness Goal
                </Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: inputBgColor,
                    color: textColor,
                    borderColor,
                  },
                ]}
                value={goal}
                onChangeText={setGoal}
                placeholder="What's your fitness goal?"
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Complete Button */}
            <TouchableOpacity
              style={[styles.completeButton, { opacity: isLoading ? 0.7 : 1 }]}
              onPress={handleCompleteSetup}
              disabled={isLoading}
            >
              <Text style={styles.completeButtonText}>Complete Setup</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
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
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderOptionSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  debugText: {
    marginTop: 16,
    textAlign: 'center',
  },
});
