## Sample config.js entry

```
{
	module: "MMM-DiscGolfNews",
	position: "top_right",
	config: {
		reloadInterval: 300000,
		updateInterval: 15000,
		
		// Tournament Scores
		displayTournaments: true,
		tiers: ["DGPT", "NT", "M"],
		numEvents: 2,
		divisions: ["MPO", "FPO"],
		//divisions: ["MPO", "MA1"],
		topX: 3,
		eventIDs: [44298, 44224], 
		
		// Reddit
		displayReddit: true,
		postsLimit: 10,
		
		// Ultiworld
		displayUltiworld: true,
		numUltiArticles: 3,
		ultiAuthors: ["Charlie Eisenhood"],
	}			
},
```