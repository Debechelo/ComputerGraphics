import Spark from './spark'

const colors = [[1, 1, 1, 0.47, 0.31, 0.24],[0.84, 0,18, 0,18, 0,66, 0,44, 0,41],[0,96, 0,6, 0,12, 0,65, 0,59, 0,47],
                [0.82, 0.82, 0.82, 0.53, 0.53, 0.53],[1, 1, 1, 0.47, 0.31, 0.24],[1, 1, 1, 0.47, 0.31, 0.24],
                [1, 1, 1, 0.47, 0.31, 0.24],[1, 1, 1, 0.47, 0.31, 0.24],[1, 1, 1, 0.47, 0.31, 0.24]]

export default class Firework{
    constructor(timeFromCreation){
    this.position = this.#genPos()
    this.sparks = this.#genSpark()
    this.color = colors[Math.floor(Math.random()*4)]
    this.timeFromCreation = timeFromCreation
    this.sparksCount = 800  
    }

    #genSpark(){
        var sparks = [];
        for (var i = 0; i < this.sparksCount; i++) {
            sparks.push(new Spark(this.position[0],this.position[1]));
        }
        return sparks
    }

    genPos(){
        return [
            Math.random() * 5 - 3.5,
            Math.random() * 2.5 - 1.25,
            Math.random() * 2.5 - 1.25,
        ]
    }

    timeFirework(time) {

        var timeShift = time - this.timeFromCreation;
    
        if (timeShift > 2500) {
            this.timeFromCreation = time;
            this.position = this.#genPos()
            this.sparks = this.#genSpark()
            this.color = colors[Math.floor(Math.random()*4)]
            return;
        }
    }
}