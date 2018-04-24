const IBMCredentials = require('./credentials.json')

const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const express = require('express')
const fs = require('fs');

const app = express()

const speech_to_text = new SpeechToTextV1 ({
    username: IBMCredentials.speech_to_text[0].credentials.username,
    password: IBMCredentials.speech_to_text[0].credentials.password
  });


app.post('/speech-to-text/:lang', function(req, res, next) {

    let language_model = 'en-US_BroadbandModel';

    if(req.params.lang){
        switch (req.params.lang) {
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

    // req.pipe(fs.createWriteStream('./logs/test.mp3'))

    let params = {
        model: language_model,
        audio: req,
        content_type: 'audio/mp3'
      };
    
    speech_to_text.recognize(params, function(error, transcript) {
        if (error){
            res.send({'error': error});
            console.warn('Error:', error);
        }else{
            res.send(transcript.results);
        }
    });

});

app.use('/', express.static('static'));


app.listen(5000, () => console.log('Voice Of Doom Web Server listening on port 5000!'))
