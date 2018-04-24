import './libraries/howler.js';

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
function playTextToAudioBlob(blob){
    let url = URL.createObjectURL( blob );
    let sound = new Howl({
        src: [url],
        format: ['webm']
      }).play();
    return sound;
}

export
async function text_to_speech_and_play(text, lang){
    let blob = await text_to_speech(text, lang);
    playTextToAudioBlob(blob);
    return text
}