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
import {wait, wait_until} from './utils.js'
import { EventEmitter2 } from "eventemitter2";

let piezo = new ThresholdedSensor(12);
let bend  = new ThresholdedSensor(360);
let photo = new ThresholdedSensor(118);
let touch = new ThresholdedSensor(20000);
let button1 = new Button(0, 0);
let button2 = new Button(0, 0);
let button3 = new Button(0, 0);

let bgMusic = new Howl({
    src: ['static/UNIVOX8.WAV'],
    loop: true,
    volume: 0.5
});

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
    console.log('press','button1')
})
button2.on('press', ()=>{
    console.log('press','button2')
})
button3.on('press', ()=>{
    console.log('press','button3')
})
// piezo.on('press', ()=>{
//     console.log('press','piezo')
// })
// touch.on('press', ()=>{
//     console.log('press','touch')
// })


bend.on('press', ()=>{
    console.log('press','bend')
})
photo.on('press', ()=>{
    console.log('press','photo')
})


TextSpeech.getAuthorizations()

const siri = new Siri();

const default_siri_key = ' ';
const if_siri_key_not_busy_do =  (async_callable, siriKey = default_siri_key) => async (e) => { if(e.key == siriKey && !isBusy()){return await async_callable()} return false}
const if_siri_key_do =  (async_callable, siriKey = default_siri_key) => async (e) => { if(e.key == siriKey){return await async_callable()} return false}

const keyboard = new Keybaord();

class SiriButton extends EventEmitter2{
    constructor(devices, keyboard){
        super()
        this.busy = false;
        
        devices.map(d=>d.on('press', e=>{
            this.busy = true;
            this.emit('press', e)
        }))
        devices.map(d=>d.on('release', e=>{
            this.busy = false;
            this.emit('release', e)
        }))
        
        keyboard.on('press', (e)=>{
            this.busy = true;
            if(e.key == default_siri_key){
                this.emit('press', e)
            }
        })
        keyboard.on('release', (e)=>{
            this.busy = false;
            if(e.key == default_siri_key){
                this.emit('release', e)
            }
        })
    } 
}
let siriButton = new SiriButton([button2], keyboard);

function listen_new_conversation(){
    siriButton.once('press', async ()=>{
        siriButton.once('release', TextSpeech.mic_stop)
        await pressAsk()
        listen_new_conversation()
    });
    keyboard.once('press', async (e) =>{
        if(e.key == 'n'){
            await new_conversation();
            listen_new_conversation()
        }
    });
}
listen_new_conversation();

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

// TODO: Sample: setting threshold for device
var p_values = [];
var o_values = [];
var i_values = [];
var u_values = [];
function collect_p(value){
    p_values.push(value)
}
function collect_o(value){
    o_values.push(value)
}
function collect_i(value){
    i_values.push(value)
}
function collect_u(value){
    u_values.push(value)
}
keyboard.on('press', (e)=>{
    // if(e.key == 'p'){
    //     piezo.on('tick', collect_p)
    // }else if(e.key == 'o'){
    //     bend.on('tick', collect_o)
    // }
    // else if(e.key == 'i'){
    //     photo.on('tick', collect_i)
    // }
    // else if(e.key == 'u'){
    //     touch.on('tick', collect_u)
    // }
    if(e.key == '\\'){
        piezo.on('tick', collect_p)
        bend.on('tick', collect_o)
        photo.on('tick', collect_i)
        touch.on('tick', collect_u)
    }
})
keyboard.on('release', (e)=>{
    // if(e.key == 'p'){
    //     piezo.off('tick', collect_p)
    //     piezo.reset(p_values, 10)
    //     console.log('piezo set', piezo.threshold);
        
    // }else if(e.key == 'o'){
    //     bend.off('tick', collect_o)
    //     bend.reset(o_values, 3)
    //     console.log('bend set', bend.threshold);
    // }
    // else if(e.key == 'i'){
    //     photo.off('tick', collect_i)
    //     photo.reset(i_values, 3)
    //     console.log('photo set', photo.threshold);
    // }
    // else if(e.key == 'u'){
    //     touch.off('tick', collect_u)
    //     touch.reset(u_values, 3)
    //     console.log('touch set', touch.threshold);
    // }
    if(e.key == '\\'){
        piezo.off('tick', collect_p)
        piezo.reset(p_values, 10)
        console.log('piezo set', piezo.threshold);

        bend.off('tick', collect_o)
        bend.reset(o_values, 3)
        console.log('bend set', bend.threshold);

        photo.off('tick', collect_i)
        photo.reset(i_values, 3)
        console.log('photo set', photo.threshold);

        touch.off('tick', collect_u)
        touch.reset(u_values, 3)
        console.log('touch set', touch.threshold);
    }
})

