# Thymebot - node.js
* Thyme discord bot built using the discord.js framework.
* Includes a fully capable music playing module with voice support.
* Features full YouTube audio support and indirect Spotify compatibility.
* Many additional and discretionary features.
* Use the **!help** command to find out what else we are capable of.
___

## Contributors
*  **Author:** Linke (founding member)
*  **Support:** Matte (discord.js assistance)
*  **Sponsoring:** CoCo, UZo, IMan, et al.

## Development:
### Bugfixes:
* Seek broken.

### Current tasks:
* !np Playback buttons.
* Complete Sora overhaul (!ship, !marry, !leaderboard).

### Suggested features:
* FFMpeg manipulation.
* Add search for multiple songs.
* Upgraded polling (DM !ask, guild specific functionality).
___

## Installation
### Downloading the project:
To clone the repository enter in the terminal<br>
`git clone https://github.com/Kaltzisp/thymebot.git`

This project uses a branched workflow - updates should be made on new branches.

To update code to current version<br>
`git checkout master`<br>
`git pull`

To create a new branch<br>
`git checkout -b new_branch_name`

Staging changes, committing, and pushing<br>
`git add .`<br>
`git commit -a -m "commit_message"`<br>
`git push`<br>

To request a merge into `master`:<br>
`git checkout branch_to_merge`<br>
`git merge master`<br>

### Porting the project:

Run the following code in the terminal to install npm<br>
`[sudo] npm install npm -g`

Next to install project dependencies enter the directory and run<br>
`npm install --prune`

To run the bot you will need to start the process using<br>
`node index.js`

The list of available Weatherbit.io cities is available from<br>
`https://www.weatherbit.io/static/exports/cities_all.csv.gz`

**To run the server, you will also require API keys for used services, including:**
- [Discord Developer portal](https://discord.com/developers/) (discord authentication)
- [Jsonbin.io](jsonbin.io) (Data Storage)
- [Weatherbit.io](weatherbit.io) (Weather API)
- [Google Developer's Console](https://console.developers.google.com/) (YouTube Data V3 API)
- [Spotify](https://developer.spotify.com/) (Web API)
- [KSoft.si](ksoft.si) (Lyrics API)