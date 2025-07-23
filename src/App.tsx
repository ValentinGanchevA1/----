import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { store, persistor } from './store/store';
import { AppInitializer } from './components/AppInitializer';
import { ErrorBoundary } from './components/ErrorBoundary';
import RootNavigator from './navigation/RootNavigator';
import { StatusBar } from 'react-native';

/**
 * The main entry point for the Cyberealm application.
 *
 * This component sets up the core application structure:
 * 1. ErrorBoundary: Catches rendering errors to prevent crashes.
 * 2. Provider: Makes the Redux store available to all components.
 * 3. PersistGate: Delays rendering until the persisted Redux state is loaded.
 * 4. AppInitializer: Handles asynchronous setup tasks (e.g., service initialization).
 * 5. NavigationContainer: Manages the app's navigation state.
 * 6. RootNavigator: The main navigator that decides which screens to show.
 */
const App = () => {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <AppInitializer>
                        <NavigationContainer>
                            <StatusBar barStyle="dark-content" />
                            <RootNavigator />
                        </NavigationContainer>
                    </AppInitializer>
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    );
};

export default App;
