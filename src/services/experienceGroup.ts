/** Payload inside API `data` for GET /users/me/experience-group-status */
export interface ExperienceGroupStatusPayload {
  selected: boolean;
  groupId: string | null;
  /** API may return a string or a nested object (e.g. `{ name: string }`) */
  experienceGroup: string | { name?: string } | null;
}

/** Safe label for UI — handles string, `{ name }`, or other shapes without throwing */
export function experienceGroupDisplayName(
  value: ExperienceGroupStatusPayload["experienceGroup"],
): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const t = value.trim();
    return t.length > 0 ? t : null;
  }
  if (typeof value === "object" && value !== null && "name" in value) {
    const n = (value as { name: unknown }).name;
    if (typeof n === "string") {
      const t = n.trim();
      return t.length > 0 ? t : null;
    }
  }
  return null;
}

/** Typical API envelope from privateApi.get */
export interface ExperienceGroupStatusResponse {
  data: ExperienceGroupStatusPayload;
  message?: string;
  method?: string;
  path?: string;
  status?: boolean;
  statusCode?: number;
  timestamp?: string;
}

export const EXPERIENCE_GROUP_STATUS_QUERY_KEY = [
  "experience-group-status",
] as const;

/** PATCH body for /users/me/experience-group */
export interface SelectExperienceGroupBody {
  groupId: string;
}
