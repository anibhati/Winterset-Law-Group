// src/lib/crm/index.ts
// Auto-selects real adapter when env vars are set, stub otherwise.

import { stubCrm } from "./stub-adapter";
import { apiCrm } from "./api-adapter";
import type { CrmAdapter } from "./types";

export const crm: CrmAdapter =
  process.env.CRM_BASE_URL && process.env.CRM_API_KEY
    ? apiCrm
    : stubCrm;

export type { CrmAdapter, CrmSyncResult } from "./types";