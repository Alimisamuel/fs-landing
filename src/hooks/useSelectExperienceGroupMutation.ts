"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import privateApi from "@/services/api";
import {
  EXPERIENCE_GROUP_STATUS_QUERY_KEY,
  type SelectExperienceGroupBody,
} from "@/services/experienceGroup";

export function useSelectExperienceGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: SelectExperienceGroupBody) => {
      const { data } = await privateApi.patch<unknown>(
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
