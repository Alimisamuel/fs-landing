/* eslint-disable @typescript-eslint/no-explicit-any */

import privateApi from "@/services/api";
import { getErrorMessage } from "@/utils/helpers";
import { useEffect, useState } from "react";

interface UseSignedUrlProps {
  resourceId: string;

}

export function useSignedUrl({ resourceId }: UseSignedUrlProps) {
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseURL = process.env.NEXT_PUBLIC_APP_STREAMING_BASE_URL || ""

  useEffect(() => {

    const fetchCookiesAndUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await privateApi.post(`${baseURL}/streaming/sign-cookie`,{ resource: resourceId })

        const data = response;
        if (data.data?.data?.cookies) {
          Object.entries(data.data.data.cookies).forEach(([name, value]) => {
            document.cookie = `${name}=${value}; path=/; secure; samesite=none`;
          });
        }

        // set final URL
        setSignedUrl(data.data.data.cloudFrontUrl || "");
      } catch (err: any) {
        const message = getErrorMessage(err);
        setError(message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCookiesAndUrl();
  }, [resourceId]);

  return { signedUrl, loading, error };
}
