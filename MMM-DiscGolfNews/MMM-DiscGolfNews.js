Module.register("MMM-DiscGolfNews", {
    defaults: {
        text: "Disc Golf is Awesome!",
        feeds: [
            {
                title: "New York Times",
                url: "https://www.reddit.com/r/discgolf/hot/?limit=10",
                encoding: "UTF-8" //ISO-8859-1
            }
        ],
        reloadInterval: 1 * 60 * 1000, // every 5 minutes
    },
    start: function () {
        Log.info("Starting module: " + this.name);

        this.newsItems = [];
        this.loaded = false;
        this.activeItem = 0;
        
        this.registerFeeds();
    },
    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.innerHTML = this.config.text;
        return wrapper;
    },
    notificationReceived: function () { },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "DISCGOLF_ITEMS") {
            this.generateFeed(payload);

            Log.info(payload);

            if (!this.loaded) {
                this.scheduleUpdateInterval();
            }

            this.loaded = true;
        }
    },
    registerFeeds: function () {
        for (var f in this.config.feeds) {
            var feed = this.config.feeds[f];
            this.sendSocketNotification("ADD_FEED", {
                feed: feed,
                config: this.config
            });
        }
    },
    generateFeed: function (feeds) {
        //var newsItems = [];
        //for (var feed in feeds) {
        //    var feedItems = feeds[feed];
        //    if (this.subscribedToFeed(feed)) {
        //        for (var i in feedItems) {
        //            var item = feedItems[i];
        //            item.sourceTitle = this.titleForFeed(feed);
        //            if (!(this.config.ignoreOldItems && Date.now() - new Date(item.pubdate) > this.config.ignoreOlderThan)) {
        //                newsItems.push(item);
        //            }
        //        }
        //    }
        //}
        //newsItems.sort(function (a, b) {
        //    var dateA = new Date(a.pubdate);
        //    var dateB = new Date(b.pubdate);
        //    return dateB - dateA;
        //});
        //if (this.config.maxNewsItems > 0) {
        //    newsItems = newsItems.slice(0, this.config.maxNewsItems);
        //}

        //if (this.config.prohibitedWords.length > 0) {
        //    newsItems = newsItems.filter(function (value) {
        //        for (var i = 0; i < this.config.prohibitedWords.length; i++) {
        //            if (value["title"].toLowerCase().indexOf(this.config.prohibitedWords[i].toLowerCase()) > -1) {
        //                return false;
        //            }
        //        }
        //        return true;
        //    }, this);
        //}

        //// get updated news items and broadcast them
        //var updatedItems = [];
        //newsItems.forEach((value) => {
        //    if (this.newsItems.findIndex((value1) => value1 === value) === -1) {
        //        // Add item to updated items list
        //        updatedItems.push(value);
        //    }
        //});

        //// check if updated items exist, if so and if we should broadcast these updates, then lets do so
        //if (this.config.broadcastNewsUpdates && updatedItems.length > 0) {
        //    this.sendNotification("NEWS_FEED_UPDATE", { items: updatedItems });
        //}

        //this.newsItems = newsItems;
    },
    subscribedToFeed: function (feedUrl) {
        for (var f in this.config.feeds) {
            var feed = this.config.feeds[f];
            if (feed.url === feedUrl) {
                return true;
            }
        }
        return false;
    },
    titleForFeed: function (feedUrl) {
        for (var f in this.config.feeds) {
            var feed = this.config.feeds[f];
            if (feed.url === feedUrl) {
                return feed.title || "";
            }
        }
        return "";
    },
    scheduleUpdateInterval: function () {
        //var self = this;

        //self.updateDom(self.config.animationSpeed);

        //// Broadcast NewsFeed if needed
        //if (self.config.broadcastNewsFeeds) {
        //    self.sendNotification("NEWS_FEED", { items: self.newsItems });
        //}

        //this.timer = setInterval(function () {
        //    self.activeItem++;
        //    self.updateDom(self.config.animationSpeed);

        //    // Broadcast NewsFeed if needed
        //    if (self.config.broadcastNewsFeeds) {
        //        self.sendNotification("NEWS_FEED", { items: self.newsItems });
        //    }
        //}, this.config.updateInterval);
    },

    resetDescrOrFullArticleAndTimer: function () {
        //this.isShowingDescription = this.config.showDescription;
        //this.config.showFullArticle = false;
        //this.scrollPosition = 0;
        //// reset bottom bar alignment
        //document.getElementsByClassName("region bottom bar")[0].style.bottom = "0";
        //document.getElementsByClassName("region bottom bar")[0].style.top = "inherit";
        //if (!this.timer) {
        //    this.scheduleUpdateInterval();
        //}
    },

    notificationReceived: function (notification, payload, sender) {
        //const before = this.activeItem;
        //if (notification === "ARTICLE_NEXT") {
        //    this.activeItem++;
        //    if (this.activeItem >= this.newsItems.length) {
        //        this.activeItem = 0;
        //    }
        //    this.resetDescrOrFullArticleAndTimer();
        //    Log.info(this.name + " - going from article #" + before + " to #" + this.activeItem + " (of " + this.newsItems.length + ")");
        //    this.updateDom(100);
        //} else if (notification === "ARTICLE_PREVIOUS") {
        //    this.activeItem--;
        //    if (this.activeItem < 0) {
        //        this.activeItem = this.newsItems.length - 1;
        //    }
        //    this.resetDescrOrFullArticleAndTimer();
        //    Log.info(this.name + " - going from article #" + before + " to #" + this.activeItem + " (of " + this.newsItems.length + ")");
        //    this.updateDom(100);
        //}
        //// if "more details" is received the first time: show article summary, on second time show full article
        //else if (notification === "ARTICLE_MORE_DETAILS") {
        //    // full article is already showing, so scrolling down
        //    if (this.config.showFullArticle === true) {
        //        this.scrollPosition += this.config.scrollLength;
        //        window.scrollTo(0, this.scrollPosition);
        //        Log.info(this.name + " - scrolling down");
        //        Log.info(this.name + " - ARTICLE_MORE_DETAILS, scroll position: " + this.config.scrollLength);
        //    } else {
        //        this.showFullArticle();
        //    }
        //} else if (notification === "ARTICLE_SCROLL_UP") {
        //    if (this.config.showFullArticle === true) {
        //        this.scrollPosition -= this.config.scrollLength;
        //        window.scrollTo(0, this.scrollPosition);
        //        Log.info(this.name + " - scrolling up");
        //        Log.info(this.name + " - ARTICLE_SCROLL_UP, scroll position: " + this.config.scrollLength);
        //    }
        //} else if (notification === "ARTICLE_LESS_DETAILS") {
        //    this.resetDescrOrFullArticleAndTimer();
        //    Log.info(this.name + " - showing only article titles again");
        //    this.updateDom(100);
        //} else if (notification === "ARTICLE_TOGGLE_FULL") {
        //    if (this.config.showFullArticle) {
        //        this.activeItem++;
        //        this.resetDescrOrFullArticleAndTimer();
        //    } else {
        //        this.showFullArticle();
        //    }
        //} else if (notification === "ARTICLE_INFO_REQUEST") {
        //    this.sendNotification("ARTICLE_INFO_RESPONSE", {
        //        title: this.newsItems[this.activeItem].title,
        //        source: this.newsItems[this.activeItem].sourceTitle,
        //        date: this.newsItems[this.activeItem].pubdate,
        //        desc: this.newsItems[this.activeItem].description,
        //        url: this.getActiveItemURL()
        //    });
        //}
    },

    showFullArticle: function () {
        //this.isShowingDescription = !this.isShowingDescription;
        //this.config.showFullArticle = !this.isShowingDescription;
        //// make bottom bar align to top to allow scrolling
        //if (this.config.showFullArticle === true) {
        //    document.getElementsByClassName("region bottom bar")[0].style.bottom = "inherit";
        //    document.getElementsByClassName("region bottom bar")[0].style.top = "-90px";
        //}
        //clearInterval(this.timer);
        //this.timer = null;
        //Log.info(this.name + " - showing " + this.isShowingDescription ? "article description" : "full article");
        //this.updateDom(100);
    }
});