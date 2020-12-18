var NodeHelper = require("node_helper");
const validUrl = require("valid-url");
const DiscGolfRedditFetcher = require("./discgolffetcher.js");
const PDGA_Fetcher = require("./pdgafetcher.js");
const UltiworldFetcher = require("./ultiworldfetcher.js");
const Log = require("../../js/logger");

module.exports = NodeHelper.create({
    // subclass start method, clears the initial config array
    start: function () {
        Log.log("Starting node helper for: " + this.name);
		this.redditFetcher;
		this.pdgaFetcher;
		this.ultiworldFetcher;
    },
	socketNotificationReceived: function (notification, payload) {
		if (notification === "ADD_REDDIT") {
			this.createRedditFetcher(payload);
		} else if (notification == "ADD_PDGA") {
			this.createPDGAFetcher(payload);
		} else if (notification == "ADD_ULTIWORLD") {
			this.createUltiworldFetcher(payload);
		}
    },
    createRedditFetcher: function (config) {
		const reloadInterval = config.reloadInterval || 5 * 60 * 1000;
		const postsLimit = config.postsLimit || 5;
        Log.log(reloadInterval);

        let fetcher;
        if (this.redditFetcher == null) {
            Log.log("Create new r/DiscGolf fetcher - Interval: " + reloadInterval);
            fetcher = new DiscGolfRedditFetcher(reloadInterval, postsLimit);
			
			fetcher.onReceive(() => {
				this.broadcastReddit();
            });

            fetcher.onError((fetcher, error) => {
                this.sendSocketNotification("FETCH_ERROR", {
                    url: fetcher.url(),
                    error: error
                });
            });

			this.redditFetcher = fetcher;
        } else {
            Log.log("Use existing news r/DiscGolf fetcher");
			fetcher = this.redditFetcher;
            fetcher.setReloadInterval(reloadInterval);
			fetcher.broadcastItems();
        }

        fetcher.startFetch();
	},
	createUltiworldFetcher: function (config) {
		const reloadInterval = config.reloadInterval || 5 * 60 * 1000;
		const numUltiArticles = config.numUltiArticles || 5;
		const authors = config.ultiAuthors || [];
		Log.log(reloadInterval);

		let fetcher;
		if (this.ultiworldFetcher == null) {
			Log.log("Create new Ultiworld fetcher - Interval: " + reloadInterval);
			fetcher = new UltiworldFetcher(reloadInterval, numUltiArticles, authors);
			
			fetcher.onReceive(() => {
				this.broadcastUltiworld();
			});

			fetcher.onError((fetcher, error) => {
				this.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			this.ultiworldFetcher = fetcher;
		} else {
			Log.log("Use existing news Ultiworld fetcher");
			fetcher = this.ultiworldFetcher;
			fetcher.setReloadInterval(reloadInterval);
			fetcher.broadcastItems();
		}

		fetcher.startFetch();
	},
	createPDGAFetcher: function (config) {
		const reloadInterval = config.reloadInterval || 5 * 60 * 1000;
		const tiers = config.tiers || ["DGPT", "NT", "M"];
		const divisions = config.divisions || ["MPO"];
		const topX = config.topX || 5;
		const eventIDs = config.eventIDs || [];
		let numEvents = config.numEvents || 1;

		if (config.numEvents === 0) {
			numEvents = 0;
		}

		let pdgaFetch;
		if (this.pdgaFetcher == null) {
			Log.log("Create new PDGA fetcher - Interval: " + reloadInterval);
			pdgaFetch = new PDGA_Fetcher(reloadInterval, eventIDs, numEvents, tiers, topX, divisions);
			
			pdgaFetch.onReceive(() => {
				this.broadcastPDGA();
			});

			pdgaFetch.onError((fetcher, error) => {
				this.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			this.pdgaFetcher = pdgaFetch;
		} else {
			Log.log("Use existing PDGA fetcher");
			pdgaFetch = this.pdgaFetcher;
			pdgaFetch.setReloadInterval(reloadInterval);
			pdgaFetch.broadcastItems();
		}

		pdgaFetch.startFetch();
	},
    broadcastReddit: function () {
		var self = this;
        self.sendSocketNotification("REDDIT_ITEMS", self.redditFetcher.items());
	},
	broadcastUltiworld: function () {
		var self = this;
		self.sendSocketNotification("ULTIWORLD_ITEMS", self.ultiworldFetcher.items());
	},
	broadcastPDGA: function () {
		var self = this;
		self.sendSocketNotification("PDGA_ITEMS", self.pdgaFetcher.items());
	},
});
