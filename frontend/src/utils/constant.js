// Use VITE_API_BASE_URL from .env; falls back to localhost for local dev
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const USER_API_END_POINT       = `${BASE_URL}/user`;
export const JOB_API_END_POINT        = `${BASE_URL}/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
export const COMPANY_API_END_POINT    = `${BASE_URL}/company`;
