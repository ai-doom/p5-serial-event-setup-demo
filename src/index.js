import $ from "jquery"
import {Howl, Howler} from 'howler'
// import Microm from 'microm'
import swal from 'sweetalert'

import {Board} from './Arduino.js'
import {TimeAnalysizer, Button, ThresholdedSensor} from './Device.js'
import {Keybaord} from './Keyboard.js'
import * as TextSpeech from './TextSpeech.js'
import Siri from './Siri.js'
import Talker , {Sentence} from './Sentence.js'
import {wait} from './utils.js'

let piezo = new ThresholdedSensor();
let bend  = new ThresholdedSensor();
let photo = new ThresholdedSensor();
let touch = new ThresholdedSensor();
let button1 = new Button(0, 0);
let button2 = new Button(0, 0);
let button3 = new Button(0, 0);

let devices = [new TimeAnalysizer(), piezo, bend, photo, touch, button1, button2, button3]
const board = new Board(devices);
board.connect({baudrate: 9600});

// debug raw value
// board.on('line', line => {
//     console.log(`line`, String.fromCharCode(...line))
// });

// only works if device is set: `let board = new Board([button1]);`
// board.on('point', point => {
//     console.log(`point`, point)
// });
button1.on('press', ()=>{
    if(!isBusy()){
        record_begin(true);
        button1.once('release', end_record_and_response);
    }
})
button2.on('press', ()=>{
    console.log('press','button2')
})
button3.on('press', ()=>{
    console.log('press','button3')
})


TextSpeech.getAuthorizations()

const siri = new Siri();

const siriKey = ' ';
const if_siri_key_not_busy_do =  (async_callable) => async (e) => { if(e.key == siriKey && !isBusy()){return await async_callable()} return false}
const if_siri_key_do =  (async_callable) => async (e) => { if(e.key == siriKey){return await async_callable()} return false}

const keyboard = new Keybaord();
keyboard.on('press', if_siri_key_not_busy_do(  () =>{
    record_begin(true);
    keyboard.once('release', if_siri_key_do(end_record_and_response));
}));

async function pop_busy_dialog(title, cancelable = true, text = ''){
    return await swal({
        title: title,
        text: text,
        buttons: {
            cancel: {value:false, visible: cancelable},
            confirm: false,
        },
    })
}
async function new_conversation(){
    let talker = new Talker(language);

    let siri_question = talker.askForName();
    pop_busy_dialog(siri_question.text, false);
    await siri_question.play();

    await siri.start()
    let name = await askWithDialog(siri_question.text)

    siri_question = talker.hi(name);
    pop_busy_dialog(siri_question.text, false);
    await siri_question.play();
    
    await siri.start()
    let question = await askWithDialog(siri_question.text)

    responseToQuestion(question)
}

async function askWithDialog(title, autoStop=true){
    let recording = $('<div />').attr('id', 'text-recording');
    recording.text('...');

    let dialog = swal({
        title: title,
        content: recording[0],
        buttons: false
    })
    let result = await TextSpeech.mic_to_text(language, autoStop, recording[0]);
    return result;
}

keyboard.on('press', async (e) =>{
    if(e.key == 'n' && !isBusy()){
        await new_conversation();
    }
});

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
            await responseToQuestion(question)
        }
    }
});

window.isBusy = isBusy;

var language = 'en-us';

async function responseToQuestion(question){
    let answer = reason_question(question);
    console.log('answer', answer);
    swal({
        title: answer.text,
        text : question,
        button: false,
    })
    await answer.play();
}

function reason_question(question){
    let talker = new Talker(language);
    switch (language) {
        case 'ja-jp':
            if(question.match(/言語/i)){
                let new_langauge_literal = '';
                if(question.match(/イギリス/i)){
                    language = 'en-gb';
                    new_langauge_literal = 'イギリス語'
                }else if(question.match(/英語|アメリカ|米/i)){
                    language = 'en-us';
                    new_langauge_literal = '英語'
                }else if(question.match(/スペイン/i)){
                    language = 'es-es';
                    new_langauge_literal = 'スペイン語'
                }else{
                    return talker.unsure();
                }
                return talker.okey(`${new_langauge_literal} に換えました。`);
            }else{
                return talker.unsure();
            }

        case 'es-es':
            if(question.match(/idioma/i)){
                let new_langauge_literal = '';
                if(question.match(/inglés/i)){
                    language = 'en-us';
                    new_langauge_literal = 'inglés'
                }else if(question.match(/japonés/i)){
                    language = 'ja-jp';
                    new_langauge_literal = 'japonés'
                }else{
                    return talker.unsure();
                }
                return talker.okey(`ha cambiado a ${new_langauge_literal}.`);
            }
            return talker.unsure();

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
                    return talker.unsure();
                }
                return talker.okey(`Language switched to ${new_langauge_literal}.`);
            }else{
                return talker.unsure();
            }
    }
    return talker.unsure()
}