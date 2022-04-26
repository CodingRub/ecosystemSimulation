import { Vector } from './Vector.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function getRndInteger(min, max) {
    return Math.random() * (max - min) + min;
}

export class Aliment {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        this.radius = 6;
        this.color = "white"
    }
}

export class Food extends Aliment {
    constructor(x, y) {
        super(x, y);
        this.color = "lime";
        this.name = "Food";
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

export class Poison extends Aliment {
    constructor(x, y) {
        super(x, y);
        this.color = "red";
        this.name = "Poison"
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill(); 
    }
}