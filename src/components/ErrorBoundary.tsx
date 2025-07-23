import React, { Component, ErrorInfo, ReactNode } from 'react';
import {View, Text, StyleSheet, Button, ScrollView, Platform} from 'react-native';

// --- Type Definitions ---

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

// --- ErrorBoundary Component ---

/**
 * A React Error Boundary component for catching JavaScript errors in the component tree.
 * It displays a fallback UI and provides a way for the user to recover.
 * This should be wrapped around major sections of your app, or the entire app itself.
 */
export class ErrorBoundary extends Component<Props, State> {
	/**
	 * The state constructor initializes the component's state.
	 * An error boundary's state must include a flag to indicate if an error has occurred.
	 */
	public state: State = {
		hasError: false,
	};

	/**
	 * This lifecycle method is invoked after an error has been thrown by a descendant component.
	 * It receives the error that was thrown and should return a value to update state,
	 * triggering a re-render to show the fallback UI.
	 */
	public static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	/**
	 * This lifecycle method is also called after an error has been thrown.
	 * It's the ideal place for side effects, like logging the error to an external service.
	 */
	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// In a production app, you would send this to a service like Sentry, Bugsnag, etc.
		console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
	}

	/**
	 * A method to reset the error boundary's state, which will attempt to
	 * re-render the child component tree.
	 */
	private handleRetry = () => {
		this.setState({ hasError: false, error: undefined });
	};

	/**
	 * Renders the component. If an error has been caught, it displays the fallback UI.
	 * Otherwise, it renders the children as normal.
	 */
	public render() {
		if (this.state.hasError) {
			// Render the custom fallback UI
			return (
				<View style={styles.container}>
					<Text style={styles.title}>Oops! Something Went Wrong</Text>
					<Text style={styles.subtitle}>
						An unexpected error occurred. Please try again.
					</Text>

					<Button title="Try Again" onPress={this.handleRetry} color="#007AFF" />

					{/* For development builds, it's useful to display the actual error */}
					{__DEV__ && this.state.error && (
						<ScrollView style={styles.errorDetailsContainer}>
							<Text style={styles.errorText}>
								{this.state.error.toString()}
							</Text>
						</ScrollView>
					)}
				</View>
			);
		}

		// If there's no error, render the children components as intended.
		return this.props.children;
	}
}

// --- Styles ---

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#f8f9fa',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#343a40',
		textAlign: 'center',
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: '#6c757d',
		textAlign: 'center',
		marginBottom: 20,
	},
	errorDetailsContainer: {
		marginTop: 20,
		maxHeight: '50%',
		width: '100%',
		backgroundColor: '#e9ecef',
		borderRadius: 8,
		padding: 15,
	},
	errorText: {
		fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
		color: '#c92a2a',
	},
});

export default ErrorBoundary;
