"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateApi from "@/services/api";
import {
  EXPERIENCE_GROUP_STATUS_QUERY_KEY,
  type SelectExperienceGroupBody,
} from "@/services/experienceGroup";

/**
 * Persists the user's experience group choice.
 * Adjust path/body if your API differs (e.g. PATCH, or { groupId }).
 */
export function useSelectExperienceGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: SelectExperienceGroupBody) => {
      const { data } = await privateApi.post<unknown>(
        "/users/me/experience-group",
        body,
      );
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [...EXPERIENCE_GROUP_STATUS_QUERY_KEY],
      });
      await queryClient.refetchQueries({
        queryKey: [...EXPERIENCE_GROUP_STATUS_QUERY_KEY],
      });
    },
  });
}
