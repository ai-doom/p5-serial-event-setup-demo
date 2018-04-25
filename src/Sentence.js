import {text_to_speech, playTextToAudioBlob} from './TextSpeech.js';

export class Sentence{
    constructor(text, language){
        this.text = text;
        this.language = language;
    }
    async play(){
        let blob = await text_to_speech(this.text, this.language);
        return await playTextToAudioBlob(blob);
    }
}

export default
class SentenceLibrary{
    constructor(language){
        this.lang = language
    }
    sentence(content, language = this.lang){
        if(typeof content == 'string'){
            return new Sentence(content, language);
        }else if(content instanceof Array){
            let text = content.randomElement();
            if(typeof text == 'string'){
                return new Sentence(text, language);
            }else{
                throw TypeError("Must say Array of String!");
            }
        }else{
            throw TypeError("Must say string or Array of String!");
        }
    }
    unsure(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence('とうかな？');
            case 'es-es':
                return this.sentence('No estoy seguro');
            case 'en-gb':
                return this.sentence(`I do not sure.`);
            case 'en-us':
            default:
                return this.sentence(`I'm not sure.`);
        }
    }
    okey(what_s_done = ''){
        switch (this.lang) {
            case 'ja-jp':
                let candidates = [
                    '了解', 
                    '承知しました'
                ]
                if(what_s_done){
                    candidates.push(what_s_done)
                }
                return this.sentence(candidates);
        
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence([
                    `Okay. `+what_s_done , 
                    'Sure!'
                ]);
        }
    }
    askForName(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`君のなは？`);
    
            case 'es-es':
                
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`What's your name?`);
        }
    }
    hi(name){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`こんにちは、${name}さん、どうがしましたが？`);
    
            case 'es-es':
                
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Hi, ${name}, What can I do for you?`);
        }
    }
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
