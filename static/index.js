import  './libraries/jquery.min.js';
import {Board} from './Arduino.js';
import {Keybaord} from './Keyboard.js';
import './libraries/howler.js';
import {speech_to_text, text_to_speech_and_play} from './TextSpeech.js';
import Siri from './Siri.js'
import Sayer from './Sayer.js';

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

const siri = new Siri();

const siriKey = ' ';
const keyboard = new Keybaord();
keyboard.on('press', async (e) =>{
    if(e.key == siriKey && !isBusy()){
        record_begin();

        keyboard.once('release', (e) =>{
            if(e.key == siriKey){
                end_record_and_response();
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
    return false;
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
    
    // swal('Transtexting...','', 'info');
    swal('Thinking...','', 'info');
    let text = null;
    try{
        text = await speech_to_text(mp3.blob, language);
    }catch(e){
        console.warn(e);
        swal("Error", "Cannot transcode.", "error");
        return false
    }
    if(text !== null){
        // console.log(text)
        // swal('You said:', text, 'success');
        return text;
    }
}

function isBusy(){
    let state = swal.getState();
    return state.isOpen && state.actions.cancel.value === false;
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
            await text_to_speech_and_play();
        }
    }
});
keyboard.on('press', async (e) =>{
    if(e.key == 'q' && !isBusy()){
        let input = await swal({
            title: `Question:`, 
            content: "input", 
            buttons: {
                cancel: {value:false, visible: true},
                confirm: true,
            },
        });
        if(input){
            let question = input;
            console.log('question', question);
            let answer = await reason_question(question);
            console.log('answer', answer);
            swal({
                title: answer,
                text : question,
                button: false,
            })
        }
    }
});

window.isBusy = isBusy;

var language = 'en-us';


async function end_record_and_response(){
    let question = await record_might_end();
    console.log('question', question);
    if(question){
        let answer = await reason_question(question);
        console.log('answer', answer);
        swal({
            title: answer,
            text : question,
            button: false,
        })
    }
}

async function reason_question(question){
    let sayer = new Sayer(language);
    switch (language) {
        case 'ja-jp':
            return await sayer.unsure()

        case 'en-us':
        case 'en-gb':
        default:
            // TODO: main logic part
            if(question.match(/language/i)){
                let new_langauge_literal = '';
                if(question.match(/british|uk/i)){
                    language = 'en-gb';
                    new_langauge_literal = 'British English'
                }else if(question.match(/american|us/i)){
                    language = 'en-us';
                    new_langauge_literal = 'American English'
                }else if(question.match(/spanish|spain/i)){
                    language = 'es-es';
                    new_langauge_literal = 'Spanish'
                }else if(question.match(/japanese|japan/i)){
                    language = 'ja-jp';
                    new_langauge_literal = 'Japanese'
                }else{
                    return await sayer.unsure();
                }
                return await sayer.okey(`Language switched to ${new_langauge_literal}.`);
            }else{
                return await sayer.unsure();
            }
    }
    return await sayer.unsure()
}