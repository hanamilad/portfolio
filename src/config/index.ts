/**
 * Portfolio Configuration
 * 
 * This configuration controls how content is loaded in the portfolio.
 * 
 * - use_api: false (default) = Load from local JSON files
 * - use_api: true = Load from API endpoints
 * 
 * To activate backend:
 * 1. Set use_api to true
 * 2. Set base_url to your API endpoint (e.g., "https://mybackend.com/api")
 * 3. All content will automatically switch from JSON to API
 */

export const CONFIG = {
  // Content source toggle
  use_api: false, // Set to true to use API instead of local JSON

  // Backend API configuration (when use_api is true)
  base_url: "", // e.g., "https://api.yourportfolio.com"

  // API endpoints (relative to base_url)
  endpoints: {
    about: "/about",
    skills: "/skills",
    projects: "/projects",
    experience: "/experience",
    contact: "/contact",
  },

  // Local JSON file paths (when use_api is false)
  local_json: {
    about: "/data/about.json",
    skills: "/data/skills.json",
    projects: "/data/projects.json",
    experience: "/data/experience.json",
    contact: "/data/contact.json",
  },

  // Debug mode - logs data loading info to console
  debug: true,
} as const;

export type ConfigType = typeof CONFIG;
export type DataType = keyof typeof CONFIG.endpoints;
