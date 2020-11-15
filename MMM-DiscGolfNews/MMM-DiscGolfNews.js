Module.register("MMM-DiscGolfNews", {
    defaults: {
        text: "Disc Golf is Awesome! :)",
        reloadInterval: 5 * 60 * 1000, // every 5 minutes
        updateInterval: 10 * 1000,
    },
    start: function () {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);

        this.redditItems = [];
        this.loaded = false;

        this.addRedditFeed();
    },
    getScripts: function () {
        return ["moment.js"];
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "REDDIT_ITEMS") {
            this.redditItems = payload;

            if (!this.loaded) {
                this.scheduleUpdateInterval();
            }

            this.loaded = true;
        }
    },
    getDom: function () {
        const wrapper = document.createElement("div");

        console.log(this.redditItems);
        if (this.redditItems.length === 0) {
            wrapper.innerHTML = this.config.text;
        }
        else {
            for (let i = 0; i < this.redditItems.length; i++) {
                var redditPost = document.createElement("div");
                //redditPost.className("small");

                redditPost.innerHTML = this.redditItems[i].title;
                redditPost.innerHTML += " " + moment(new Date(this.redditItems[i].created)).fromNow();
                wrapper.appendChild(redditPost);
            }
        }

        return wrapper;
    },
    addRedditFeed: function () {
        this.sendSocketNotification("ADD_REDDIT", this.config);
        console.log("notification sent to node_helper");
    },
    scheduleUpdateInterval: function () {
        var self = this;
        self.updateDom();

        self.sendNotification("REDDIT_FEED", { items: self.redditItems });

        this.timer = setInterval(function () {
            self.sendNotification("REDDIT_FEED", { items: self.redditItems });
            self.updateDom();
        }, this.config.updateInterval);
    }
});