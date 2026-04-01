/** Payload inside API `data` for GET /users/me/experience-group-status */
export interface ExperienceGroupStatusPayload {
  selected: boolean;
  groupId: string | null;
  experienceGroup: string | null;
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

/** POST body when user picks an experience (adjust if backend expects groupId, etc.) */
export interface SelectExperienceGroupBody {
  experienceGroup: string;
}
