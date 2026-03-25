import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { ContentItem } from '@/services/bannerApi';

// Base URL for your API - adjust this to your actual API endpoint
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fs.advancedtechnologypark.com';

export interface AddToMyListRequest {
  videoId: string;
}

export interface AddToMyListResponse {
  success: boolean;
  message: string;
  data?: unknown;
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}

export interface MyListResponse {
  success: boolean;
  message: string;
data:{
    data: {
    items: ContentItem[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
}

export const myListApi = createApi({
  reducerPath: 'myListApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/content`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['MyList'],
  endpoints: (builder) => ({
    // GET /content/my-list - Get user's favorite list
    getMyList: builder.query<MyListResponse, void>({
      query: () => ({
        url: '/my-list',
        method: 'GET',
      }),
      providesTags: ['MyList'],
    }),
    
    // POST /content/my-list - Add video to favorites
    addToMyList: builder.mutation<AddToMyListResponse, AddToMyListRequest>({
      query: (data) => ({
        url: '/my-list',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyList'],
    }),
    
    // DELETE /content/my-list - Remove video from favorites (assuming you might need this)
    removeFromMyList: builder.mutation<AddToMyListResponse, AddToMyListRequest>({
      query: (data) => ({
        url: `/my-list/${data.videoId}`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['MyList'],
    }),
  }),
});

export const {
  useGetMyListQuery,
  useAddToMyListMutation,
  useRemoveFromMyListMutation,
} = myListApi;
