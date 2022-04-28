import { Vector } from './Vector.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


function getRnd(min, max) {
    return Math.random() * (max - min) + min;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export class Animal {
    constructor(x, y, dna) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, -2);
        this.acceleration = new Vector(0, 0);
        this.maxSpeed = 2;
        this.maxForce = 0.5;
        this.radius = 15;
        this.health = 0;
        this.dna = [];
        if (dna === undefined) {
            // La force pour la food
            this.dna[0] = getRnd(-2, 2);
            // La force pour le poison
            this.dna[1] = getRnd(-2, 2);
            // La perception pour la food
            this.dna[2] = getRnd(0, 100);
            // La perception pour le poison
            this.dna[3] = getRnd(0, 100);
        } else {
            this.dna[0] = dna[0];
            this.dna[1] = dna[1];
            this.dna[2] = dna[2];
            this.dna[3] = dna[3];
        }
    }

    updateMaxSpeed(nbr) {
        this.maxSpeed = nbr;
    }

    draw(debug) {

        let dna_food_attract = this.dna[0]*20;
        let dna_poison_attract = this.dna[1]*20;
        let newVelFood = this.vel.normalize().multiply(dna_food_attract);
        let newVelPoison = this.vel.normalize().multiply(dna_poison_attract);
        let dna_food_percept = this.dna[2];
        let dna_poison_percept = this.dna[3];

        ctx.beginPath();
        ctx.fillStyle = 'hsl(' + (1 - this.health) * 120 + ',100%,50%)'
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        if (debug) {
            dna_food_percept = dna_food_percept<0? 0 : dna_food_percept;
            dna_poison_percept = dna_poison_percept<0? 0 : dna_poison_percept;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.pos.x + newVelFood.x, this.pos.y + newVelFood.y);
            ctx.strokeStyle = 'green';
            ctx.stroke();
    
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.pos.x + newVelPoison.x, this.pos.y + newVelPoison.y);
            ctx.strokeStyle = 'red';
            ctx.stroke();
    
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.fillStyle = 'black'
            ctx.arc(this.pos.x, this.pos.y, this.dna[2], 0, 2 * Math.PI);
            ctx.strokeStyle = 'green';
            ctx.stroke();
    
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.fillStyle = 'black'
            ctx.arc(this.pos.x, this.pos.y, this.dna[3], 0, 2 * Math.PI);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        }
    }

    bounceOffWalls() {
        if (this.pos.x > canvas.width) {
            this.pos.x = 0;
        } else if (this.pos.x < 0) {
            this.pos.x = canvas.width;
        }
        if (this.pos.y > canvas.height) {
            this.pos.y = 0;
        } else if (this.pos.y < 0) {
            this.pos.y = canvas.height;
        }
    }

    dist(other) {
        return (Math.pow(other.pos.x - this.pos.x, 2) + Math.pow(other.pos.y - this.pos.y, 2));
    }

    born(reproductionRate) {
        if (this.health <= 0.5 && Math.random(1) < reproductionRate) {
            return new Animal(this.pos.x, this.pos.y, this.dna);
        } else {
            return null;
        }
    }

    behaviors(food, poison, bonus, malus) {
        var foodSteer = this.eat(food, bonus, this.dna[2]);
        var poisonSteer = this.eat(poison, malus, this.dna[3]);

        foodSteer = foodSteer.multiply(this.dna[0]);
        poisonSteer = poisonSteer.multiply(this.dna[1]);

        this.applyForce(foodSteer)
        this.applyForce(poisonSteer)
    }

    isDead() {
        return (this.health >= 1);
    }

    eat(list, nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = list.length - 1; i >= 0; i--) {

            var d = this.dist(list[i]);

            if (d < this.maxSpeed) {
                list.splice(i, 1);
                if (this.health > 0 && this.health < 1) {
                    this.health -= nutrition;
                }
            } else {
                if (d < record && d < perception * perception) {
                    record = d;
                    closest = list[i];
                }
            }
        }
        if (closest != null) {
            return this.seek(closest)
        }
        return new Vector(0, 0);
    }

    seek(target) {
        let desired = target.pos.subtract(this.pos);
        desired = desired.setMagnitude(this.maxSpeed);
        let steeringForce = desired.subtract(this.vel);
        steeringForce = steeringForce.limit(this.maxForce);
        return steeringForce
    }

    applyForce(force) {
        this.acceleration = this.acceleration.add(force);
    }

    update() {
        if (this.health < 1) {
            this.health += 0.002;
        }
        this.vel = this.vel.add(this.acceleration);
        this.vel = this.vel.limit(this.maxSpeed)
        this.pos = this.pos.add(this.vel);
        this.acceleration = this.acceleration.multiply(0);
    }
}