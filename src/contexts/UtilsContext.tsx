/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCardContext } from "./CardContext";
import { ContentItem } from "@/services/bannerApi";
import {
  useGetMyListQuery,
  useAddToMyListMutation,
  useRemoveFromMyListMutation,
} from "@/store/slices/myListApi";
import useAlert from "@/hooks/useAlert";

interface UtilsContextType {
  addToFavoriteList: (movie: ContentItem) => void;
  movieList: ContentItem[];
  randomDuration: () => string;
  isLoading: boolean;
  error: string | null;
  isInFavorites: (movieId: string) => boolean;
  isItemMutating: (movieId: string) => boolean;
}

const UtilsContext = createContext<UtilsContextType | null>(null);

export const UtilsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [movieList, setMovieList] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { cardState, setCardState } = useCardContext();
  const handleAlert = useAlert();

  // RTK Query hooks
  const {
    data: myListData,
    isLoading,
    error: queryError,
    refetch,
  } = useGetMyListQuery();

  const [addToMyList] = useAddToMyListMutation();
  const [removeFromMyList] = useRemoveFromMyListMutation();

  // Update movieList when API data changes
  useEffect(() => {
    if (myListData?.data?.data?.items) {
      setMovieList(myListData.data.data.items);
    }
    if (queryError) {
      setError("Failed to load favorites list");
    }
  }, [myListData, queryError]);

  const [mutatingItems, setMutatingItems] = useState<Set<string>>(new Set());

  const addToFavoriteList = async (movie: ContentItem) => {
    // Set loading state for this specific movie
    setMutatingItems(prev => new Set([...prev, movie.id]));
    
    try {
      // Check if movie already exists in the list
      const exists = movieList.some(
        (item: ContentItem) => item.video.id === movie.id
      );

      if (exists) {
        // Remove from favorites
        await removeFromMyList({ videoId: movie.id }).unwrap();
        // showAlert('Removed from My List', 'success');

        // Close popup only when removing from list
        setCardState({
          ...cardState,
          isHovered: false,
          item: null,
          cardId: null,
        });
      } else {
        // Add to favorites
        await addToMyList({ videoId: movie.id }).unwrap();
        // showAlert('Added to My List', 'success');

        // Don't close popup when adding to list - keep it open
        // User can continue interacting with the video
      }

      // Refetch the list to get updated data
      refetch();
    } catch (error: any) {
      console.error("Error updating favorites:", error);
      setError(error.message || "Failed to update favorites");
      // showAlert(error.message || 'Failed to update favorites', 'error');
    } finally {
      // Remove loading state for this specific movie
      setMutatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(movie.id);
        return newSet;
      });
    }
  };

  const randomDuration = () => {
    const randomMins = Math.floor(Math.random() * (200 - 60 + 1)) + 60;
    const hrs = Math.floor(randomMins / 60);
    const mins = randomMins % 60;

    return `${hrs}h ${mins}m`;
  };

  const isInFavorites = (movieId: string): boolean => {
    return movieList.some((item: ContentItem) => item.video.id === movieId);
  };

  const isItemMutating = (movieId: string): boolean => {
    return mutatingItems.has(movieId);
  };

  return (
    <UtilsContext.Provider
      value={{
        addToFavoriteList,
        movieList,
        randomDuration,
        isLoading,
        error,
        isInFavorites,
        isItemMutating,
      }}
    >
      {children}
    </UtilsContext.Provider>
  );
};

export const useUtilsContext = (): UtilsContextType => {
  const context = useContext(UtilsContext);

  if (!context) {
    throw new Error("useUtilsContext must be used within a UtilsProvider");
  }

  return context;
};
