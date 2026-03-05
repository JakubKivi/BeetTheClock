import { Produce } from "../types";

// Rarity level mapping (number to display properties)
export const RARITY_LEVELS: Record<
  1 | 2 | 3 | 4 | 5,
  { label: string; color: string; emoji: string }
> = {
  1: { label: "Common", color: "#808080", emoji: "⚪" },
  2: { label: "Uncommon", color: "#00AA00", emoji: "🟢" },
  3: { label: "Rare", color: "#0055FF", emoji: "🔵" },
  4: { label: "Epic", color: "#AA00FF", emoji: "🟣" },
  5: { label: "Legendary", color: "#FFAA00", emoji: "🟡" },
};

// Helper function to get rarity info
export const getRarityInfo = (rarity: 1 | 2 | 3 | 4 | 5) =>
  RARITY_LEVELS[rarity];

export const PRODUCE_DATA: Produce[] = [
  // --- Root Vegetables & Tubers ---
  {
    id: "1",
    name: "Beetroot",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [5, 6],
    selection_guide:
      "Firm, smooth skin, intact taproot. For greens attached, leaves should be fresh not wilted.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Beetroot",
    rarity: 1,
  },
  {
    id: "4",
    name: "Carrot",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [5, 6, 7],
    selection_guide:
      "Firm, bright orange, smooth skin. Avoid cracks or rubbery texture.",
    emoji: "🥕",
    wikipedia_url: "https://en.wikipedia.org/wiki/Carrot",
    rarity: 1,
  },
  {
    id: "34",
    name: "Celery Root",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Heavy for its size, firm, no soft spots. Smaller roots tend to be less woody.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Celeriac",
    rarity: 1,
  },
  {
    id: "35",
    name: "Parsley Root",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide: "Firm, white/beige skin. Avoid rusty spots or limp roots.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Parsley#Root_parsley",
    rarity: 1,
  },
  {
    id: "5",
    name: "Potato",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [5, 6],
    selection_guide:
      "Firm, smooth skin, no green tints or sprouts. New potatoes should have flaky skin.",
    emoji: "🥔",
    wikipedia_url: "https://en.wikipedia.org/wiki/Potato",
    rarity: 1,
  },
  {
    id: "45",
    name: "Parsnip",
    months: [0, 1, 2, 9, 10, 11],
    selection_guide:
      "Firm, ivory color. Avoid very large roots as they can be woody cores.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Parsnip",
    rarity: 3,
  },
  {
    id: "49",
    name: "Jerusalem Artichoke",
    months: [0, 1, 2, 9, 10, 11],
    selection_guide:
      "Firm, not shriveled. Knobby is normal, but avoid soft spots/mold.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Jerusalem_artichoke",
    rarity: 4,
  },
  {
    id: "51",
    name: "Horseradish",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide: "Very hard and firm. Avoid shriveled roots or soft ends.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Horseradish",
    rarity: 2,
  },
  {
    id: "8",
    name: "Radish",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    best_months: [3, 4, 8, 9],
    selection_guide:
      "Firm, smooth, bright color. If leaves are attached, they should be green and crisp.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Radish",
    rarity: 1,
  },

  // --- Alliums ---
  {
    id: "20",
    name: "Onion",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Hard, dry, papery skin. Avoid sprouting necks or soft spots.",
    emoji: "🧅",
    wikipedia_url: "https://en.wikipedia.org/wiki/Onion",
    rarity: 1,
  },
  {
    id: "20b",
    name: "Garlic",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Firm, tight skin, heavy for size. Avoid if cloves feel hollow or soft.",
    emoji: "🧄",
    wikipedia_url: "https://en.wikipedia.org/wiki/Garlic",
    rarity: 1,
  },
  {
    id: "36",
    name: "Leek",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Crisp white and light green parts. Avoid yellowing or slimy leaves.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Leek",
    rarity: 1,
  },
  {
    id: "52",
    name: "Spring Onion",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    selection_guide: "Bright green, crisp stalks. Avoid slimy or wilting tips.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Scallion",
    rarity: 1,
  },

  // --- Brassicas & Leafy Greens ---
  {
    id: "15",
    name: "Cabbage (White)",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [4, 5, 6],
    selection_guide:
      "Heavy for size, tight leaves. Young cabbage is looser and greener.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cabbage",
    rarity: 1,
  },
  {
    id: "16",
    name: "Brussels Sprouts",
    months: [0, 1, 9, 10, 11],
    best_months: [10, 11, 0],
    selection_guide:
      "Tight, small, bright green heads. Avoid yellow leaves or loose structure.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Brussels_sprout",
    rarity: 2,
  },
  {
    id: "9",
    name: "Cauliflower",
    months: [4, 5, 6, 7, 8, 9, 10],
    selection_guide:
      "Compact, creamy white curds. No dark spots. Leaves should be fresh green.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cauliflower",
    rarity: 1,
  },
  {
    id: "10",
    name: "Broccoli",
    months: [5, 6, 7, 8, 9, 10],
    selection_guide:
      "Firm stalks, tight dark green florets. Avoid yellowing buds.",
    emoji: "🥦",
    wikipedia_url: "https://en.wikipedia.org/wiki/Broccoli",
    rarity: 1,
  },
  {
    id: "37",
    name: "Kohlrabi",
    months: [4, 5, 6, 7, 8, 9],
    best_months: [4, 5, 8, 9],
    selection_guide:
      "Small to medium size (tennis ball). Heavy and firm. Large ones can be woody inside.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kohlrabi",
    rarity: 1,
  },
  {
    id: "17",
    name: "Kale",
    months: [0, 1, 2, 7, 8, 9, 10, 11],
    best_months: [10, 11, 0, 1],
    selection_guide: "Dark green, crisp leaves. Avoid yellow or mushy spots.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kale",
    rarity: 1,
  },
  {
    id: "18",
    name: "Spinach",
    months: [2, 3, 4, 5, 7, 8, 9, 10],
    selection_guide:
      "Vibrant green, fresh looking. Avoid slimy or wilted leaves.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Spinach",
    rarity: 1,
  },
  {
    id: "2",
    name: "Asparagus",
    months: [4, 5],
    selection_guide:
      "Firm, straight stalks with closed, tight tips. Ends should be moist, not dry.",
    emoji: "bi",
    wikipedia_url: "https://en.wikipedia.org/wiki/Asparagus",
    rarity: 2,
  },
  {
    id: "19",
    name: "Rhubarb",
    months: [3, 4, 5],
    best_months: [3, 4],
    selection_guide: "Firm, crisp stalks. Avoid limp or rubbery ones.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Rhubarb",
    rarity: 2,
  },

  // --- Fruiting Vegetables ---
  {
    id: "6",
    name: "Tomato",
    months: [3, 4, 5, 6, 7, 8, 9, 10],
    best_months: [6, 7, 8],
    selection_guide:
      "Fragrant, rich color, slightly yielding to pressure. Heavy for size.",
    emoji: "🍅",
    wikipedia_url: "https://en.wikipedia.org/wiki/Tomato",
    rarity: 1,
  },
  {
    id: "7",
    name: "Cucumber",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    best_months: [6, 7, 8],
    selection_guide:
      "Firm along entire length. Avoid shriveled ends or soft spots.",
    emoji: "🥒",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cucumber",
    rarity: 1,
  },
  {
    id: "12",
    name: "Pepper",
    months: [6, 7, 8, 9, 10],
    selection_guide: "Glossy, taut skin, firm stem. Heavy for size.",
    emoji: "🫑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bell_pepper",
    rarity: 1,
  },
  {
    id: "39",
    name: "Eggplant",
    months: [7, 8, 9],
    selection_guide:
      "Shiny, smooth skin. Firm but bounces back slightly when pressed. Heavy.",
    emoji: "🍆",
    wikipedia_url: "https://en.wikipedia.org/wiki/Eggplant",
    rarity: 1,
  },
  {
    id: "11",
    name: "Zucchini",
    months: [5, 6, 7, 8, 9],
    best_months: [6, 7, 8],
    selection_guide: "Small to medium size, shiny skin. Avoid soft spots.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Zucchini",
    rarity: 1,
  },
  {
    id: "3",
    name: "Pumpkin",
    months: [0, 1, 8, 9, 10, 11],
    selection_guide:
      "Hard rind (cannot be punctured with a fingernail), hollow sound when tapped. Stem should be dry.",
    emoji: "🎃",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pumpkin",
    rarity: 2,
  },
  {
    id: "70",
    name: "Corn",
    months: [7, 8, 9],
    best_months: [7, 8],
    selection_guide:
      "Bright green husk, golden silk (not dried black). Kernels should look plump and release milky juice when punctured.",
    emoji: "🌽",
    wikipedia_url: "https://en.wikipedia.org/wiki/Sweet_corn",
    rarity: 1,
  },
  {
    id: "13",
    name: "Beans (Broad)",
    months: [5, 6],
    best_months: [5],
    selection_guide:
      "Pods should be green and filled, but not bulging excessively (indicates old/hard beans).",
    emoji: "🫘",
    wikipedia_url: "https://en.wikipedia.org/wiki/Vicia_faba",
    rarity: 2,
  },
  {
    id: "14",
    name: "Beans (Green)",
    months: [6, 7, 8],
    selection_guide:
      "Bright color, snaps easily when bent. Avoid tough or stringy pods.",
    emoji: "🫘",
    wikipedia_url: "https://en.wikipedia.org/wiki/Green_bean",
    rarity: 1,
  },

  // --- Local Fruits ---
  {
    id: "22",
    name: "Apples",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [8, 9, 10],
    selection_guide: "Firm, unbruised, skin should be tight not wrinkled.",
    emoji: "🍎",
    wikipedia_url: "https://en.wikipedia.org/wiki/Apple",
    rarity: 1,
  },
  {
    id: "23",
    name: "Pears",
    months: [0, 1, 2, 7, 8, 9, 10, 11],
    selection_guide:
      "Check the neck: if it yields to gentle pressure, it is ripe. Body can be firm.",
    emoji: "🍐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pear",
    rarity: 1,
  },
  {
    id: "24",
    name: "Plums",
    months: [6, 7, 8, 9],
    selection_guide:
      "Slightly soft at the tip, rich color, dusty bloom on skin is good.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Plum",
    rarity: 1,
  },
  {
    id: "25",
    name: "Cherries (Sweet)",
    months: [5, 6],
    selection_guide:
      "Green, flexible stems. Fruit should be shiny, plump and dark.",
    emoji: "🍒",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cherry",
    rarity: 1,
  },
  {
    id: "21",
    name: "Strawberries",
    months: [4, 5, 6, 7, 8],
    best_months: [5, 6],
    selection_guide:
      "Bright red all over, fresh green cap, strong sweet smell. Avoid white shoulders.",
    emoji: "🍓",
    wikipedia_url: "https://en.wikipedia.org/wiki/Strawberry",
    rarity: 1,
  },
  {
    id: "27",
    name: "Raspberries",
    months: [5, 6, 7, 8, 9],
    selection_guide:
      "Dry, plump, bright color. Check container bottom for juice (sign of crushing).",
    wikipedia_url: "https://en.wikipedia.org/wiki/Raspberry",
    rarity: 1,
  },
  {
    id: "28",
    name: "Blueberries",
    months: [6, 7, 8],
    selection_guide:
      "Firm, dusty blue color (bloom). Avoid soft or shriveled berries.",
    emoji: "🫐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Blueberry",
    rarity: 1,
  },
  {
    id: "63",
    name: "Wild Strawberries",
    months: [5, 6, 7],
    selection_guide:
      "Intense aroma is key. Very delicate, buy only if dry and not squashed.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Fragaria_vesca",
    rarity: 5,
  },
  {
    id: "41",
    name: "Wild Bilberries",
    months: [5, 6],
    selection_guide:
      "Dark, almost black, distinct aroma. Will stain hands. Must be dry.",
    emoji: "🫐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bilberry",
    rarity: 4,
  },
  {
    id: "32",
    name: "Grapes (Local)",
    months: [8, 9],
    selection_guide:
      "Plump, firmly attached to green stems. Avoid wrinkled berries.",
    emoji: "🍇",
    wikipedia_url: "https://en.wikipedia.org/wiki/Grape",
    rarity: 4,
  },

  // --- Imported Seasonal Fruits ---
  {
    id: "71",
    name: "Watermelon",
    months: [5, 6, 7, 8],
    best_months: [6, 7],
    selection_guide:
      "Heavy for size, hollow sound when tapped. Look for a creamy yellow spot (field spot) where it sat on ground.",
    emoji: "🍉",
    wikipedia_url: "https://en.wikipedia.org/wiki/Watermelon",
    rarity: 1,
  },
  {
    id: "72",
    name: "Melon (Cantaloupe/Honeydew)",
    months: [5, 6, 7, 8, 9],
    selection_guide:
      "Sweet fragrance at the stem end. Slightly soft at the blossom end (opposite stem).",
    emoji: "🍈",
    wikipedia_url: "https://en.wikipedia.org/wiki/Melon",
    rarity: 1,
  },
  {
    id: "73",
    name: "Orange",
    months: [0, 1, 2, 10, 11],
    best_months: [11, 0, 1],
    selection_guide:
      "Heavy for its size (means juicy). Firm, finely textured skin.",
    emoji: "🍊",
    wikipedia_url: "https://en.wikipedia.org/wiki/Orange_(fruit)",
    rarity: 1,
  },
  {
    id: "74",
    name: "Tangerine/Clementine",
    months: [0, 1, 10, 11],
    best_months: [11, 0],
    selection_guide:
      "Bright orange, skin feels slightly loose (easy to peel) but fruit should be heavy.",
    emoji: "🍊",
    wikipedia_url: "https://en.wikipedia.org/wiki/Tangerine",
    rarity: 1,
  },
  {
    id: "75",
    name: "Lemon",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [11, 0, 1, 2],
    selection_guide: "Bright yellow, heavy. Thin-skinned lemons are juicier.",
    emoji: "🍋",
    wikipedia_url: "https://en.wikipedia.org/wiki/Lemon",
    rarity: 1,
  },
  {
    id: "76",
    name: "Grapefruit",
    months: [0, 1, 2, 3, 4, 10, 11],
    best_months: [0, 1, 2],
    selection_guide:
      "Heavy for size, firm but slightly springy. Flat ends usually indicate good ripeness.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Grapefruit",
    rarity: 1,
  },
  {
    id: "77",
    name: "Pomegranate",
    months: [0, 9, 10, 11],
    best_months: [10, 11],
    selection_guide:
      "Heavy, angular shape (not perfectly round means seeds are full), dark red skin.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pomegranate",
    rarity: 1,
  },
  {
    id: "78",
    name: "Persimmon (Kaki)",
    months: [0, 9, 10, 11],
    best_months: [10, 11],
    selection_guide:
      "Bright orange. 'Sharon' variety can be eaten hard, standard Kaki must be jelly-soft to avoid astringency.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Persimmon",
    rarity: 1,
  },
  {
    id: "79",
    name: "Fig",
    months: [7, 8, 9, 10],
    selection_guide:
      "Soft to touch, neck should droop. Small splits in skin indicate peak ripeness.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Fig",
    rarity: 2,
  },
  {
    id: "80",
    name: "Nectarine/Peach (Imported)",
    months: [5, 6, 7, 8, 9],
    best_months: [6, 7, 8],
    selection_guide:
      "Vibrant color (ignore red blush, look at background color - should be yellow not green). Slight give along the seam.",
    emoji: "🍑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Peach",
    rarity: 1,
  },
  {
    id: "81",
    name: "Kiwi",
    months: [0, 1, 2, 3, 10, 11],
    selection_guide:
      "Yields to gentle thumb pressure. Avoid rock hard (unripe) or mushy (overripe).",
    emoji: "🥝",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kiwifruit",
    rarity: 1,
  },
  {
    id: "82",
    name: "Avocado",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Hass: Dark skin, yields gently to pressure. Green skins: Firm but not rock hard, skin stays green.",
    emoji: "🥑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Avocado",
    rarity: 1,
  },
  {
    id: "83",
    name: "Mango",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [11, 0, 1],
    selection_guide:
      "Slightly soft to touch, fruity aroma at stem. Color is not a reliable indicator of ripeness.",
    emoji: "🥭",
    wikipedia_url: "https://en.wikipedia.org/wiki/Mango",
    rarity: 1,
  },
];
