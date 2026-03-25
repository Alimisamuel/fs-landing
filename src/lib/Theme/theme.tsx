"use client";

import { createTheme, ThemeOptions } from "@mui/material/styles";

interface ThemeProps {
  color: string;
  mode?: string;
}

const Theme = ({ color, mode }: ThemeProps) =>
  createTheme({
    palette: {
      mode: mode || "dark",
      primary: {
        main: color,
      },
      secondary: {
        main: "#8987F4",
      },
    },
    typography: {
      fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: "initial",
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      h1: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      h2: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      h3: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      h4: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      h5: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      h6: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      body1: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      body2: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      subtitle1: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      subtitle2: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      caption: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
      overline: {
        fontFamily: '"Satoshi", "Helvetica", "Arial", sans-serif',
      },
    },
  } as ThemeOptions);

export default Theme;
