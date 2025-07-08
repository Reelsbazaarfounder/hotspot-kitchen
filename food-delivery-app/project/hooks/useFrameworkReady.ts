import { useEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export function useFrameworkReady() {
  useEffect(() => {
    // Only access window in web environment
    if (Platform.OS === 'web') {
      // @ts-ignore - window exists in web environment
      typeof window !== 'undefined' && window.frameworkReady?.();
    }
  });
}
