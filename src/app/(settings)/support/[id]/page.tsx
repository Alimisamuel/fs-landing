import React from "react";
import SupportTopicOverview from "@/features/Settings/Support/SupportTopicOverview";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <SupportTopicOverview id={decodeURIComponent(id)} />
    </>
  );
}
