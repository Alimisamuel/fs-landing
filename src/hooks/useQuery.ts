import privateApi, { publicApi } from "@/services/api";
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";

import { AxiosError, AxiosRequestConfig } from "axios";

// Generic GET request hook
export function useGetQuery<T>(
  key: string[],
  url: string,
  enabled?: boolean,
  config?: AxiosRequestConfig,
  isPublic = false,
  refetchInterval?: number,
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const api = isPublic ? publicApi : privateApi;
      const response = await api.get<T>(url, config);
      return response.data;
    },
    refetchInterval, // ✅ apply interval
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    enabled // always consider data stale
  });
}

// Generic POST mutation hook
export function usePostMutation<TData, TVariables>(
  url: string,
  isPublic = false,
  keys: string[],
) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const api = isPublic ? publicApi : privateApi;
      const response = await api.post<TData>(url, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: keys });
      queryClient.setQueryData(keys, data);
    },
  });
}

// Generic PUT mutation hook
export function usePutMutation<TData, TVariables>(
  url: string,
  isPublic = false,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const api = isPublic ? publicApi : privateApi;
      const response = await api.put<TData>(url, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

// Generic PATCH mutation hook
export function usePatchMutation<TData, TVariables>(
  url: string,
  isPublic = false,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const api = isPublic ? publicApi : privateApi;
      const response = await api.patch<TData>(url, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

// Generic DELETE mutation hook
export function useDeleteMutation<TData>(
  url: string,
  keys: string[],
  isPublic = false,
) {
  const queryClient = useQueryClient();

  return useMutation<TData, AxiosError, string | number>({
    mutationFn: async (id: string | number) => {
      const api = isPublic ? publicApi : privateApi;
      const response = await api.delete<TData>(`${url}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys });
    },
  });
}
