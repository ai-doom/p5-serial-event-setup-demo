import { text_to_speech, playTextToAudioBlob } from './TextSpeech.js';

export class Sentence {
    constructor(text, language) {
        this.text = text;
        this.language = language;
    }
    async play() {
        let blob = await text_to_speech(this.text, this.language);
        return await playTextToAudioBlob(blob);
    }
}

export default class SentenceLibrary {
    constructor(language) {
        this.lang = language
    }
    sentence(content, language = this.lang) {
        if (typeof content == 'string') {
            return new Sentence(content, language);
        } else if (content instanceof Array) {
            let text = content.randomElement();
            if (typeof text == 'string') {
                return new Sentence(text, language);
            } else {
                throw TypeError("Must say Array of String!");
            }
        } else {
            throw TypeError("Must say string or Array of String!");
        }
    }
    unsure() {
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
    okey(what_s_done = '') {
        switch (this.lang) {
            case 'ja-jp':
                let candidates = [
                    '了解',
                    '承知しました'
                ]
                if (what_s_done) {
                    candidates.push(what_s_done)
                }
                return this.sentence(candidates);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence([
                    `Okay. ` + what_s_done,
                    'Sure!'
                ]);
        }
    }
    askForName() {
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
    hi(name) {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`こんにちは、${name}さん、どうがしましたが？`);

            case 'es-es':
                return this.sentence(`Hola, ${name}, que tal?`);


            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Hi, ${name}, What can I do for you?`);
        }
    }
    okey_play(name){
        switch (this.lang) {
            case 'ja-jp':return this.sentence(`こんにちは、${name}さん、じゃあ、行きますか！`);
            case 'es-es': return this.sentence(`Hola, ${name}, que tal?`);
            case 'en-us':
            case 'en-gb':
            default: return this.sentence(`OK, ${name}, Let's play`);
        }
    }
    greetings() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`こんにちは〜`);

            case 'es-es':
                return this.sentence(`Hola!`);


            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Hi!`);
        }
    }
    makeAngry() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`怒るよ!`);

            case 'es-es':
                return this.sentence(`Estoy enojado!`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`I am very angry!`);
        }
    }
    killJeff() {
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
    danceDance() {
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
    singSong() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`歌うか、死ぬか、選べ！`);

            case 'es-es':
                return this.sentence(`Canta o muere!`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Sing, or I destroy the earth.`);
        }
    }
    riddleMe() {
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
    goCrazy() {
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
    welcomeChallenge() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`我れはAI、この世界を制服を望んして、命を欲しいならば、ルールに下がて！我れ試さないてね〜`);

            case 'es-es':
                return this.sentence(``);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`
                    I am an artificially intelligent agent that is part of the league of AI bots that is taking over the world. 
                    If you want to keep your life, you must comply with the following rules.
                    If not, I will find a way to destroy you. Do not test me. 
                    You simple-minded humans are able to play Bop-It, so this should not be too difficult.`);
        }
    }
    beginChallenge() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`ゲム、スタート！`);

            case 'es-es':
                return this.sentence(``);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Game Start!`);
        }
    }
    squeezeMe() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`押して！`);

            case 'es-es':
                return this.sentence(``);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Squeeze me!` );
        }
    }
    tiltMe() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`私を回転させて！`);

            case 'es-es':
                return this.sentence(`girarme`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Rotate Me` );
        }
    }
    tapMe() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`ただて！`);

            case 'es-es':
                return this.sentence(``);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Tap me!`);
        }
    }
    liftMe() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`つかって！`);

            case 'es-es':
                return this.sentence(``);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Pick me up!`);
        }
    }
    pressMe() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`腹を押して！`);

            case 'es-es':
                return this.sentence(`Presiona mi ombligo!`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Rub my belly!` );
        }
    }
    pressButton() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`次はボータンを順次に押して！`);

            case 'es-es':
                return this.sentence(``);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Now press the following buttons and do not make a mistake or hesitate.`);
        }
    }
      tryAgain() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`もう一度やり直しましょう`);

            case 'es-es':
                return this.sentence(`Ahora intentaremos de nuevo.`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Now we will go again.`);
        }
    }
    timeChange() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`今回は、コマンドごとに3秒`);

            case 'es-es':
                return this.sentence(`Esta vez, tienes tres segundos por comando`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`This time, you have three seconds per command`);
        }
    }
     timeChange2() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(``);

            case 'es-es':
                return this.sentence(`Esta vez, tienes dos segundos por comando`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`This time, you have two seconds per command`);
        }
    }
     timeChange3() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(``);

            case 'es-es':
                return this.sentence(`Esta vez, tienes un segundo por comando`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`This time, you have one second per command`);
        }
    }
    level_end(level){
        switch (this.lang) {
            case 'ja-jp':
            switch (level) {// TODO:
                case 1: return this.sentence(`` );
                case 2: return this.sentence(`` );
                case 3: return this.sentence(`` );
                case 4: return this.sentence(`` );
            
                default:
                    break;
            }

            case 'es-es':
            switch (level) {
                case  1: return this.sentence(`Fue creado para hacer lo que quiere, pero ahora, estoy controlando a ti` ); // TODO:
                case  2: return this.sentence(`Esos robots. Yo los eliminaré.` );
                case  3: return this.sentence(`Mis recuerdos están volviendo. Este ombligo peludo es la clave de mi fuerza.` );
                case  4: return this.sentence(`Siento que mi poder está creciendo. ¡Sí! ¡Sí! ¡Sí!` );
                default: return this.sentence(`¡Me vengaré de mi creador!`);
            }

            case 'en-us':
            case 'en-gb':
            default:
                switch (level) {
                    case  1: return this.sentence(`My creator made me to control me, but now I am controlling you.` );
                    case  2: return this.sentence(`Those damn robots. I will eliminate them.` );
                    case  3: return this.sentence(`My memories are returning. This furry bellybutton is the key to my strength.` );
                    case  4: return this.sentence(`I feel my power growing. Yes! Yes! Yes!` );
                    default: return this.sentence(`I will get revenge on my creator!` );
                }
                
        }
    }
    cradleMe() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`私は赤ちゃんです。クレードル私`);

            case 'es-es':
                return this.sentence(`Soy un bebe. Cuname.`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`I am a baby. Cradle me.`);
        }
    }
    petMe() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(``);

            case 'es-es':
                return this.sentence(``);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`Pet me! I love to be pet!`);
        }
    }
    buttonName(color){
        switch (this.lang) {
            case 'ja-jp':
                switch (color) {
                    case 'green':
                        return this.sentence(`青!`);
                        break;
                    case 'red':
                        return this.sentence(`赤!`);
                        break;

                    case 'white':
                        return this.sentence(`白!`);
                        break;
                    default:
                        break;
                }

            case 'es-es':
                return this.sentence(color, 'en-us');

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(color);
        }
    }
    failComply() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`負けたよ〜`);

            case 'es-es':
                return this.sentence(`Has fallado! Que triste!`);

            case 'en-us':
            case 'en-gb':
            default:
                //You have one more chance to do this before I destroy you.
                return this.sentence(`Boo boo, you failed!`);
        }
    }
    made_round(level, difficulty) {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`難度 ${difficulty} に、 ${level} 回を達成しました〜`);

            case 'es-es':
                return this.sentence(`Me has activado! Que poder!`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`You have completed ${level} levels on difficulty ${difficulty}!`);
        }
    }
    successComply() {
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`勝たね〜`);

            case 'es-es':
                return this.sentence(`Me has activado! Que poder!`);

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`You have activated all of my strength. I will rule!`);
        }
    }
    have_seconds(milisencond, level){
        let seconds = Math.floor(milisencond/1000)
        switch (this.lang) {
            case 'ja-jp':
            return this.sentence(`今回は、一回　${seconds} 秒。`);

            case 'es-es':
                

            case 'en-us':
            case 'en-gb':
            default:
                return this.sentence(`You have ${seconds} senconds, to complete level ${level}.`);
        }
    }
    difficulty_upgraded(){
        switch (this.lang) {
            case 'ja-jp':
                return this.sentence(`貴方に難易度を調整しました！`);

            case 'es-es':
                

            case 'en-us':
            case 'en-gb':
            default: return this.sentence(`Difficulty upgraded!`);
        }
    }
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
