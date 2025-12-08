// API Configuration
// For Vercel deployment: Set REACT_APP_API_URL environment variable to your Vercel URL
// Example: REACT_APP_API_URL=https://your-app.vercel.app/api
// For local development with separate Express backend: Set to 'http://localhost:5000'
//
// Default: Empty string (relative paths) - works when frontend and backend are on same domain
// When REACT_APP_API_URL is set, it should include /api prefix for Vercel deployments
const baseUrl = process.env.REACT_APP_API_URL || "";
export const API_BASE_URL = baseUrl;

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USER_CREATE: `${API_BASE_URL}/user/create`,
  USER_MULTIPLE_CREATE: `${API_BASE_URL}/user/multiple`,
  USER_LOGIN: `${API_BASE_URL}/user/login`,
  USER_HUDDLY: `${API_BASE_URL}/user/huddly`,

  // Admin endpoints
  ADMIN_SEE_USERS: `${API_BASE_URL}/admin/seeUsers`,
  ADMIN_UPDATE_USER: (userId) => `${API_BASE_URL}/admin/updateUser/${userId}`,

  // Boat endpoints
  BOAT_CREATE: `${API_BASE_URL}/registerBoat/createBoat`,
  BOAT_SEE: `${API_BASE_URL}/registerBoat/seeBoats`,

  // Meeting endpoints
  MEETING_CREATE: `${API_BASE_URL}/meeting/create`,
  MEETING_FETCH: `${API_BASE_URL}/meeting/fetch`,
  MEETING_UPDATE: (id) => `${API_BASE_URL}/meeting/update/${id}`,
  MEETING_DELETE: (id) => `${API_BASE_URL}/meeting/delete/${id}`,

  // Record endpoints
  RECORD_CREATE: `${API_BASE_URL}/record/make`,
  RECORD_FIND: `${API_BASE_URL}/record/find`,

  // Chat endpoints
  CHAT_CREATE: `${API_BASE_URL}/get/create`,
  CHAT_MESSAGES: `${API_BASE_URL}/get/messages`,
};
