<div align="center">
  <img src="https://i-need.discord.cards/bb03c2.png" alt="logo" align="left" width=256>
  <a href="https://discordbots.org/bot/284134563381248000" >
    <img src="https://discordbots.org/api/widget/284134563381248000.svg" alt="PhotoBox" />
  </a>
  <hr>
  <p>The best memegen ever</p>
</div>
<br>

### Installation
If you are running an Ubuntu Server you can use `INSTALL-UNIX.sh` to easily install dependencies.
You also need to [download the fonts](https://github.com/Snazzah/PhotoBox/blob/master/assets/fonts/WhereAreTheFonts.md).

### Usage
Both `sharding.js` and `main.js` can be used to start the bot.  

### config.json
| Property | Type | Description |
| -------- | ---- | ----------- |
| discordToken | string | The token to the bot, duh. |
| prefix | string | The prefix that the bot will use. |
| owner | string | The Discord ID of the person hosting the bot, AKA you. |
| redis | object | The Redis Authorization Information needed for cooldowns. |
| discord | object | The [options](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions) for the Discord Client. |
| debug | bool | Whether or not to use verbose logs |
| botlist | object | Bot list tokens supported by [dbots.js](https://github.com/Snazzah/dbots.js) |
| api | object | api keys for certain commands |
| api.weebsh | string | Wolke token for Weeb.sh |
| commands | string | The path to the folder where all the commands will be. |
| image_codes | string | The path to the folder where all the image codes will be. |

### Sources
- [Blargbot](https://github.com/Ratismal/blargbot) by Ratismal/stupid cat
- [Pix2Pix](https://affinelayer.com/pixsrv/) by Affinelayer.com
- [Dank Memer](https://github.com/Dank-Memer) by Melmsie
- [Korra](https://github.com/weeb-services/korra) by weeb-services