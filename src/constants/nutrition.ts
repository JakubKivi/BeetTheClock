export type NutrientKey =
  | "energy"
  | "carbohydrates"
  | "fiber"
  | "protein"
  | "fat"
  | "vitaminA"
  | "vitaminB1"
  | "vitaminB6"
  | "vitaminC"
  | "vitaminK"
  | "folate"
  | "calcium"
  | "copper"
  | "iron"
  | "magnesium"
  | "manganese"
  | "phosphorus"
  | "potassium"
  | "selenium";

export type NutritionEntry = {
  nutrient: NutrientKey;
  amount?: number;
  unit?: "kcal" | "g";
};

export const NUTRIENT_INFO: Record<
  NutrientKey,
  {
    label: { en: string; pl: string };
    description: { en: string; pl: string };
    wikipediaUrl: string;
  }
> = {
  energy: {
    label: { en: "Energy", pl: "Energia" },
    description: {
      en: "Food energy powers basic processes such as breathing and circulation, as well as movement and exercise. Too little energy over time can contribute to fatigue and unintended weight loss.",
      pl: "Energia z pożywienia zasila podstawowe procesy, takie jak oddychanie i krążenie, a także ruch i wysiłek. Jej długotrwały niedobór może sprzyjać zmęczeniu i niezamierzonej utracie masy ciała.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Food_energy",
  },
  carbohydrates: {
    label: { en: "Carbohydrates", pl: "Węglowodany" },
    description: {
      en: "Carbohydrates are broken down mainly into glucose, which provides fuel for the brain, muscles, and other tissues. Choosing fiber-rich sources also supports steady digestion; very low overall intake may leave some people feeling tired.",
      pl: "Węglowodany są rozkładane głównie do glukozy, która dostarcza paliwa mózgowi, mięśniom i innym tkankom. Produkty bogate w błonnik dodatkowo wspierają trawienie, a bardzo mała podaż węglowodanów może u niektórych osób powodować zmęczenie.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Carbohydrate",
  },
  fiber: {
    label: { en: "Fiber", pl: "Błonnik" },
    description: {
      en: "Fiber adds bulk to stool and helps support regular bowel movements; some types also feed beneficial gut bacteria. Too little fiber can contribute to constipation.",
      pl: "Błonnik zwiększa objętość stolca i pomaga utrzymać regularne wypróżnienia; niektóre jego rodzaje są też pożywką dla korzystnych bakterii jelitowych. Zbyt mała ilość błonnika może sprzyjać zaparciom.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Dietary_fiber",
  },
  protein: {
    label: { en: "Protein", pl: "Białko" },
    description: {
      en: "Protein supplies amino acids needed to maintain muscles and build tissues, enzymes, and some hormones. Persistently inadequate intake can contribute to muscle loss and slower recovery from illness or injury.",
      pl: "Białko dostarcza aminokwasów potrzebnych do utrzymania mięśni oraz budowy tkanek, enzymów i części hormonów. Długotrwale zbyt mała podaż może sprzyjać utracie mięśni i wolniejszej regeneracji po chorobie lub urazie.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Protein_(nutrient)",
  },
  fat: {
    label: { en: "Fat", pl: "Tłuszcz" },
    description: {
      en: "Dietary fat provides energy and helps the body absorb fat-soluble vitamins. The type and amount of fat matter as part of an overall balanced diet.",
      pl: "Tłuszcz dostarcza energii i pomaga organizmowi wchłaniać witaminy rozpuszczalne w tłuszczach. W zbilansowanej diecie znaczenie ma jego rodzaj i ilość.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Fat",
  },
  vitaminA: {
    label: { en: "Vitamin A", pl: "Witamina A" },
    description: {
      en: "Vitamin A helps the eyes adapt to dim light and supports immune defenses and healthy skin and tissues. Severe deficiency can impair night vision and increase susceptibility to infections.",
      pl: "Witamina A pomaga oczom przystosować się do słabego oświetlenia oraz wspiera odporność i zdrowie skóry i tkanek. Znaczny niedobór może pogarszać widzenie po zmroku i zwiększać podatność na infekcje.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vitamin_A",
  },
  vitaminB1: {
    label: { en: "Vitamin B1", pl: "Witamina B1" },
    description: {
      en: "Vitamin B1 helps cells use carbohydrates for energy and is important for nerves and the heart. Deficiency can cause fatigue, nerve problems, and, in severe cases, beriberi.",
      pl: "Witamina B1 pomaga komórkom wykorzystywać węglowodany jako źródło energii i jest ważna dla nerwów oraz serca. Jej niedobór może powodować zmęczenie i zaburzenia nerwowe, a ciężki — beri-beri.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Thiamine",
  },
  vitaminB6: {
    label: { en: "Vitamin B6", pl: "Witamina B6" },
    description: {
      en: "Vitamin B6 helps the body process protein and make neurotransmitters and hemoglobin. Deficiency is uncommon but can cause anemia, skin changes, or nerve symptoms.",
      pl: "Witamina B6 pomaga organizmowi przetwarzać białko oraz wytwarzać neuroprzekaźniki i hemoglobinę. Jej niedobór występuje rzadko, ale może prowadzić do niedokrwistości, zmian skórnych lub objawów ze strony nerwów.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vitamin_B6",
  },
  vitaminC: {
    label: { en: "Vitamin C", pl: "Witamina C" },
    description: {
      en: "Vitamin C is needed to make collagen, helps absorb iron from plant foods, and contributes to normal immune function. Severe, prolonged deficiency causes scurvy, which can include bleeding gums and poor wound healing.",
      pl: "Witamina C jest potrzebna do tworzenia kolagenu, pomaga wchłaniać żelazo z produktów roślinnych i wspiera prawidłowe działanie odporności. Ciężki, długotrwały niedobór prowadzi do szkorbutu, który może powodować krwawienie dziąseł i gorsze gojenie ran.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vitamin_C",
  },
  vitaminK: {
    label: { en: "Vitamin K", pl: "Witamina K" },
    description: {
      en: "Vitamin K enables proteins involved in blood clotting and bone metabolism to work properly. A significant deficiency can impair clotting and increase bleeding, though it is uncommon in healthy adults.",
      pl: "Witamina K umożliwia prawidłowe działanie białek uczestniczących w krzepnięciu krwi i metabolizmie kości. Znaczny niedobór może zaburzać krzepnięcie i nasilać krwawienia, ale u zdrowych dorosłych występuje rzadko.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Vitamin_K",
  },
  folate: {
    label: { en: "Folate", pl: "Foliany" },
    description: {
      en: "Folate is needed to make DNA and new cells, including red blood cells, and is especially important during early pregnancy. Deficiency can cause a type of anemia; low folate during pregnancy increases the risk of neural tube defects.",
      pl: "Foliany są potrzebne do syntezy DNA i tworzenia nowych komórek, w tym czerwonych krwinek, a ich odpowiednia ilość jest szczególnie ważna na początku ciąży. Niedobór może powodować określony rodzaj niedokrwistości, a w ciąży zwiększa ryzyko wad cewy nerwowej.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Folate",
  },
  calcium: {
    label: { en: "Calcium", pl: "Wapń" },
    description: {
      en: "Calcium gives bones and teeth strength and also helps muscles contract and nerves send signals. Inadequate intake over time can weaken bones and raise the risk of osteoporosis.",
      pl: "Wapń wzmacnia kości i zęby, a także umożliwia skurcze mięśni i przewodzenie sygnałów nerwowych. Długotrwale zbyt mała podaż może osłabiać kości i zwiększać ryzyko osteoporozy.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Calcium",
  },
  copper: {
    label: { en: "Copper", pl: "Miedź" },
    description: {
      en: "Copper helps the body use iron and form connective tissue, and supports normal nervous and immune function. Deficiency is rare but can contribute to anemia and nerve problems.",
      pl: "Miedź pomaga organizmowi wykorzystywać żelazo i tworzyć tkankę łączną, a także wspiera układ nerwowy i odpornościowy. Jej niedobór występuje rzadko, ale może sprzyjać niedokrwistości i zaburzeniom nerwowym.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Copper",
  },
  iron: {
    label: { en: "Iron", pl: "Żelazo" },
    description: {
      en: "Iron is part of hemoglobin, which carries oxygen from the lungs to the body's tissues. Low iron can lead to anemia, often causing tiredness, weakness, and reduced concentration.",
      pl: "Żelazo wchodzi w skład hemoglobiny, która przenosi tlen z płuc do tkanek. Niedobór żelaza może prowadzić do niedokrwistości, której częstymi objawami są zmęczenie, osłabienie i trudności z koncentracją.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Iron",
  },
  magnesium: {
    label: { en: "Magnesium", pl: "Magnez" },
    description: {
      en: "Magnesium participates in hundreds of enzyme reactions and helps muscles, nerves, and energy production work normally. Significant deficiency can cause weakness and, in severe cases, muscle spasms or abnormal heart rhythms.",
      pl: "Magnez uczestniczy w setkach reakcji enzymatycznych i pomaga utrzymać prawidłową pracę mięśni, nerwów oraz procesów wytwarzania energii. Znaczny niedobór może powodować osłabienie, a ciężki — skurcze mięśni lub zaburzenia rytmu serca.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Magnesium",
  },
  manganese: {
    label: { en: "Manganese", pl: "Mangan" },
    description: {
      en: "Manganese is a trace mineral used by enzymes involved in metabolism, antioxidant defense, and bone formation. Deficiency is very rare, and its effects in people are not well established.",
      pl: "Mangan jest mikroelementem wykorzystywanym przez enzymy uczestniczące w metabolizmie, ochronie antyoksydacyjnej i tworzeniu kości. Jego niedobór występuje bardzo rzadko, a skutki u ludzi nie są dobrze poznane.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Manganese",
  },
  phosphorus: {
    label: { en: "Phosphorus", pl: "Fosfor" },
    description: {
      en: "Phosphorus is part of bones and teeth and helps form ATP, the molecule cells use to store and transfer energy. Deficiency is uncommon but can cause weakness and impaired bone health when severe.",
      pl: "Fosfor jest składnikiem kości i zębów oraz uczestniczy w tworzeniu ATP — cząsteczki, w której komórki magazynują i przenoszą energię. Niedobór występuje rzadko, ale w ciężkiej postaci może powodować osłabienie i pogorszenie zdrowia kości.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Phosphorus",
  },
  potassium: {
    label: { en: "Potassium", pl: "Potas" },
    description: {
      en: "Potassium helps regulate fluid balance and is essential for nerve signals, muscle contraction, and a steady heartbeat. Low blood potassium can cause weakness and dangerous rhythm disturbances, but it usually has causes beyond diet alone.",
      pl: "Potas pomaga regulować równowagę płynów i jest niezbędny do przewodzenia sygnałów nerwowych, skurczu mięśni oraz prawidłowego rytmu serca. Zbyt niskie stężenie potasu we krwi może powodować osłabienie i groźne zaburzenia rytmu, ale zwykle ma przyczyny wykraczające poza samą dietę.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Potassium",
  },
  selenium: {
    label: { en: "Selenium", pl: "Selen" },
    description: {
      en: "Selenium is used by antioxidant enzymes and helps the thyroid produce and process hormones. Deficiency is uncommon but can affect thyroid function and, in severe cases, heart and muscle health.",
      pl: "Selen jest wykorzystywany przez enzymy antyoksydacyjne i pomaga tarczycy wytwarzać oraz przetwarzać hormony. Jego niedobór występuje rzadko, ale może wpływać na pracę tarczycy, a w ciężkich przypadkach także serca i mięśni.",
    },
    wikipediaUrl: "https://en.wikipedia.org/wiki/Selenium",
  },
};
