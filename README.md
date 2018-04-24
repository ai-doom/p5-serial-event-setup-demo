# Demo

## Prerequisite
### Serial Server App
You might choose from an GUI App or commnad line:

- GUI
download https://github.com/vanevery/p5.serialcontrol/releases
- ​cmd
see https://github.com/vanevery/p5.serialport#p5serial-nodejs 

### Setup `credentials.json`
1. Visit [IBM Cloud](https://www.ibm.com/watson/services/text-to-speech/).
2. Follow the guide to setup IBM account and create API credientals.
3. copy the credientals to `credientals.json` formated as `credientals.sample.json`, there is few thing needs to change.

### Start a Web Server for commnunication
Make sure you have node.js installed to have it run, if you don't have it:

#### install `node.js` if you haven't
```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install node
```

#### install dependencies
```bash
$ npm install
```

## How to run

### Start the Serial Server 
Start p5.serialcontrol App (or cmd line server)

### Start web server
``` bash
$ node app
```

## Test
### Use keyboard to convert speech
Keep pressing `space` while talking.

## Development

Main Interaction logic are in `static`. `app.js` is for communication with IBM server.

