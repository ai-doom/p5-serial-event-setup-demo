import  './libraries/jquery.min.js';
import {Board} from './Arduino.js';
import {Keybaord} from './Keyboard.js';
import {SpeechToText} from './IBM.js'
import './libraries/howler.js';

// uncomment  and changge to import devices
// import {Button} from './Devices.js';
// let button1 = Button();

const board = new Board();
board.connect({baudrate: 9600});

// 
// board.on('line', line => {
//     console.log(`line`, String.fromCharCode(...line))
// });

// only works if device is set: `let board = new Board([button1]);`
board.on('point', point => {
    console.log(`point`, point)
});

class Siri {
    constructor(filepath = 'Siri.aac'){
        this.siri = new Howl({
            src: [filepath],
            sprite: {
              start: [0, 1000],
              done: [1000, 1000],
              cancel: [2000, 1000]
            }
          });
    }
    play(spriteName){
        if(this.siri.playing()){
            this.siri.stop();
        }
        this.siri.play(spriteName);
    }
    start(){
        this.play('start');
    }
    done(){
        this.play('done')
    }
    cancel(){
        this.play('cancel')
    }
}
const siri = new Siri();

const siriKey = ' ';
const keyboard = new Keybaord();
keyboard.on('press', async (e) =>{
    if(e.key == siriKey && !isBusy()){
        record_begin();

        keyboard.once('release', (e) =>{
            if(e.key == siriKey){
                record_might_end();
            }
        });
    }
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const microm = new Microm();
var recordSometime = false;
var aborted = false;

async function record_begin(){
    await microm.record();
    console.log('record_begin...');
    
    setTimeout(()=>{
        siri.start();
    }, 500);

    await wait(700);
    if(aborted){
        aborted = false;
        return false;
    }
    recordSometime = true;
    swal({
        title: `Recorder`, 
        text: "recording...", 
        icon: 'info',
        buttons: {
            cancel: {value:false, visible: true},
            confirm: false,
        },
    });
    return true;
}

async function record_might_end(){
    if(recordSometime){
        recordSometime = false;
        return await record_end();
    }else{
        aborted = true;
        return await record_abort();
    }
}
async function record_abort(){
    siri.cancel();
} 
async function record_end(){
    recordSometime = false;
    siri.done();
    swal({
        title: `Recorder`, 
        text: "transcoding...", 
        icon: 'info',
        buttons: {
            cancel: {value:false, visible: false},
            confirm: false,
        },
    });
    console.log('record_end.');
    await microm.stop();
    let mp3 = await microm.getMp3();
    
    swal('Transtexting...','', 'info');
    let text = null;
    try{
        text = await speech_to_text(mp3.blob);
    }catch(e){
        console.warn(e);
        await swal("Error", "Cannot transcode.", "error");
    }
    if(text !== null){
        console.log(text)
        await swal('You said:', text, 'success');
    }
}

var language = 'en-us';

async function speech_to_text(soundBlob){
    let results = await $.ajax({
        type: 'POST',
        url: `speech-to-text/${language}`,
        data: soundBlob,
        processData: false,
        contentType: "multipart/form-data",
    });
    if(results.error){
        throw results.error;
    }
    results.map(r=> console.log(r.alternatives[0]));
    return results.map(r=> r.alternatives[0].transcript).join(' ');
}

async function text_to_speech(text, lang = language){
    let results = await $.ajax({
        type: 'POST',
        url: `text-to-speech/${language}`,
        data: JSON.stringify({text: text}),
        contentType: "application/json; charset=utf-8",
        cache: false,
        xhrFields:{
            responseType: 'blob'
        },
    });
    return results;
}

function isBusy(){
    let state = swal.getState();
    return state.isOpen && state.actions.cancel.value === false;
}
function playTextToAudioBlob(blob){
    let url = URL.createObjectURL( blob );
    let sound = new Howl({
        src: [url],
        format: ['webm']
      }).play();
    return sound;
}
keyboard.on('press', async (e) =>{
    if(e.key == 't' && !isBusy()){
        let input = await swal({
            title: `Text to Speech:`, 
            content: "input", 
            buttons: {
                cancel: {value:false, visible: true},
                confirm: true,
            },
        });
        if(input){
            let blob = await text_to_speech(input);
            playTextToAudioBlob(blob);
        }
    }
});

window.isBusy = isBusy;
