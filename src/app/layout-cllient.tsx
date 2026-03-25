"use client";

import { useEffect } from "react";
import ThemeRegistry from "@/lib/Theme/ThemeRegistry";
import ReduxProvider from "@/store/ReduxProvider";
import { SnackbarProvider } from "notistack";
import ErrorAlert from "@/components/UI/Alert/ErrorAlert";
import SuccessAlert from "@/components/UI/Alert/SuccessAlert";
import { MovieProvider } from "@/contexts/MovieContext";
import { CardProvider } from "@/contexts/CardContext";
import { UtilsProvider } from "@/contexts/UtilsContext";
import NoMobile from "./NoMobile";
import { useMediaQuery, useTheme } from "@mui/material";
import QueryProvider from "@/lib/react-query/QueryProvider";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <QueryProvider>
      {/* {isMobile ? (
        <NoMobile/>
      ) : ( */}
        <ReduxProvider>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            Components={{ error: ErrorAlert, success: SuccessAlert }}
          >
            <ThemeRegistry color="#701f63">
              <MovieProvider>
                <CardProvider>
                  <UtilsProvider>
                    <div id="containerBackdrop"></div>
                    {/* <ScrollToTop /> */}
                    {children}
                  </UtilsProvider>
                </CardProvider>
              </MovieProvider>
            </ThemeRegistry>
          </SnackbarProvider>
        </ReduxProvider>
      {/* )} */}
    </QueryProvider>
  );
}
