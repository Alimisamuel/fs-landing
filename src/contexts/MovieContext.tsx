"use client"

import { ContentItem } from "@/services/bannerApi";
import { createContext, FC, ReactNode, useContext, useState } from "react";


interface MovieContextType {
    selectedMovie: ContentItem | null;
    setSelectedMovie: (movie: ContentItem | null) => void;
    popularMovies: ContentItem[] | null;
    setPopularMovies: (movies: ContentItem[] | null) => void;
    topRatedMovies: ContentItem[] | null;
    setTopRatedMovies: (movies: ContentItem[] | null) => void;
    trendingMovies: ContentItem[] | null;
    setTrendingMovies: (movies: ContentItem[] | null) => void;
    trailerUrl: string
    setTrailerUrl: (url: string) => void
    playerMuted: boolean
    setPlayerMuted: (muted: boolean) => void
    isModalOpen: boolean
    setModalOpen: (muted: boolean) => void
    
}


const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null)
    const [popularMovies, setPopularMovies] = useState<ContentItem[] | null>(null)
    const [topRatedMovies, setTopRatedMovies] = useState<ContentItem[] | null>(null)
    const [trendingMovies, setTrendingMovies] = useState<ContentItem[] | null>(null)
    const [trailerUrl, setTrailerUrl] = useState<string>("")
    const [playerMuted, setPlayerMuted] = useState<boolean>(true)
    const [isModalOpen, setModalOpen] = useState<boolean>(false)

    return (
        <MovieContext.Provider value={{
            selectedMovie, setSelectedMovie,
            popularMovies, setPopularMovies,
             topRatedMovies, setTopRatedMovies,
            trendingMovies, setTrendingMovies,
            trailerUrl, setTrailerUrl,
            playerMuted, setPlayerMuted
            ,isModalOpen, setModalOpen
        }}>
            {children}
        </MovieContext.Provider>
    )
}


export const useMovieContext = () => {
     
    const context = useContext(MovieContext)

    if(!context){
        throw new Error("useMovieContext must be used within a MovieProvider")
    }

    return context
}