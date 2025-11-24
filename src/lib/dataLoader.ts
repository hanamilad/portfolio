/**
 * Universal Data Loader
 * 
 * Handles loading data from either local JSON files or API endpoints
 * based on the configuration in config/index.ts
 */

import { CONFIG, DataType } from "@/config";

/**
 * Error class for data loading failures
 */
export class DataLoadError extends Error {
  constructor(
    message: string,
    public dataType: DataType,
    public source: "json" | "api"
  ) {
    super(message);
    this.name = "DataLoadError";
  }
}

/**
 * Logs debug information if debug mode is enabled
 */
function debugLog(message: string, data?: any) {
  if (CONFIG.debug) {
    console.log(`[DataLoader] ${message}`, data || "");
  }
}

/**
 * Loads data from a local JSON file
 */
async function fetchJSON(type: DataType): Promise<any> {
  const filePath = CONFIG.local_json[type];
  debugLog(`Loading from JSON: ${filePath}`);

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    debugLog(`✓ JSON loaded successfully for: ${type}`, data);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    debugLog(`✗ JSON load failed for: ${type} - ${message}`);
    throw new DataLoadError(`Failed to load JSON for ${type}: ${message}`, type, "json");
  }
}

/**
 * Loads data from an API endpoint
 */
async function fetchAPI(type: DataType): Promise<any> {
  const endpoint = `${CONFIG.base_url}${CONFIG.endpoints[type]}`;
  debugLog(`Loading from API: ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    debugLog(`✓ API loaded successfully for: ${type}`, data);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    debugLog(`✗ API load failed for: ${type} - ${message}`);
    throw new DataLoadError(`Failed to load API for ${type}: ${message}`, type, "api");
  }
}

/**
 * Universal data loader - automatically uses JSON or API based on config
 * 
 * @param type - The type of data to load (about, skills, projects, etc.)
 * @returns Promise with the loaded data
 * @throws DataLoadError if loading fails
 * 
 * @example
 * ```typescript
 * const aboutData = await loadData('about');
 * const projects = await loadData('projects');
 * ```
 */
export async function loadData(type: DataType): Promise<any> {
  debugLog(`Initiating data load for: ${type}`, {
    source: CONFIG.use_api ? "API" : "JSON",
    config: CONFIG.use_api
      ? { base_url: CONFIG.base_url, endpoint: CONFIG.endpoints[type] }
      : { file: CONFIG.local_json[type] },
  });

  try {
    if (CONFIG.use_api) {
      // Validate API configuration
      if (!CONFIG.base_url) {
        throw new DataLoadError(
          "API mode enabled but base_url is not configured",
          type,
          "api"
        );
      }
      return await fetchAPI(type);
    } else {
      return await fetchJSON(type);
    }
  } catch (error) {
    if (error instanceof DataLoadError) {
      throw error;
    }
    throw new DataLoadError(
      `Unexpected error loading ${type}: ${error instanceof Error ? error.message : "Unknown"}`,
      type,
      CONFIG.use_api ? "api" : "json"
    );
  }
}

/**
 * Loads multiple data types in parallel
 * 
 * @param types - Array of data types to load
 * @returns Promise with object containing all loaded data
 * 
 * @example
 * ```typescript
 * const { about, skills, projects } = await loadMultiple(['about', 'skills', 'projects']);
 * ```
 */
export async function loadMultiple(types: DataType[]): Promise<Record<DataType, any>> {
  debugLog(`Loading multiple data types: ${types.join(", ")}`);

  const promises = types.map(async (type) => {
    try {
      const data = await loadData(type);
      return { type, data, error: null };
    } catch (error) {
      return { type, data: null, error };
    }
  });

  const results = await Promise.all(promises);

  // Check for errors
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    debugLog(`✗ Some data failed to load:`, errors);
  }

  // Return object with all data
  const dataObject = results.reduce((acc, result) => {
    if (result.data) {
      acc[result.type] = result.data;
    }
    return acc;
  }, {} as Record<DataType, any>);

  return dataObject;
}
