const Log = require("../../js/logger.js");
const FeedMe = require("feedme");
const request = require("request");
const iconv = require("iconv-lite");

const DiscGolfNewsFetcher = function (url, reloadInterval, encoding, logFeedWarnings) {
    const self = this;

    let reloadTimer = null;

    if (reloadInterval < 1000) {
        reloadInterval = 1000;
    }

    const fetchReddit = function () {
        clearTimeout(reloadTimer);
        reloadTimer = null;
        items = [];

        let fetchFailedCallback = function (self, error) {
            Log.error(error);
        };
        let itemsReceivedCallback = function () { };

        const parser = new FeedMe();

        parser.on("item", function (item) {
            Log.info(item)
            //const title = item.title;
            //let description = item.description || item.summary || item.content || "";
            //const pubdate = item.pubdate || item.published || item.updated || item["dc:date"];
            //const url = item.url || item.link || "";

            //if (title && pubdate) {
            //    const regex = /(<([^>]+)>)/gi;
            //    description = description.toString().replace(regex, "");

            //    items.push({
            //        title: title,
            //        description: description,
            //        pubdate: pubdate,
            //        url: url
            //    });
            //} else if (logFeedWarnings) {
            //    Log.warn("Can't parse feed item:");
            //    Log.warn(item);
            //    Log.warn("Title: " + title);
            //    Log.warn("Description: " + description);
            //    Log.warn("Pubdate: " + pubdate);
            //}
        });

        parser.on("end", function () {
            self.broadcastItems();
            scheduleTimer();
        });

        parser.on("error", function (error) {
            fetchFailedCallback(self, error);
            scheduleTimer();
        });

        const nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1]);
        const opts = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Node.js " + nodeVersion + ") MagicMirror/" + global.version + " (https://github.com/MichMich/MagicMirror/)",
                "Cache-Control": "max-age=0, no-cache, no-store, must-revalidate",
                Pragma: "no-cache"
            },
            encoding: null
        };

        request(url, opts)
            .on("error", function (error) {
                fetchFailedCallback(self, error);
                scheduleTimer();
            })
            .pipe(iconv.decodeStream(encoding))
            .pipe(parser);
    }

    const scheduleTimer = function () {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(function () {
            fetchReddit();
        }, reloadInterval);
    };

    this.setReloadInterval = function (interval) {
        if (interval > 1000 && interval < reloadInterval) {
            reloadInterval = interval;
        }
    };

    this.startFetch = function () {
        fetchReddit();
    };
    
    this.broadcastItems = function () {
        if (items.length <= 0) {
            Log.info("DiscGolfNews-Fetcher: No items to broadcast yet.");
            return;
        }
        Log.info("DiscGolfNews-Fetcher: Broadcasting " + items.length + " items.");
        itemsReceivedCallback(self);
    };

    this.onReceive = function (callback) {
        itemsReceivedCallback = callback;
    };

    this.onError = function (callback) {
        fetchFailedCallback = callback;
    };

    this.url = function () {
        return url;
    };

    this.items = function () {
        return items;
    };
};

module.exports = DiscGolfNewsFetcher;