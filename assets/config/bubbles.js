class Bubble{
    constructor(anker, index){
        this.anker = anker;
        this.index = index;

        let delta = 100/SUBBEATS
        this.start = this.index * this.delta

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        anker.appendChild(bubble);
        bubble.style.backgroundColor = colors[this.index];
        
        bubble.style.animation = 'bubble 1s ease';
        
        bubble.addEventListener('animationend', () => {
            bubble.remove();
        })

    }
}