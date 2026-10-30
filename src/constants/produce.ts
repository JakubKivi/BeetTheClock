import { Produce, REGIONS } from "../types";
import {
  formatNutrition,
  getNutritionItems,
  PRODUCE_CONTENT,
} from "./produceContent";

export const RARITY_LEVELS: Record<
  1 | 2 | 3 | 4 | 5,
  { label: string; plLabel: string; color: string; emoji: string }
> = {
  1: { label: "Common", plLabel: "Powszechny", color: "#808080", emoji: "⚪" },
  2: {
    label: "Uncommon",
    plLabel: "Niezwykły",
    color: "#00AA00",
    emoji: "🟢",
  },
  3: { label: "Rare", plLabel: "Rzadki", color: "#0055FF", emoji: "🔵" },
  4: { label: "Epic", plLabel: "Epicki", color: "#AA00FF", emoji: "🟣" },
  5: {
    label: "Legendary",
    plLabel: "Legendarny",
    color: "#FFAA00",
    emoji: "🟡",
  },
};

export const getRarityInfo = (rarity: 1 | 2 | 3 | 4 | 5) =>
  RARITY_LEVELS[rarity];

const PRODUCE_BASE_DATA: Produce[] = [
  // --- Root Vegetables & Tubers ---
  {
    id: "1",
    name: "Beetroot",
    plName: "Burak",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [8, 9, 10, 11],
      },
    },
    selectionGuide:
      "Firm, smooth skin, intact taproot. For greens attached, leaves should be fresh not wilted.",
    plSelectionGuide:
      "Twarda, gładka skórka, nienaruszony korzeń główny. Jeśli ma liście, powinny być świeże, a nie zwiędnięte.",
    storageGuide:
      "Remove greens leaving 1 inch of stem. Store unwashed in a perforated plastic bag in the fridge crisper.",
    plStorageGuide:
      "Odciąć liście zostawiając 2-3 cm łodygi. Przechowywać nieumyte w perforowanym plastikowym worku w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Beetroot",
    rarity: 1,
  },
  {
    id: "4",
    name: "Carrot",
    plName: "Marchew",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8, 9, 10, 11],
      },
    },
    selectionGuide:
      "Firm, bright orange, smooth skin. Avoid cracks or rubbery texture.",
    plSelectionGuide:
      "Twarda, jasnopomarańczowa, gładka skórka. Unikaj pęknięć i gumowatej konsystencji.",
    storageGuide:
      "Remove greens. Submerge completely in water in a sealed container in the fridge. Change water every few days.",
    plStorageGuide:
      "Odciąć nać. Przechowywać całkowicie zanurzone w wodzie w szczelnym pojemniku w lodówce. Zmieniać wodę co kilka dni.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Carrot",
    rarity: 1,
  },
  {
    id: "34",
    name: "Celery Root",
    plName: "Seler korzeniowy",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [8, 9, 10, 11],
      },
    },
    selectionGuide:
      "Heavy for its size, firm, no soft spots. Smaller roots tend to be less woody.",
    plSelectionGuide:
      "Ciężki jak na swój rozmiar, twardy, bez miękkich plam. Mniejsze korzenie są zazwyczaj mniej zdrewniałe.",
    storageGuide:
      "Store unwashed and loosely wrapped in a plastic bag in the fridge crisper drawer.",
    plStorageGuide:
      "Przechowywać nieumyty, luźno owinięty w plastikową torbę w szufladzie na warzywa w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Celeriac",
    rarity: 1,
  },
  {
    id: "35",
    name: "Parsley Root",
    plName: "Pietruszka korzeniowa",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [8, 9, 10, 11],
      },
    },
    selectionGuide: "Firm, white/beige skin. Avoid rusty spots or limp roots.",
    plSelectionGuide:
      "Twarda, biała/beżowa skórka. Unikaj rdzawych plam i wiotkich korzeni.",
    storageGuide:
      "Remove greens. Wrap the root in a lightly damp paper towel and store in an airtight container or bag in the fridge.",
    plStorageGuide:
      "Odciąć nać. Zawinąć korzeń w lekko wilgotny ręcznik papierowy i trzymać w szczelnym pojemniku lub torbie w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Parsley#Root_parsley",
    rarity: 1,
  },
  {
    id: "5",
    name: "Potato",
    plName: "Ziemniak",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8],
      },
    },
    selectionGuide:
      "Firm, smooth skin, no green tints or sprouts. New potatoes should have flaky skin.",
    plSelectionGuide:
      "Twarda, gładka skórka, bez zielonych odcieni i kiełków. Młode ziemniaki powinny mieć łuszczącą się skórkę.",
    storageGuide:
      "Keep in a cool, dark, dry, well-ventilated place (like a paper bag in a pantry). Do not refrigerate. Keep away from onions.",
    plStorageGuide:
      "Trzymać w chłodnym, ciemnym, suchym i dobrze wentylowanym miejscu (np. w papierowej torbie w spiżarni). Nie w lodówce. Trzymać z dala od cebuli.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Potato",
    rarity: 1,
  },
  {
    id: "45",
    name: "Parsnip",
    plName: "Pasternak",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [8, 9, 10, 11],
      },
    },
    selectionGuide:
      "Firm, ivory color. Avoid very large roots as they can be woody cores.",
    plSelectionGuide:
      "Twardy, w kolorze kości słoniowej. Unikaj bardzo dużych korzeni, ponieważ mogą mieć zdrewniały środek.",
    storageGuide:
      "Store unwashed in a perforated plastic bag in the vegetable drawer of the fridge.",
    plStorageGuide:
      "Przechowywać nieumyty w perforowanym plastikowym worku w szufladzie na warzywa w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Parsnip",
    rarity: 2,
  },
  {
    id: "49",
    name: "Jerusalem Artichoke",
    plName: "Topinambur",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 8, 9, 10, 11],
        bestMonths: [0, 1, 2, 9, 10, 11],
      },
    },
    selectionGuide:
      "Firm, not shriveled. Knobby is normal, but avoid soft spots/mold.",
    plSelectionGuide:
      "Twardy, niepomarszczony. Guzkowaty kształt to norma, ale unikaj miękkich plam i pleśni.",
    storageGuide:
      "Wrap unwashed tubers in a paper towel inside a loose plastic bag in the fridge crisper.",
    plStorageGuide:
      "Owinąć nieumyte bulwy w ręcznik papierowy wewnątrz luźnej plastikowej torby w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Jerusalem_artichoke",
    rarity: 3,
  },
  {
    id: "51",
    name: "Horseradish",
    plName: "Chrzan",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [0, 1, 2, 9, 10, 11],
      },
    },
    selectionGuide: "Very hard and firm. Avoid shriveled roots or soft ends.",
    plSelectionGuide:
      "Bardzo twardy i jędrny. Unikaj pomarszczonych korzeni lub miękkich końcówek.",
    storageGuide:
      "Wrap the unwashed root loosely in plastic wrap or keep in a perforated bag in the crisper drawer.",
    plStorageGuide:
      "Owinąć nieumyty korzeń luźno w folię spożywczą lub trzymać w perforowanej torbie w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Horseradish",
    rarity: 2,
  },
  {
    id: "8",
    name: "Radish",
    plName: "Rzodkiewka",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [3, 4, 5, 8, 9],
      },
    },
    selectionGuide:
      "Firm, smooth, bright color. If leaves are attached, they should be green and crisp.",
    plSelectionGuide:
      "Twarda, gładka, o jasnym kolorze. Jeśli ma liście, powinny być zielone i chrupiące.",
    storageGuide:
      "Remove greens immediately. Store roots submerged in a jar of water in the fridge to keep them crisp.",
    plStorageGuide:
      "Odciąć natychmiast liście. Przechowywać korzenie zanurzone w słoiku z wodą w lodówce, aby pozostały chrupiące.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Radish",
    rarity: 1,
  },

  // --- Alliums ---
  {
    id: "20",
    name: "Onion",
    plName: "Cebula",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [7, 8, 9],
      },
    },
    selectionGuide:
      "Hard, dry, papery skin. Avoid sprouting necks or soft spots.",
    plSelectionGuide:
      "Twarda, sucha, papierowa skórka. Unikaj kiełkujących końcówek i miękkich plam.",
    storageGuide:
      "Store in a cool, dark, dry, and well-ventilated spot (like a wire basket). Do not refrigerate or put in plastic. Keep away from potatoes.",
    plStorageGuide:
      "Przechowywać w chłodnym, ciemnym, suchym i przewiewnym miejscu (np. w koszyku). Nie wkładać do lodówki ani do folii. Trzymać z dala od ziemniaków.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Onion",
    rarity: 1,
  },
  {
    id: "20b",
    name: "Garlic",
    plName: "Czosnek",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8],
      },
    },
    selectionGuide:
      "Firm, tight skin, heavy for size. Avoid if cloves feel hollow or soft.",
    plSelectionGuide:
      "Twarda, ciasna skórka, ciężki jak na swój rozmiar. Unikaj główek z pustymi lub miękkimi ząbkami.",
    storageGuide:
      "Keep in a dry, dark, well-ventilated space at room temperature. A mesh bag or open basket is ideal.",
    plStorageGuide:
      "Trzymać w suchym, ciemnym, dobrze wentylowanym miejscu w temperaturze pokojowej. Najlepsza będzie siatka lub otwarty koszyk.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Garlic",
    rarity: 1,
  },
  {
    id: "36",
    name: "Leek",
    plName: "Por",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [0, 1, 2, 8, 9, 10, 11],
      },
    },
    selectionGuide:
      "Crisp white and light green parts. Avoid yellowing or slimy leaves.",
    plSelectionGuide:
      "Chrupiące białe i jasnozielone części. Unikaj żółknących lub oślizgłych liści.",
    storageGuide:
      "Store unwashed and untrimmed, loosely wrapped in a plastic bag in the crisper drawer of the fridge.",
    plStorageGuide:
      "Przechowywać nieumyty i nieprzycięty, luźno owinięty w plastikową torbę w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Leek",
    rarity: 1,
  },
  {
    id: "52",
    name: "Spring Onion",
    plName: "Dymka",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [3, 4, 5, 6, 7, 8],
      },
    },
    selectionGuide: "Bright green, crisp stalks. Avoid slimy or wilting tips.",
    plSelectionGuide:
      "Jasnozielone, chrupiące łodygi. Unikaj oślizgłych lub więdnących końcówek.",
    storageGuide:
      "Stand them upright in a jar with an inch of water at the bottom, loosely covered with a plastic bag in the fridge.",
    plStorageGuide:
      "Postawić pionowo w słoiku z odrobiną wody na dnie, luźno przykryć plastikową torbą i wstawić do lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Scallion",
    rarity: 1,
  },

  // --- Brassicas & Leafy Greens ---
  {
    id: "15",
    name: "Cabbage (White)",
    plName: "Kapusta (Biała)",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8, 9, 10],
      },
    },
    selectionGuide:
      "Heavy for size, tight leaves. Young cabbage is looser and greener.",
    plSelectionGuide:
      "Ciężka jak na swój rozmiar, zwarte liście. Młoda kapusta jest luźniejsza i bardziej zielona.",
    storageGuide:
      "Do not wash. Keep the whole head wrapped tightly in plastic wrap in the crisper drawer.",
    plStorageGuide:
      "Nie myć. Trzymać całą główkę ciasno owiniętą folią spożywczą w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cabbage",
    rarity: 1,
  },
  {
    id: "16",
    name: "Brussels Sprouts",
    plName: "Brukselka",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [0, 1, 9, 10, 11],
      },
    },
    selectionGuide:
      "Tight, small, bright green heads. Avoid yellow leaves or loose structure.",
    plSelectionGuide:
      "Zwarte, małe, jasnozielone główki. Unikaj żółtych liści i luźnej struktury.",
    storageGuide:
      "Leave on the stalk if possible. Otherwise, store unwashed in a loose plastic bag in the fridge crisper.",
    plStorageGuide:
      "Najlepiej trzymać na łodydze. W przeciwnym razie przechowywać nieumyte w luźnej plastikowej torbie w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Brussels_sprout",
    rarity: 1,
  },
  {
    id: "9",
    name: "Cauliflower",
    plName: "Kalafior",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Compact, creamy white curds. No dark spots. Leaves should be fresh green.",
    plSelectionGuide:
      "Zwarty, kremowobiały kwiatostan. Bez ciemnych plam. Liście powinny być świeżo zielone.",
    storageGuide:
      "Store stem-side down in a loosely sealed plastic bag with a dry paper towel to absorb moisture in the fridge.",
    plStorageGuide:
      "Przechowywać łodygą do dołu w luźno zamkniętej plastikowej torbie z suchym ręcznikiem papierowym pochłaniającym wilgoć w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cauliflower",
    rarity: 1,
  },
  {
    id: "10",
    name: "Broccoli",
    plName: "Brokuł",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Firm stalks, tight dark green florets. Avoid yellowing buds.",
    plSelectionGuide:
      "Twarde łodygi, zwarte ciemnozielone różyczki. Unikaj żółknących pąków.",
    storageGuide:
      "Mist the head lightly, wrap loosely in damp paper towels, and keep in an unsealed bag in the fridge.",
    plStorageGuide:
      "Lekko zrosić główkę wodą, luźno owinąć wilgotnym ręcznikiem papierowym i trzymać w otwartej torbie w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Broccoli",
    rarity: 1,
  },
  {
    id: "37",
    name: "Kohlrabi",
    plName: "Kalarepa",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [3, 4, 5, 6, 7, 8],
      },
    },
    selectionGuide:
      "Small to medium size (tennis ball). Heavy and firm. Large ones can be woody inside.",
    plSelectionGuide:
      "Mała do średniej wielkości (wielkość piłki tenisowej). Ciężka i twarda. Duże sztuki mogą być wewnątrz zdrewniałe.",
    storageGuide:
      "Remove leaves. Store the unwashed bulb loose or in a perforated bag in the crisper drawer.",
    plStorageGuide:
      "Odciąć liście. Przechowywać nieumytą bulwę luźno lub w perforowanej torbie w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kohlrabi",
    rarity: 1,
  },
  {
    id: "17",
    name: "Kale",
    plName: "Jarmuż",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [0, 1, 8, 9, 10, 11],
      },
    },
    selectionGuide: "Dark green, crisp leaves. Avoid yellow or mushy spots.",
    plSelectionGuide:
      "Ciemnozielone, chrupiące liście. Unikaj żółtych lub papkowatych miejsc.",
    storageGuide:
      "Wrap unwashed leaves in dry paper towels and store in a sealed plastic bag in the fridge.",
    plStorageGuide:
      "Owinąć nieumyte liście w suchy ręcznik papierowy i przechowywać w szczelnej plastikowej torbie w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kale",
    rarity: 2,
  },
  {
    id: "18",
    name: "Spinach",
    plName: "Szpinak",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [2, 3, 4, 5, 8, 9, 10],
      },
    },
    selectionGuide:
      "Vibrant green, fresh looking. Avoid slimy or wilted leaves.",
    plSelectionGuide:
      "Żywo zielony, świeżo wyglądający. Unikaj oślizgłych lub zwiędniętych liści.",
    storageGuide:
      "Store unwashed in a hard, airtight container lined with dry paper towels to absorb excess moisture.",
    plStorageGuide:
      "Przechowywać nieumyty w twardym, szczelnym pojemniku wyłożonym suchym ręcznikiem papierowym, aby pochłaniał wilgoć.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Spinach",
    rarity: 1,
  },
  {
    id: "2",
    name: "Asparagus",
    plName: "Szparagi",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [1, 2, 3, 4, 5, 6, 7],
        bestMonths: [3, 4, 5],
      },
    },
    selectionGuide:
      "Firm, straight stalks with closed, tight tips. Ends should be moist, not dry.",
    plSelectionGuide:
      "Twarde, proste łodygi z zamkniętymi, zwartymi główkami. Końcówki powinny być wilgotne, nie suche.",
    storageGuide:
      "Trim the ends and stand stalks upright in a glass with an inch of water. Loosely cover the tips with a plastic bag in the fridge.",
    plStorageGuide:
      "Przyciąć końcówki i postawić pionowo w szklance z odrobiną wody. Luźno przykryć główki plastikową torbą i trzymać w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Asparagus",
    rarity: 2,
  },
  {
    id: "19",
    name: "Rhubarb",
    plName: "Rabarbar",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [2, 3, 4, 5, 6],
        bestMonths: [3, 4, 5],
      },
    },
    selectionGuide: "Firm, crisp stalks. Avoid limp or rubbery ones.",
    plSelectionGuide:
      "Twarde, chrupiące łodygi. Unikaj wiotkich lub gumowatych.",
    storageGuide:
      "Wrap unwashed stalks tightly in aluminum foil and store in the crisper drawer of the fridge.",
    plStorageGuide:
      "Szczelnie owinąć nieumyte łodygi w folię aluminiową i przechowywać w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Rhubarb",
    rarity: 2,
  },

  // --- Fruiting Vegetables ---
  {
    id: "6",
    name: "Tomato",
    plName: "Pomidor",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Fragrant, rich color, slightly yielding to pressure. Heavy for size.",
    plSelectionGuide:
      "Pachnący, o głębokim kolorze, lekko ustępujący pod naciskiem. Ciężki jak na swój rozmiar.",
    storageGuide:
      "Keep stem-side down at room temperature, out of direct sunlight for best flavor. Refrigeration can slow deterioration of ripe tomatoes, but may affect flavor and texture.",
    plStorageGuide:
      "Aby zachować najlepszy smak, trzymać szypułką do dołu w temperaturze pokojowej, z dala od bezpośredniego słońca. Chłodzenie dojrzałych pomidorów może spowolnić ich psucie, ale wpłynąć na smak i konsystencję.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Tomato",
    rarity: 1,
  },
  {
    id: "7",
    name: "Cucumber",
    plName: "Ogórek",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [4, 5, 6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Firm along entire length. Avoid shriveled ends or soft spots.",
    plSelectionGuide:
      "Twardy na całej długości. Unikaj pomarszczonych końcówek i miękkich plam.",
    storageGuide:
      "Wrap individually in paper towels, place in a plastic bag, and store towards the front of the fridge shelf where it's warmer.",
    plStorageGuide:
      "Każdy osobno owinąć ręcznikiem papierowym, włożyć do plastikowej torby i trzymać z przodu półki w lodówce, gdzie jest cieplej.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cucumber",
    rarity: 1,
  },
  {
    id: "12",
    name: "Pepper",
    plName: "Papryka",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8, 9],
      },
    },
    selectionGuide: "Glossy, taut skin, firm stem. Heavy for size.",
    plSelectionGuide:
      "Błyszcząca, napięta skórka, twarda szypułka. Ciężka jak na swój rozmiar.",
    storageGuide:
      "Store unwashed in a loosely tied plastic bag in the crisper drawer. Keep them completely dry.",
    plStorageGuide:
      "Przechowywać nieumytą, w luźno zawiązanej plastikowej torbie w szufladzie lodówki. Należy ją chronić przed wilgocią.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bell_pepper",
    rarity: 1,
  },
  {
    id: "39",
    name: "Eggplant",
    plName: "Bakłażan",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Shiny, smooth skin. Firm but bounces back slightly when pressed. Heavy.",
    plSelectionGuide:
      "Błyszcząca, gładka skórka. Twardy, ale lekko sprężysty przy naciśnięciu. Ciężki.",
    storageGuide:
      "Store at cool room temperature away from bananas/tomatoes. If refrigerating, wrap in paper towel in the crisper and use quickly.",
    plStorageGuide:
      "Trzymać w chłodnej temperaturze pokojowej z dala od bananów i pomidorów. Jeśli w lodówce, owinąć w ręcznik papierowy i szybko zużyć.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Eggplant",
    rarity: 1,
  },
  {
    id: "11",
    name: "Zucchini",
    plName: "Cukinia",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8],
      },
    },
    selectionGuide: "Small to medium size, shiny skin. Avoid soft spots.",
    plSelectionGuide:
      "Mały do średniego rozmiaru, błyszcząca skórka. Unikaj miękkich plam.",
    storageGuide:
      "Keep dry and unwashed. Store in a paper bag or loose plastic bag with a paper towel in the crisper drawer.",
    plStorageGuide:
      "Chronić przed wilgocią, nie myć. Trzymać w papierowej torbie lub luźnej plastikowej torbie z ręcznikiem papierowym w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Zucchini",
    rarity: 1,
  },
  {
    id: "3",
    name: "Pumpkin",
    plName: "Dynia",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [8, 9, 10],
      },
    },
    selectionGuide:
      "Hard rind (cannot be punctured with a fingernail), hollow sound when tapped. Stem should be dry.",
    plSelectionGuide:
      "Twarda skóra (nie da się jej przebić paznokciem), głuchy dźwięk przy pukaniu. Łodyga powinna być sucha.",
    storageGuide:
      "Store whole pumpkins in a cool, dark, dry, and well-ventilated place. Once cut, wrap tightly in plastic and refrigerate.",
    plStorageGuide:
      "Przechowywać w całości w chłodnym, ciemnym, suchym i dobrze wentylowanym miejscu. Po rozkrojeniu ciasno owinąć folią i schować do lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Pumpkin",
    rarity: 2,
  },
  {
    id: "70",
    name: "Corn",
    plName: "Kukurydza",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [3, 4, 5, 6, 7, 8, 9, 10],
        bestMonths: [6, 7, 8],
      },
    },
    selectionGuide:
      "Bright green husk, golden silk (not dried black). Kernels should look plump and release milky juice when punctured.",
    plSelectionGuide:
      "Jasnozielone liście, złociste znamiona (nie suche i czarne). Ziarna powinny wyglądać na pękate i uwalniać mleczny sok po przekłuciu.",
    storageGuide:
      "Keep unhusked in a loosely closed plastic bag in the fridge. Consume as soon as possible, as sugars quickly turn to starch.",
    plStorageGuide:
      "Trzymać w liściach w luźno zamkniętej plastikowej torbie w lodówce. Zjeść jak najszybciej, gdyż cukry szybko zamieniają się w skrobię.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Sweet_corn",
    rarity: 2,
  },
  {
    id: "13",
    name: "Beans (Broad)",
    plName: "Bób",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [3, 4, 5, 6, 7, 8],
        bestMonths: [4, 5, 6],
      },
    },
    selectionGuide:
      "Pods should be green and filled, but not bulging excessively (indicates old/hard beans).",
    plSelectionGuide:
      "Strąki powinny być zielone i pełne, ale nie nadmiernie wybrzuszone (oznacza to stare/twarde nasiona).",
    storageGuide:
      "Store unshelled in a paper bag or perforated plastic bag in the crisper drawer for up to a few days.",
    plStorageGuide:
      "Przechowywać w łupinach, w papierowej torbie lub perforowanym worku w szufladzie lodówki maksymalnie przez kilka dni.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vicia_faba",
    rarity: 2,
  },
  {
    id: "14",
    name: "Beans (Green)",
    plName: "Fasolka szparagowa",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8],
      },
    },
    selectionGuide:
      "Bright color, snaps easily when bent. Avoid tough or stringy pods.",
    plSelectionGuide:
      "Jasny kolor, łatwo pęka przy zginaniu. Unikaj twardych lub łykowatych strąków.",
    storageGuide:
      "Keep unwashed. Wrap in a dry paper towel and place inside a reusable plastic bag in the fridge crisper.",
    plStorageGuide:
      "Nie myć. Zawinąć w suchy ręcznik papierowy i włożyć do plastikowej torebki w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Green_bean",
    rarity: 1,
  },

  // --- Local Fruits ---
  {
    id: "22",
    name: "Apples",
    plName: "Jabłka",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [7, 8, 9, 10],
      },
    },
    selectionGuide: "Firm, unbruised, skin should be tight not wrinkled.",
    plSelectionGuide:
      "Twarde, bez obić, skórka powinna być napięta, nie pomarszczona.",
    storageGuide:
      "Store in the crisper drawer, ideally in a perforated plastic bag. Keep separate from other sensitive vegetables.",
    plStorageGuide:
      "Trzymać w szufladzie lodówki, najlepiej w perforowanej plastikowej torbie. Przechowywać osobno od wrażliwych warzyw.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Apple",
    rarity: 1,
  },
  {
    id: "23",
    name: "Pears",
    plName: "Gruszki",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [7, 8, 9, 10],
      },
    },
    selectionGuide:
      "Check the neck: if it yields to gentle pressure, it is ripe. Body can be firm.",
    plSelectionGuide:
      "Sprawdź szyjkę: jeśli ustępuje pod delikatnym naciskiem, jest dojrzała. Reszta owocu może być twarda.",
    storageGuide:
      "Ripen at room temperature. Once the neck yields to pressure, move to the fridge to halt ripening.",
    plStorageGuide:
      "Dojrzewać w temperaturze pokojowej. Gdy szyjka lekko zmięknie, schować do lodówki, aby zatrzymać dojrzewanie.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Pear",
    rarity: 1,
  },
  {
    id: "24",
    name: "Plums",
    plName: "Śliwki",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8],
      },
    },
    selectionGuide:
      "Slightly soft at the tip, rich color, dusty bloom on skin is good.",
    plSelectionGuide:
      "Lekko miękkie na czubku, nasycony kolor, pożądany jest matowy nalot na skórce.",
    storageGuide:
      "Leave at room temperature in a paper bag to ripen. Once soft, transfer unwashed to the fridge.",
    plStorageGuide:
      "Zostawić w temperaturze pokojowej w papierowej torbie do dojrzewania. Gdy zmiękną, przenieść nieumyte do lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Plum",
    rarity: 1,
  },
  {
    id: "25",
    name: "Cherries (Sweet)",
    plName: "Czereśnie",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 5, 6, 7],
        bestMonths: [5, 6],
      },
    },
    selectionGuide:
      "Green, flexible stems. Fruit should be shiny, plump and dark.",
    plSelectionGuide:
      "Zielone, elastyczne ogonki. Owoce powinny być błyszczące, pękate i ciemne.",
    storageGuide:
      "Store unwashed with stems attached. Keep loosely packed in a paper-towel-lined container in the fridge.",
    plStorageGuide:
      "Przechowywać nieumyte, bez odrywania ogonków. Trzymać luźno w pojemniku wyłożonym ręcznikiem papierowym w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Cherry",
    rarity: 1,
  },
  {
    id: "21",
    name: "Strawberries",
    plName: "Truskawki",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [4, 5, 6],
      },
    },
    selectionGuide:
      "Bright red all over, fresh green cap, strong sweet smell. Avoid white shoulders.",
    plSelectionGuide:
      "Całkowicie jaskrawoczerwone, świeża zielona szypułka, silny słodki zapach. Unikaj białych wierzchołków.",
    storageGuide:
      "Store unwashed in a single layer inside an airtight container lined with a dry paper towel in the fridge.",
    plStorageGuide:
      "Przechowywać nieumyte, ułożone pojedynczą warstwą w szczelnym pojemniku wyłożonym suchym ręcznikiem papierowym w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Strawberry",
    rarity: 1,
  },
  {
    id: "27",
    name: "Raspberries",
    plName: "Maliny",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Dry, plump, bright color. Check container bottom for juice (sign of crushing).",
    plSelectionGuide:
      "Suche, pękate, jasny kolor. Sprawdź spód pojemnika pod kątem soku (oznaka zgniecenia).",
    storageGuide:
      "Do not wash until eating. Store in a wide, shallow container lined with paper towels, slightly open for airflow in the fridge.",
    plStorageGuide:
      "Nie myć przed zjedzeniem. Trzymać w szerokim, płytkim pojemniku wyłożonym papierem, lekko otwartym dla przepływu powietrza w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Raspberry",
    rarity: 1,
  },
  {
    id: "28",
    name: "Blueberries",
    plName: "Borówki",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8],
      },
    },
    selectionGuide:
      "Firm, dusty blue color (bloom). Avoid soft or shriveled berries.",
    plSelectionGuide:
      "Twarde, o zakurzonym, niebieskim kolorze (nalot). Unikaj miękkich lub pomarszczonych jagód.",
    storageGuide:
      "Pick out any moldy ones first. Store unwashed in a breathable or vented container in the fridge.",
    plStorageGuide:
      "Najpierw wyrzucić spleśniałe sztuki. Przechowywać nieumyte w wentylowanym lub oddychającym pojemniku w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Blueberry",
    rarity: 1,
  },
  {
    id: "63",
    name: "Wild Strawberries",
    plName: "Poziomki",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [5, 6, 7],
        bestMonths: [5, 6],
      },
    },
    selectionGuide:
      "Intense aroma is key. Very delicate, buy only if dry and not squashed.",
    plSelectionGuide:
      "Intensywny aromat to podstawa. Bardzo delikatne, kupuj tylko wtedy, gdy są suche i niezgniecione.",
    storageGuide:
      "Highly perishable. Eat immediately or store unwashed in a single layer in the fridge for no more than a day.",
    plStorageGuide:
      "Bardzo nietrwałe. Zjeść natychmiast lub schować nieumyte w jednej warstwie do lodówki na maksymalnie jeden dzień.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fragaria_vesca",
    rarity: 5,
  },
  {
    id: "41",
    name: "Wild Bilberries",
    plName: "Jagody (Leśne)",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [5, 6, 7, 8],
        bestMonths: [6, 7],
      },
    },
    selectionGuide:
      "Dark, almost black, distinct aroma. Will stain hands. Must be dry.",
    plSelectionGuide:
      "Ciemne, prawie czarne, wyraźny aromat. Brudzą dłonie. Muszą być suche.",
    storageGuide:
      "Pick out crushed berries. Store unwashed in a shallow container in the fridge. Wash just before eating.",
    plStorageGuide:
      "Usunąć zgniecione owoce. Przechowywać nieumyte w płytkim pojemniku w lodówce. Myć bezpośrednio przed jedzeniem.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Bilberry",
    rarity: 4,
  },
  {
    id: "32",
    name: "Grapes",
    plName: "Winogrona",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [8, 9],
      },
    },
    selectionGuide:
      "Plump, firmly attached to green stems. Avoid wrinkled berries.",
    plSelectionGuide:
      "Pękate, mocno osadzone na zielonych gałązkach. Unikaj pomarszczonych owoców.",
    storageGuide:
      "Keep unwashed in their original ventilated bag or a perforated plastic bag in the fridge crisper.",
    plStorageGuide:
      "Trzymać nieumyte w oryginalnej perforowanej torbie z otworami wentylacyjnymi w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Grape",
    rarity: 1,
  },

  // --- Imported Seasonal Fruits ---
  {
    id: "71",
    name: "Watermelon",
    plName: "Arbuz",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8],
      },
    },
    selectionGuide:
      "Heavy for size, hollow sound when tapped. Look for a creamy yellow spot (field spot) where it sat on ground.",
    plSelectionGuide:
      "Ciężki jak na swój rozmiar, głuchy dźwięk przy pukaniu. Szukaj kremowo-żółtej plamy w miejscu, gdzie leżał na ziemi.",
    storageGuide:
      "Keep whole watermelons at room temperature. Once cut, wrap the exposed flesh tightly with plastic wrap and refrigerate.",
    plStorageGuide:
      "Arbuzy w całości trzymać w temperaturze pokojowej. Po rozkrojeniu szczelnie owinąć odsłonięty miąższ folią i wstawić do lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Watermelon",
    rarity: 1,
  },
  {
    id: "72",
    name: "Melon (Cantaloupe/Honeydew)",
    plName: "Melon",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8],
      },
    },
    selectionGuide:
      "Sweet fragrance at the stem end. Slightly soft at the blossom end (opposite stem).",
    plSelectionGuide:
      "Słodki zapach od strony łodygi. Lekko miękki po stronie kwiatu (przeciwnej do łodygi).",
    storageGuide:
      "Ripen at room temperature. Once ripe, store whole in the fridge. Cut melon must be refrigerated in an airtight container.",
    plStorageGuide:
      "Dojrzewać w temp. pokojowej. Gdy dojrzeje, trzymać w całości w lodówce. Przekrojonego melona przechowywać w szczelnym pojemniku w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Melon",
    rarity: 1,
  },
  {
    id: "73",
    name: "Orange",
    plName: "Pomarańcza",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [0, 1, 2, 3, 4, 10, 11],
      },
    },
    selectionGuide:
      "Heavy for its size (means juicy). Firm, finely textured skin.",
    plSelectionGuide:
      "Ciężka jak na swój rozmiar (oznacza to, że jest soczysta). Twarda, drobnoziarnista skórka.",
    storageGuide:
      "Store loose in the crisper drawer of the fridge for maximum freshness (up to a month). Room temp is fine for a few days.",
    plStorageGuide:
      "Najdłuższą świeżość (do miesiąca) zachowa luźno włożona do szuflady lodówki. W temperaturze pokojowej wytrzyma kilka dni.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Orange_(fruit)",
    rarity: 1,
  },
  {
    id: "74",
    name: "Tangerine/Clementine",
    plName: "Mandarynka / Klementynka",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 8, 9, 10, 11],
        bestMonths: [0, 1, 2, 9, 10, 11],
      },
    },
    selectionGuide:
      "Bright orange, skin feels slightly loose (easy to peel) but fruit should be heavy.",
    plSelectionGuide:
      "Jasnopomarańczowa, skórka wydaje się lekko luźna (łatwa do obrania), ale owoc powinien być ciężki.",
    storageGuide:
      "Keep them loose in the crisper drawer of the fridge to prevent them from drying out quickly.",
    plStorageGuide:
      "Trzymać luźno w szufladzie lodówki, by zapobiec szybkiemu wysychaniu.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Tangerine",
    rarity: 1,
  },
  {
    id: "75",
    name: "Lemon",
    plName: "Cytryna",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    },
    selectionGuide: "Bright yellow, heavy. Thin-skinned lemons are juicier.",
    plSelectionGuide:
      "Jasnożółta, ciężka. Cytryny o cienkiej skórce są bardziej soczyste.",
    storageGuide:
      "Store submerged in water in an airtight container in the fridge to keep them firm and juicy for weeks.",
    plStorageGuide:
      "Przechowywać w całości zalane wodą w szczelnym pojemniku w lodówce. Dzięki temu zachowają jędrność i sok przez wiele tygodni.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Lemon",
    rarity: 1,
  },
  {
    id: "76",
    name: "Grapefruit",
    plName: "Grejpfrut",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [0, 1, 2, 3, 4, 5, 11],
      },
    },
    selectionGuide:
      "Heavy for size, firm but slightly springy. Flat ends usually indicate good ripeness.",
    plSelectionGuide:
      "Ciężki jak na swój rozmiar, twardy, ale lekko sprężysty. Płaskie końce zazwyczaj oznaczają dobrą dojrzałość.",
    storageGuide:
      "Store loose in the fridge crisper drawer to maximize shelf life.",
    plStorageGuide:
      "Aby zmaksymalizować trwałość, należy przechowywać luźno w szufladzie lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Grapefruit",
    rarity: 1,
  },
  {
    id: "77",
    name: "Pomegranate",
    plName: "Granat",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [0, 1, 9, 10, 11],
      },
    },
    selectionGuide:
      "Heavy, angular shape (not perfectly round means seeds are full), dark red skin.",
    plSelectionGuide:
      "Ciężki, kanciasty kształt (nie do końca okrągły oznacza, że nasiona są pełne), ciemnoczerwona skórka.",
    storageGuide:
      "Keep whole fruits in the fridge crisper drawer. Extracted seeds should go in an airtight container.",
    plStorageGuide:
      "Całe owoce trzymać w szufladzie lodówki. Wyłuskane nasiona należy schować do szczelnego pojemnika.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Pomegranate",
    rarity: 2,
  },
  {
    id: "78",
    name: "Persimmon (Kaki)",
    plName: "Kaki (Persymona)",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 9, 10, 11],
        bestMonths: [0, 1, 9, 10, 11],
      },
    },
    selectionGuide:
      "Astringent types (such as Hachiya) must soften fully before eating; non-astringent types (such as Fuyu) can be eaten while firm.",
    plSelectionGuide:
      "Odmiany cierpkie (np. Hachiya) muszą całkowicie zmięknąć przed jedzeniem; odmiany niecierpkie (np. Fuyu) można jeść, gdy są twarde.",
    storageGuide:
      "Ripen at room temperature. Astringent varieties must soften fully before eating; refrigerate ripe fruit.",
    plStorageGuide:
      "Zostawić do dojrzenia w temperaturze pokojowej. Odmiany cierpkie jeść dopiero po całkowitym zmięknięciu; dojrzałe owoce przechowywać w lodówce.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Persimmon",
    rarity: 2,
  },
  {
    id: "79",
    name: "Fig",
    plName: "Figa",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Soft to touch, neck should droop. Small splits in skin indicate peak ripeness.",
    plSelectionGuide:
      "Miękka w dotyku, szyjka powinna opadać. Małe pęknięcia na skórce wskazują na szczytową dojrzałość.",
    storageGuide:
      "Place unwashed in a single layer on a paper towel-lined plate, covered loosely with plastic wrap in the fridge.",
    plStorageGuide:
      "Ułożyć nieumyte jednowarstwowo na talerzu wyłożonym papierem, przykryć luźno folią spożywczą i wstawić do lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fig",
    rarity: 3,
  },
  {
    id: "80",
    name: "Nectarine/Peach",
    plName: "Nektarynka / Brzoskwinia",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [5, 6, 7, 8],
      },
    },
    selectionGuide:
      "Ignore the red blush; the background color should be non-green (yellow or cream/white, depending on variety). The fruit should yield slightly along the seam.",
    plSelectionGuide:
      "Zignoruj czerwony rumieniec; kolor tła powinien być niezielony (żółty lub kremowy/biały, zależnie od odmiany). Owoc powinien lekko ustępować wzdłuż szwu.",
    storageGuide:
      "Ripen stem-side down at room temperature. Once ripe and fragrant, store in the fridge crisper.",
    plStorageGuide:
      "Dojrzewać szypułką do dołu w temp. pokojowej. Kiedy będą pachnące i miękkie, przełożyć do lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Peach",
    rarity: 1,
  },
  {
    id: "81",
    name: "Kiwi",
    plName: "Kiwi",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        bestMonths: [4, 5, 6, 7, 8, 9],
      },
    },
    selectionGuide:
      "Yields to gentle thumb pressure. Avoid rock hard (unripe) or mushy (overripe).",
    plSelectionGuide:
      "Ustępuje pod delikatnym naciskiem kciuka. Unikaj twardych jak kamień (niedojrzałych) lub papkowatych (przejrzałych).",
    storageGuide:
      "Leave firm kiwis at room temp to ripen. Once soft, transfer to a plastic bag in the fridge.",
    plStorageGuide:
      "Twarde owoce trzymać w temperaturze pokojowej aż dojrzeją. Gdy zmiękną, przenieść w plastikowej torebce do lodówki.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Kiwifruit",
    rarity: 1,
  },
  {
    id: "82",
    name: "Avocado",
    plName: "Awokado",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    },
    selectionGuide:
      "Hass: Dark skin, yields gently to pressure. Green skins: Firm but not rock hard, skin stays green.",
    plSelectionGuide:
      "Hass: Ciemna skórka, delikatnie ustępuje pod naciskiem. Zielone skórki: Twarde, ale nie jak kamień, skórka pozostaje zielona.",
    storageGuide:
      "Ripen at room temperature. Once it yields gently, store whole in the fridge to pause ripening. For cut halves, squeeze lemon juice and wrap tightly in plastic.",
    plStorageGuide:
      "Dojrzewać w temp. pokojowej. Kiedy lekko zmięknie, wstawić do lodówki. Przekrojone połówki skropić cytryną i ciasno owinąć folią.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Avocado",
    rarity: 1,
  },
  {
    id: "83",
    name: "Mango",
    plName: "Mango",
    seasonalityByRegion: {
      [REGIONS.POLAND]: {
        months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
    },
    selectionGuide:
      "Slightly soft to touch, fruity aroma at stem. Color is not a reliable indicator of ripeness.",
    plSelectionGuide:
      "Lekko miękkie w dotyku, owocowy aromat przy łodydze. Kolor nie jest wiarygodnym wskaźnikiem dojrzałości.",
    storageGuide:
      "Ripen at room temperature. Once ripe, move to the fridge to extend its shelf life by a few days.",
    plStorageGuide:
      "Zostawić w temperaturze pokojowej do osiągnięcia dojrzałości. Potem przełożyć do lodówki, by zachować świeżość na kilka dni dłużej.",
    wikipediaUrl: "https://en.wikipedia.org/wiki/Mango",
    rarity: 1,
  },
];

export const PRODUCE_DATA: Produce[] = PRODUCE_BASE_DATA.map((produce) => {
  const content = PRODUCE_CONTENT[produce.id];
  if (!content) {
    throw new Error(
      `Missing nutrition and recipe content for produce ${produce.id}.`,
    );
  }

  return {
    ...produce,
    nutritionalInfo: formatNutrition(content.nutrition, "en"),
    plNutritionalInfo: formatNutrition(content.nutrition, "pl"),
    nutritionItems: getNutritionItems(content.nutrition, content.micronutrients),
    ...(content.nutritionNote && { nutritionNote: content.nutritionNote }),
    recipes: [
      {
        id: `default-${produce.id}`,
        name: `Classic ${produce.name} recipe`,
        plName: `Podstawowy przepis: ${produce.plName}`,
        instructions: content.recipe.en,
        plInstructions: content.recipe.pl,
      },
    ],
  };
});
