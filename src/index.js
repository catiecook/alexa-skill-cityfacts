var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Denver";

var numberOfResults = 3;

var APIKey = "0d88ce861d024b2f91a5d00184961d50";

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Denver is located in the western central part of the country. Some of the things it is well known for are the Rocky Mountains, it's growing tech inductry and its craft beer scene!";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your  Alexa app for  more  information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "There was an error finding this attraction, " + tryAgainMessage;

var topFiveMoreInfo = " You can tell me a number for more information. For example open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var output = "";

var alexa;

var attractions = [
    { name: "Art District on Santa Fe", content: "Art District on Santa Fe is one of Colorado\'s designated Creative Districts, with more than 60 art galleries, studios and innovative businesses. Some fun events are: First Friday Art Walks, Third Friday Collector\'s Preview, Art Day on SanteFe in the Beginning of August, Dia De Los Muertos", location: "Between 6th and 10th on Sante Fe Drive", contact: "zooinfo@zoo.org\n 206 548 2500" },
    { name: "EMP Museum", content: "Dedicated to contemporary popular culture, the EMP Museum was established by Microsoft co-founder Paul Allen in 2000.It's home to exhibits, interactive activity stations, sound sculpture, and various educational resources.", location: "325 5th Avenue N, Seattle, Washington", contact: "www.denver.org" },

    { name: "Breweries", content: "Denver is the home to an expanding number of breweries including the largest brewery in the world: Coors Brewery. Some of the best breweries are: Diebolt, Factotum, Little Machine, Denver Beer Company, TRVE Brewing, Grandma's House, Banded Oak, Renegade, Black Shirt, River North, Our Mutual Friend, Stem Ciders, Crooked Stave, Epic Brewing, Ratio Beerworks, Spangalang, Black Sky, Station 26, Hogs Head", location: "all over denver", contact: "www.denver.org" },

    { name: "Coffee Shops", content: "Spend the day in Denver's best coffee shops reading, chatting with locals and drinking some amazing coffee. Examples of thes shops include: Huckleberry Roasters, Crema, Steam, lula Rose General, Thummp, Little Owl, Middle State, Two Rivers, Purple Door, BoxCar Roasters", location: "all over denver", contact: "www.denver.org" },

    { name: "Hikes", content: "There are endless options for hiking in and around the Denver area. From easy to advanced, there's a hike for everyone! Some of the best hikes are: Golden Gate Canyon, Chicago Lakes, echo Lake Trail, Mt. Evans, St. Mary's Glacier, Elk Valley, Adams Falls, Royal Arches, Three Sisters Park, Lair o\' the Bear, Bear Creek, Blue Grouse Trail, Bierstadt Lake, Boulder Falls, Bridal Veil Falls, Buffalo Creek Falls, Calypso Cascades, Canyon View Nature Trail, Clear Creek Trail", location: "Search the hike name for location", contact: "www.denverdayhikes.com" },
];

var topFive = [
    { number: "1", caption: "Walk around the RiNo neighborhood for the day.", more: "Visit High Point Creamery at the Central Market, get coffee from Crema and round the day off with pizza from Cart Driver. While walking around you can see the most dense collection of murals Denver has to offer.", location: "Between 24th and 29th on Larimer Street", contact: "www.denver.org" },
    { number: "2", caption: "Visit the LoHi neighborhood.", more: "Get Icecream from Little Man, walk in and out of local shops and boutiques, see unique lower highland houses and end the day with happy hour at Old Major.", location: "32nd and Tejon Street", contact: "www.denver.org" },

    { number: "3", caption: "Walk around the highland neighborhood on a tuesday", more: "See local stores, wonderful archetecture and get Taco Tuesday at El Camino for lunch or dinner", location: "32nd and Lowell", contact: "www.denver.org" },
    { number: "4", caption: "Walk around the Baker and south Boardway area.", more: "f you want to experience the original Denver before it really started evolving, go here! Attractions include Iron Wood, Trve Brew, Sweet Action Icecream, The Kitchen, Mutiny Book Store, Walnut Room, High Dive, Buffalo Exchange, Fancy Tiger, Metropolis Coffee", location: "1st and Broadway", contact: "www.denver.org" },

    { number: "5", caption: "See a show at Red Rocks Ampetheater.", more: "Visit the red rocks website to see up coming shows, events and outtings", location: "Morrison, Colorado", contact: "www.denver.org" }
];

var topFiveIntro = "Here are the top five things to  do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;

        output = welcomeMessage;

        this.emit(':ask', output, welcomeRepromt);
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    }
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getOverview': function () {

        output = locationOverview;

        this.emit(':tellWithCard', output, location, locationOverview);
    },

    'getAttractionIntent': function () {

        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = attraction.name + " " + attraction.content + newline + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },

    'getTopFiveIntent': function () {

        output = topFiveIntro;

        var cardTitle = "";

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += " Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }

        output += topFiveMoreInfo;

        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, output);
    },

    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'getNewsIntent': function () {
        httpGet(location, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'AMAZON.HelpIntent': function () {

        output = HelpMessage;

        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = this.event.request.intent.slots.attraction.value;
        var index = parseInt(slotValue) - 1;

        var selectedAttraction = topFive[index];
        if (selectedAttraction) {

            output = selectedAttraction.caption + ". " + selectedAttraction.more + ". " + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },

    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },

    'SessionEndedRequest': function () {
        this.emit(':tell', goodbyeMessage);
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
  console.log("/n QUERY: "+query);

    var options = {
      //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=seattle&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

        var body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });

    });
    req.end();

    req.on('error', (e) => {
        console.error(e);
    });
}

String.prototype.trunc =
      function (n) {
          return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
      };
