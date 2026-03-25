"use client";

import React from 'react';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import { IoVolumeHighOutline, IoVolumeMuteOutline } from 'react-icons/io5';
import { IoPause, IoPlay, IoStop } from 'react-icons/io5';
import { useVideoContext } from '../../hooks/VideoSoundContext';

/**
 * GlobalVideoControls - A component that demonstrates global video management
 * This can be placed anywhere in your app to control all videos globally
 */
const GlobalVideoControls: React.FC = () => {
  const videoContext = useVideoContext();

  const registeredVideoIds = Object.keys(videoContext.registeredVideos);
  const currentlyPlayingVideo = videoContext.getCurrentlyPlayingVideo();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        borderRadius: 2,
        p: 2,
        minWidth: 300,
        border: '1px solid #333',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Global Video Controls
      </Typography>
      
      {/* Global Controls */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton
          onClick={videoContext.toggleMute}
          sx={{ color: 'white' }}
          title={videoContext.isMuted ? 'Unmute All' : 'Mute All'}
        >
          {videoContext.isMuted ? (
            <IoVolumeMuteOutline size={24} />
          ) : (
            <IoVolumeHighOutline size={24} />
          )}
        </IconButton>
        
        <IconButton
          onClick={videoContext.pauseAllVideos}
          sx={{ color: 'white' }}
          title="Pause All Videos"
        >
          <IoStop size={24} />
        </IconButton>
        
        <Chip
          label={videoContext.isMuted ? 'Muted' : 'Unmuted'}
          color={videoContext.isMuted ? 'error' : 'success'}
          size="small"
        />
      </Box>

      {/* Currently Playing */}
      <Box mb={2}>
        <Typography variant="body2" gutterBottom>
          Currently Playing:
        </Typography>
        {currentlyPlayingVideo ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={`${currentlyPlayingVideo.component}: ${currentlyPlayingVideo.id.substring(0, 20)}...`}
              color="primary"
              size="small"
            />
            <IconButton
              onClick={() => videoContext.pauseVideo(currentlyPlayingVideo.id)}
              sx={{ color: 'white' }}
              size="small"
              title="Pause This Video"
            >
              <IoPause size={16} />
            </IconButton>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No video currently playing
          </Typography>
        )}
      </Box>

      {/* Registered Videos */}
      <Box>
        <Typography variant="body2" gutterBottom>
          Registered Videos: {registeredVideoIds.length}
        </Typography>
        {registeredVideoIds.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={1}>
            {registeredVideoIds.slice(0, 3).map((videoId) => {
              const video = videoContext.registeredVideos[videoId];
              const isCurrentlyPlaying = videoId === videoContext.currentlyPlayingVideoId;
              
              return (
                <Box key={videoId} display="flex" alignItems="center" gap={1}>
                  <Chip
                    label={`${video.component}: ${videoId.substring(0, 15)}...`}
                    color={isCurrentlyPlaying ? 'success' : 'default'}
                    size="small"
                    variant={isCurrentlyPlaying ? 'filled' : 'outlined'}
                  />
                  <IconButton
                    onClick={() => isCurrentlyPlaying 
                      ? videoContext.pauseVideo(videoId) 
                      : videoContext.playVideo(videoId)
                    }
                    sx={{ color: 'white' }}
                    size="small"
                    title={isCurrentlyPlaying ? 'Pause' : 'Play'}
                  >
                    {isCurrentlyPlaying ? (
                      <IoPause size={14} />
                    ) : (
                      <IoPlay size={14} />
                    )}
                  </IconButton>
                </Box>
              );
            })}
            {registeredVideoIds.length > 3 && (
              <Typography variant="caption" color="text.secondary">
                ... and {registeredVideoIds.length - 3} more
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No videos registered
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GlobalVideoControls;
