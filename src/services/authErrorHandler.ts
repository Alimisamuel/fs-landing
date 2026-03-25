/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuthError {
  type: 'PROFILE_SWITCH_FAILED' | 'AUTH_EXPIRED';
  message: string;
  profileId?: string;
  profileName?: string;
  timestamp: Date;
}

type AuthErrorListener = (error: AuthError) => void;

class AuthErrorHandler {
  private listeners: AuthErrorListener[] = [];

  public onError(listener: AuthErrorListener): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public notifyError(error: AuthError) {
    console.error('Auth Error:', error);
    
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in auth error listener:', listenerError);
      }
    });
  }


  public handleProfileSwitchError(error: any, profileId?: string, profileName?: string) {
    this.notifyError({
      type: 'PROFILE_SWITCH_FAILED',
      message: error?.message || 'Failed to switch profile',
      profileId,
      profileName,
      timestamp: new Date(),
    });
  }

  public handleAuthExpired() {
    this.notifyError({
      type: 'AUTH_EXPIRED',
      message: 'Your session has expired. Please log in again.',
      timestamp: new Date(),
    });
  }
}

// Create singleton instance
export const authErrorHandler = new AuthErrorHandler();

// Default error handler for console logging
authErrorHandler.onError((error) => {
  switch (error.type) {
    case 'PROFILE_SWITCH_FAILED':
      console.error(`⚠️ Profile switch failed${error.profileName ? ` to "${error.profileName}"` : ''}:`, error.message);
      break;
    case 'AUTH_EXPIRED':
      console.error('⚠️ Authentication expired:', error.message);
      break;
  }
});