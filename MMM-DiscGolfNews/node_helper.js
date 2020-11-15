var NodeHelper = require("node_helper");
const validUrl = require("valid-url");
const DiscGolfNewsFetcher = require("./discgolffetcher.js");
const Log = require("../../js/logger");

module.exports = NodeHelper.create({
    // subclass start method, clears the initial config array
    start: function () {
        Log.log("Starting node helper for: " + this.name);
        this.redditFetcher;
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "ADD_REDDIT") {
            this.createFetcher(payload);
        }
    },
    createFetcher: function (config) {
        const reloadInterval = config.reloadInterval || 5 * 60 * 1000;
        Log.log(reloadInterval);

        let fetcher;
        if (this.redditFetcher == null) {
            Log.log("Create new r/DiscGolf fetcher - Interval: " + reloadInterval);
            fetcher = new DiscGolfNewsFetcher(reloadInterval);

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
    broadcastReddit: function () {
        var self = this;
        self.sendSocketNotification("REDDIT_ITEMS", self.redditFetcher.items());
    }
});