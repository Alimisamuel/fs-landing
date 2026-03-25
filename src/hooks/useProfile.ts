import { ApiResponse, createProfile, getCurrentProfile, getStreamingProfiles } from "@/services/profile";
import { User } from "@/store/slices/authApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useProfilesData = () => {
  return useQuery({
    queryKey: ["streaming-profiles"],
    queryFn: getStreamingProfiles,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
     retry: 2,
    refetchOnWindowFocus: false,
  });
};
export const useCurrentData = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getCurrentProfile,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
     retry: 2,
    refetchOnWindowFocus: false,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<User | null>, Error, string>({
    mutationFn: (name: string) => createProfile(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["streaming-profiles"], // refetch profiles list
      });
    },
  });
};