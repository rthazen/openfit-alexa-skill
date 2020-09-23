const request = require('../nutrioRequest');

const SLOTS_MAP = [
  "UNUSED", // slot_id:0 not used
  "breakfast",
  "snacks", // snack #1
  "lunch",
  "snacks", // snack #2,
  "dinner",
  "snacks", // snack #3
  "breakfast", // breakfast: main
  "breakfast", // breakfast: fruit
  "dinner", // dinner: one-pot
  "dinner", // dinner: protein
  "dinner", // dinner: starch
  "dinner", // dinner: vegetable
  "snacks",
  "breakfast" // breakfast: one-pot
];

// const MealsData = {
//   breakfast: [
//     "Warm Banana Walnut Vanilla Yogurt",
//     " Fruit Salad"
//   ],
//   lunch: [
//     "Berry Yogurt"
//   ],
//   dinner: [
//     "Rosemary Chicken Breast",
//     " Whole Wheat Pasta",
//     " Raspberry Spinach Salad"
//   ],
//   snacks: [
//     "Roast Beef Wrap",
//     " Egg White Tomato Lettuce Wraps"
//   ]
// };

const MealSlotHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "MealSlotIntent";
  },
  async handle(handlerInput) {
    console.log("MealSlotHandler Intent handler called");
    const {
      meals = [],
      food_plan_presets = []
    } = await request.getDashboardFood();


    const reduceBySlot = (presets = [], meals, slot) =>
      presets.reduce((acc, meal) => {
        if (SLOTS_MAP[meal.slot_id] === slot) {

          let mealData = null;
          mealData = meals.find(i => i.id === meal.meal_id);

          acc.push({
            ...mealData,
            slot_id: meal.slot_id,
            multiplier: mealData.multiplier || meal.multiplier
          });
          return acc;
        }
      return acc;
    }, []);

    const getPresetMeals = (preset, meals) => {
      if (!preset || !preset.length || !meals.length) {
        return [];
      }
      const slotList = ["breakfast", "lunch", "dinner", "snacks"];
      return slotList.map(slot => {
        let slotData = reduceBySlot(preset, meals, slot).map(i => {
          return {
            ...i,
            preset: true,
          };
        });
        return {
          title: slot,
          data: slotData.map(i => i.name)
        };
      });
    };

    const grabPresetMeals = getPresetMeals(food_plan_presets, meals);

    let meal_slot = handlerInput.requestEnvelope.request.intent.slots.meal_slot.value;

    const grabRequestedMealSlot = grabPresetMeals.find(i => i.title === meal_slot);
    const listMealsForSlot = grabRequestedMealSlot.data.map(meal => meal);

    let cardTitle = "Meals from " + meal_slot;
    let cardContent = grabRequestedMealSlot.data[0];
    let speechText = "The meals for " + meal_slot + " are " + listMealsForSlot;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, cardContent)
      .getResponse();
  }
};

module.exports = MealSlotHandler;
