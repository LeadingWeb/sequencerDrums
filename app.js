const SUBBEATS = 16;
let BPM = 120;
let t = 0;
let active = 0;

let $instrumentsDIV, $stepsDIV, $play, $pause, $stop, $bpm, $swing, $bpmLabel, $swingLabel, $visual, $gain, $duration, $dist, $rev;
let $instruments = [], $steps = [];
let loopBeat, sampler, masterGain, rev, dist, revGain, distGain;
let bpm, swing;
let sounds = [];
 let sliders;


function setup(){
    $instrumentsDIV = document.getElementById('instruments');
    $stepsDIV = document.getElementById('steps');
    $play = document.getElementById('play');
    $pause = document.getElementById('pause');
    $stop = document.getElementById('stop');
    $bpm = document.getElementById('bpm');
    $swing = document.getElementById('swing');
    $bpmLabel = document.getElementById('bpm-label');
    $swingLabel = document.getElementById('swing-label');
    $visual = document.getElementById('visual');
    $gain = document.getElementById('gain');
    $duration = document.getElementById('duration');
    $dist = document.getElementById('dist');
    $rev = document.getElementById('rev');

    sliders = [$gain, $duration, $dist, $rev];

    createElements();

    loopBeat = new Tone.Loop(loop, `${SUBBEATS}n`);
    const notes = ['C1', 'D1', 'E1', 'F1', 'G1', 'A1', 'B1', 'C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3'];
    masterGain = new Tone.Gain(0.5);
   
    masterGain.toMaster();

    rev = new Tone.Reverb(1).connect(masterGain);
    rev.decay = 2;
    rev.wet.value = 0;

    dist = new Tone.Distortion(0.4).connect(rev);
    dist.wet.value = 0;


    sampler = new Tone.Sampler({
        "C1" : "./assets/sounds/kick1.wav",
        "D1" : "./assets/sounds/kick2.wav",
        "E1" : "./assets/sounds/sn1.wav",
        "F1" : "./assets/sounds/sn2.wav",
        "G1" : "./assets/sounds/tom.wav",
        "A1" : "./assets/sounds/hh1.wav",
        "B1" : "./assets/sounds/hh2.wav",
        "C2" : "./assets/sounds/crash.wav",
        "D2" : "./assets/sounds/clap.wav",
        "E2" : "./assets/sounds/bass1.wav",
        "F2" : "./assets/sounds/bass2.wav",
        "G2" : "./assets/sounds/violin.wav",
        "A2" : "./assets/sounds/voc.wav",
        "B2" : "./assets/sounds/chorus.wav",
        "C3" : "./assets/sounds/atmo.wav",
        "D3" : "./assets/sounds/arp.wav",
    }, function(){
        //sampler will repitch the closest sample
        //sampler.triggerAttack("D3")

        for(let i = 0; i < SUBBEATS; i++){
            const sound = new Instrument(notes[i], sampler, 0.1, rev);
            sounds.push(sound);
        }

        colorActive2($steps, t8)


    })

    //kick = new Instrument($instrumentsDIV, 'C1', 'kick1', sampler, 0.1);
    //snare = new Instrument($instrumentsDIV, 'D1', 'snare1', sampler, 0.1);

    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();
    loopBeat.start(0);


    $play.addEventListener('click', (e) => {
        loopBeat.start(0);
    });
    $pause.addEventListener('click', (e) => {
        loopBeat.stop();
    });
    $stop.addEventListener('click', (e) => {
        loopBeat.stop();
        active = 0;
        sounds.forEach((sound, index) => {
            for(let i = 0; i < SUBBEATS; i++){
                sounds[index].boolean[i] = false;
            }
            t = 0;
        })
    });

    

    $bpm = document.getElementById('bpm');
    $bpm.addEventListener('change', (e) => {
        
        bpm = e.target.value;
        Tone.Transport.bpm.rampTo(bpm, 0.05);
        //console.log(e.target.value);
    });
    $swing = document.getElementById('swing');
    $swing.addEventListener('change', (e) => {
        
        swing = e.target.value/100;
        Tone.Transport.swing = swing;
        //console.log(e.target.value);
    });


    $gain.addEventListener('change', (e) => {

        let input = e.target.value/100;
        sounds[active].velocity = input;
        //console.log(input, sounds[active].gain.gain = input);
    });

    $duration.addEventListener('change', (e) => {
        let input = e.target.value/100;
        sounds[active].duration = input;
    })

    $dist.addEventListener('change', (e) => {
        let input = (e.target.value/100)*0.8 + 0.001;
        dist.wet.value = input;
        
    })

    $rev.addEventListener('change', (e) => {
        let input = (e.target.value/100)*0.6 + 0.001;
        rev.wet.value = input;
        rev.decay = input*10;

    })

}

