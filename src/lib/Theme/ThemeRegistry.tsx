
"use client";

import createCache from "@emotion/cache";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Theme from "./theme";

import { VideoProvider } from "@/hooks/VideoSoundContext";


// Create Emotion cache
const cache = createCache({ key: "css", prepend: true });

// Define props for ThemeRegistry
interface ThemeRegistryProps {
  children: React.ReactNode;
  color: string;
  mode?:string;
}

export default function ThemeRegistry({ children, color, mode }: ThemeRegistryProps) {
  const muiTheme = Theme({ color, mode }); 

  return (
 
      <ThemeProvider theme={muiTheme}>
        <VideoProvider>
        <CssBaseline />
        {children}
        </VideoProvider>
      </ThemeProvider>

  );
}
