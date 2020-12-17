const Log = require("../../js/logger.js");
const axios = require('axios');
const cheerio = require('cheerio');

const PDGA_Fetcher = function (reloadInterval, eventIDs, numEvents, eventTypes, topX, divisions) {
  const self = this;
  const dgpt = eventTypes.includes("DGPT");
  const aTier = eventTypes.includes("A");
  // Need to swap for A-tier if not already in
  if (dgpt) {
    for (var i = 0; i < eventTypes.length; i++) {
      if (eventTypes[i] === "DGPT") {
        eventTypes.splice(i, 1);
        break;
      }
    }

    if (!aTier) {
      eventTypes.push("A");
    }
  }

  let itemsReceivedCallback;
  let reloadTimer = null;
  let items = [];

  if (reloadInterval < 1000) {
    reloadInterval = 1000;
  }

  const fetchPDGA = function () {
    clearTimeout(reloadTimer);
    reloadTimer = null;
    items = [];

    let today = new Date();
    let startDate = new Date((new Date()).setMonth(today.getMonth() - 6));

    let url = 'https://www.pdga.com/tour/search?OfficialName=&td=&date_filter[min][date]=' + formatDate(startDate) + '&date_filter[max][date]=' + formatDate(today);
    eventTypes.forEach(tier => url += '&Tier[]=' + tier);

    if (eventIDs.length > 0) {
    	for (var i = 0; i < eventIDs.length; i++) {
    		addEvent('/tour/event/' + eventIDs[i]);
    	}
    }

	if (eventTypes.length > 0 && numEvents > 0) {
    	// Find the most recent event
		axios.get(url)
		   .then(response => {
		   	const html = response.data;
		   	const $ = cheerio.load(html);

		   	let last = $('li.pager-last.last > a');
		   	if ($(last).length) {
		   		url = 'https://www.pdga.com' + $(last).attr('href');
		   	}

		   	getEventHrefs(url, numEvents, function (response) {
		   		if (response == null) {
		   			console.log("NO EVENT FOUND");
		   			return;
		   		}

		   		addEvent(response);
		   	});
		  })
		  //handling error
		  .catch((error) => {
		  	console.log(error);
		  })
	}
  }

  const addEvent = function (eventHref) {
  	// Fetch for the specific event
  	axios.get('https://www.pdga.com' + eventHref)
	   .then(response => {
	   	const html = response.data;
	   	const $ = cheerio.load(html);

	   	let tournament = $('.pane-page-title > div > h1').text();
	   	let date = $('.tournament-date').text();
	   	let location = $('.tournament-location').text();
	   	let playerDivs = [];

	   	$('details').each((index, elem) => {
	   		let div = $(elem).find('summary > h3').attr('id');
	   		if (!divisions.includes(div)) return true;

	   		let players = [];
	   		$(elem).find('tr').each((index, row) => {
	   			if (index === 0) return true;
	   			if (index > topX) return false;

	   			let pos = $(row).find('.place').text();
	   			let player = $(row).find('.player > a').text();
	   			let playerRating = $(row).find('.player-rating').text();
	   			let score = $(row).find('.par').text();

	   			let ratingSum = 0;
	   			let roundCount = 0;
	   			$(row).find('.round-rating').each((index, rating) => {
	   				roundCount++;
	   				ratingSum += parseInt($(rating).text());
	   			});

	   			let j = {
	   				position: pos,
	   				player: player,
	   				playerRating: playerRating,
	   				score: score,
	   				tournamentRating: parseInt(ratingSum / roundCount)
	   			};

	   			players.push(j);
	   		});

	   		playerDivs.push({ division: div, players: players });
	   	});

	   	items.push({
	   		title: tournament,
	   		date: date,
	   		location: location,
	   		divisions: playerDivs
	   	})

	   	self.broadcastItems();
	   	scheduleTimer();
	   })
	  //handling error
	  .catch((error) => {
	  	console.log(error);
	  });
  }

  const scheduleTimer = function () {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(function () {
      fetchPDGA();
    }, reloadInterval);
  };

  const formatDate = function(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    return yyyy + '-' + mm + '-' + dd;
  }

  const getEventHrefs = function (url, numEvents, callback) {
    let hrefs = [];
    axios.get(url)
       .then(response => {
         const html = response.data;
         const $ = cheerio.load(html);

         $('tr').each((index, row) => {
			if (index === 0) return true;

			if ($(row).hasClass('status-Cancelled')) return true;

			var tier = $(row).find('.views-field-Tier').text().trim();
			if (tier === "A" && !aTier && dgpt &&
				!$(row).find('.views-field-OfficialName > a').text().includes("DGPT")) {
				return true;
			}

			hrefs.push($(row).find('.views-field-OfficialName > a').attr('href'));
			if (hrefs.length > numEvents) {
				hrefs.shift();
			}
         });

         for (var i = 0; i < hrefs.length; i++) {
         	callback(hrefs[i]);
         }

         if (hrefs.length < numEvents) {
         	let prev = $('li.pager-previous > a');
         	if ($(prev).length) {
         		getEventHrefs('https://www.pdga.com' + $(prev).attr('href'), numEvents - hrefs.length, callback)
         	}
         }
       })
      //handling error
      .catch((error) => {
        console.log(error);
      })
  }

  this.setReloadInterval = function (interval) {
    if (interval > 1000 && interval < reloadInterval) {
      reloadInterval = interval;
    }
  };

  this.startFetch = function () {
    fetchPDGA();
  };

  this.broadcastItems = function () {
    if (items.length <= 0) {
      Log.info("PDGA-Fetcher: No items to broadcast yet.");
      return;
    }

    Log.info("PDGA-Fetcher: Broadcasting " + items.length + " items.");
    itemsReceivedCallback(self);
  };

  this.onReceive = function (callback) {
    itemsReceivedCallback = callback;
  };

  this.onError = function (callback) {
    fetchFailedCallback = callback;
  };

  this.items = function () {
    return items;
  };
}

module.exports = PDGA_Fetcher;
