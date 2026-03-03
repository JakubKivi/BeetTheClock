import { Produce } from "../types";

export const PRODUCE_DATA: Produce[] = [
  // --- Root Vegetables & Tubers ---
  {
    id: "1",
    name: "Beetroot",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // Young beets (botwinka) in June
    best_months: [5, 6],
    selection_guide:
      "Firm, smooth skin, intact taproot. For greens attached, leaves should be fresh not wilted.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Beetroot",
  },
  {
    id: "4",
    name: "Carrot",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // Young carrots
    best_months: [5, 6, 7],
    selection_guide:
      "Firm, bright orange, smooth skin. Avoid cracks or rubbery texture.",
    emoji: "🥕",
    wikipedia_url: "https://en.wikipedia.org/wiki/Carrot",
  },
  {
    id: "34",
    name: "Celery Root",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Heavy for its size, firm, no soft spots. Smaller roots tend to be less woody.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Celeriac",
  },
  {
    id: "35",
    name: "Parsley Root",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide: "Firm, white/beige skin. Avoid rusty spots or limp roots.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Parsley#Root_parsley",
  },
  {
    id: "5",
    name: "Potato",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // New potatoes (Młode ziemniaki)
    best_months: [5, 6],
    selection_guide:
      "Firm, smooth skin, no green tints or sprouts. New potatoes should have flaky skin.",
    emoji: "🥔",
    wikipedia_url: "https://en.wikipedia.org/wiki/Potato",
  },
  {
    id: "45",
    name: "Parsnip",
    months: [0, 1, 2, 9, 10, 11],
    selection_guide:
      "Firm, ivory color. Avoid very large roots as they can be woody cores.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Parsnip",
  },
  {
    id: "49",
    name: "Jerusalem Artichoke",
    months: [0, 1, 2, 9, 10, 11],
    selection_guide:
      "Firm, not shriveled. Knobby is normal, but avoid soft spots/mold.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Jerusalem_artichoke",
  },
  {
    id: "51",
    name: "Horseradish",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide: "Very hard and firm. Avoid shriveled roots or soft ends.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Horseradish",
  },
  {
    id: "8",
    name: "Radish",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    // Spring and Autumn harvest is less spicy and woody than summer
    best_months: [3, 4, 8, 9],
    selection_guide:
      "Firm, smooth, bright color. If leaves are attached, they should be green and crisp.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Radish",
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
  },
  {
    id: "20b",
    name: "Garlic",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Firm, tight skin, heavy for size. Avoid if cloves feel hollow or soft.",
    emoji: "🧄",
    wikipedia_url: "https://en.wikipedia.org/wiki/Garlic",
  },
  {
    id: "36",
    name: "Leek",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Crisp white and light green parts. Avoid yellowing or slimy leaves.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Leek",
  },
  {
    id: "52",
    name: "Spring Onion",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    selection_guide: "Bright green, crisp stalks. Avoid slimy or wilting tips.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Scallion",
  },

  // --- Brassicas & Leafy Greens ---
  {
    id: "15",
    name: "Cabbage (White)",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // Young cabbage
    best_months: [4, 5, 6],
    selection_guide:
      "Heavy for size, tight leaves. Young cabbage is looser and greener.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cabbage",
  },
  {
    id: "16",
    name: "Brussels Sprouts",
    months: [0, 1, 9, 10, 11],
    // Frost sweetens them
    best_months: [10, 11, 0],
    selection_guide:
      "Tight, small, bright green heads. Avoid yellow leaves or loose structure.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Brussels_sprout",
  },
  {
    id: "9",
    name: "Cauliflower",
    months: [4, 5, 6, 7, 8, 9, 10],
    selection_guide:
      "Compact, creamy white curds. No dark spots. Leaves should be fresh green.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cauliflower",
  },
  {
    id: "10",
    name: "Broccoli",
    months: [5, 6, 7, 8, 9, 10],
    selection_guide:
      "Firm stalks, tight dark green florets. Avoid yellowing buds.",
    emoji: "🥦",
    wikipedia_url: "https://en.wikipedia.org/wiki/Broccoli",
  },
  {
    id: "37",
    name: "Kohlrabi",
    months: [4, 5, 6, 7, 8, 9],
    // Smaller ones are less woody
    best_months: [4, 5, 8, 9],
    selection_guide:
      "Small to medium size (tennis ball). Heavy and firm. Large ones can be woody inside.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kohlrabi",
  },
  {
    id: "17",
    name: "Kale",
    months: [0, 1, 2, 7, 8, 9, 10, 11],
    // Sweetens after frost
    best_months: [10, 11, 0, 1],
    selection_guide: "Dark green, crisp leaves. Avoid yellow or mushy spots.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kale",
  },
  {
    id: "18",
    name: "Spinach",
    months: [2, 3, 4, 5, 7, 8, 9, 10],
    selection_guide:
      "Vibrant green, fresh looking. Avoid slimy or wilted leaves.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Spinach",
  },
  {
    id: "2",
    name: "Asparagus",
    months: [4, 5],
    selection_guide:
      "Firm, straight stalks with closed, tight tips. Ends should be moist, not dry.",
    emoji: "bi-flower3",
    wikipedia_url: "https://en.wikipedia.org/wiki/Asparagus",
  },
  {
    id: "19",
    name: "Rhubarb",
    months: [3, 4, 5],
    // Young stalks are less fibrous
    best_months: [3, 4],
    selection_guide: "Firm, crisp stalks. Avoid limp or rubbery ones.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Rhubarb",
  },

  // --- Fruiting Vegetables ---
  {
    id: "6",
    name: "Tomato",
    months: [3, 4, 5, 6, 7, 8, 9, 10],
    // Field grown / full sun season
    best_months: [6, 7, 8],
    selection_guide:
      "Fragrant, rich color, slightly yielding to pressure. Heavy for size.",
    emoji: "🍅",
    wikipedia_url: "https://en.wikipedia.org/wiki/Tomato",
  },
  {
    id: "7",
    name: "Cucumber",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    // Field grown (Ground cucumbers)
    best_months: [6, 7, 8],
    selection_guide:
      "Firm along entire length. Avoid shriveled ends or soft spots.",
    emoji: "🥒",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cucumber",
  },
  {
    id: "12",
    name: "Pepper",
    months: [6, 7, 8, 9, 10],
    selection_guide: "Glossy, taut skin, firm stem. Heavy for size.",
    emoji: "🫑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bell_pepper",
  },
  {
    id: "39",
    name: "Eggplant",
    months: [7, 8, 9],
    selection_guide:
      "Shiny, smooth skin. Firm but bounces back slightly when pressed. Heavy.",
    emoji: "🍆",
    wikipedia_url: "https://en.wikipedia.org/wiki/Eggplant",
  },
  {
    id: "11",
    name: "Zucchini",
    months: [5, 6, 7, 8, 9],
    // Smaller ones are tastier/less watery
    best_months: [6, 7, 8],
    selection_guide: "Small to medium size, shiny skin. Avoid soft spots.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Zucchini",
  },
  {
    id: "3",
    name: "Pumpkin",
    months: [0, 1, 8, 9, 10, 11],
    selection_guide:
      "Hard rind (cannot be punctured with a fingernail), hollow sound when tapped. Stem should be dry.",
    emoji: "🎃",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pumpkin",
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
  },
  {
    id: "13",
    name: "Beans (Broad)",
    months: [5, 6],
    // Early beans are sweet and tender, late ones have thick skin
    best_months: [5],
    selection_guide:
      "Pods should be green and filled, but not bulging excessively (indicates old/hard beans).",
    emoji: "🫘",
    wikipedia_url: "https://en.wikipedia.org/wiki/Vicia_faba",
  },
  {
    id: "14",
    name: "Beans (Green)",
    months: [6, 7, 8],
    selection_guide:
      "Bright color, snaps easily when bent. Avoid tough or stringy pods.",
    emoji: "🫘",
    wikipedia_url: "https://en.wikipedia.org/wiki/Green_bean",
  },

  // --- Local Fruits ---
  {
    id: "22",
    name: "Apples",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // Fresh harvest
    best_months: [8, 9, 10],
    selection_guide: "Firm, unbruised, skin should be tight not wrinkled.",
    emoji: "🍎",
    wikipedia_url: "https://en.wikipedia.org/wiki/Apple",
  },
  {
    id: "23",
    name: "Pears",
    months: [0, 1, 2, 7, 8, 9, 10, 11],
    selection_guide:
      "Check the neck: if it yields to gentle pressure, it is ripe. Body can be firm.",
    emoji: "🍐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pear",
  },
  {
    id: "24",
    name: "Plums",
    months: [6, 7, 8, 9],
    selection_guide:
      "Slightly soft at the tip, rich color, dusty bloom on skin is good.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Plum",
  },
  {
    id: "25",
    name: "Cherries (Sweet)",
    months: [5, 6],
    selection_guide:
      "Green, flexible stems. Fruit should be shiny, plump and dark.",
    emoji: "🍒",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cherry",
  },
  {
    id: "21",
    name: "Strawberries",
    months: [4, 5, 6, 7, 8],
    // Main field season
    best_months: [5, 6],
    selection_guide:
      "Bright red all over, fresh green cap, strong sweet smell. Avoid white shoulders.",
    emoji: "🍓",
    wikipedia_url: "https://en.wikipedia.org/wiki/Strawberry",
  },
  {
    id: "27",
    name: "Raspberries",
    months: [5, 6, 7, 8, 9],
    selection_guide:
      "Dry, plump, bright color. Check container bottom for juice (sign of crushing).",
    wikipedia_url: "https://en.wikipedia.org/wiki/Raspberry",
  },
  {
    id: "28",
    name: "Blueberries",
    months: [6, 7, 8],
    selection_guide:
      "Firm, dusty blue color (bloom). Avoid soft or shriveled berries.",
    emoji: "🫐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Blueberry",
  },
  {
    id: "63",
    name: "Wild Strawberries",
    months: [5, 6, 7],
    selection_guide:
      "Intense aroma is key. Very delicate, buy only if dry and not squashed.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Fragaria_vesca",
  },
  {
    id: "41",
    name: "Wild Bilberries",
    months: [5, 6],
    selection_guide:
      "Dark, almost black, distinct aroma. Will stain hands. Must be dry.",
    emoji: "🫐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bilberry",
  },
  {
    id: "32",
    name: "Grapes (Local)",
    months: [8, 9],
    selection_guide:
      "Plump, firmly attached to green stems. Avoid wrinkled berries.",
    emoji: "🍇",
    wikipedia_url: "https://en.wikipedia.org/wiki/Grape",
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
  },
  {
    id: "72",
    name: "Melon (Cantaloupe/Honeydew)",
    months: [5, 6, 7, 8, 9],
    selection_guide:
      "Sweet fragrance at the stem end. Slightly soft at the blossom end (opposite stem).",
    emoji: "🍈",
    wikipedia_url: "https://en.wikipedia.org/wiki/Melon",
  },
  {
    id: "73",
    name: "Orange",
    months: [0, 1, 2, 10, 11],
    // Peak winter season
    best_months: [11, 0, 1],
    selection_guide:
      "Heavy for its size (means juicy). Firm, finely textured skin.",
    emoji: "🍊",
    wikipedia_url: "https://en.wikipedia.org/wiki/Orange_(fruit)",
  },
  {
    id: "74",
    name: "Tangerine/Clementine",
    months: [0, 1, 10, 11],
    // Christmas season
    best_months: [11, 0],
    selection_guide:
      "Bright orange, skin feels slightly loose (easy to peel) but fruit should be heavy.",
    emoji: "🍊",
    wikipedia_url: "https://en.wikipedia.org/wiki/Tangerine",
  },
  {
    id: "75",
    name: "Lemon",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // Winter lemons are best
    best_months: [11, 0, 1, 2],
    selection_guide: "Bright yellow, heavy. Thin-skinned lemons are juicier.",
    emoji: "🍋",
    wikipedia_url: "https://en.wikipedia.org/wiki/Lemon",
  },
  {
    id: "76",
    name: "Grapefruit",
    months: [0, 1, 2, 3, 4, 10, 11],
    best_months: [0, 1, 2],
    selection_guide:
      "Heavy for size, firm but slightly springy. Flat ends usually indicate good ripeness.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Grapefruit",
  },
  {
    id: "77",
    name: "Pomegranate",
    months: [0, 9, 10, 11],
    best_months: [10, 11],
    selection_guide:
      "Heavy, angular shape (not perfectly round means seeds are full), dark red skin.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pomegranate",
  },
  {
    id: "78",
    name: "Persimmon (Kaki)",
    months: [0, 9, 10, 11],
    best_months: [10, 11],
    selection_guide:
      "Bright orange. 'Sharon' variety can be eaten hard, standard Kaki must be jelly-soft to avoid astringency.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Persimmon",
  },
  {
    id: "79",
    name: "Fig",
    months: [7, 8, 9, 10],
    selection_guide:
      "Soft to touch, neck should droop. Small splits in skin indicate peak ripeness.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Fig",
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
  },
  {
    id: "81",
    name: "Kiwi",
    months: [0, 1, 2, 3, 10, 11],
    selection_guide:
      "Yields to gentle thumb pressure. Avoid rock hard (unripe) or mushy (overripe).",
    emoji: "🥝",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kiwifruit",
  },
  {
    id: "82",
    name: "Avocado",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Hass: Dark skin, yields gently to pressure. Green skins: Firm but not rock hard, skin stays green.",
    emoji: "🥑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Avocado",
  },
  {
    id: "83",
    name: "Mango",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    // Winter (Peru imports) often best in PL
    best_months: [11, 0, 1],
    selection_guide:
      "Slightly soft to touch, fruity aroma at stem. Color is not a reliable indicator of ripeness.",
    emoji: "🥭",
    wikipedia_url: "https://en.wikipedia.org/wiki/Mango",
  },
];
