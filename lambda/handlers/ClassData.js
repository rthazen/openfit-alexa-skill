const request = require('../request');

const ClassDataHandler = {
  canHandle(handlerInput) {
      console.log("INSIDE HANDLER!!!!!!!!!!!!!")
    return handlerInput.requestEnvelope.request.type === "IntentRequest"
      && handlerInput.requestEnvelope.request.intent.name === "ClassDataIntent";
  },
  async handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    // const userSchedule = await request.getAvailableClasses();
    // console.log(userSchedule);
    // const descriptors = userSchedule.descriptors;
    // const schedules = userSchedule.schedule.map((schedule) => descriptors[schedule.descriptorID].title);    
    
    console.log("GETTING CLASSES")
    const availableClasses = await request.getAvailableClasses();
    console.log(availableClasses);
    const descriptors = availableClasses.slice(0, 5).map((event) => event.descriptor.title);
    // const schedules = userSchedule.schedule.map((schedule) => descriptors[schedule.descriptorID].title);

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    const speak = descriptors.filter(Boolean).length > 0 
        ? "Here is a list of the available classes for today: " + [...new Set(descriptors)]
        : "There is no class for you at the moment, please go watch Netflix and eat popcorn";
      
      return handlerInput.responseBuilder
          .speak(speak)
          .reprompt(speak)
          .withSimpleCard(
            "This is the Title of the Card", 
            "This is the card content. This card just has plain text content.\r\nThe content is formated with line breaks to improve readability.")
          .getResponse();
  }
};

module.exports = ClassDataHandler;