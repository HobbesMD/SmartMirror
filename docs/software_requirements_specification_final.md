
# Overview
This is an overview of some of our module functions goals and requirements. This document describes the Magic Mirror user interface, hardware and software requirements. It also includes our test cases and related requirements.

# Software Requirements
This section contains three of our features a lists the related requirements of each.

## Functional Requirements
### Weather Module
| ID | Requirement | Test Cases |
| :-------------: | :---------- | :----------: |
| FR1 | Module shall check weather information and display it on screen with weekly reports. |  |
| FR2 | Users can add and remove locations to receive their weather data. |  |
| FR3 | On severe weather conditions users gets notified. |  |
| FR4 | User can switch between fahrenheit and celsius. |  |
| FR5 | |  |
  
### PDGA Tournament Scores
| ID | Requirement | Test Cases |
| :-------------: | :---------- | :----------: |
| FR6 | This feature shall display the leaderboard for sanctioned PDGA event(s) | TC1, TC2, TC3 |
| FR7 | The user shall be able to configure which divisions to display | TC1, TC3 |
| FR8 | The user shall be able to configure how many tournaments to display | TC2 |
| FR9 | The user shall be able to specify specific tournament(s) to display  | TC3 |
| FR10 | This feature shall display the score for each player relative to par | TC3 |

### Utliworld Articles
| ID | Requirement | Test Cases |
| :-------------: | :---------- | :----------: |
| FR11 | This feature shall display the most recent articles published on https://discgolf.ultiworld.com/category/news/ | TC4, TC5 |
| FR12 | The user shall be able to configure the number of articles to be displayed | TC4 |
| FR13 | The user shall be able to filter authors  | TC5 |
| FR14 | This feature shall display the author | TC6 |
| FR15 | This feature shall display the publish date  | TC6 |

## Non-Functional Requirements
### Portability and Compatability
| ID | Requirement | Test Cases |
| :-------------: | :---------- | :----------: |
| NFR1 | Modules shall work on a Raspberry Pi running a local client |  |
| NFR2 | Modules shall work on a PC using server only mode in Chrome |  |
  
### Usability
| ID | Requirement | Test Cases |
| :-------------: | :---------- | :----------: |
| NFR3 | User shall easily be able to configure which features shall be turned on | TC11 |
| NFR4 | Data shall and display shall update promptly with minimal delay | TC16 |
| NFR5 | Displaying multiple tournaments with multiple divisions shall be easily reabable | TC12 |
| NFR6 | Users shall be able to view the weather at all times | TC17 |
| NFR7 | r/DiscGolf Reddit posts shall display necessary information in a readable manner | TC11, TC12 |
| NFR8 | Wearther Module will reformat itself as you change the width and height. |  |
| NFR9 |  |  |
| NFR10 |  |  |
| NFR11 |  |  |
| NFR12 |  |  |
| NFR13 |  |  |
| NFR14 |  |  |
| NFR15 |  |  |

# Test Specification
This section contains our Unit Tests, Integration Tests, and System Tests
## Unit tests
| ID | Description | Steps | Input Values | Expected Output | Actual Output | Pass/Fail | Requirement Link |
| :-------------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: |
| TC1 | Test can user configure tournament divisions | Set config file according to input values, run program and check display | In config.js, ```divisions: ["MPO", "MA1"]``` | Only the MA1 divisions shall display | Only the MA1 division displays | Pass | FR7 |
| TC2 | Test displaying multiple tournaments | Set config file according to input values, run program and check display | In config.js, ```tiers: ["DGPT", "NT", "M"], numEvents: 2,``` | The two most recent events shall be rotated, at the time of writing expect "DGPT Tour Championship" and "DGPT - Play It Again Sports Jonesboro Open" | Display rotates "DGPT Tour Championship" and "DGPT - Play It Again Sports Jonesboro Open" | Pass | FR8 |
| TC3 | Test displaying scores relative to par | Set config file according to input values, run program and check display | In config.js, ```divisions: ["MA1"], eventIDs: [44298]``` | Top 3 scores shall be: Jeff Vanderploeg -21, Joel Bowser -20, Michael Dykema -18 | Jeff Vanderploeg -21, Joel Bowser -20, Michael Dykema -18 | Pass | FR10 |
| TC4 | Test can user configure number of Ultiworld articles | Set config file according to input values, run program and check display | In config.js, ```numUltiArticles: 3``` | The three most recent articles should be display, at this time it is: "Disc Golf Network Prices Rising Modestly in 2021", "Open Women And Open Divisions To Receive Equal PDGA Nation Tour Bonus Payout in 2021", and "2021 PDGA National Tour Media Plan: ..." | Display Reads: "Disc Golf Network Prices Rising Modestly in 2021", "Open Women And Open Divisions To Receive Equal PDGA Nation Tour Bonus Payout in 2021", and "2021 PDGA National Tour Media Plan: ..." | Pass | FR12 |
| TC5 | Test can user filter authors | Set config file according to input values, run program and check display | In config.js, ```numUltiArticles: 3, ultiAuthors: ["Charlie Eisenhood"],``` | Only author to be displayed shll be Charlie Eisenhood | Only articles by Charlie Eisenhood are displayed | Pass | FR13 |
| TC6 | Test displays Ultiworld article publish date | Set config file according to input values, run program and check display | In config.js, ```numUltiArticles: 3``` | At this moment, most recent article is "Disc Golf Network Prices Rising Modestly in 2021" with a publish date of "Dec 17, 2020" | Display is: "Disc Golf Network Prices Rising Modestly in 2021  Charlie Eisenhood   Dec 17, 2020" | Pass | FR15 |

