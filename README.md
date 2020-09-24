# Thymebot - node.js
Thyme discord bot built using the discord.js framework.

## Installation
To clone the repository enter in the terminal
`git clone https://github.com/Kaltzisp/thymebot.git`
This project uses a branched workflow; updates should be made on new branches

To update code to current version:
`git checkout master`
`git pull`

To create a new branch:
`git checkout -b new_branch_name`

Staging changes, committing, and pushing:
`git add .`
`git commit -a -m "commit_message"`
`git push`

To request a merge into `master`:
`git checkout branch_to_merge`
`git merge master`

___
Run the following code in the terminal to install npm
`[sudo] npm install npm -g`
Next to install project dependencies enter the directory and run
`npm install --prune`
To run the bot you will need to start the process using
`node index.js`

The list of available Weatherbit.io cities is available from
`https://www.weatherbit.io/static/exports/cities_all.csv.gz`
___

**To run the server, you will also require API keys for used services, including:**
- [Discord Developer portal](https://discord.com/developers/) (discord authentication)
- Jsonbin.io (Data Storage)
- Weatherbit.io (Weather API)
- [Google Developer's Console](https://console.developers.google.com/) (YouTube Data V3 API)
- [Spotify](https://developer.spotify.com/) (Web API)
- KSoft.si (Lyrics API)

## Contributors
*  **Author:** Linke (founding member)
*  **Support:** Matte (discord.js assistance)
* **Sponsoring:** CoCo, UZo, IMan, et al.

## Development:
### Bugfixes:
* !seek does not work.

### Current tasks:
* Add an informative !help function.
* Complete Spotify integration into code.

### Suggested features:
* Test file for development git push pipeline.
* Class based refactor of entire code base.
* Interactive !np embed (moving dot & restart button).
* Upgraded polling (DM !ask, guild specific functionality).
* Monash Muggles: !iam <role_name>