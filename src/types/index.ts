export interface Produce {
  id: string;
  name: string;
  pl_name: string;
  months: number[]; // 0-11
  emoji?: string;
  best_months?: number[]; // months when best quality available
  selection_guide?: string; // tips for selecting
  pl_selection_guide?: string; // tips for selecting in Polish
  wikipedia_url?: string; // link to Wikipedia page
  rarity: 1 | 2 | 3 | 4 | 5; // 1=common, 2=uncommon, 3=rare, 4=epic, 5=legendary
}
