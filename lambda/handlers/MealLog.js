const request = require("../nutrioRequest");

const MealLogHandler = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "MealLogIntent"
    );
  },
  async handle(handlerInput) {
    const {
      requestEnvelope: { request: { intent: { slots = {} } = {} } = {} } = {}
    } = handlerInput;
    const slotValue =
      slots.MEAL_LOG_FOOD_ITEM.slotValue.value.toLowerCase() || null;
    const { meals = [] } = await request.getDashboardFood();
    console.log("MEALLOGINTENT_slotValue", slotValue);
    console.log("MEALLOGINTENT_MEALS", meals);
    const foundMeal =
      meals.find(({ name }) => {
        console.log(
          "MEALLOGINTEND__seach",
          name.toLowerCase(),
          slotValue,
          "found string",
          name.toLowerCase().indexOf(slotValue)
        );
        return name.toLowerCase().indexOf(slotValue) > -1;
      }) || {};
    console.log("MEALLOGINTENT_foundMeal", foundMeal);
    const speech = {
      repeat: "Tell us what you just ate",
      found: `${foundMeal.name || slotValue}, has been logged.`,
      error: `We could not find, ${slotValue}, in your meal plan.`
      // `We could not find, ${slotValue}, in your meal plan.  Would you like ot add it?`
    };

    const speak = foundMeal ? speech.found : speech.error;
    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speech.repeat)
      .getResponse();
  }
};

module.exports = MealLogHandler;
