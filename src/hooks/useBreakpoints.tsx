import { useTheme, useMediaQuery } from "@mui/material";

export default function useBreakpoint() {
  const theme = useTheme();

  return {
    isXs: useMediaQuery(theme.breakpoints.down("sm")),
    isSm: useMediaQuery(theme.breakpoints.between("sm", "md")),
    isMd: useMediaQuery(theme.breakpoints.between("md", "lg")),
    isLg: useMediaQuery(theme.breakpoints.up("lg")),
    isMobile: useMediaQuery(theme.breakpoints.down("md")),
    isTablet: useMediaQuery(theme.breakpoints.between("md", "lg")),
    isDesktop: useMediaQuery(theme.breakpoints.up("lg")),
  };
}