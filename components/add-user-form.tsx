//
//  add-user-form.tsx
//  
//
//  Created by Valmira Suka on 3.10.25.
//
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AddUserFormProps {
  onSubmit: (userData: { name: string; email: string; company: string; phone: string; website: string; address: string }) => void;
  onCancel: () => void;
  initialData?: Partial<FormData>;
  submitLabel?: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export function AddUserForm({ onSubmit, onCancel, initialData, submitLabel = 'Add User' }: AddUserFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    company: initialData?.company ?? '',
    phone: initialData?.phone ?? '',
    website: initialData?.website ?? '',
    address: initialData?.address ?? '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');
  const backgroundColor = useThemeColor({ light: '#f8f9fa', dark: '#2c2c2e' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#6c757d', dark: '#8e8e93' }, 'text');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || 'Unknown Company',
        phone: formData.phone.trim() || '+1-555-0123',
        website: formData.website.trim() || 'https://example.com',
        address: formData.address.trim() || 'Local User Street, Suite 100, Local City 12345',
      });
      
      // Reset form
      setFormData({ name: '', email: '', company: '', phone: '', website: '', address: '' });
      setErrors({});
    } catch (error) {
      Alert.alert('Error', 'Failed to add user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={[styles.form, { backgroundColor }]}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Add New User</ThemedText>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <IconSymbol name="xmark" size={20} color={iconColor} />
          </TouchableOpacity>
        </ThemedView>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Name *</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                borderColor: errors.name ? '#ff6b6b' : tintColor + '40',
              }
            ]}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter full name"
            placeholderTextColor={placeholderColor}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isSubmitting}
          />
          {errors.name && (
            <ThemedText style={styles.errorText}>{errors.name}</ThemedText>
          )}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Email *</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                borderColor: errors.email ? '#ff6b6b' : tintColor + '40',
              }
            ]}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter email address"
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />
          {errors.email && (
            <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
          )}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Company</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                borderColor: tintColor + '40',
              }
            ]}
            value={formData.company}
            onChangeText={(value) => handleInputChange('company', value)}
            placeholder="Enter company name (optional)"
            placeholderTextColor={placeholderColor}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Phone</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                borderColor: tintColor + '40',
              }
            ]}
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Enter phone number (optional)"
            placeholderTextColor={placeholderColor}
            keyboardType="phone-pad"
            autoCorrect={false}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Website</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                borderColor: tintColor + '40',
              }
            ]}
            value={formData.website}
            onChangeText={(value) => handleInputChange('website', value)}
            placeholder="Enter website URL (optional)"
            placeholderTextColor={placeholderColor}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Address</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                borderColor: tintColor + '40',
              }
            ]}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Enter address (optional)"
            placeholderTextColor={placeholderColor}
            autoCapitalize="words"
            autoCorrect={false}
            multiline
            numberOfLines={2}
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              { backgroundColor: tintColor },
              isSubmitting && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : submitLabel}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  submitButton: {
    // backgroundColor set dynamically
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
