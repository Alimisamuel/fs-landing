/* eslint-disable @typescript-eslint/no-explicit-any */

interface ContentItemMovie{
    id?: number;
    title?:string;
    backdrop_path?:string;
    overview?:string;
      year?: number;
      category?: string;
      image?: StaticImageData;
      index?: string | number;
      isTop10?: boolean;
      isRecent?: boolean;
      isLeaving?: boolean;
      watching?: boolean;
      video?:string
}

interface Genre{
    id: number;
    name: string;
}

export interface StreamingProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  type: "adult" | "kid"; // restrict type values if possible
  maxAgeRating: string;
  isKidsProfile: boolean;
  isActive: boolean;
  isPrimary: boolean;
  pinCode: string | null;
  autoplayEnabled: boolean;
  notificationsEnabled: boolean;
  preferredGenres: string[];
  preferredLanguages: string[];
  blockedContentTypes: string[];
  watchTimeMinutes: number;
  videosWatched: number;
  lastWatchedAt: string | null;
  preferences: any | null; // can refine if you know the structure
  watchHistory: any | null; // can refine if you know the structure
  createdAt: string;
  updatedAt: string;
}



interface GenreWithMovie{
    id: number;
    name: string;
    movies: Movie[]
}

interface Trailer{
    key: string;
    type: string;
    site: string;
}


interface MovieDetails {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: Belongstocollection;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: Productioncompany[];
    production_countries: Productioncountry[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: Spokenlanguage[];
    status: string;
    tagline: string;
    title: string;
    vote_average: number;
    vote_count: number;
    video:string
  }
  
interface MovieDetails_Short {

    id: number;
    title: string;
    vote_average: number;
    vote_count: number;
    video:string
  }
  
  interface Spokenlanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }
  
  interface Productioncountry {
    iso_3166_1: string;
    name: string;
  }
  
  interface Productioncompany {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }
  
  interface Genre {
    id: number;
    name: string;
  }
  
  interface Belongstocollection {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  }