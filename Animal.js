import { Vector } from './Vector.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


function getRnd(min, max) {
    return Math.random() * (max - min) + min;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

let bool = [true, false];

export class Animal {
    constructor(x, y, maxspeed, maxforce, isPredator, dna) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, -2);
        this.acceleration = new Vector(0, 0);
        this.maxSpeed = maxspeed;
        this.maxForce = maxforce;
        this.radius = 15;
        this.health = 1;
        this.dna = [];
        this.indexTarget = null;
        if (dna === undefined) {
            // La force pour la food
            this.dna[0] = getRnd(-2, 2);
            // La force pour le poison
            this.dna[1] = getRnd(-2, 2);
            // La perception pour la food
            this.dna[2] = getRnd(0, 100);
            // La perception pour le poison
            this.dna[3] = getRnd(0, 100);
            // La force pour les predateurs
            this.dna[4] = getRnd(-2, 0);
            // La perception pour les prédateurs
            this.dna[5] = getRnd(25, 250)
            //Sexe
            this.dna[6] = getRndInteger(0, 2)
            // Predator or not
            if (isPredator === undefined) {
                this.dna[7] = bool[Math.floor(Math.random() * bool.length)];
            } else {
                this.dna[7] = isPredator;
            }
            if (this.dna[7]) {
                // La force d'attraction du predateur
                this.dna[8] = getRnd(2, 3);
                // La perception des predateurs pour la food
                this.dna[9] = getRnd(100, 300);
            }
        } else {
            this.dna[0] = dna[0];
            this.dna[1] = dna[1];
            this.dna[2] = dna[2];
            this.dna[3] = dna[3];
            this.dna[4] = dna[4];
            this.dna[5] = dna[5];
            this.dna[6] = dna[6];
            this.dna[7] = dna[7];
            if (this.dna[7]) {
                this.dna[8] = dna[8];
                this.dna[9] = dna[9];
            }
        }
        this.color = this.dna[7]==1? "red" : "yellow"; 
    }

    updateMaxSpeed(nbr) {
        this.maxSpeed = nbr;
    }

    updateMaxForce(nbr) {
        this.maxForce = nbr;
    }

    draw(debug) {

        let dna_food_attract = this.dna[0]*20;
        let dna_poison_attract = this.dna[1]*20;
        let dna_predator_fear = this.dna[4]*20;
        let newVelFood = this.vel.normalize().multiply(dna_food_attract);
        let newVelPoison = this.vel.normalize().multiply(dna_poison_attract);
        let newVelPredatorFear = this.vel.normalize().multiply(dna_predator_fear);
        let dna_food_percept = this.dna[2];
        let dna_poison_percept = this.dna[3];
        let dna_predator_fear_percep = this.dna[5];
        if (this.dna[7]) {
            var dna_proie_attract = this.dna[8]*20;
            var newVelProie = this.vel.normalize().multiply(dna_proie_attract);
            var dna_proie_percept = this.dna[9];
        }

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.lineWidth = 10;
        if (this.dna[6] == 0) {
            ctx.strokeStyle = 'blue';
        } else {
            ctx.strokeStyle = 'rgb(215, 119, 212)';
        }
        ctx.stroke();
        ctx.fill();

        if (debug) {
            if (this.dna[7]) {
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(this.pos.x + newVelProie.x, this.pos.y + newVelProie.y);
                ctx.strokeStyle = 'green';
                ctx.stroke();
        
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.fillStyle = 'black'
                ctx.arc(this.pos.x, this.pos.y, dna_proie_percept, 0, 2 * Math.PI);
                ctx.strokeStyle = 'green';
                ctx.stroke();
            } else {
                dna_food_percept = dna_food_percept<0? 0 : dna_food_percept;
                dna_poison_percept = dna_poison_percept<0? 0 : dna_poison_percept;
                dna_predator_fear_percep = dna_predator_fear_percep<0? 0 : dna_predator_fear_percep;
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
                ctx.moveTo(this.pos.x, this.pos.y);
                ctx.lineTo(this.pos.x + newVelPredatorFear.x, this.pos.y + newVelPredatorFear.y);
                ctx.strokeStyle = 'blue';
                ctx.stroke();
        
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.fillStyle = 'black'
                ctx.arc(this.pos.x, this.pos.y, dna_food_percept, 0, 2 * Math.PI);
                ctx.strokeStyle = 'green';
                ctx.stroke();
        
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.fillStyle = 'black'
                ctx.arc(this.pos.x, this.pos.y, dna_poison_percept, 0, 2 * Math.PI);
                ctx.strokeStyle = 'red';
                ctx.stroke();

                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.fillStyle = 'black'
                ctx.arc(this.pos.x, this.pos.y, dna_predator_fear_percep, 0, 2 * Math.PI);
                ctx.strokeStyle = 'blue';
                ctx.stroke();
            }
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
        if (this.health >= 0.75 && Math.random(1) < reproductionRate) {
            return new Animal(this.pos.x, this.pos.y, this.maxSpeed, this.maxForce, this.isPredator, this.dna);
        } else {
            return null;
        }
    }

    behaviors(predator, prois, food, poison, bonus, malus, bonusProis) {      
        if (this.dna[7]) {
            if (this.indexTarget == null) {
                var proisSteer = this.eat(prois, bonusProis, this.dna[9]);
                proisSteer = proisSteer.multiply(this.dna[8]);
            } else {
                var proisSteer = this.seek(this.indexTarget);
                proisSteer = proisSteer.multiply(this.dna[8]);
                if (this.indexTarget.isDead()) {
                    this.indexTarget = null;
                }
            }
            this.applyForce(proisSteer);
        } else {
            var foodSteer = this.eat(food, bonus, this.dna[2]);
            var poisonSteer = this.eat(poison, malus, this.dna[3]);
            var predatorSteer = this.eat(predator, 0, this.dna[5]);
    
            foodSteer = foodSteer.multiply(this.dna[0]);
            poisonSteer = poisonSteer.multiply(this.dna[1]);
            predatorSteer = predatorSteer.multiply(this.dna[4]);
            this.applyForce(foodSteer)
            this.applyForce(poisonSteer)
            this.applyForce(predatorSteer)
        }
/*         this.applyForce(foodSteer)
        this.applyForce(poisonSteer) */
    }

    isDead() {
        return (this.health <= 0);
    }

    eat(list, nutrition, perception) {
        var record = Infinity;
        var closest = null;
        for (var i = list.length - 1; i >= 0; i--) {
            if (list[i] != this) {
                var d = this.dist(list[i]);

                if (d < this.maxSpeed) {
                    this.indexTarget = null;
                    list.splice(i, 1);
                    this.health += parseFloat(nutrition);
                } else {
                    if (d < record && d < perception * perception) {
                        record = d;
                        closest = list[i];
                    }
                }
            }
        }
        if (closest != null) {
            this.indexTarget = closest;
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

    clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    update() {
        this.health -= 0.001;
        this.health = this.clamp(this.health, 0, 1)
        this.vel = this.vel.add(this.acceleration);
        this.vel = this.vel.limit(this.maxSpeed)
        this.pos = this.pos.add(this.vel);
        this.acceleration = this.acceleration.multiply(0);
    }
}