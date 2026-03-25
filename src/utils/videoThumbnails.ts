export interface VideoThumbnail {
  time: number;
  dataUrl: string;
}

export class VideoThumbnailGenerator {
  private video: HTMLVideoElement;
  private hiddenVideo: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private thumbnailCache: Map<number, string> = new Map();
  private isGenerating: boolean = false;
  private videoSrc: string = '';

  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 160;
    this.canvas.height = 90;
    this.ctx = this.canvas.getContext('2d')!;
    
    // Store the video source for hidden video creation
    this.videoSrc = video.src || (video as HTMLVideoElement & { currentSrc?: string }).currentSrc || '';
  }

  /**
   * Create a hidden video element for thumbnail generation
   */
  private async createHiddenVideo(): Promise<HTMLVideoElement> {
    if (this.hiddenVideo && !this.hiddenVideo.error) {
      return this.hiddenVideo;
    }

    return new Promise((resolve, reject) => {
      const hiddenVideo = document.createElement('video');
      hiddenVideo.style.display = 'none';
      hiddenVideo.muted = true;
      hiddenVideo.playsInline = true;
      hiddenVideo.preload = 'metadata';
      
      // Copy source from main video
      if (this.video.src) {
        hiddenVideo.src = this.video.src;
      } else if ((this.video as HTMLVideoElement & { currentSrc?: string }).currentSrc) {
        hiddenVideo.src = (this.video as HTMLVideoElement & { currentSrc?: string }).currentSrc;
      }
      
      hiddenVideo.addEventListener('loadedmetadata', () => {
        this.hiddenVideo = hiddenVideo;
        resolve(hiddenVideo);
      }, { once: true });
      
      hiddenVideo.addEventListener('error', () => {
        reject(new Error('Failed to load hidden video'));
      }, { once: true });
      
      document.body.appendChild(hiddenVideo);
    });
  }

  /**
   * Generate a thumbnail for a specific time in the video
   */
  async generateThumbnail(time: number): Promise<string> {
    // Check cache first
    const cacheKey = Math.floor(time);
    if (this.thumbnailCache.has(cacheKey)) {
      return this.thumbnailCache.get(cacheKey)!;
    }

    // Prevent multiple simultaneous generations
    if (this.isGenerating) {
      return this.generateFallbackThumbnail(time);
    }

    this.isGenerating = true;
    
    try {
      // Try to use hidden video first, fallback to main video if needed
      const thumbnailUrl = await this.generateThumbnailFromHiddenVideo(time)
        .catch(() => this.generateThumbnailFromMainVideo(time));
      
      this.isGenerating = false;
      return thumbnailUrl;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }

  /**
   * Generate thumbnail using hidden video (preferred method)
   */
  private async generateThumbnailFromHiddenVideo(time: number): Promise<string> {
    const cacheKey = Math.floor(time);
    if (this.thumbnailCache.has(cacheKey)) {
      return this.thumbnailCache.get(cacheKey)!;
    }

    try {
      const hiddenVideo = await this.createHiddenVideo();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          hiddenVideo.removeEventListener('seeked', onSeeked);
          reject(new Error('Thumbnail generation timeout'));
        }, 5000);

        const onSeeked = () => {
          try {
            clearTimeout(timeout);
            // Draw the current frame to canvas
            this.ctx.drawImage(hiddenVideo, 0, 0, this.canvas.width, this.canvas.height);
            
            // Convert to data URL
            const dataUrl = this.canvas.toDataURL('image/jpeg', 0.7);
            
            // Cache the thumbnail
            this.thumbnailCache.set(cacheKey, dataUrl);
            
            hiddenVideo.removeEventListener('seeked', onSeeked);
            resolve(dataUrl);
          } catch (error) {
            clearTimeout(timeout);
            hiddenVideo.removeEventListener('seeked', onSeeked);
            reject(error);
          }
        };

        hiddenVideo.addEventListener('seeked', onSeeked);
        hiddenVideo.currentTime = time;
      });
    } catch (error) {
      // If hidden video fails, fall back to main video method
      throw error;
    }
  }

  /**
   * Fallback method using main video (may interrupt playback)
   */
  private async generateThumbnailFromMainVideo(time: number): Promise<string> {
    const cacheKey = Math.floor(time);
    if (this.thumbnailCache.has(cacheKey)) {
      return this.thumbnailCache.get(cacheKey)!;
    }

    return new Promise((resolve, reject) => {
      const originalTime = this.video.currentTime;
      const wasPlaying = !this.video.paused;

      const onSeeked = () => {
        try {
          // Draw the current frame to canvas
          this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
          
          // Convert to data URL
          const dataUrl = this.canvas.toDataURL('image/jpeg', 0.7);
          
          // Cache the thumbnail
          this.thumbnailCache.set(cacheKey, dataUrl);
          
          // Restore original video state
          this.video.currentTime = originalTime;
          if (wasPlaying) {
            this.video.play().catch(() => {});
          }

          this.video.removeEventListener('seeked', onSeeked);
          resolve(dataUrl);
        } catch (error) {
          this.video.removeEventListener('seeked', onSeeked);
          reject(error);
        }
      };

      this.video.addEventListener('seeked', onSeeked);
      this.video.currentTime = time;
    });
  }

  /**
   * Pre-generate thumbnails for better performance
   */
  async preGenerateThumbnails(interval: number = 10): Promise<VideoThumbnail[]> {
    const thumbnails: VideoThumbnail[] = [];
    const duration = this.video.duration;
    
    if (!duration || isNaN(duration)) {
      return thumbnails;
    }

    for (let time = 0; time <= duration; time += interval) {
      try {
        const dataUrl = await this.generateThumbnail(time);
        thumbnails.push({ time, dataUrl });
      } catch (error) {
        console.warn(`Failed to generate thumbnail at ${time}s:`, error);
      }
    }

    return thumbnails;
  }

  /**
   * Get a thumbnail for a specific time (with interpolation if exact match not found)
   */
  getThumbnailForTime(time: number): string | null {
    const cacheKey = Math.floor(time);
    
    // Try exact match first
    if (this.thumbnailCache.has(cacheKey)) {
      return this.thumbnailCache.get(cacheKey)!;
    }

    // Find the closest available thumbnail
    let closestKey = -1;
    let minDistance = Infinity;

    for (const key of this.thumbnailCache.keys()) {
      const distance = Math.abs(key - cacheKey);
      if (distance < minDistance) {
        minDistance = distance;
        closestKey = key;
      }
    }

    return closestKey >= 0 ? this.thumbnailCache.get(closestKey)! : null;
  }

  /**
   * Generate a simple fallback thumbnail
   */
  private generateFallbackThumbnail(time: number): string {
    // Create a simple placeholder thumbnail
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext('2d')!;
    
    // Draw a dark background
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw time text
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.formatTime(time), canvas.width / 2, canvas.height / 2);
    
    return canvas.toDataURL('image/jpeg', 0.7);
  }

  /**
   * Format time for display
   */
  private formatTime(time: number): string {
    if (isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * Clear the thumbnail cache and cleanup
   */
  clearCache(): void {
    this.thumbnailCache.clear();
    
    // Clean up hidden video if it exists
    if (this.hiddenVideo && this.hiddenVideo.parentNode) {
      this.hiddenVideo.parentNode.removeChild(this.hiddenVideo);
      this.hiddenVideo = null;
    }
  }

  /**
   * Get cache size for debugging
   */
  getCacheSize(): number {
    return this.thumbnailCache.size;
  }
}
