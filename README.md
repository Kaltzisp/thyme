# Thymebot - node.js
* Thyme discord bot built using the discord.js framework.
* Includes a fully capable music playing module with voice support.
* Features full YouTube audio support and indirect Spotify compatibility.
* Many additional and discretionary features.
* Use the **!help** command to find out what else we are capable of.
* Official provider for the **Monash Muggles!**
___

## Contributors
*  **Author:** Linke (founding member)
*  **Support:** Matte (discord.js assistance)
*  **Sponsoring:** CoCo, UZo, IMan, et al.

## Development:
### Bugfixes:
* End ffmpeg streams.
* Playlist owners.
* Verbose save messages.
* Region change broke playlists?
* 11 minute plus songs fail?
* Remove in the open from music plays.
* Fix pause.
* Reset bot activity on radio end stream / song finish.
* Video unavailable: https://www.youtube.com/watch?v=GdeaLnnWM18

### Current tasks:
* Discord notifications for Muggles.
* Sorting quiz.
* House points.
* Meme competition.
* Remove song from playlist.
* !np Playback buttons.
* Complete Sora overhaul (!ship, !marry, !leaderboard).

### Suggested features:
* FFMpeg manipulation.
* Add search for multiple songs.
* Upgraded polling (DM !ask, guild specific functionality).
___

## Metadata:
### Porting the project:
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