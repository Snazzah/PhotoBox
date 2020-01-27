<div align="center">
  <img src="https://awau.moe/bb03c2.png" alt="logo" align="left" width=256>
  <a href="https://discordbots.org/bot/284134563381248000" >
    <img src="https://discordbots.org/api/widget/284134563381248000.svg" alt="PhotoBox" />
  </a>
  <hr>
  <p>The best memegen ever</p>
</div>
<br>

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSnazzah%2FPhotoBox.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FSnazzah%2FPhotoBox?ref=badge_shield)


### Installation
You need [Node.JS](https://nodejs.org/) v10 (use [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md)) or newer along with [NPM](https://npmjs.com). 
You also need to install [ImageMagick](http://www.imagemagick.org/).
```
sudo apt install libcairo2-dev libjpeg-dev libgif-dev
sudo apt install imagemagick
```

### Usage
You can run `npm start` to start the bot.
Make sure to copy and paste `config/_default.json` into `config/default.json` and fill in the properties below **BEFORE** starting the bot.

### config/default.json
| Property | Type | Description |
| -------- | ---- | ----------- |
| discordToken | string | The token to the bot, duh. |
| prefix | string | The prefix that the bot will use. |
| owner | string | The Discord ID of the person hosting the bot, AKA you. |
| redis | object | The Redis Authorization Information needed for cooldowns. |
| discord | object | The [options](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions) for the Discord Client. |
| debug | bool | Whether or not to use verbose logs |
| botlist | object | Bot list tokens supported by [dbots.js](https://github.com/Snazzah/dbots.js) |
| options.lookBackLimit | number | How far PhotoBox should look back for a photo |
| options.requestTimeout | number | How long a request should take until it is dropped |
| api.weebsh | string | Wolke token for Weeb.sh |
| api.giphy | string | API key for Giphy |
| commands | string | The path to the folder where all the commands will be. |
| image_codes | string | The path to the folder where all the image codes will be. |

### Sources
- [Blargbot](https://github.com/Ratismal/blargbot) by Ratismal/stupid cat
- [Dank Memer](https://github.com/DankMemer) by Melmsie
- [Korra](https://github.com/weeb-services/korra) by weeb-services
- [Switchblade](https://github.com/SwitchbladeBot/switchblade) by Doges

## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSnazzah%2FPhotoBox.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FSnazzah%2FPhotoBox?ref=badge_large)
