import { Alert } from 'react-native';

// --- Type Definitions ---

/**
 * A standardized error object used throughout the application.
 * This ensures that all errors, whether from the API or client-side,
 * have a consistent shape.
 */
export interface AppError {
  code: string;
  message: string;
}

/**
 * A helper type to identify objects that look like our API's error responses.
 */
interface ApiErrorLike {
  error: {
    code?: string;
    message?: string;
  };
}

/**
 * A type guard to safely check if an unknown error is a structured API error.
 */
function isApiError(obj: unknown): obj is ApiErrorLike {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'error' in obj &&
    typeof (obj as any).error === 'object' &&
    (obj as any).error !== null
  );
}

// --- Error Handling Functions ---

/**
 * Normalizes an unknown error into a consistent `AppError` format.
 * This function is used by Redux thunks and other services to ensure that
 * errors stored in the state or passed around the app are predictable.
 *
 * @param error The raw error caught in a catch block.
 * @param defaultMessage A fallback message if the error has no message.
 * @returns A standardized `AppError` object.
 */
export const normalizeError = (
  error: unknown,
  defaultMessage = 'An unknown error occurred.',
): AppError => {
  // 1. Handle structured API errors from our backend
  if (isApiError(error)) {
    return {
      code: error.error.code || 'unknown_api_error',
      message: error.error.message || defaultMessage,
    };
  }

  // 2. Handle standard JavaScript Error objects
  if (error instanceof Error) {
    return {
      code: 'client_error',
      message: error.message,
    };
  }

  // 3. Handle plain string errors
  if (typeof error === 'string' && error.length > 0) {
    return {
      code: 'unknown',
      message: error,
    };
  }

  // 4. Fallback for all other cases (null, undefined, etc.)
  return {
    code: 'unknown',
    message: defaultMessage,
  };
};

/**
 * A user-facing error handler that displays a native alert.
 * It's used for handling errors from critical processes like app initialization.
 * It normalizes the error to ensure a clean message is shown to the user
 * while logging the raw error for developers.
 *
 * @param error The raw error to handle.
 * @param title The title for the alert dialog.
 */
export function handleServiceError(error: unknown, title: string): void {
  const normalizedError = normalizeError(error);

  // Log the full error details for debugging purposes
  console.error(`[Service Error: ${title}]`, {
    message: normalizedError.message,
    code: normalizedError.code,
    originalError: error,
  });

  // Show a user-friendly alert
  Alert.alert(
    title,
    normalizedError.message,
    [{ text: 'OK' }],
    { cancelable: true }
  );
}
