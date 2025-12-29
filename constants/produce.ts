import { Produce } from "../types";

export const PRODUCE_DATA: Produce[] = [
  // --- Vegetables ---
  {
    id: "1",
    name: "Beetroot",
    category: "vegetable",
    // Available from storage (Jan-Apr) and fresh harvest (Jun-Dec)
    months: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: "2",
    name: "Asparagus",
    category: "vegetable",
    // Short season: May - June
    months: [4, 5],
  },
  {
    id: "3",
    name: "Pumpkin",
    category: "vegetable",
    // Harvest and storage: Sept - Dec
    months: [8, 9, 10, 11],
    emoji: "🎃",
  },
  {
    id: "4",
    name: "Carrot",
    category: "vegetable",
    // Available almost year-round due to storage
    months: [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11],
    emoji: "🥕",
  },
  {
    id: "5",
    name: "Potato",
    category: "vegetable",
    // Early potatoes start June, storage lasts until next harvest
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    emoji: "🥔",
  },
  {
    id: "6",
    name: "Tomato",
    category: "vegetable",
    // Field/Poly-tunnel season: Jul - Sept/Oct
    months: [6, 7, 8, 9],
    emoji: "🍅",
  },
  {
    id: "7",
    name: "Cucumber",
    category: "vegetable",
    // Field grown: Jul - Sept
    months: [6, 7, 8],
    emoji: "🥒",
  },
  {
    id: "8",
    name: "Radish",
    category: "vegetable",
    // Spring (Mar-Jun) and Autumn harvest (Sept-Oct)
    months: [2, 3, 4, 5, 8, 9],
  },
  {
    id: "9",
    name: "Cauliflower",
    category: "vegetable",
    // May - Nov
    months: [4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: "10",
    name: "Broccoli",
    category: "vegetable",
    // Jun - Nov
    months: [5, 6, 7, 8, 9, 10],
    emoji: "🥦",
  },
  {
    id: "11",
    name: "Zucchini",
    category: "vegetable",
    // Jun - Oct
    months: [5, 6, 7, 8, 9],
  },
  {
    id: "12",
    name: "Pepper",
    category: "vegetable",
    // Aug - Oct (Greenhouse/Field)
    months: [7, 8, 9],
    emoji: "🫑",
  },
  {
    id: "13",
    name: "Beans (Broad)",
    category: "vegetable",
    // Fava beans: Jun - Jul
    months: [5, 6],
    emoji: "🫘",
  },
  {
    id: "14",
    name: "Beans (Green)",
    category: "vegetable",
    // Jul - Sept
    months: [6, 7, 8],
    emoji: "🫘",
  },
  {
    id: "15",
    name: "Cabbage (White)",
    category: "vegetable",
    // Year-round (early varieties + storage)
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    emoji: "🥬",
  },
  {
    id: "16",
    name: "Brussels Sprouts",
    category: "vegetable",
    // Oct - Feb (can handle frost)
    months: [0, 1, 9, 10, 11],
  },
  {
    id: "17",
    name: "Kale",
    category: "vegetable",
    // Aug - Mar
    months: [0, 1, 2, 7, 8, 9, 10, 11],
    emoji: "🥬",
  },
  {
    id: "18",
    name: "Spinach",
    category: "vegetable",
    // Spring and Autumn harvest
    months: [3, 4, 5, 7, 8, 9],
    emoji: "🥬",
  },
  {
    id: "19",
    name: "Rhubarb",
    category: "vegetable",
    // Apr - Jun
    months: [3, 4, 5],
  },
  {
    id: "20",
    name: "Onion",
    category: "vegetable",
    // Year-round (storage)
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    emoji: "🧅",
  },
  {
    id: "20b",
    name: "Garlic",
    category: "vegetable",
    // Year-round (storage)
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    emoji: "🧄",
  },
  {
    id: "20c",
    name: "Corn",
    category: "vegetable",
    // Aug - Oct
    months: [7, 8, 9],
    emoji: "🌽",
  },

  // --- Fruits ---
  {
    id: "21",
    name: "Strawberries",
    category: "fruit",
    // Field grown: Jun - Jul (late May dependent on weather)
    months: [5, 6],
    emoji: "🍓",
  },
  {
    id: "22",
    name: "Apples",
    category: "fruit",
    // Harvest (Aug-Oct) + Storage (Year-round except maybe July gap)
    months: [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11],
    emoji: "🍎",
  },
  {
    id: "23",
    name: "Pears",
    category: "fruit",
    // Aug - Feb
    months: [0, 1, 7, 8, 9, 10, 11],
    emoji: "🍐",
  },
  {
    id: "24",
    name: "Plums",
    category: "fruit",
    // Jul - Oct
    months: [6, 7, 8, 9],
  },
  {
    id: "25",
    name: "Cherries (Sweet)",
    category: "fruit",
    // Jun - Jul
    months: [5, 6],
    emoji: "🍒",
  },
  {
    id: "26",
    name: "Cherries (Sour)",
    category: "fruit",
    // Jul - early Aug
    months: [6, 7],
    emoji: "🍒",
  },
  {
    id: "27",
    name: "Raspberries",
    category: "fruit",
    // Summer and Autumn varieties: Jun - Oct
    months: [5, 6, 7, 8, 9],
  },
  {
    id: "28",
    name: "Blueberries",
    category: "fruit",
    // American blueberry: Jul - Sept
    months: [6, 7, 8],
    emoji: "🫐",
  },
  {
    id: "29",
    name: "Currants",
    category: "fruit",
    // Black/Red: Jul - Aug
    months: [6, 7],
  },
  {
    id: "30",
    name: "Gooseberries",
    category: "fruit",
    // Jun - Jul
    months: [5, 6],
  },
  {
    id: "31",
    name: "Blackberries",
    category: "fruit",
    // Aug - Sept
    months: [7, 8],
  },
  {
    id: "32",
    name: "Grapes",
    category: "fruit",
    // Polish harvest: Sept - Oct
    months: [8, 9],
    emoji: "🍇",
  },
  {
    id: "33",
    name: "Apricots",
    category: "fruit",
    // Jul - Aug
    months: [6, 7],
    emoji: "🍑",
  },
];
