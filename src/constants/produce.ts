import { Produce } from "../types";

export const RARITY_LEVELS: Record<
  1 | 2 | 3 | 4 | 5,
  { label: string; pl_label: string; color: string; emoji: string }
> = {
  1: { label: "Common", pl_label: "Powszechny", color: "#808080", emoji: "⚪" },
  2: {
    label: "Uncommon",
    pl_label: "Niezwykły",
    color: "#00AA00",
    emoji: "🟢",
  },
  3: { label: "Rare", pl_label: "Rzadki", color: "#0055FF", emoji: "🔵" },
  4: { label: "Epic", pl_label: "Epicki", color: "#AA00FF", emoji: "🟣" },
  5: {
    label: "Legendary",
    pl_label: "Legendarny",
    color: "#FFAA00",
    emoji: "🟡",
  },
};

export const getRarityInfo = (rarity: 1 | 2 | 3 | 4 | 5) =>
  RARITY_LEVELS[rarity];

export const PRODUCE_DATA: Produce[] = [
  // --- Root Vegetables & Tubers ---
  {
    id: "1",
    name: "Beetroot",
    pl_name: "Burak",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [5, 6],
    selection_guide:
      "Firm, smooth skin, intact taproot. For greens attached, leaves should be fresh not wilted.",
    pl_selection_guide:
      "Twarda, gładka skórka, nienaruszony korzeń główny. Jeśli ma liście, powinny być świeże, a nie zwiędnięte.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Beetroot",
    rarity: 1,
  },
  {
    id: "4",
    name: "Carrot",
    pl_name: "Marchew",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [5, 6, 7],
    selection_guide:
      "Firm, bright orange, smooth skin. Avoid cracks or rubbery texture.",
    pl_selection_guide:
      "Twarda, jasnopomarańczowa, gładka skórka. Unikaj pęknięć i gumowatej konsystencji.",
    emoji: "🥕",
    wikipedia_url: "https://en.wikipedia.org/wiki/Carrot",
    rarity: 1,
  },
  {
    id: "34",
    name: "Celery Root",
    pl_name: "Seler korzeniowy",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Heavy for its size, firm, no soft spots. Smaller roots tend to be less woody.",
    pl_selection_guide:
      "Ciężki jak na swój rozmiar, twardy, bez miękkich plam. Mniejsze korzenie są zazwyczaj mniej zdrewniałe.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Celeriac",
    rarity: 1,
  },
  {
    id: "35",
    name: "Parsley Root",
    pl_name: "Pietruszka korzeniowa",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide: "Firm, white/beige skin. Avoid rusty spots or limp roots.",
    pl_selection_guide:
      "Twarda, biała/beżowa skórka. Unikaj rdzawych plam i wiotkich korzeni.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Parsley#Root_parsley",
    rarity: 1,
  },
  {
    id: "5",
    name: "Potato",
    pl_name: "Ziemniak",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [5, 6],
    selection_guide:
      "Firm, smooth skin, no green tints or sprouts. New potatoes should have flaky skin.",
    pl_selection_guide:
      "Twarda, gładka skórka, bez zielonych odcieni i kiełków. Młode ziemniaki powinny mieć łuszczącą się skórkę.",
    emoji: "🥔",
    wikipedia_url: "https://en.wikipedia.org/wiki/Potato",
    rarity: 1,
  },
  {
    id: "45",
    name: "Parsnip",
    pl_name: "Pasternak",
    months: [0, 1, 2, 9, 10, 11],
    selection_guide:
      "Firm, ivory color. Avoid very large roots as they can be woody cores.",
    pl_selection_guide:
      "Twardy, w kolorze kości słoniowej. Unikaj bardzo dużych korzeni, ponieważ mogą mieć zdrewniały środek.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Parsnip",
    rarity: 3,
  },
  {
    id: "49",
    name: "Jerusalem Artichoke",
    pl_name: "Topinambur",
    months: [0, 1, 2, 9, 10, 11],
    selection_guide:
      "Firm, not shriveled. Knobby is normal, but avoid soft spots/mold.",
    pl_selection_guide:
      "Twardy, niepomarszczony. Guzkowaty kształt to norma, ale unikaj miękkich plam i pleśni.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Jerusalem_artichoke",
    rarity: 4,
  },
  {
    id: "51",
    name: "Horseradish",
    pl_name: "Chrzan",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide: "Very hard and firm. Avoid shriveled roots or soft ends.",
    pl_selection_guide:
      "Bardzo twardy i jędrny. Unikaj pomarszczonych korzeni lub miękkich końcówek.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Horseradish",
    rarity: 2,
  },
  {
    id: "8",
    name: "Radish",
    pl_name: "Rzodkiewka",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    best_months: [3, 4, 8, 9],
    selection_guide:
      "Firm, smooth, bright color. If leaves are attached, they should be green and crisp.",
    pl_selection_guide:
      "Twarda, gładka, o jasnym kolorze. Jeśli ma liście, powinny być zielone i chrupiące.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Radish",
    rarity: 1,
  },

  // --- Alliums ---
  {
    id: "20",
    name: "Onion",
    pl_name: "Cebula",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Hard, dry, papery skin. Avoid sprouting necks or soft spots.",
    pl_selection_guide:
      "Twarda, sucha, papierowa skórka. Unikaj kiełkujących końcówek i miękkich plam.",
    emoji: "🧅",
    wikipedia_url: "https://en.wikipedia.org/wiki/Onion",
    rarity: 1,
  },
  {
    id: "20b",
    name: "Garlic",
    pl_name: "Czosnek",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Firm, tight skin, heavy for size. Avoid if cloves feel hollow or soft.",
    pl_selection_guide:
      "Twarda, ciasna skórka, ciężki jak na swój rozmiar. Unikaj główek z pustymi lub miękkimi ząbkami.",
    emoji: "🧄",
    wikipedia_url: "https://en.wikipedia.org/wiki/Garlic",
    rarity: 1,
  },
  {
    id: "36",
    name: "Leek",
    pl_name: "Por",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Crisp white and light green parts. Avoid yellowing or slimy leaves.",
    pl_selection_guide:
      "Chrupiące białe i jasnozielone części. Unikaj żółknących lub oślizgłych liści.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Leek",
    rarity: 1,
  },
  {
    id: "52",
    name: "Spring Onion",
    pl_name: "Dymka",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    selection_guide: "Bright green, crisp stalks. Avoid slimy or wilting tips.",
    pl_selection_guide:
      "Jasnozielone, chrupiące łodygi. Unikaj oślizgłych lub więdnących końcówek.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Scallion",
    rarity: 1,
  },

  // --- Brassicas & Leafy Greens ---
  {
    id: "15",
    name: "Cabbage (White)",
    pl_name: "Kapusta (Biała)",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [4, 5, 6],
    selection_guide:
      "Heavy for size, tight leaves. Young cabbage is looser and greener.",
    pl_selection_guide:
      "Ciężka jak na swój rozmiar, zwarte liście. Młoda kapusta jest luźniejsza i bardziej zielona.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cabbage",
    rarity: 1,
  },
  {
    id: "16",
    name: "Brussels Sprouts",
    pl_name: "Brukselka",
    months: [0, 1, 9, 10, 11],
    best_months: [10, 11, 0],
    selection_guide:
      "Tight, small, bright green heads. Avoid yellow leaves or loose structure.",
    pl_selection_guide:
      "Zwarte, małe, jasnozielone główki. Unikaj żółtych liści i luźnej struktury.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Brussels_sprout",
    rarity: 2,
  },
  {
    id: "9",
    name: "Cauliflower",
    pl_name: "Kalafior",
    months: [4, 5, 6, 7, 8, 9, 10],
    selection_guide:
      "Compact, creamy white curds. No dark spots. Leaves should be fresh green.",
    pl_selection_guide:
      "Zwarty, kremowobiały kwiatostan. Bez ciemnych plam. Liście powinny być świeżo zielone.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cauliflower",
    rarity: 1,
  },
  {
    id: "10",
    name: "Broccoli",
    pl_name: "Brokuł",
    months: [5, 6, 7, 8, 9, 10],
    selection_guide:
      "Firm stalks, tight dark green florets. Avoid yellowing buds.",
    pl_selection_guide:
      "Twarde łodygi, zwarte ciemnozielone różyczki. Unikaj żółknących pąków.",
    emoji: "🥦",
    wikipedia_url: "https://en.wikipedia.org/wiki/Broccoli",
    rarity: 1,
  },
  {
    id: "37",
    name: "Kohlrabi",
    pl_name: "Kalarepa",
    months: [4, 5, 6, 7, 8, 9],
    best_months: [4, 5, 8, 9],
    selection_guide:
      "Small to medium size (tennis ball). Heavy and firm. Large ones can be woody inside.",
    pl_selection_guide:
      "Mała do średniej wielkości (wielkość piłki tenisowej). Ciężka i twarda. Duże sztuki mogą być wewnątrz zdrewniałe.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kohlrabi",
    rarity: 1,
  },
  {
    id: "17",
    name: "Kale",
    pl_name: "Jarmuż",
    months: [0, 1, 2, 7, 8, 9, 10, 11],
    best_months: [10, 11, 0, 1],
    selection_guide: "Dark green, crisp leaves. Avoid yellow or mushy spots.",
    pl_selection_guide:
      "Ciemnozielone, chrupiące liście. Unikaj żółtych lub papkowatych miejsc.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kale",
    rarity: 1,
  },
  {
    id: "18",
    name: "Spinach",
    pl_name: "Szpinak",
    months: [2, 3, 4, 5, 7, 8, 9, 10],
    selection_guide:
      "Vibrant green, fresh looking. Avoid slimy or wilted leaves.",
    pl_selection_guide:
      "Żywo zielony, świeżo wyglądający. Unikaj oślizgłych lub zwiędniętych liści.",
    emoji: "🥬",
    wikipedia_url: "https://en.wikipedia.org/wiki/Spinach",
    rarity: 1,
  },
  {
    id: "2",
    name: "Asparagus",
    pl_name: "Szparagi",
    months: [4, 5],
    selection_guide:
      "Firm, straight stalks with closed, tight tips. Ends should be moist, not dry.",
    pl_selection_guide:
      "Twarde, proste łodygi z zamkniętymi, zwartymi główkami. Końcówki powinny być wilgotne, nie suche.",
    emoji: "bi",
    wikipedia_url: "https://en.wikipedia.org/wiki/Asparagus",
    rarity: 2,
  },
  {
    id: "19",
    name: "Rhubarb",
    pl_name: "Rabarbar",
    months: [3, 4, 5],
    best_months: [3, 4],
    selection_guide: "Firm, crisp stalks. Avoid limp or rubbery ones.",
    pl_selection_guide:
      "Twarde, chrupiące łodygi. Unikaj wiotkich lub gumowatych.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Rhubarb",
    rarity: 2,
  },

  // --- Fruiting Vegetables ---
  {
    id: "6",
    name: "Tomato",
    pl_name: "Pomidor",
    months: [3, 4, 5, 6, 7, 8, 9, 10],
    best_months: [6, 7, 8],
    selection_guide:
      "Fragrant, rich color, slightly yielding to pressure. Heavy for size.",
    pl_selection_guide:
      "Pachnący, o głębokim kolorze, lekko ustępujący pod naciskiem. Ciężki jak na swój rozmiar.",
    emoji: "🍅",
    wikipedia_url: "https://en.wikipedia.org/wiki/Tomato",
    rarity: 1,
  },
  {
    id: "7",
    name: "Cucumber",
    pl_name: "Ogórek",
    months: [2, 3, 4, 5, 6, 7, 8, 9],
    best_months: [6, 7, 8],
    selection_guide:
      "Firm along entire length. Avoid shriveled ends or soft spots.",
    pl_selection_guide:
      "Twardy na całej długości. Unikaj pomarszczonych końcówek i miękkich plam.",
    emoji: "🥒",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cucumber",
    rarity: 1,
  },
  {
    id: "12",
    name: "Pepper",
    pl_name: "Papryka",
    months: [6, 7, 8, 9, 10],
    selection_guide: "Glossy, taut skin, firm stem. Heavy for size.",
    pl_selection_guide:
      "Błyszcząca, napięta skórka, twarda szypułka. Ciężka jak na swój rozmiar.",
    emoji: "🫑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bell_pepper",
    rarity: 1,
  },
  {
    id: "39",
    name: "Eggplant",
    pl_name: "Bakłażan",
    months: [7, 8, 9],
    selection_guide:
      "Shiny, smooth skin. Firm but bounces back slightly when pressed. Heavy.",
    pl_selection_guide:
      "Błyszcząca, gładka skórka. Twardy, ale lekko sprężysty przy naciśnięciu. Ciężki.",
    emoji: "🍆",
    wikipedia_url: "https://en.wikipedia.org/wiki/Eggplant",
    rarity: 1,
  },
  {
    id: "11",
    name: "Zucchini",
    pl_name: "Cukinia",
    months: [5, 6, 7, 8, 9],
    best_months: [6, 7, 8],
    selection_guide: "Small to medium size, shiny skin. Avoid soft spots.",
    pl_selection_guide:
      "Mały do średniego rozmiaru, błyszcząca skórka. Unikaj miękkich plam.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Zucchini",
    rarity: 1,
  },
  {
    id: "3",
    name: "Pumpkin",
    pl_name: "Dynia",
    months: [0, 1, 8, 9, 10, 11],
    selection_guide:
      "Hard rind (cannot be punctured with a fingernail), hollow sound when tapped. Stem should be dry.",
    pl_selection_guide:
      "Twarda skóra (nie da się jej przebić paznokciem), głuchy dźwięk przy pukaniu. Łodyga powinna być sucha.",
    emoji: "🎃",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pumpkin",
    rarity: 2,
  },
  {
    id: "70",
    name: "Corn",
    pl_name: "Kukurydza",
    months: [7, 8, 9],
    best_months: [7, 8],
    selection_guide:
      "Bright green husk, golden silk (not dried black). Kernels should look plump and release milky juice when punctured.",
    pl_selection_guide:
      "Jasnozielone liście, złociste znamiona (nie suche i czarne). Ziarna powinny wyglądać na pękate i uwalniać mleczny sok po przekłuciu.",
    emoji: "🌽",
    wikipedia_url: "https://en.wikipedia.org/wiki/Sweet_corn",
    rarity: 1,
  },
  {
    id: "13",
    name: "Beans (Broad)",
    pl_name: "Bób",
    months: [5, 6],
    best_months: [5],
    selection_guide:
      "Pods should be green and filled, but not bulging excessively (indicates old/hard beans).",
    pl_selection_guide:
      "Strąki powinny być zielone i pełne, ale nie nadmiernie wybrzuszone (oznacza to stare/twarde nasiona).",
    emoji: "🫘",
    wikipedia_url: "https://en.wikipedia.org/wiki/Vicia_faba",
    rarity: 2,
  },
  {
    id: "14",
    name: "Beans (Green)",
    pl_name: "Fasolka szparagowa",
    months: [6, 7, 8],
    selection_guide:
      "Bright color, snaps easily when bent. Avoid tough or stringy pods.",
    pl_selection_guide:
      "Jasny kolor, łatwo pęka przy zginaniu. Unikaj twardych lub łykowatych strąków.",
    emoji: "🫘",
    wikipedia_url: "https://en.wikipedia.org/wiki/Green_bean",
    rarity: 1,
  },

  // --- Local Fruits ---
  {
    id: "22",
    name: "Apples",
    pl_name: "Jabłka",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [8, 9, 10],
    selection_guide: "Firm, unbruised, skin should be tight not wrinkled.",
    pl_selection_guide:
      "Twarde, bez obić, skórka powinna być napięta, nie pomarszczona.",
    emoji: "🍎",
    wikipedia_url: "https://en.wikipedia.org/wiki/Apple",
    rarity: 1,
  },
  {
    id: "23",
    name: "Pears",
    pl_name: "Gruszki",
    months: [0, 1, 2, 7, 8, 9, 10, 11],
    selection_guide:
      "Check the neck: if it yields to gentle pressure, it is ripe. Body can be firm.",
    pl_selection_guide:
      "Sprawdź szyjkę: jeśli ustępuje pod delikatnym naciskiem, jest dojrzała. Reszta owocu może być twarda.",
    emoji: "🍐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pear",
    rarity: 1,
  },
  {
    id: "24",
    name: "Plums",
    pl_name: "Śliwki",
    months: [6, 7, 8, 9],
    selection_guide:
      "Slightly soft at the tip, rich color, dusty bloom on skin is good.",
    pl_selection_guide:
      "Lekko miękkie na czubku, nasycony kolor, pożądany jest matowy nalot na skórce.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Plum",
    rarity: 1,
  },
  {
    id: "25",
    name: "Cherries (Sweet)",
    pl_name: "Czereśnie",
    months: [5, 6],
    selection_guide:
      "Green, flexible stems. Fruit should be shiny, plump and dark.",
    pl_selection_guide:
      "Zielone, elastyczne ogonki. Owoce powinny być błyszczące, pękate i ciemne.",
    emoji: "🍒",
    wikipedia_url: "https://en.wikipedia.org/wiki/Cherry",
    rarity: 1,
  },
  {
    id: "21",
    name: "Strawberries",
    pl_name: "Truskawki",
    months: [4, 5, 6, 7, 8],
    best_months: [5, 6],
    selection_guide:
      "Bright red all over, fresh green cap, strong sweet smell. Avoid white shoulders.",
    pl_selection_guide:
      "Całkowicie jaskrawoczerwone, świeża zielona szypułka, silny słodki zapach. Unikaj białych wierzchołków.",
    emoji: "🍓",
    wikipedia_url: "https://en.wikipedia.org/wiki/Strawberry",
    rarity: 1,
  },
  {
    id: "27",
    name: "Raspberries",
    pl_name: "Maliny",
    months: [5, 6, 7, 8, 9],
    selection_guide:
      "Dry, plump, bright color. Check container bottom for juice (sign of crushing).",
    pl_selection_guide:
      "Suche, pękate, jasny kolor. Sprawdź spód pojemnika pod kątem soku (oznaka zgniecenia).",
    wikipedia_url: "https://en.wikipedia.org/wiki/Raspberry",
    rarity: 1,
  },
  {
    id: "28",
    name: "Blueberries",
    pl_name: "Borówki",
    months: [6, 7, 8],
    selection_guide:
      "Firm, dusty blue color (bloom). Avoid soft or shriveled berries.",
    pl_selection_guide:
      "Twarde, o zakurzonym, niebieskim kolorze (nalot). Unikaj miękkich lub pomarszczonych jagód.",
    emoji: "🫐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Blueberry",
    rarity: 1,
  },
  {
    id: "63",
    name: "Wild Strawberries",
    pl_name: "Poziomki",
    months: [5, 6, 7],
    selection_guide:
      "Intense aroma is key. Very delicate, buy only if dry and not squashed.",
    pl_selection_guide:
      "Intensywny aromat to podstawa. Bardzo delikatne, kupuj tylko wtedy, gdy są suche i niezgniecione.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Fragaria_vesca",
    rarity: 5,
  },
  {
    id: "41",
    name: "Wild Bilberries",
    pl_name: "Jagody (Leśne)",
    months: [5, 6],
    selection_guide:
      "Dark, almost black, distinct aroma. Will stain hands. Must be dry.",
    pl_selection_guide:
      "Ciemne, prawie czarne, wyraźny aromat. Brudzą dłonie. Muszą być suche.",
    emoji: "🫐",
    wikipedia_url: "https://en.wikipedia.org/wiki/Bilberry",
    rarity: 4,
  },
  {
    id: "32",
    name: "Grapes (Local)",
    pl_name: "Winogrona (Lokalne)",
    months: [8, 9],
    selection_guide:
      "Plump, firmly attached to green stems. Avoid wrinkled berries.",
    pl_selection_guide:
      "Pękate, mocno osadzone na zielonych gałązkach. Unikaj pomarszczonych owoców.",
    emoji: "🍇",
    wikipedia_url: "https://en.wikipedia.org/wiki/Grape",
    rarity: 4,
  },

  // --- Imported Seasonal Fruits ---
  {
    id: "71",
    name: "Watermelon",
    pl_name: "Arbuz",
    months: [5, 6, 7, 8],
    best_months: [6, 7],
    selection_guide:
      "Heavy for size, hollow sound when tapped. Look for a creamy yellow spot (field spot) where it sat on ground.",
    pl_selection_guide:
      "Ciężki jak na swój rozmiar, głuchy dźwięk przy pukaniu. Szukaj kremowo-żółtej plamy w miejscu, gdzie leżał na ziemi.",
    emoji: "🍉",
    wikipedia_url: "https://en.wikipedia.org/wiki/Watermelon",
    rarity: 1,
  },
  {
    id: "72",
    name: "Melon (Cantaloupe/Honeydew)",
    pl_name: "Melon",
    months: [5, 6, 7, 8, 9],
    selection_guide:
      "Sweet fragrance at the stem end. Slightly soft at the blossom end (opposite stem).",
    pl_selection_guide:
      "Słodki zapach od strony łodygi. Lekko miękki po stronie kwiatu (przeciwnej do łodygi).",
    emoji: "🍈",
    wikipedia_url: "https://en.wikipedia.org/wiki/Melon",
    rarity: 1,
  },
  {
    id: "73",
    name: "Orange",
    pl_name: "Pomarańcza",
    months: [0, 1, 2, 10, 11],
    best_months: [11, 0, 1],
    selection_guide:
      "Heavy for its size (means juicy). Firm, finely textured skin.",
    pl_selection_guide:
      "Ciężka jak na swój rozmiar (oznacza to, że jest soczysta). Twarda, drobnoziarnista skórka.",
    emoji: "🍊",
    wikipedia_url: "https://en.wikipedia.org/wiki/Orange_(fruit)",
    rarity: 1,
  },
  {
    id: "74",
    name: "Tangerine/Clementine",
    pl_name: "Mandarynka / Klementynka",
    months: [0, 1, 10, 11],
    best_months: [11, 0],
    selection_guide:
      "Bright orange, skin feels slightly loose (easy to peel) but fruit should be heavy.",
    pl_selection_guide:
      "Jasnopomarańczowa, skórka wydaje się lekko luźna (łatwa do obrania), ale owoc powinien być ciężki.",
    emoji: "🍊",
    wikipedia_url: "https://en.wikipedia.org/wiki/Tangerine",
    rarity: 1,
  },
  {
    id: "75",
    name: "Lemon",
    pl_name: "Cytryna",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [11, 0, 1, 2],
    selection_guide: "Bright yellow, heavy. Thin-skinned lemons are juicier.",
    pl_selection_guide:
      "Jasnożółta, ciężka. Cytryny o cienkiej skórce są bardziej soczyste.",
    emoji: "🍋",
    wikipedia_url: "https://en.wikipedia.org/wiki/Lemon",
    rarity: 1,
  },
  {
    id: "76",
    name: "Grapefruit",
    pl_name: "Grejpfrut",
    months: [0, 1, 2, 3, 4, 10, 11],
    best_months: [0, 1, 2],
    selection_guide:
      "Heavy for size, firm but slightly springy. Flat ends usually indicate good ripeness.",
    pl_selection_guide:
      "Ciężki jak na swój rozmiar, twardy, ale lekko sprężysty. Płaskie końce zazwyczaj oznaczają dobrą dojrzałość.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Grapefruit",
    rarity: 1,
  },
  {
    id: "77",
    name: "Pomegranate",
    pl_name: "Granat",
    months: [0, 9, 10, 11],
    best_months: [10, 11],
    selection_guide:
      "Heavy, angular shape (not perfectly round means seeds are full), dark red skin.",
    pl_selection_guide:
      "Ciężki, kanciasty kształt (nie do końca okrągły oznacza, że nasiona są pełne), ciemnoczerwona skórka.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Pomegranate",
    rarity: 1,
  },
  {
    id: "78",
    name: "Persimmon (Kaki)",
    pl_name: "Kaki (Persymona)",
    months: [0, 9, 10, 11],
    best_months: [10, 11],
    selection_guide:
      "Bright orange. 'Sharon' variety can be eaten hard, standard Kaki must be jelly-soft to avoid astringency.",
    pl_selection_guide:
      "Jasnopomarańczowe. Odmianę 'Sharon' można jeść twardą, standardowe Kaki musi być miękkie jak galaretka, aby uniknąć cierpkości.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Persimmon",
    rarity: 1,
  },
  {
    id: "79",
    name: "Fig",
    pl_name: "Figa",
    months: [7, 8, 9, 10],
    selection_guide:
      "Soft to touch, neck should droop. Small splits in skin indicate peak ripeness.",
    pl_selection_guide:
      "Miękka w dotyku, szyjka powinna opadać. Małe pęknięcia na skórce wskazują na szczytową dojrzałość.",
    wikipedia_url: "https://en.wikipedia.org/wiki/Fig",
    rarity: 2,
  },
  {
    id: "80",
    name: "Nectarine/Peach (Imported)",
    pl_name: "Nektarynka / Brzoskwinia (Importowana)",
    months: [5, 6, 7, 8, 9],
    best_months: [6, 7, 8],
    selection_guide:
      "Vibrant color (ignore red blush, look at background color - should be yellow not green). Slight give along the seam.",
    pl_selection_guide:
      "Żywy kolor (zignoruj czerwony rumieniec, spójrz na kolor tła - powinien być żółty, nie zielony). Lekko ustępuje wzdłuż szwu.",
    emoji: "🍑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Peach",
    rarity: 1,
  },
  {
    id: "81",
    name: "Kiwi",
    pl_name: "Kiwi",
    months: [0, 1, 2, 3, 10, 11],
    selection_guide:
      "Yields to gentle thumb pressure. Avoid rock hard (unripe) or mushy (overripe).",
    pl_selection_guide:
      "Ustępuje pod delikatnym naciskiem kciuka. Unikaj twardych jak kamień (niedojrzałych) lub papkowatych (przejrzałych).",
    emoji: "🥝",
    wikipedia_url: "https://en.wikipedia.org/wiki/Kiwifruit",
    rarity: 1,
  },
  {
    id: "82",
    name: "Avocado",
    pl_name: "Awokado",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    selection_guide:
      "Hass: Dark skin, yields gently to pressure. Green skins: Firm but not rock hard, skin stays green.",
    pl_selection_guide:
      "Hass: Ciemna skórka, delikatnie ustępuje pod naciskiem. Zielone skórki: Twarde, ale nie jak kamień, skórka pozostaje zielona.",
    emoji: "🥑",
    wikipedia_url: "https://en.wikipedia.org/wiki/Avocado",
    rarity: 1,
  },
  {
    id: "83",
    name: "Mango",
    pl_name: "Mango",
    months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    best_months: [11, 0, 1],
    selection_guide:
      "Slightly soft to touch, fruity aroma at stem. Color is not a reliable indicator of ripeness.",
    pl_selection_guide:
      "Lekko miękkie w dotyku, owocowy aromat przy łodydze. Kolor nie jest wiarygodnym wskaźnikiem dojrzałości.",
    emoji: "🥭",
    wikipedia_url: "https://en.wikipedia.org/wiki/Mango",
    rarity: 1,
  },
];
