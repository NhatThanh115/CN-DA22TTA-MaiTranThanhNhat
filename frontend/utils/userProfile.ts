// User profile management utility

export interface UserProfile {
  username: string;
  email: string;
  role?: 'user' | 'moderator' | 'admin';
  birthdate?: string;
  sex?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  phoneNumber?: string;
  joinDate: string;
  avatar?: string;
}

const STORAGE_KEY = 'tvenglish_user_profile';

// Get user profile from localStorage
export function getUserProfile(): UserProfile | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing user profile:', error);
      return null;
    }
  }
  
  return null;
}

// Save user profile to localStorage
export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    // Emit custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('profileUpdated'));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

// Create or update user profile
export function createUserProfile(
  username: string,
  email: string,
  additionalInfo?: Partial<UserProfile>
): UserProfile {
  const existingProfile = getUserProfile();
  
  const profile: UserProfile = {
    username,
    email,
    joinDate: existingProfile?.joinDate || new Date().toISOString(),
    ...additionalInfo,
  };
  
  saveUserProfile(profile);
  return profile;
}

// Update user profile
export function updateUserProfile(updates: Partial<UserProfile>): void {
  const profile = getUserProfile();
  
  if (profile) {
    const updatedProfile = {
      ...profile,
      ...updates,
    };
    saveUserProfile(updatedProfile);
  }
}

// Clear user profile (on logout)
export function clearUserProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}