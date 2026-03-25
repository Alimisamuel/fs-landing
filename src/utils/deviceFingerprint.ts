/**
 * Device fingerprinting utility
 * Creates a consistent device fingerprint for analytics tracking
 */

export class DeviceFingerprint {
  private static STORAGE_KEY = 'fs_device_id';

  /**
   * Get or generate a device fingerprint
   */
  static getDeviceId(): string {
    // First check if we already have a stored device ID
    const stored = this.getStoredDeviceId();
    if (stored) {
      return stored;
    }

    // Generate a new device ID
    const deviceId = this.generateDeviceFingerprint();
    this.storeDeviceId(deviceId);
    return deviceId;
  }

  /**
   * Generate a new device fingerprint based on browser characteristics
   */
  private static generateDeviceFingerprint(): string {
    if (typeof window === 'undefined') {
      return this.generateFallbackId();
    }

    const components: string[] = [];

    try {
      // Screen characteristics
      components.push(`screen:${window.screen.width}x${window.screen.height}`);
      components.push(`colorDepth:${window.screen.colorDepth}`);

      // Browser characteristics
      components.push(`userAgent:${navigator.userAgent}`);
      components.push(`language:${navigator.language}`);
      components.push(`platform:${navigator.platform}`);
      components.push(`cookieEnabled:${navigator.cookieEnabled}`);

      // Timezone
      components.push(`timezone:${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

      // Canvas fingerprinting (lightweight version)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('FaithStream Device ID', 2, 2);
        components.push(`canvas:${canvas.toDataURL().substring(0, 50)}`);
      }

      // Audio context (if supported)
      if (typeof AudioContext !== 'undefined') {
        const audioCtx = new AudioContext();
        components.push(`audio:${audioCtx.sampleRate}`);
        audioCtx.close();
      }

    } catch (error) {
      console.warn('Error generating device fingerprint:', error);
    }

    // Create hash from components
    const fingerprint = this.hashString(components.join('|'));
    
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now();
    
    return `fs_${fingerprint}_${timestamp}`;
  }

  /**
   * Simple hash function for strings
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get stored device ID from localStorage
   */
  private static getStoredDeviceId(): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Error reading device ID from localStorage:', error);
      return null;
    }
  }

  /**
   * Store device ID in localStorage
   */
  private static storeDeviceId(deviceId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, deviceId);
    } catch (error) {
      console.warn('Error storing device ID in localStorage:', error);
    }
  }

  /**
   * Generate a fallback device ID for server-side or when fingerprinting fails
   */
  private static generateFallbackId(): string {
    const random = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);
    return `fs_fallback_${random}_${timestamp}`;
  }

  /**
   * Clear stored device ID (for testing or privacy purposes)
   */
  static clearDeviceId(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Error clearing device ID:', error);
    }
  }
}