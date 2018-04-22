import {Board} from './Arduino.js';
import {Keybaord} from './Keyboard.js';
import IBMCredentials from './credentials.js'


// uncomment  and changge to import devices
// import {Button} from './Devices.js';
// let button1 = Button();

let board = new Board();
board.connect({baudrate: 9600});


let keyboard = new Keybaord();

// 
// board.on('line', line => {
//     console.log(`line`, String.fromCharCode(...line))
// });

// only works if device is set: `let board = new Board([button1]);`
board.on('point', point => {
    console.log(`point`, point)
});

// uncomment if keyboard wanted
// keyboard.on('press', (e) =>{
//     console.log(e);
// });
// keyboard.on('release', (e) =>{
//     console.log(e);
// });
