class Instrument{

    constructor(note, sound, vol, rev){
       
        this.note = note;
        this.sound = sound;
        this.gain = new Tone.Gain(vol);
        
        
        this.played = false;

        //this.rev = new Tone.Reverb(0.1).connect(this.gain);
        //this.dist = new Tone.Distortion(0.9).connect(this.gain);

        this.gain.connect(dist);
        this.sound.connect(this.gain);

        /*
        this.distGain = new Tone.Gain(this.dist).connect(dist);
        this.revGain = new Tone.Gain(this.rev).connect(rev);
        */

        //this.gain.connect(this.distGain);
        //this.gain.fan(dist, rev, masterGain);
        
        this.velocity = 0.7;

        this.duration = 0.5;



        this.boolean = [];
        for(let i = 0; i < SUBBEATS; i++) {
            this.boolean[i] = false;
        }
        this.children = [];



    
    }

    checkSteps() {

        this.children.forEach((step, index) => {
            this.boolean[index] = step.checked;
        });
    }
    go(n, time){
        if(this.boolean[n]){
            this.sound.triggerAttackRelease(this.note, this.duration, time, this.velocity);
        }
        if(n == undefined && time == undefined) {
            this.sound.triggerAttackRelease(this.note, this.duration, time, this.velocity);
        }
    }

    
    setDist(dist){
        this.dist.wet.value = dist;
       

        


    }
    setRev(rev){
        this.rev.decay = rev;
        this.rev.wet = rev;

    }
}