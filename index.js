import { Animal } from './Animal.js';
import { Food, Poison } from './Aliment.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let lstAnimal = [];
let food = [];
let poison = [];

function getRnd(min, max) {
    return Math.random() * (max - min) + min;
}

function getRndInteger(min, max) {
    return Math.random() * (max - min) + min;
}

function createAliment(nbr, x, y) {
    for (var i = 0; i < nbr; i++) {
        if (x === undefined || y === undefined) {
            food.push(new Food(getRndInteger(0, canvas.width), getRndInteger(0, canvas.height)))
        } else {
            food.push(new Food(x, y));
        }
    }
}

function createPoison(nbr, x, y) {
    for (var i = 0; i < nbr; i++) {
        if (x === undefined || y === undefined) {
            poison.push(new Poison(getRndInteger(0, canvas.width), getRndInteger(0, canvas.height)))
        } else {
            poison.push(new Poison(x, y));
        }
    }
}

function createAnimal(nbr) {
    for (var i = 0; i < nbr; i++) {
        lstAnimal.push(new Animal(getRnd(0, canvas.width), getRnd(0, canvas.height)));
    }
}

function getListFood() {
    return food;
}


function setup() {
    createAnimal(10);
    createAliment(200)
    createPoison(30);
    console.log(getListFood());
}

var last = 0;
function draw(now) {
    let myReq = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (lstAnimal.length == 0) {
        cancelAnimationFrame(myReq);
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random(1) < 0.06) {
        createAliment(1, getRndInteger(0, canvas.width), getRndInteger(0, canvas.height))
    }

    if (Math.random(1) < 0.009) {
        createPoison(1, getRndInteger(0, canvas.width), getRndInteger(0, canvas.height))
    }

    for (var i = 0; i < food.length; i++) {
        let foodElt = food[i];
        foodElt.draw();
    }
    for (var i = 0; i < poison.length; i++) {
        let poisonElt = poison[i];
        poisonElt.draw();
    }

    ctx.textAlign = "right";
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.fillText("Time: "+Math.round(now/1000, 2) + "s",980, 30, 200);
    ctx.textAlign = "left";
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.fillText("Animal:"+lstAnimal.length, 10, 30, 200);
    ctx.fillText("Food:"+food.length, 10, 70, 200);
    ctx.fillText("Poison:"+poison.length, 10, 110, 200);

    for (var i = lstAnimal.length - 1; i >= 0; i--) {
        let animal = lstAnimal[i];
        animal.behaviors(food, poison);
        animal.bounceOffWalls();
        animal.update();
        animal.draw();
        
        let newAnimal = animal.born();

        if (newAnimal != null) {
            lstAnimal.push(newAnimal);
        }

        if (animal.isDead()) {
            createAliment(1, animal.pos.x, animal.pos.y);
            lstAnimal.splice(i, 1)
        }
    }
}

setup();
draw();