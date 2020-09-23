const request = require('../request');

const UserDataHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "UserDataIntent";
  },
  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const userSchedule = await request.getUserSchedule();
    console.log(userSchedule);
    const descriptors = userSchedule.descriptors;
    const schedules = userSchedule.schedule.map((schedule) => descriptors[schedule.descriptorID].title);

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    const speak = schedules.filter(Boolean).length > 0 
        ? "Here is a list of all your class schedule I found for today: " + [...new Set(schedules)]
        : "You currently don't have any classes scheduled. Please get off your butt and schedule a class";
      
      return handlerInput.responseBuilder
          .speak(speak)
          .reprompt(speak)
          .withSimpleCard(
            "This is the Title of the Card", 
            "This is the card content. This card just has plain text content.\r\nThe content is formated with line breaks to improve readability.")
          .getResponse();
  }
};

module.exports = UserDataHandler;