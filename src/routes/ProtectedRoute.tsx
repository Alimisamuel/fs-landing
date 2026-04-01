"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from "@/store/slices/authSlice";
import GlobalLoading from "@/app/loading";
import { useGetQuery } from "@/hooks/useQuery";
import type { ExperienceGroupStatusResponse } from "@/services/experienceGroup";
import { EXPERIENCE_GROUP_STATUS_QUERY_KEY } from "@/services/experienceGroup";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  /** When set, authenticated users without a chosen experience (per API) are sent to this path */
  requireSelectedExperience?: boolean;
  experienceRedirectTo?: string;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/auth/login",
  requireSelectedExperience = false,
  experienceRedirectTo = "/experience",
}: ProtectedRouteProps) => {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  const [mounted, setMounted] = useState(false);

  const shouldFetchExperienceStatus =
    mounted &&
    isAuthenticated &&
    requireSelectedExperience &&
    !authLoading;

  const { data: statusPayload, isPending, isError, isSuccess } =
    useGetQuery<ExperienceGroupStatusResponse>(
      [...EXPERIENCE_GROUP_STATUS_QUERY_KEY],
      "/users/me/experience-group-status",
      shouldFetchExperienceStatus,
    );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [authLoading, isAuthenticated, mounted, redirectTo, router]);

  const selected =
    isSuccess && statusPayload?.data
      ? statusPayload.data.selected === true
      : undefined;

  useEffect(() => {
    if (
      !requireSelectedExperience ||
      !isAuthenticated ||
      !mounted ||
      authLoading ||
      !isSuccess
    ) {
      return;
    }
    if (selected === false) {
      router.push(experienceRedirectTo);
    }
  }, [
    authLoading,
    experienceRedirectTo,
    isAuthenticated,
    isSuccess,
    mounted,
    requireSelectedExperience,
    router,
    selected,
  ]);

  const waitingForAuth =
    !mounted || authLoading || (!isAuthenticated && mounted);

  const waitingForExperienceStatus =
    isAuthenticated &&
    mounted &&
    requireSelectedExperience &&
    (isPending || isError || selected === undefined || selected === false);

  if (waitingForAuth || waitingForExperienceStatus) {
    return <GlobalLoading />;
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
