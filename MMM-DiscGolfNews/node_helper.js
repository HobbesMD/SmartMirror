var NodeHelper = require("node_helper");
const validUrl = require("valid-url");
const DiscGolfNewsFetcher = require("./discgolffetcher.js");
const Log = require("../../js/logger");

module.exports = NodeHelper.create({
    // subclass start method, clears the initial config array
    start: function () {
        Log.log("Starting node helper for: " + this.name);
        this.fetchers = [];
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "ADD_FEED") {
            this.createFetcher(payload.feed, payload.config);
        }
    },
    createFetcher: function (feed, config) {
        const url = feed.url || "";
        const encoding = feed.encoding || "UTF-8";
        const reloadInterval = feed.reloadInterval || config.reloadInterval || 5 * 60 * 1000;

        if (!validUrl.isUri(url)) {
            this.sendSocketNotification("INCORRECT_URL", url);
            return;
        }

        let fetcher;
        if (typeof this.fetchers[url] === "undefined") {
            Log.log("Create new disc golf fetcher for url: " + url + " - Interval: " + reloadInterval);
            fetcher = new DiscGolfNewsFetcher(url, reloadInterval, encoding, config.logFeedWarnings);

            fetcher.onReceive(() => {
                this.broadcastFeeds();
            });

            fetcher.onError((fetcher, error) => {
                this.sendSocketNotification("FETCH_ERROR", {
                    url: fetcher.url(),
                    error: error
                });
            });

            this.fetchers[url] = fetcher;
        } else {
            Log.log("Use existing news fetcher for url: " + url);
            fetcher = this.fetchers[url];
            fetcher.setReloadInterval(reloadInterval);
            fetcher.broadcastItems();
        }

        fetcher.startFetch();
    },
    broadcastFeeds: function () {
        var feeds = {};
        for (var f in this.fetchers) {
            feeds[f] = this.fetchers[f].items();
        }
        this.sendSocketNotification("DISCGOLF_ITEMS", feeds);
    }
});