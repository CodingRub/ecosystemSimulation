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


const foodRange = document.querySelector(".foodRange");
const foodBonusRange = document.querySelector(".foodBonusRange");
const poisonRange = document.querySelector(".poisonRange");
const poisonMalusRange = document.querySelector(".poisonMalusRange");
const reprodRange = document.querySelector(".reprodRange");


let foodNbr = foodRange.value;
let foodBonus = foodBonusRange.value;
let poisonNbr = poisonRange.value;
let poisonMalus = poisonMalusRange.value;
let reprodNbr = reprodRange.value;

const labelFood = document.querySelector(".range-details-food");
labelFood.innerText = foodNbr;
const labelFoodBonus = document.querySelector(".range-details-food-bonus");
labelFoodBonus.innerText = foodBonus;
const labelPoison = document.querySelector(".range-details-poison");
labelPoison.innerText = poisonNbr;
const labelPoisonMalus = document.querySelector(".range-details-poison-malus");
labelPoisonMalus.innerText = poisonMalus;
const labelReprod = document.querySelector(".range-details-reprod");
labelReprod.innerText = reprodNbr;
let output = document.querySelector(".console");

foodRange.addEventListener('change', function() {
    labelFood.innerText = foodRange.value;
    foodNbr = foodRange.value 
})

foodBonusRange.addEventListener('change', function() {
    labelFoodBonus.innerText = foodBonusRange.value;
    foodBonus = foodBonusRange.value 
})

poisonRange.addEventListener('change', function() {
    labelPoison.innerText = poisonRange.value;
    poisonNbr = poisonRange.value;
})

poisonMalusRange.addEventListener('change', function() {
    labelPoisonMalus.innerText = poisonMalusRange.value;
    poisonMalus = poisonMalusRange.value 
})

reprodRange.addEventListener('change', function() {
    labelReprod.innerText = reprodRange.value;
    reprodNbr = reprodRange.value;
})

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

function updateConsole() {
    let consoledata = '';
    for (var i = 0; i < lstAnimal.length; i++) {
        consoledata += '[Rabbit ' + (i+1) + ']' + 
        ' life: ' + lstAnimal[i].health.toFixed(2) + 
        ' | x: ' + lstAnimal[i].pos.x.toFixed(2) + 
        ' | y: ' + lstAnimal[i].pos.y.toFixed(2) + 
        ' | food_attract: ' + lstAnimal[i].dna[0].toFixed(2) +
        ' | poison_attract: ' + lstAnimal[i].dna[1].toFixed(2) +
        ' | food_percep: ' + lstAnimal[i].dna[2].toFixed(2) +
        ' | poison_percep: ' + lstAnimal[i].dna[3].toFixed(2) +
        '\n';
    }
    output.innerHTML = '<h3>Console</h3>\n<pre>' + consoledata + '</pre>';
}

function setup() {
    createAnimal(1);
    createAliment(200)
    createPoison(30);
    setInterval(updateConsole, 1000);
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

    if (Math.random(1) < foodNbr) {
        createAliment(1, getRndInteger(0, canvas.width), getRndInteger(0, canvas.height))
    }

    if (Math.random(1) < poisonNbr) {
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

    ctx.textAlign = "left";
    ctx.font = "25px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Animal:"+lstAnimal.length, 10, 30, 300);
    ctx.fillText("Food:"+food.length, 10, 60, 300);
    ctx.fillText("Poison:"+poison.length, 10, 90, 300);
    ctx.fillText("Time: "+Math.round(now/1000, 2) + "s",10, 120, 300);

    for (var i = lstAnimal.length - 1; i >= 0; i--) {
        let animal = lstAnimal[i];
        animal.behaviors(food, poison, foodBonus, poisonMalus);
        animal.bounceOffWalls();
        animal.update();
        animal.draw();
        
        let newAnimal = animal.born(reprodNbr);

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