const wait_until_some_device = async (correctDevice, event='press', all_devices = devices) => {
    // TODO: cancel not doing
    return await Promise.race(all_devices.map(device => wait_until(device, event))) == correctDevice
}

var color_to_button = {
    'white': button3,
    'red': button2,
    'blue': button1,
}
var possible_buttons = ['white', 'red', 'blue']

// TODO: Sample:
async function ask_to_do_game(){
    let talker = new Talker(language);

    let instrction 

    let devices = [button1, button2, button3, photo, bend]

    // instrction = talker.beginChallenge()
    // await instrction.play()
    
    bgMusic.play();

    instrction = talker.liftMe()
    await instrction.play()

    // 
    if(!await wait_until_some_device(photo, 'press', devices)){
        instrction = talker.failComply()
        return await instrction.play()
    }

    instrction = talker.squeezeMe()
    await instrction.play()

    // 
    if(!await wait_until_some_device(bend, 'press', devices)){
        instrction = talker.failComply()
        return await instrction.play()
    }

    let buttons = [button1, button2, button3]
    instrction = talker.pressButton()
    await instrction.play()

    let color 
    let button

    color= possible_buttons.randomElement();
    button = color_to_button[color]
    instrction = talker.buttonName(color)
    instrction.play()
    if(!await wait_until_some_device(button, 'press', buttons)){
        instrction = talker.failComply()
        return await instrction.play()
    }
    
    color= possible_buttons.randomElement();
    button = color_to_button[color]
    instrction = talker.buttonName(color)
    instrction.play()
    if(!await wait_until_some_device(button, 'press', buttons)){
        instrction = talker.failComply()
        return await instrction.play()
    }
    
    color= possible_buttons.randomElement();
    button = color_to_button[color]
    instrction = talker.buttonName(color)
    instrction.play()
    if(!await wait_until_some_device(button, 'press', buttons)){
        instrction = talker.failComply()
        return await instrction.play()
    }
    
    color= possible_buttons.randomElement();
    button = color_to_button[color]
    instrction = talker.buttonName(color)
    instrction.play()
    if(!await wait_until_some_device(button, 'press', buttons)){
        instrction = talker.failComply()
        return await instrction.play()
    }
    
    color= possible_buttons.randomElement();
    button = color_to_button[color]
    instrction = talker.buttonName(color)
    instrction.play()
    if(!await wait_until_some_device(button, 'press', buttons)){
        instrction = talker.failComply()
        return await instrction.play()
    }
    
    color= possible_buttons.randomElement();
    button = color_to_button[color]
    instrction = talker.buttonName(color)
    instrction.play()
    if(!await wait_until_some_device(button, 'press', buttons)){
        instrction = talker.failComply()
        return await instrction.play()
    }
    



    instrction = talker.successComply()
    await instrction.play()

    // TODO: Sample
    
    bgMusic.stop();
}

async function pressAsk(){
    await siri.start();

    let question = await askWithDialog('', false);

    if(question){
        siri.done()
        responseToQuestion(question)
    }else{
        siri.cancel()
    }
}
async function instantAsk(previosQuestions){
    await siri.start()
    let question = await askWithDialog(previosQuestions)
    if(question){
        siri.done()
        responseToQuestion(question)
    }else{
        siri.cancel()
    }
}

async function new_conversation(){
    let talker = new Talker(language);

    let siri_question = talker.askForName();
    pop_busy_dialog(siri_question.text, false);
    await siri_question.play();

    await ask_with_dialog_and_indicator_sound(siri_question.text)

    siri_question = talker.hi(name);
    pop_busy_dialog(siri_question.text, false);
    await siri_question.play();
    
    await instantAsk(siri_question.text)
}

async function ask_with_dialog_and_indicator_sound(title, autoStop=true){
    await siri.start()
    let name = await askWithDialog(title, autoStop=true)
    siri.done()
    return result;
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
            let sentence =  new Sentence(input, language)
            await sentence.play()
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
    let answer = await reason_question(question);
    console.log('answer', answer);
    if(answer){
        swal({
            title: answer.text,
            text : question,
            button: false,
        })
        await answer.play();
    }
}

async function reason_question(question){
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

            }else if(question.match(/こんにちは/i)){
                return talker.greetings()
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
            // TODO: Sample: main logic part
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

            }else if(question.match(/game/i)){
                await ask_to_do_game()
                return ''

            }else if(question.match(/hi|hello|how are you/i)){
                return talker.greetings()
            }else{
                return talker.unsure();
            }
    }
    return talker.unsure()
}