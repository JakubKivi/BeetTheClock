export interface Produce {
  id: string;
  name: string;
  months: number[]; // 0-11
  category: "fruit" | "vegetable";
}

export interface UserSettings {
  phoneNumber: string;
  notificationsEnabled: boolean;
  favItems: string[];
}
