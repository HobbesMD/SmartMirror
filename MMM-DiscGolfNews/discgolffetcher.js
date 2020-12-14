const Log = require("../../js/logger.js");
const FeedMe = require("feedme");
const request = require("request");
const iconv = require("iconv-lite");
const snoowrap = require("snoowrap");

const DiscGolfRedditFetcher = function (reloadInterval, postsLimit) {
    const self = this;
    const r = new snoowrap({
        userAgent: 'A random string.',
        clientId: 'dljS59UD4Hxx-A',
        clientSecret: 'YR-Q8x4z_7uumvt6RGmOVz19uBRBdg',
        refreshToken: '3077461427-fsvIajukKSNLdZ2ZSCKFGbxyGc0zqA'
    });
    r.config({proxies:false})

	let itemsReceivedCallback;
    let reloadTimer = null;
    let items = [];

    if (reloadInterval < 1000) {
        reloadInterval = 1000;
    }

    const fetchReddit = function () {
        clearTimeout(reloadTimer);
        reloadTimer = null;
        items = [];
        
        const subreddit = r.getSubreddit('discgolf');
        const hotPosts = subreddit.getHot();

        r.getSubreddit('discgolf').getHot({ limit: postsLimit })
            .map(post => {
                let title = post.title;
                if (post.title.length > 60) {
                    title = title.slice(0, 50);
                    title += "..."
                }                

                return {
                    title: title,
                    score: post.score,
                    created: new Date(post.created_utc * 1000)
                }
            }).then(posts => {
				items = posts;
                self.broadcastItems();
                scheduleTimer();
            });
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
            Log.info("Reddit-Fetcher: No items to broadcast yet.");
            return;
		}
		Log.info("Reddit-Fetcher: Broadcasting " + items.length + " items.");
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
};

module.exports = DiscGolfRedditFetcher;
