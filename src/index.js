/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask AWS Geek for a AWS fact"
 *  Alexa: "Here's your AWS fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.86217688-d5fd-4197-9e17-1660defb1e7c";

/**
 * Array containing AWS facts.
 */
var AWS_FACTS = [
    "The default limit for APIs per account in Amazon API Gateway is 40",
    "The default limit for API keys per account	in Amazon API Gateway is 10,000"
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * AWSGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var AWSGeek = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
AWSGeek.prototype = Object.create(AlexaSkill.prototype);
AWSGeek.prototype.constructor = AWSGeek;

AWSGeek.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("AWSGeek onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

AWSGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("AWSGeek onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
AWSGeek.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("AWSGeek onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

AWSGeek.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask AWS Geek tell me a AWS fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random AWS fact from the AWS facts list
    var factIndex = Math.floor(Math.random() * AWS_FACTS.length);
    var fact = AWS_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your AWS fact: " + fact;

    response.tellWithCard(speechOutput, "AWSGeek", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the AWSGeek skill.
    var geek = new AWSGeek();
    geek.execute(event, context);
};
