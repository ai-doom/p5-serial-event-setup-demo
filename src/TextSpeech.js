import {Howl, Howler} from 'howler'
import $ from 'jquery'
import WatsonSpeech from 'watson-speech'

import {wait_until, wait_on} from './utils.js'

var default_language = 'en-us';

export
async function speech_to_text(soundBlob, lang = default_language){
    let results = await $.ajax({
        type: 'POST',
        url: `speech-to-text/${lang}`,
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

export
async function text_to_speech(text, lang = default_language){
    let results = await $.ajax({
        type: 'POST',
        url: `text-to-speech/${lang}`,
        data: JSON.stringify({text: text}),
        contentType: "application/json; charset=utf-8",
        cache: false,
        xhrFields:{
            responseType: 'blob'
        },
    });
    return results;
}

export
async function playTextToAudioBlob(blob){
    let url = URL.createObjectURL( blob );
    let sound = new Howl({
        src: [url],
        format: ['webm']
      });
    sound.play();
    await wait_until(sound, 'end');
    return sound;
}

/* IBM API
 * Allows for stream
 */

var token_speech_to_text = '';
var token_text_to_speech = '';

export 
async function getAuthorizations(){
    [token_speech_to_text, token_text_to_speech] = await Promise.all([
        $.get('/token/speech-to-text'),
        $.get('/token/text-to-speech')
    ])
    return [token_speech_to_text, token_text_to_speech]
}

export
async function mic_to_steam(lang, outputElement){
    let language_model = 'en-US_BroadbandModel';
    if(lang){
        switch (lang) {
            case 'ja-jp':
                language_model  = 'ja-JP_BroadbandModel';
                break;
            case 'en-gb':
                language_model  = 'en-GB_BroadbandModel';
                break;
            case 'es-es':
                language_model  = 'es-ES_BroadbandModel';
                break;
            case 'en-us':
            default:
                language_model = 'en-US_BroadbandModel';
                break;
        }
    }

    let stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
        token: token_speech_to_text,
        keepMicrophone: true,
        outputElement: outputElement,
        objectMode: true
    });

    stream.on('data', (data) => {
        if(data.results[0] && data.results[0].final) {
            stream.stop();
            stream.emit('done', data.results);
        }
    });

    let  results = await wait_on(stream, 'done')

    results.map(r => console.log(r.alternatives[0]));

    return results.map(r=> r.alternatives[0].transcript).join(', ');
}
