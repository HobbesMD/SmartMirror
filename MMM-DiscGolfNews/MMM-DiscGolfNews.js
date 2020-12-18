Module.register("MMM-DiscGolfNews", {
    defaults: {
        text: "Disc Golf is Awesome! :)",
        reloadInterval: 5 * 60 * 1000, // every 5 minutes
		updateInterval: 3 * 1000,
		displayTournaments: true,
		displayReddit: true,
		displayUltiworld: true,
    },
    start: function () {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);

		this.items = [];		
		this.activeItem = 0;
		this.loaded = false;

		if (this.config.displayUltiworld)
			this.addUltiworld();
		if (this.config.displayTournaments)
			this.addPDGA();
		if (this.config.displayReddit)
			this.addRedditFeed();
    },
    getScripts: function () {
        return ["moment.js"];
	},
	getStyles: function () {
		return [this.file('custom.css')];
	},
	socketNotificationReceived: function (notification, payload) {
		console.log(notification)
		if (notification === "REDDIT_ITEMS") {
			var found = false;
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].redditItems) {
					this.items[i].redditItems = payload;
					found = true;
					break;
				}
			}

			if (!found) {
				this.items.push({
					redditItems: payload
				});
			}

			if (!this.loaded) {
				this.scheduleUpdateInterval();
			}

			this.loaded = true;
		} else if (notification == "ULTIWORLD_ITEMS") {
			var found = false;
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].ultiworldItems) {
					this.items[i].ultiworldItems = payload;
					found = true;
					break;
				}
			}

			if (!found) {
				this.items.push({
					ultiworldItems: payload
				});
			}

			if (!this.loaded) {
				this.scheduleUpdateInterval();
			}

			this.loaded = true;
		} else if (notification == "PDGA_ITEMS") {
			for (let i = 0; i < this.items.length; i++) {
				if (this.items[i].tournament) {
					this.items.splice(i, 1);
					i--;
				}
			}

			for (let i = 0; i < payload.length; i++) {
				this.items.push({
					tournament: payload[i]
				});
			}

			if (!this.loaded) {
				this.scheduleUpdateInterval();
			}

			this.loaded = true;
		}
    },
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		
		if (this.activeItem >= this.items.length) {
			this.activeItem = 0;
		}

		if (this.items.length === 0) {
			wrapper.innerHTML = this.config.text;
		}
		else if (this.items[this.activeItem].redditItems) {
			let posts = this.items[this.activeItem].redditItems;
			var title = document.createElement("div");
			title.innerHTML = "r/DiscGolf Hot"
			title.className = "reddit-title";
			wrapper.appendChild(title);

			var table = document.createElement("Table");

			for (let i = 0; i < posts.length; i++) {
				var row = document.createElement("tr");
				row.className = "reddit-post-row";

				var score = document.createElement("td");
				score.innerHTML = '+' + posts[i].score;
				score.className = "reddit-post-score";
				row.appendChild(score);

				var title = document.createElement("td");
				title.innerHTML = posts[i].title;
				title.className = "reddit-post-title";
				row.appendChild(title);

				var date = document.createElement("td");
				date.innerHTML = moment(new Date(posts[i].created)).fromNow();
				date.className = "reddit-post-date";
				row.appendChild(date);

				table.appendChild(row);
			}

			wrapper.appendChild(table);
		}
		else if (this.items[this.activeItem].ultiworldItems) {
			let articles = this.items[this.activeItem].ultiworldItems;
			var title = document.createElement("div");
			title.innerHTML = "Ultiworld Disc Golf"
			title.className = "ultiworld-title";
			wrapper.appendChild(title);

			var table = document.createElement("Table");

			for (let i = 0; i < articles.length; i++) {
				var row = document.createElement("tr");
				row.className = "ultiworld-article-row";
				
				var title = document.createElement("td");
				title.innerHTML = articles[i].title;
				title.className = "ultiworld-article-title";
				row.appendChild(title);

				var author = document.createElement("td");
				author.innerHTML = articles[i].author;
				author.className = "ultiworld-article-author";
				row.appendChild(author);

				var date = document.createElement("td");
				date.innerHTML = articles[i].date;
				date.className = "ultiworld-article-date";
				row.appendChild(date);

				table.appendChild(row);
			}

			wrapper.appendChild(table);
		}
		else if (this.items[this.activeItem].tournament) {
			let tournament = this.items[this.activeItem].tournament;
			var title = document.createElement("div");

			if (tournament.title.match(/presented/i)) {
				var pIndex = tournament.title.toLowerCase().indexOf('presented');
				title.innerHTML = tournament.title.substring(0, pIndex);
			} else {
				title.innerHTML = tournament.title;
			}
			title.className = "tournament-name";
			wrapper.appendChild(title);
			
			for (let i = 0; i < tournament.divisions.length; i++) {
				var division = tournament.divisions[i];

				var divisionWrapper = document.createElement("div");
				var divisionTitle = document.createElement("div");
				divisionTitle.innerHTML = division.division;
				divisionTitle.className = "division-title";
				divisionWrapper.appendChild(divisionTitle);

				var table = document.createElement("Table");
				table.className = "division-table";

				for (let j = 0; j < division.players.length; j++) {
					var player = division.players[j];
					var row = document.createElement("tr");
					row.className = "player-row";

					var pos = document.createElement("td");
					pos.innerHTML = player.position;
					pos.className = "player-pos";
					row.appendChild(pos);

					var playerInfo = document.createElement("td");
					playerInfo.className = "player-info";

					var playerName = document.createElement("div");
					playerName.innerHTML = player.player;
					playerName.className = "player-name";
					playerInfo.appendChild(playerName);

					var rating = document.createElement("div");
					rating.innerHTML = "(" + player.playerRating + ")";
					rating.className = "player-rating";
					playerInfo.appendChild(rating);
					
					row.appendChild(playerInfo);

					if (player.score) {
						var score = document.createElement("td");
						score.innerHTML = player.score;
						if (player.score < 0)
							score.className = "player-score-under";
						else
							score.className = "player-score-over";
						row.appendChild(score);
					}

					if (player.tournamentRating) {
						var tournamentRating = document.createElement("td");
						tournamentRating.innerHTML = "(" + player.tournamentRating + ")";
						tournamentRating.className = "player-tournament-rating";
						row.appendChild(tournamentRating);
					}
					
					table.appendChild(row);
				}
				
				divisionWrapper.appendChild(table);
				wrapper.appendChild(divisionWrapper);
			}
		}

        return wrapper;
    },
    addRedditFeed: function () {
        this.sendSocketNotification("ADD_REDDIT", this.config);
	},
	addPDGA: function () {
		this.sendSocketNotification("ADD_PDGA", this.config);
	},
	addUltiworld: function () {
		this.sendSocketNotification("ADD_ULTIWORLD", this.config);
	},
	scheduleUpdateInterval: function () {
		var self = this;
		self.updateDom();
		
		this.timer = setInterval(function () {
			self.activeItem++;
			self.updateDom();
		}, this.config.updateInterval);
	}
});
