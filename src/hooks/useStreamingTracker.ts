import { useEffect, useRef, useCallback } from 'react';
import { StreamingAnalyticsService, StreamingCapturePayload } from '@/services/streamingApi';
import { DeviceFingerprint } from '@/utils/deviceFingerprint';

interface UseStreamingTrackerOptions {
  videoId: string;
  videoElement: HTMLVideoElement | null;
  isPlaying: boolean;
  enabled?: boolean;
  captureInterval?: number; // in seconds, default 30s
  minWatchTime?: number; // minimum watch time before sending data (in seconds), default 5s
}

interface StreamingStats {
  totalWatchTime: number;
  lastCaptureTime: number;
  sessionStartTime: number;
  deviceId: string;
}

/**
 * Hook for tracking video streaming analytics
 * Automatically captures watch time, progress, and device information
 */
export const useStreamingTracker = ({
  videoId,
  videoElement,
  isPlaying,
  enabled = true,
  captureInterval = 30, // Capture every 30 seconds
  minWatchTime = 5 // Minimum 5 seconds before first capture
}: UseStreamingTrackerOptions) => {
  const statsRef = useRef<StreamingStats>({
    totalWatchTime: 0,
    lastCaptureTime: 0,
    sessionStartTime: Date.now(),
    deviceId: DeviceFingerprint.getDeviceId()
  });

  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPlayTimeRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);

  /**
   * Calculate current progress percentage
   */
  const calculateProgress = useCallback((): number => {
    if (!videoElement || !videoElement.duration || isNaN(videoElement.duration)) {
      return 0;
    }
    return Math.round((videoElement.currentTime / videoElement.duration) * 100);
  }, [videoElement]);

  /**
   * Send streaming data to API
   */
  const captureStreamingData = useCallback(async (completed: boolean = false) => {
   

    if (!videoElement || !enabled) {
      
      return;
    }

    const stats = statsRef.current;
    const currentTime = videoElement.currentTime || 0;
    const progress = calculateProgress();
    
    // Don't send if we haven't met minimum watch time
    if (stats.totalWatchTime < minWatchTime && !completed) {

      return;
    }



    const payload: StreamingCapturePayload = {
      videoId,
      watchTimeSeconds: Math.round(stats.totalWatchTime),
      progressPercentage: progress,
      currentPositionSeconds: Math.round(currentTime),
      completed,
      deviceType: StreamingAnalyticsService.getDeviceType(),
      deviceId: stats.deviceId,
      platform: 'web'
    };

    try {
      const result = await StreamingAnalyticsService.captureStreamingData(payload);
      if (result.success) {
    
        
        // Update last capture time
        stats.lastCaptureTime = Date.now();
      } else {
        console.warn('Failed to capture streaming data:', result.message);
      }
    } catch (error) {
      console.error('Error capturing streaming data:', error);
    }
  }, [videoId, videoElement, enabled, calculateProgress, minWatchTime]);

  /**
   * Update watch time when video is playing
   */
  const updateWatchTime = useCallback(() => {
    if (!isPlaying || !videoElement) {

      return;
    }

    const currentTime = Date.now();
    
    // Initialize lastPlayTimeRef if it's not set (0) or very old
    if (lastPlayTimeRef.current === 0 || (currentTime - lastPlayTimeRef.current) > 5000) {

      lastPlayTimeRef.current = currentTime;
      return;
    }
    
    const timeSinceLastUpdate = (currentTime - lastPlayTimeRef.current) / 1000;
    
    // Only update if reasonable time has passed (prevent huge jumps)
    if (timeSinceLastUpdate > 0 && timeSinceLastUpdate <= 10) { // Increased from 2 to 10 seconds for more flexibility
      const oldWatchTime = statsRef.current.totalWatchTime;
      statsRef.current.totalWatchTime += timeSinceLastUpdate;
     
    } else {
    
    }
    
    lastPlayTimeRef.current = currentTime;
  }, [isPlaying, videoElement]);

  /**
   * Handle video play event
   */
  const handlePlay = useCallback(() => {
 
    const now = Date.now();
    lastPlayTimeRef.current = now;
   
    
    // Start periodic capture interval
    if (enabled && !captureIntervalRef.current) {

      captureIntervalRef.current = setInterval(() => {
     
        updateWatchTime();
        captureStreamingData();
      }, captureInterval * 1000);
    } else {
     
    }
  }, [enabled, captureInterval, updateWatchTime, captureStreamingData]);

  /**
   * Handle video pause event
   */
  const handlePause = useCallback(() => {
    updateWatchTime();
    
    // Clear interval when paused
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  }, [updateWatchTime]);

  /**
   * Handle video end event
   */
  const handleVideoEnd = useCallback(() => {
    updateWatchTime();
    captureStreamingData(true); // Mark as completed
    
    // Clear interval
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  }, [updateWatchTime, captureStreamingData]);

  /**
   * Handle video seek event (when user skips to different position)
   */
  const handleSeek = useCallback(() => {
    // Send current data before user seeks
    if (statsRef.current.totalWatchTime >= minWatchTime) {
      captureStreamingData();
    }
  }, [captureStreamingData, minWatchTime]);

  /**
   * Initialize tracking when video element is available
   */
  useEffect(() => {
  

    if (!videoElement || !enabled || hasInitializedRef.current) return;

    // Initialize stats
    statsRef.current = {
      totalWatchTime: 0,
      lastCaptureTime: Date.now(),
      sessionStartTime: Date.now(),
      deviceId: DeviceFingerprint.getDeviceId()
    };

    // Initialize play time reference
    lastPlayTimeRef.current = 0; // Reset to 0 so it gets properly initialized on first play

   
    hasInitializedRef.current = true;

    return () => {
      hasInitializedRef.current = false;
    };
  }, [videoElement, enabled, videoId]);

  /**
   * Handle play/pause state changes
   */
  useEffect(() => {


    if (!videoElement || !enabled) return;

    if (isPlaying) {
    
      handlePlay();
    } else {

      handlePause();
    }
  }, [isPlaying, videoElement, enabled, handlePlay, handlePause]);

  /**
   * Add event listeners to video element
   */
  useEffect(() => {
    if (!videoElement || !enabled) return;

    videoElement.addEventListener('ended', handleVideoEnd);
    videoElement.addEventListener('seeked', handleSeek);

    return () => {
      videoElement.removeEventListener('ended', handleVideoEnd);
      videoElement.removeEventListener('seeked', handleSeek);
    };
  }, [videoElement, enabled, handleVideoEnd, handleSeek]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      // Final capture on component unmount
      if (enabled && statsRef.current.totalWatchTime >= minWatchTime) {
        updateWatchTime();
        captureStreamingData();
      }

      // Clear any running intervals
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
    };
  }, [enabled, minWatchTime, updateWatchTime, captureStreamingData]);

  /**
   * Manual capture function (for external use)
   */
  const manualCapture = useCallback(() => {
    updateWatchTime();
    return captureStreamingData();
  }, [updateWatchTime, captureStreamingData]);

  /**
   * Get current stats (for debugging or external use)
   */
  const getCurrentStats = useCallback(() => {
    updateWatchTime();
    return {
      ...statsRef.current,
      currentProgress: calculateProgress(),
      currentPosition: videoElement?.currentTime || 0,
      duration: videoElement?.duration || 0
    };
  }, [updateWatchTime, calculateProgress, videoElement]);

  return {
    manualCapture,
    getCurrentStats,
    deviceId: statsRef.current.deviceId
  };
};