function loop(time){
    t++;
    let t8 = t % SUBBEATS;

  
    draw(t8);
   sounds.forEach((sound, index) => {
       if(sound.boolean[t8]) {
            sound.go();
            sound.played = true;
       } else {
            sound.played = false;
       }
   })
}

function draw(t8){
    colorActive2($steps, t8);
    sounds.forEach((sound, index) => {
        if(sound.boolean[t8]) {
            let bubble = new Bubble($visual, index);
            $instruments[index].style.backgroundColor = '#fff'
        }
    })

    for(let i=0; i<SUBBEATS; i++){
        if(sounds[i].played){
            $instruments[i].style.backgroundColor = colors[i];
        }else if(active != i){
            $instruments[i].style.backgroundColor = theme.bg;
        }
    }


}

function createElements() {
    for (let i = 0; i < 16; i++){
        const instrument = document.createElement('div');
        instrument.className = 'instrument';
        $instrumentsDIV.appendChild(instrument);
        $instruments.push(instrument);

        
        const step = document.createElement('div');
        step.className = 'step';
        $stepsDIV.appendChild(step);
        $steps.push(step);
        
    }

    colorActive($instruments, 0);
    $instruments.forEach((ins, index) => {
        ins.addEventListener('click', (e) => {
            active = index;
            //console.log(active)
            colorActive($instruments, active);

            sounds[active].go();

            sliders.forEach(slider => {
                slider.style.backgroundColor = colors[active]; 
                
            })
            $gain.value = sounds[active].velocity*100;
            $duration.value = sounds[active].duration*100;

            for(let i = 0; i < SUBBEATS; i++){
                if(sounds[i].boolean){
                    $steps[i].backgroundColor = colors[i];                }
            }
        });
    });

    $steps.forEach((step, index) => {
        step.addEventListener('click', (e) => {
            sounds[active].boolean[index] = !sounds[active].boolean[index];
            colorSteps();
            
        })
    })
}

function colorActive(obj, index) {
    obj.forEach(o => {
        o.style.backgroundColor = theme.check;
        o.style.border = 'none';
    });
    obj[index].style.backgroundColor = colors[index];
    obj[index].style.border = '3px solid #fff';
    
}
function colorActive2(obj, index) {

    for(let i = 0; i < SUBBEATS; i++){
        if(sounds[active].boolean[i]){

        }else{
            obj[i].style.backgroundColor = theme.check;
            obj[i].style.border = 'none';
        }
    }

    obj[index].style.backgroundColor = colors[index];
    obj[index].style.border = '3px solid #fff';


    sliders.forEach(slider => {
        slider.style.backgroundColor = colors[active]; 
    })


    
    
}

function colorSteps() {
    $steps.forEach((step, index) => {
        if(sounds[active].boolean[index]) {
            step.style.backgroundColor = colors[index];
            step.style.border = '3px solid #fff';
        }else {
            step.style.backgroundColor = theme.check;
            step.style.border = 'none';
        }
    })
}

window.addEventListener('load', () => {
    setTimeout(() => {
        $steps[0].click();
        setTimeout(()=> {
            $instruments[0].click();
        }, 400)
    }, 400)
})