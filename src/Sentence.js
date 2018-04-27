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
                return this.sentence(`Cuál es tu nombre?`);
    
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
                return this.sentence (`Hola, ${name}, que tal?`);
                
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Hi, ${name}, What can I do for you?`);
        }
    } 
    makeAngry(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`怒っている!`);
    
            case 'es-es':
                return this.sentence(`Estoy enojado!`);
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`I am very angry!`);
        }
    }
    killJeff(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`ジェフを殺す。`);
    
            case 'es-es':
                return this.sentence(`Mata a Jeff!`);
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`You must kill Jeff`);
        }
    }
      danceDance(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`私のために踊る`);
    
            case 'es-es':
                return this.sentence(`Baila para mi!`);
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Show me your best dance moves!`);
        }
    }
    singSong(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`歌うか死ぬか`);
    
            case 'es-es':
                return this.sentence(`Canta o muere!`);
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Sing, or I destroy the earth.`);
        }
    }
    riddleMe(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`パンはパンでも食べられないパンは、なぁに？`);
                //riddle is "bread is bread, but what kind of bread is inedible" answer is a frying pan because pan means bread in japanese
            case 'es-es':
                return this.sentence(`Tengo algo en mi mano. Oro no es. Plata no es. ¿Qué es? `);
                //the riddle is "I have something in my hand. It's not gold. It's not silver. What is it? The answer is banana because plata, meaning silver, followed by no makes the spanish word platano, which means banana
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Beth’s mother has three daughters. One is called Lara, the other one is Sara. What is the name of the third daughter?`);
                //it's Beth...
        }
    }
    goCrazy(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`夢中になる！`);
    
            case 'es-es':
                return this.sentence(`¡Volverse loco!`);
    
            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Go crazy!`);
        }
    }
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
