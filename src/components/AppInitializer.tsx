import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Button } from 'react-native';
import { useAppDispatch } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { initializeAuth } from '@/store/slices/authSlice';
import LocationService from '@/services/LocationService';

interface AppInitializerProps {
  children: ReactNode;
}

type InitializationStatus = 'loading' | 'ready' | 'error';

/**
 * AppInitializer handles critical asynchronous setup tasks before rendering the main app.
 * It initializes services like authentication and location, and provides a robust
 * loading and error-handling UI to ensure a smooth app startup.
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [status, setStatus] = useState<InitializationStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const dispatch: AppDispatch = useAppDispatch();

  // Use useCallback to memoize the initialization function
  const initializeApp = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      // Promise.allSettled allows us to attempt multiple initializations
      // and handle their results individually.
      const results = await Promise.allSettled([
        dispatch(initializeAuth()).unwrap(), // Critical service
        LocationService.initialize(),      // Can be considered critical
      ]);

      const failedServices = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected',
      );

      if (failedServices.length > 0) {
        // We treat any failure here as critical for a clean startup.
        const firstError = failedServices[0].reason;
        console.error('Failed to initialize app services:', firstError);
        // For a user-facing message, we can be more generic.
        setError(firstError.message || 'A critical service failed to start.');
        setStatus('error');
        return; // Stop the process
      }

      // If all promises are fulfilled, the app is ready.
      setStatus('ready');
    } catch (e) {
      // This outer catch handles unexpected synchronous errors.
      console.error('An unexpected error occurred during app initialization:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setStatus('error');
    }
  }, [dispatch]);

  useEffect(() => {
    initializeApp();

    // Cleanup services on component unmount
    return () => {
      LocationService.cleanup?.();
    };
  }, [initializeApp]);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Initializing Cyberealm...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Initialization Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={initializeApp} color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});
