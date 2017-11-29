# Real React Native on Web Platform

## Install:

First initialize your react-native project

```shell
react-native init MyProject
cd MyProject
```

Install this module.

```shell
yarn add react-native-web-platform
```

Configure your rn-cli.config.js to add web platform & provideModuleNodeModules:

```javascript
'use strict';

const config = {
  // Add these lines if you already have a rn-cli.config.js
  getPlatforms() {
    return ['web'];
  },

   getProvidesModuleNodeModules() {
    return [
      'react-native',
      'react-native-web-platform',
    ];
  },
};

module.exports = config;
```

Add a launch.web.js and index.html in your project root:

```javascript
// launch.web.js
const { Bridge } = require('react-native-web-platform/lib/launch');

const bridge = new Bridge(
  __DEV__ ?
    './index.web.bundle?platform=web' :
    './index.web.bundle.js'
);


bridge.start();

bridge.createRootView(document.body, 'YOUR_APP_NAME_HERE');
```

index.html:

```html
<html>
<head>
  <title>YOUR_APP_NAME_HERE</title>
  <style>body { margin: 0; } html, body { height: 100%; }</style>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
</head>
<body>
<script src="./launch.web.bundle?platform=web"></script>
</body>
</html>
```

index.release.html:

```html
<html>
<head>
  <title>YOUR_APP_NAME_HERE</title>
  <style>body { margin: 0; } html, body { height: 100%; }</style>
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
</head>
<body>
<script src="./launch.bundle.js"></script>
</body>
</html>
```

## Debug

```shell
npm start
```

Then visit [http://localhost:8081/index.html](http://localhost:8081/index.html) to visit your page.

## Publish

Linux & Mac:

```shell
mkdir build
mkdir build/web
react-native bundle --entry-file launch.web.js --platform web --dev false --bundle-output build/web/launch.bundle.js --assets-dest build/web
react-native bundle --entry-file index.web.js --platform web --dev false --bundle-output build/web/index.bundle.js --assets-dest build/web
cp index.release.html build/web/index.html
```

Windows: 

```shell
md build
md build\web
react-native bundle --entry-file launch.web.js --platform web --dev false --bundle-output build/web/launch.bundle.js --assets-dest build/web
react-native bundle --entry-file index.web.js --platform web --dev false --bundle-output build/web/index.bundle.js --assets-dest build/web
copy index.release.html build\web\index.html
```

Then publish everything in `build/web` into your server.
