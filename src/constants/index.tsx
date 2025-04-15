export const API_URL_test = "http://localhost:3001";

export const API_URL = "https://api.tixflow.net/api/";

export const STORAGE_KEYS = {
  NEW_EVENT: "create_ticket_event_draft",
  TICKET_DATA: "create_ticket_data_draft",
  SELECTED_EVENT: "create_ticket_selected_event",
  ACTIVE_TAB: "create_ticket_active_tab",
  EVENTS_CACHE: "events_cache",
};

export const FILE_CONFIGS = {
  MAX_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/heic"],
};

export const PAYMENT_FEES = {
  HIGH_PRICE_THRESHOLD: 1_000_000,
  HIGH_PRICE_FEE: 50000,
  NORMAL_FEE: 30000,
};
