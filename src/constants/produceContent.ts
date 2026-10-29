type ProduceContent = {
  nutrition: [kcal: number, carbohydrate: number, fiber: number, protein: number];
  nutritionNote?: { en: string; pl: string };
  recipe: { en: string; pl: string };
};

export const PRODUCE_CONTENT: Record<string, ProduceContent> = {
  "1": {
    nutrition: [43, 9.6, 2.8, 1.6],
    recipe: {
      en: "Roast beet wedges with olive oil, thyme, and a little vinegar until tender.",
      pl: "Upiecz cząstki buraka z oliwą, tymiankiem i odrobiną octu do miękkości.",
    },
  },
  "4": {
    nutrition: [41, 9.6, 2.8, 0.9],
    recipe: {
      en: "Simmer sliced carrots with vegetable stock, then blend with ginger for soup.",
      pl: "Gotuj pokrojoną marchew w bulionie warzywnym, a następnie zmiksuj z imbirem na zupę.",
    },
  },
  "34": {
    nutrition: [42, 9.2, 1.8, 1.5],
    recipe: {
      en: "Roast celeriac cubes with oil and rosemary; serve with a lemon dressing.",
      pl: "Upiecz kostki selera z olejem i rozmarynem; podawaj z sosem cytrynowym.",
    },
  },
  "35": {
    nutrition: [55, 12.3, 4.3, 2.3],
    recipe: {
      en: "Grate parsley root into a slaw with apple, lemon juice, and yogurt.",
      pl: "Zetrzyj pietruszkę korzeniową do surówki z jabłkiem, sokiem z cytryny i jogurtem.",
    },
  },
  "5": {
    nutrition: [77, 17.5, 2.2, 2.0],
    recipe: {
      en: "Boil potatoes until tender and toss with dill, spring onion, and yogurt.",
      pl: "Ugotuj ziemniaki do miękkości i wymieszaj z koperkiem, dymką i jogurtem.",
    },
  },
  "45": {
    nutrition: [75, 18.0, 4.9, 1.2],
    recipe: {
      en: "Roast parsnip batons with oil and cumin until golden.",
      pl: "Upiecz słupki pasternaku z olejem i kuminem, aż się zarumienią.",
    },
  },
  "49": {
    nutrition: [73, 17.4, 1.6, 2.0],
    recipe: {
      en: "Roast scrubbed Jerusalem artichokes with garlic and olive oil until soft.",
      pl: "Upiecz wyszorowane topinambury z czosnkiem i oliwą do miękkości.",
    },
  },
  "51": {
    nutrition: [48, 11.3, 3.3, 1.2],
    recipe: {
      en: "Mix freshly grated horseradish with yogurt, lemon, and a pinch of salt for a sauce.",
      pl: "Wymieszaj świeżo starty chrzan z jogurtem, cytryną i szczyptą soli na sos.",
    },
  },
  "8": {
    nutrition: [16, 3.4, 1.6, 0.7],
    recipe: {
      en: "Thinly slice radishes and toss with butter, lemon, and chopped herbs.",
      pl: "Pokrój rzodkiewki w cienkie plasterki i wymieszaj z masłem, cytryną i ziołami.",
    },
  },
  "20": {
    nutrition: [40, 9.3, 1.7, 1.1],
    recipe: {
      en: "Cook sliced onions slowly until golden and serve on toast with thyme.",
      pl: "Duś pokrojoną cebulę powoli do zarumienienia i podawaj na grzance z tymiankiem.",
    },
  },
  "20b": {
    nutrition: [149, 33.1, 2.1, 6.4],
    recipe: {
      en: "Roast a whole garlic bulb until soft; squeeze the cloves into mashed potatoes.",
      pl: "Upiecz całą główkę czosnku do miękkości; wyciśnięte ząbki dodaj do purée ziemniaczanego.",
    },
  },
  "36": {
    nutrition: [61, 14.2, 1.8, 1.5],
    recipe: {
      en: "Simmer sliced leek and potato in stock, then blend into a smooth soup.",
      pl: "Gotuj pokrojony por i ziemniaki w bulionie, a następnie zmiksuj na krem.",
    },
  },
  "52": {
    nutrition: [32, 7.3, 2.6, 1.8],
    recipe: {
      en: "Stir-fry chopped spring onions briefly and fold into scrambled eggs.",
      pl: "Krótko podsmaż posiekaną dymkę i dodaj do jajecznicy.",
    },
  },
  "15": {
    nutrition: [25, 5.8, 2.5, 1.3],
    recipe: {
      en: "Finely shred cabbage and dress with grated carrot, yogurt, and vinegar.",
      pl: "Drobno poszatkuj kapustę i połącz z tartą marchewką, jogurtem i octem.",
    },
  },
  "16": {
    nutrition: [43, 9.0, 3.8, 3.4],
    recipe: {
      en: "Roast halved Brussels sprouts with oil until browned; finish with lemon.",
      pl: "Upiecz przekrojoną brukselkę z olejem do zarumienienia; skrop cytryną.",
    },
  },
  "9": {
    nutrition: [25, 5.0, 2.0, 1.9],
    recipe: {
      en: "Steam cauliflower florets and serve with a sauce of yogurt, garlic, and herbs.",
      pl: "Ugotuj różyczki kalafiora na parze i podawaj z sosem z jogurtu, czosnku i ziół.",
    },
  },
  "10": {
    nutrition: [34, 6.6, 2.6, 2.8],
    recipe: {
      en: "Steam broccoli until just tender and toss with lemon and toasted almonds.",
      pl: "Ugotuj brokuł na parze do miękkości i wymieszaj z cytryną oraz prażonymi migdałami.",
    },
  },
  "37": {
    nutrition: [27, 6.2, 3.6, 1.7],
    recipe: {
      en: "Cut kohlrabi into sticks and serve raw with a yogurt and dill dip.",
      pl: "Pokrój kalarepę w słupki i podawaj na surowo z dipem jogurtowo-koperkowym.",
    },
  },
  "17": {
    nutrition: [49, 8.8, 3.6, 4.3],
    recipe: {
      en: "Massage chopped kale with olive oil and lemon, then top with seeds.",
      pl: "Wymieszaj posiekany jarmuż z oliwą i cytryną, a następnie posyp pestkami.",
    },
  },
  "18": {
    nutrition: [23, 3.6, 2.2, 2.9],
    recipe: {
      en: "Wilt spinach in a pan with garlic and serve as a warm side dish.",
      pl: "Podduś szpinak na patelni z czosnkiem i podawaj jako ciepły dodatek.",
    },
  },
  "2": {
    nutrition: [20, 3.9, 2.1, 2.2],
    recipe: {
      en: "Roast asparagus spears with olive oil; finish with lemon zest.",
      pl: "Upiecz szparagi z oliwą; na koniec dodaj skórkę z cytryny.",
    },
  },
  "19": {
    nutrition: [21, 4.5, 1.8, 0.9],
    recipe: {
      en: "Stew chopped rhubarb with a little sugar and orange zest; serve over yogurt.",
      pl: "Duś rabarbar z niewielką ilością cukru i skórką pomarańczową; podawaj z jogurtem.",
    },
  },
  "6": {
    nutrition: [18, 3.9, 1.2, 0.9],
    recipe: {
      en: "Bake tomato halves with olive oil, garlic, and herbs until soft.",
      pl: "Piecz połówki pomidorów z oliwą, czosnkiem i ziołami do miękkości.",
    },
  },
  "7": {
    nutrition: [15, 3.6, 0.5, 0.7],
    recipe: {
      en: "Dice cucumber and mix with yogurt, dill, and a little lemon juice.",
      pl: "Pokrój ogórka w kostkę i wymieszaj z jogurtem, koperkiem i odrobiną soku z cytryny.",
    },
  },
  "12": {
    nutrition: [31, 6.0, 2.1, 1.0],
    recipe: {
      en: "Fill pepper halves with cooked rice, herbs, and beans, then bake until tender.",
      pl: "Napełnij połówki papryki ugotowanym ryżem, ziołami i fasolą, a następnie upiecz do miękkości.",
    },
  },
  "39": {
    nutrition: [25, 5.9, 3.0, 1.0],
    recipe: {
      en: "Roast eggplant slices with olive oil and garlic; serve with tomato sauce.",
      pl: "Upiecz plastry bakłażana z oliwą i czosnkiem; podawaj z sosem pomidorowym.",
    },
  },
  "11": {
    nutrition: [17, 3.1, 1.0, 1.2],
    recipe: {
      en: "Grate zucchini into fritters with egg, flour, and herbs; pan-fry until golden.",
      pl: "Zetrzyj cukinię na placki z jajkiem, mąką i ziołami; smaż do zarumienienia.",
    },
  },
  "3": {
    nutrition: [26, 6.5, 0.5, 1.0],
    recipe: {
      en: "Roast pumpkin cubes with oil and spices, then blend with stock into soup.",
      pl: "Upiecz kostki dyni z olejem i przyprawami, a następnie zmiksuj z bulionem na zupę.",
    },
  },
  "70": {
    nutrition: [86, 19.0, 2.7, 3.3],
    recipe: {
      en: "Boil or grill corn on the cob and serve with butter and chopped herbs.",
      pl: "Ugotuj lub ugrilluj kolby kukurydzy i podawaj z masłem oraz posiekanymi ziołami.",
    },
  },
  "13": {
    nutrition: [88, 17.6, 7.5, 7.9],
    recipe: {
      en: "Boil shelled broad beans until tender and toss with mint and lemon.",
      pl: "Ugotuj wyłuskany bób do miękkości i wymieszaj z miętą oraz cytryną.",
    },
  },
  "14": {
    nutrition: [31, 7.0, 2.7, 1.8],
    recipe: {
      en: "Steam green beans until crisp-tender and toss with garlic and olive oil.",
      pl: "Ugotuj fasolkę szparagową na parze al dente i wymieszaj z czosnkiem oraz oliwą.",
    },
  },
  "22": {
    nutrition: [52, 13.8, 2.4, 0.3],
    recipe: {
      en: "Bake sliced apples with cinnamon and oats until soft for a simple crumble.",
      pl: "Zapiekaj plasterki jabłek z cynamonem i płatkami owsianymi do miękkości.",
    },
  },
  "23": {
    nutrition: [57, 15.2, 3.1, 0.4],
    recipe: {
      en: "Poach pear halves gently with cinnamon and serve with plain yogurt.",
      pl: "Delikatnie ugotuj połówki gruszki z cynamonem i podawaj z jogurtem naturalnym.",
    },
  },
  "24": {
    nutrition: [46, 11.4, 1.4, 0.7],
    recipe: {
      en: "Simmer chopped plums with cinnamon into a quick compote.",
      pl: "Gotuj pokrojone śliwki z cynamonem, aż powstanie szybki kompot.",
    },
  },
  "25": {
    nutrition: [63, 16.0, 2.1, 1.1],
    recipe: {
      en: "Pit sweet cherries and fold into oatmeal with a spoonful of yogurt.",
      pl: "Wydryluj czereśnie i dodaj do owsianki z łyżką jogurtu.",
    },
  },
  "21": {
    nutrition: [32, 7.7, 2.0, 0.7],
    recipe: {
      en: "Slice strawberries and mix with oats, yogurt, and a little lemon zest.",
      pl: "Pokrój truskawki i wymieszaj z płatkami owsianymi, jogurtem i skórką z cytryny.",
    },
  },
  "27": {
    nutrition: [52, 11.9, 6.5, 1.2],
    recipe: {
      en: "Mash raspberries with lemon juice and spoon over pancakes or yogurt.",
      pl: "Rozgnieć maliny z sokiem z cytryny i podawaj do naleśników lub jogurtu.",
    },
  },
  "28": {
    nutrition: [57, 14.5, 2.4, 0.7],
    recipe: {
      en: "Warm blueberries briefly with lemon to make a topping for porridge.",
      pl: "Krótko podgrzej borówki z cytryną i podawaj jako dodatek do owsianki.",
    },
  },
  "63": {
    nutrition: [32, 7.7, 2.0, 0.7],
    nutritionNote: {
      en: "Reference values are for cultivated strawberries; wild strawberries may differ.",
      pl: "Wartości referencyjne dotyczą truskawek uprawnych; poziomki mogą się różnić.",
    },
    recipe: {
      en: "Serve wild strawberries over plain yogurt with crushed oats.",
      pl: "Podawaj poziomki z jogurtem naturalnym i pokruszonymi płatkami owsianymi.",
    },
  },
  "41": {
    nutrition: [57, 14.5, 2.4, 0.7],
    nutritionNote: {
      en: "Reference values are for cultivated blueberries; bilberries may differ.",
      pl: "Wartości referencyjne dotyczą borówek uprawnych; jagody leśne mogą się różnić.",
    },
    recipe: {
      en: "Simmer bilberries with a splash of water and serve as a warm porridge topping.",
      pl: "Podduś jagody leśne z odrobiną wody i podawaj na ciepło do owsianki.",
    },
  },
  "32": {
    nutrition: [69, 18.1, 0.9, 0.7],
    recipe: {
      en: "Roast halved grapes with thyme and serve with soft cheese and bread.",
      pl: "Upiecz przekrojone winogrona z tymiankiem i podawaj z miękkim serem oraz pieczywem.",
    },
  },
  "71": {
    nutrition: [30, 7.6, 0.4, 0.6],
    recipe: {
      en: "Dice watermelon and toss with mint and lime for a chilled fruit salad.",
      pl: "Pokrój arbuza w kostkę i wymieszaj z miętą oraz limonką na sałatkę owocową.",
    },
  },
  "72": {
    nutrition: [34, 8.2, 0.9, 0.8],
    nutritionNote: {
      en: "Reference values are for cantaloupe; honeydew melon differs.",
      pl: "Wartości referencyjne dotyczą kantalupy; melon miodowy ma inne wartości.",
    },
    recipe: {
      en: "Scoop melon into balls and serve chilled with mint and lime juice.",
      pl: "Uformuj kulki z melona i podawaj schłodzone z miętą i sokiem z limonki.",
    },
  },
  "73": {
    nutrition: [47, 11.8, 2.4, 0.9],
    recipe: {
      en: "Add orange segments to a salad with fennel and a light olive-oil dressing.",
      pl: "Dodaj cząstki pomarańczy do sałatki z koprem włoskim i lekkim sosem oliwnym.",
    },
  },
  "74": {
    nutrition: [53, 13.3, 1.8, 0.8],
    nutritionNote: {
      en: "Reference values are for tangerines; clementines may differ.",
      pl: "Wartości referencyjne dotyczą mandarynek; klementynki mogą się różnić.",
    },
    recipe: {
      en: "Toss peeled mandarin segments with spinach and toasted nuts.",
      pl: "Wymieszaj obrane cząstki mandarynki ze szpinakiem i prażonymi orzechami.",
    },
  },
  "75": {
    nutrition: [29, 9.3, 2.8, 1.1],
    recipe: {
      en: "Mix lemon juice and zest with olive oil and herbs for a bright dressing.",
      pl: "Wymieszaj sok i skórkę z cytryny z oliwą oraz ziołami na wyrazisty sos.",
    },
  },
  "76": {
    nutrition: [42, 10.7, 1.6, 0.8],
    recipe: {
      en: "Broil grapefruit halves briefly and serve warm with a little honey.",
      pl: "Krótko zapiecz połówki grejpfruta i podawaj na ciepło z odrobiną miodu.",
    },
  },
  "77": {
    nutrition: [83, 18.7, 4.0, 1.7],
    recipe: {
      en: "Scatter pomegranate seeds over roasted vegetables and a yogurt dressing.",
      pl: "Posyp pieczone warzywa pestkami granatu i polej sosem jogurtowym.",
    },
  },
  "78": {
    nutrition: [70, 18.6, 3.6, 0.6],
    recipe: {
      en: "Slice ripe persimmon and serve with yogurt, toasted nuts, and cinnamon.",
      pl: "Pokrój dojrzałą persymonę i podawaj z jogurtem, prażonymi orzechami i cynamonem.",
    },
  },
  "79": {
    nutrition: [74, 19.2, 2.9, 0.8],
    recipe: {
      en: "Bake halved figs with a little honey and serve with soft cheese.",
      pl: "Upiecz połówki fig z odrobiną miodu i podawaj z miękkim serem.",
    },
  },
  "80": {
    nutrition: [39, 9.5, 1.5, 0.9],
    nutritionNote: {
      en: "Reference values are for peaches; nectarines may differ.",
      pl: "Wartości referencyjne dotyczą brzoskwiń; nektarynki mogą się różnić.",
    },
    recipe: {
      en: "Grill peach or nectarine halves and serve with plain yogurt.",
      pl: "Ugrilluj połówki brzoskwini lub nektarynki i podawaj z jogurtem naturalnym.",
    },
  },
  "81": {
    nutrition: [61, 14.7, 3.0, 1.1],
    recipe: {
      en: "Slice kiwi over porridge or yogurt and add a handful of oats.",
      pl: "Pokrój kiwi na owsiankę lub jogurt i dodaj garść płatków owsianych.",
    },
  },
  "82": {
    nutrition: [160, 8.5, 6.7, 2.0],
    recipe: {
      en: "Mash avocado with lime, chopped tomato, and a pinch of salt for a quick spread.",
      pl: "Rozgnieć awokado z limonką, posiekanym pomidorem i szczyptą soli na szybką pastę.",
    },
  },
  "83": {
    nutrition: [60, 15.0, 1.6, 0.8],
    recipe: {
      en: "Blend mango with plain yogurt and lime for a simple chilled smoothie.",
      pl: "Zblenduj mango z jogurtem naturalnym i limonką na prosty, schłodzony koktajl.",
    },
  },
};

export const formatNutrition = (
  nutrition: ProduceContent["nutrition"],
  language: "en" | "pl",
): string => {
  const [kcal, carbohydrate, fiber, protein] = nutrition;
  const formatNumber = (value: number) =>
    value.toLocaleString(language === "pl" ? "pl-PL" : "en-US", {
      maximumFractionDigits: 1,
    });
  return language === "pl"
    ? `Na 100 g surowego produktu: ${formatNumber(kcal)} kcal; węglowodany ${formatNumber(carbohydrate)} g; błonnik ${formatNumber(fiber)} g; białko ${formatNumber(protein)} g.`
    : `Per 100 g raw: ${formatNumber(kcal)} kcal; carbohydrates ${formatNumber(carbohydrate)} g; fiber ${formatNumber(fiber)} g; protein ${formatNumber(protein)} g.`;
};
