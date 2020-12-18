const Log = require("../../js/logger.js");
const axios = require('axios');
const cheerio = require('cheerio');

const Ultiworld_Fetcher = function (reloadInterval, numArticles, authors) {
	const self = this;
	let itemsReceivedCallback;
	let reloadTimer = null;
	let items = [];

	if (reloadInterval < 1000) {
		reloadInterval = 1000;
	}

	const fetchUltiworld = function () {
		clearTimeout(reloadTimer);
		reloadTimer = null;
		items = [];
		
		let url = 'https://discgolf.ultiworld.com/category/news/';
		
		// Find the most recent event
		axios.get(url)
			.then(response => {
				const html = response.data;
				const $ = cheerio.load(html);
					
				$('ol > li').each((index, elem) => {
					if (index >= numArticles) return false;

					let title = $(elem).find('h3 > a').text().trim();
					let author = $(elem).find('h6 > span > a').text().trim();
					let date = $(elem).find('h6').text().trim();
					if (date.indexOf("by") > 0) {
						date = date.substring(0, date.indexOf("by")).trim();
					}
					
					if (authors.length === 0 || authors.includes(author)) {
						items.push({
							title: title,
							date: date,
							author: author
						})
					}
				});

				self.broadcastItems();
				scheduleTimer();
			})
			//handling error
			.catch((error) => {
				console.log(error);
			})
	}

	const scheduleTimer = function () {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function () {
			fetchUltiworld();
		}, reloadInterval);
	};

	const formatDate = function (date) {
		var dd = String(date.getDate()).padStart(2, '0');
		var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = date.getFullYear();

		return yyyy + '-' + mm + '-' + dd;
	}

	this.setReloadInterval = function (interval) {
		if (interval > 1000 && interval < reloadInterval) {
			reloadInterval = interval;
		}
	};

	this.startFetch = function () {
		fetchUltiworld();
	};

	this.broadcastItems = function () {
		if (items.length <= 0) {
			Log.info("Ultiworld-Fetcher: No items to broadcast yet.");
			return;
		}
		Log.info("Ultiworld-Fetcher: Broadcasting " + items.length + " items.");
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

module.exports = Ultiworld_Fetcher;