| TC7 | xcxcxcxc xcxc xc |  |  |  |  |  |  |
| TC8 |  |  |  |  |  |  |  |
| TC9 |  |  |  |  |  |  |  |
| TC10 |  |  |  |  |  |  |  |
  
## Integration tests
| ID | Description | Steps | Input Values | Expected Output | Actual Output | Pass/Fail | Requirement Link |
| :-------------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: |
| TC11 | Test rotation through different disc golf information | Configure all 3 disc golf sources to display, run program and check display | In config.js, ```displayUltiworld: true, displayReddit: true, displayTournaments: true,``` | The screen should rotate through r/DiscGolf posts, tournament scores, and Ultiworld articles | All three different components are displayed | Pass | NFR3 |
| TC12 | Test multiple tournaments can be displayed with all components of MMM-DiscGolfNews | Configure all 3 disc golf sources to display, run program and check display | In config.js, ```displayUltiworld: true, displayReddit: true, displayTournaments: true, numEvents: 4,``` | There should be 6 total screens to rotate through, 4 tournaments, 1 for r/DiscGolf and 1 for Ultiworld | Pass | There are 6 displays rotated through, 4 tournaments, 1 Reddit, and 1 Ultiworld | NFR5 |
| TC13 |  |  |  |  |  |  |  |
| TC14 |  |  |  |  |  |  |  |
| TC15 |  |  |  |  |  |  |  |

## System tests
| ID | Description | Steps | Input Values | Expected Output | Actual Output | Pass/Fail | Requirement Link |
| :-------------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: | :----------: |
| TC16 | Test display loads quickly | Run program in browser and measure time for display | None | Both modules, MMM-DiscGolfNews and MMM-WeatherGVSU shall appear on screen within 2 seconds | Information is display in <1 second | Pass | NFR4 |
| TC17 | Test displaying MMM-DiscGolfNews and MMM-WeatherGVSU | Configure both modules to run, run program and check display | In config.js, ```{ module: 'MMM-WeatherGVSU', position: 'bottom_center' }, { module: "MMM-DiscGolfNews", position: "top_right" }``` | While MMM-DiscGolfNews rotates through different displays, weather should always be present in middle of screen | Weather is always visible, even as disc golf display rotates | Pass | NFR6 |
| TC18 |  |  |  |  |  |  |  |
| TC19 |  |  |  |  |  |  |  |
| TC20 |  |  |  |  |  |  |  |

# Software Artifacts
This section contains links to the artifacts develop over the course of the semester.
* [Weather Module Use Case](https://github.com/HobbesMD/SmartMirror/blob/master/artifacts/use_case_diagrams/Weather%20Use%20Case.pdf)
* [Email Use Case](https://github.com/HobbesMD/SmartMirror/blob/master/artifacts/use_case_diagrams/Email%20Use%20Case.pdf)
* [Disc Golf Use Case](https://github.com/HobbesMD/SmartMirror/blob/master/artifacts/use_case_diagrams/Disc%20Golfs%20Use%20Case.pdf)
* [Project Proposal](https://github.com/HobbesMD/SmartMirror/blob/master/docs/Team%20SmartMirror%20Proposal.md)
* [Midterm Presentation](https://github.com/HobbesMD/SmartMirror/blob/master/docs/Team%20SmartMirror%20Midterm%20Presentation.pdf)
* [Task List](https://github.com/HobbesMD/SmartMirror/blob/master/docs/TaskList.md)
* [Gantt Chart](https://github.com/HobbesMD/SmartMirror/blob/master/docs/SmartMirror%20Gantt%20Chart%2010-30.pdf)
* [Final Presentation](https://github.com/HobbesMD/SmartMirror/blob/master/docs/SmartMirror%20Final%20Presentation.pdf)
* [Meeting Minutes](https://github.com/HobbesMD/SmartMirror/tree/master/meetings)
