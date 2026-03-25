import { privateApi } from "./api";

export interface StreamingCapturePayload {
  videoId: string;
  watchTimeSeconds: number;
  progressPercentage: number;
  currentPositionSeconds: number;
  completed: boolean;
  deviceType: "desktop" | "mobile" | "tablet";
  deviceId: string;
  platform: "web" | "ios" | "android";
}

export interface StreamingCaptureResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Service for streaming analytics
 */
export class StreamingAnalyticsService {
  /**
   * Capture streaming data
   */
  static async captureStreamingData(
    payload: StreamingCapturePayload
  ): Promise<StreamingCaptureResponse> {
    try {
      const response = await privateApi.post(
        "/content/streaming/capture",
        payload
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      console.error("Failed to capture streaming data:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to capture streaming data";
      const responseMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;

      return {
        success: false,
        message: responseMessage || errorMessage,
      };
    }
  }

  /**
   * Mark video as completed
   */
  static async markVideoCompleted(
    videoId: string,
    totalWatchTime: number,
    deviceId: string
  ): Promise<StreamingCaptureResponse> {
    const payload: StreamingCapturePayload = {
      videoId,
      watchTimeSeconds: totalWatchTime,
      progressPercentage: 100,
      currentPositionSeconds: totalWatchTime,
      completed: true,
      deviceType: StreamingAnalyticsService.getDeviceType(),
      deviceId,
      platform: "web",
    };

    return this.captureStreamingData(payload);
  }

  /**
   * Get device type based on user agent
   */
  static getDeviceType(): "desktop" | "mobile" | "tablet" {
    if (typeof window === "undefined") return "desktop";

    const userAgent = window.navigator.userAgent.toLowerCase();

    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return "tablet";
    }

    if (
      /mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(
        userAgent
      )
    ) {
      return "mobile";
    }

    return "desktop";
  }
}
