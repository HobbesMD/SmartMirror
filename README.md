# Team Magic Mirror

For our project we  made a magic mirror with a custom sized frame using a raspberry pi that offers connectivity google home mini through spotify api. It will look just like a mirror but with a display that tells you the weather, time, calendar, 
and much more allowing for an aesthetical and technological appeal for your home.

## Team Members and Roles

* [Michael Dykema](https://github.com/HobbesMD/CIS350-HW2-Dykema)
* [Josue Nunez](https://github.com/nunezjo/CIS350-HW2-NUNEZ)

## Prerequisites

1. [Installation of MagicMirror Platform](https://github.com/MichMich/MagicMirror)
2. [Installation of NPM](https://www.npmjs.com/)
3. [Installation of Snoowrap package](https://github.com/not-an-aardvark/snoowrap)
4. [Installation of Axios package](https://www.npmjs.com/package/axios)
5. [Installation of Cheerio package](https://www.npmjs.com/package/cheerio)

## Run Instructions

1. Copy the [MMM-WeatherGVSU](https://github.com/HobbesMD/SmartMirror/tree/master/MMM-WeatherGVSU) and [MMM-DiscGolfNews](https://github.com/HobbesMD/SmartMirror) folders into your \MagicMirror\modules folder.
2. Add these modules to your \MagicMirror\config\config.js by inserting the following code. The position can be changed to whatever you like.
```
{
  module: "MMM-DiscGolfNews",
  position: "top_right"
},
{
  module: "MMM-WeatherGVSU",
  position: "bottom-center"
},
```
3. The configs of these modules can be changed to modify certain features. Check out sample configs in the Readme.md of the respective modules.
4. Run MagicMirror either on a Raspberry Pi or your computer, with the window or server only following the instructions [here](https://docs.magicmirror.builders/getting-started/installation.html#usage)
