export interface Produce {
  id: string;
  name: string;
  months: number[]; // 0-11
  emoji?: string;
  best_months?: number[]; // months when best quality available
  selection_guide?: string; // tips for selecting
  wikipedia_url?: string; // link to Wikipedia page
}

export interface UserSettings {
  phoneNumber: string;
  notificationsEnabled: boolean;
  favItems: string[];
}
