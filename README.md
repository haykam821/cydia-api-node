#cydia-api-node

Just a simple node library for the cydia api. Used for @TweakBot#2861 in Discord.

#How To Use
<hr>
.getPrice(string) - Get price for package.<br>

```js
const cydia = require('cydia-api-node');

cydia.getPrice('com.ziph0n.pickpocket') //Use the package name and not the display name
.then(price => {
	console.log(price); //1.99
});
```

<br>
.getRepo(string) - Get repo for package.<br>

```js
const cydia = require('cydia-api-node');

cydia.getRepo('com.ziph0n.pickpocket') //Use the package name and not the display name
.then(repo => {
	console.log(repo); 
	/*
		{
			name: "BigBoss",
			link: "http://apt.thebigboss.org/repofiles/cydia/"
		}
	*/
});
```

<br>
.getInfo(string) - Basic Info

```js
const cydia = require('cydia-api-node');

cydia.getInfo('com.ziph0n.pickpocket') //Use the package name or the display name. Case-insensitive
.then(info => {
	console.log(info);
	/* 
		{ 
			display: 'PickPocket',
			name: 'com.ziph0n.pickpocket',
			section: 'Tweaks',
			summary: 'A Powerful, Full Featured and Highly Customizable Tweak Against Thieves!',
			version: '1.4'
		}
	*/
});
cydia.getInfo('PickPocket') //Use the package name or the display name. Case-insensitive
.then(info => {
	console.log(info);
	/* 
		{ 
			display: 'PickPocket',
			name: 'com.ziph0n.pickpocket',
			section: 'Tweaks',
			summary: 'A Powerful, Full Featured and Highly Customizable Tweak Against Thieves!',
			version: '1.4'
		}
	*/
});
```

<br>
.getAllInfo(string) - .getInfo(), .getPrice(), and .getRepo() in one function<br>

```js
const cydia = require('cydia-api-node');

cydia.getAllInfo('com.ziph0n.pickpocket') //Use the package name or the display name. Case-insensitive
.then(info => {
	console.log(info);
	/* 
		{ 
			display: 'PickPocket',
			name: 'com.ziph0n.pickpocket',
			section: 'Tweaks',
			summary: 'A Powerful, Full Featured and Highly Customizable Tweak Against Thieves!',
			version: '1.4',
			price: 1.99
		}
	*/
});
cydia.getAllInfo('PickPocket') //Use the package name or the display name. Case-insensitive
.then(info => {
	console.log(info);
	/* 
		{ 
			display: 'PickPocket',
			name: 'com.ziph0n.pickpocket',
			section: 'Tweaks',
			summary: 'A Powerful, Full Featured and Highly Customizable Tweak Against Thieves!',
			version: '1.4',
			price: 1.99,
			repo: {
				name: "BigBoss",
				link: "http://apt.thebigboss.org/repofiles/cydia/"
			}
		}
	*/
});
```
