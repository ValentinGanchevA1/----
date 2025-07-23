import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import { AuthStackParamList } from '@/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * A stack navigator for the authentication flow.
 * It includes screens for logging in and signing up.
 */
const AuthNavigator: React.FC = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false, // Headers are typically not needed on auth screens
			}}
		>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Signup" component={SignupScreen} />
		</Stack.Navigator>
	);
};

export default AuthNavigator;
