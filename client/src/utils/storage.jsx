export const storage = {
  set: async (k, v) => {
    try {
      const valueToStore = typeof v === "string" ? v : JSON.stringify(v);
      localStorage.setItem(k, valueToStore);
    } catch (error) {
      console.error("Storage set error:", error);
    }
  },

  get: async (k) => {
    try {
      const value = localStorage.getItem(k);
      if (value === null) return null;

      // Attempt to parse JSON, fallback to raw string
      try {
        return JSON.parse(value);
      } catch {
        return value; // It was a raw string
      }
    } catch (error) {
      console.error("Storage get error:", error);
      return null;
    }
  },

  keys: {
    token: "token",
    here_id_key: "here_id_key",
    isLight: "isLight",
    locale: "locale",
  },
};
