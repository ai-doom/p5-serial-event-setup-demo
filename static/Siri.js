import './libraries/howler.js';

export default
class Siri {
    constructor(filepath = 'Siri.aac'){
        this.siri = new Howl({
            src: [filepath],
            sprite: {
              start: [0, 1000],
              done: [1000, 1000],
              cancel: [2000, 1000]
            }
          });
    }
    play(spriteName){
        if(this.siri.playing()){
            this.siri.stop();
        }
        this.siri.play(spriteName);
    }
    start(){
        this.play('start');
    }
    done(){
        this.play('done')
    }
    cancel(){
        this.play('cancel')
    }
}