import {text_to_speech_and_play} from './TextSpeech.js';

export default
class Sayer{
    constructor(language){
        this.lang = language
    }
    async say(content, instant_return = true){
        if(typeof content == 'string'){
            return await text_to_speech_and_play(content, this.lang, instant_return);
        }else if(content instanceof Array){
            let text = content.randomElement();
            if(typeof text == 'string'){
                return await text_to_speech_and_play(content.randomElement(), this.lang, instant_return);
            }else{
                throw TypeError("Must say Array of String!");
            }
        }else{
            throw TypeError("Must say string or Array of String!");
        }
    }
    async unsure(){
        switch (this.lang) {
            case 'ja-jp':
                return await this.say('とうかな？');
            case 'es-es':
                return await this.say('No estoy seguro');
            case 'en-gb':
                return await this.say(`I do not sure.`);
            case 'en-us':
            default:
                return await this.say(`I'm not sure.`);
        }
    }
    async okey(what_s_done = ''){
        switch (this.lang) {
            case 'ja-jp':
                let candidates = ['了解', '承知しました']
                if(what_s_done){
                    candidates.push(what_s_done)
                }
                return await this.say(candidates);
        
            case 'en-us':
            case 'en-gb':
            default:
                return await this.say([`Okay. `+what_s_done , 'Sure!']);
        }
    }
    async askForName(){
        switch (this.lang) {
            case 'ja-jp':
                
    
            case 'es-es':
                
    
            case 'en-us':
            case 'en-gb':
            default:
                return await this.say(`What's your name?`);
        }
    }
    async hi(name){
        switch (this.lang) {
            case 'ja-jp':
                
    
            case 'es-es':
                
    
            case 'en-us':
            case 'en-gb':
            default:
                return await this.say(`Hi, ${name}, What can I do for you?`);
        }
    }
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
