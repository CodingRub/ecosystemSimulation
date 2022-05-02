import { Animal } from './Animal.js';
import { Food, Poison } from './Aliment.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let lstAnimal = [];
let lstProie = [];
let lstPredator = [];
let food = [];
let poison = [];

let nbrGeneration = 0;
let lstAnimalPerGen = [];
let isStop = false;

canvas.addEventListener('contextmenu', event => event.preventDefault());

const title = document.querySelector(".title");
const btnDash = document.querySelector(".arrow-dash");
const dashboard = document.querySelector(".dashboard");
const btnConsole = document.querySelector(".arrow-console");
const consoleLog = document.querySelector(".console");
const speedRange = document.querySelector(".speedRange");
const pause = document.querySelector(".pause");
const pauseElement = document.querySelector(".fas");
const forceRange = document.querySelector(".forceRange");
const foodRange = document.querySelector(".foodRange");
const foodBonusRange = document.querySelector(".foodBonusRange");
const poisonRange = document.querySelector(".poisonRange");
const poisonMalusRange = document.querySelector(".poisonMalusRange");
const reprodRange = document.querySelector(".reprodRange");
const debugCheck = document.querySelector(".debugCheck");

btnDash.addEventListener('click', function() {
    dashboard.classList.toggle("open");
})

btnConsole.addEventListener('click', function() {
    consoleLog.classList.toggle("open2");
})

let speedNbr = speedRange.value;
let forceNbr = forceRange.value;
let foodNbr = foodRange.value;
let foodBonus = foodBonusRange.value;
let poisonNbr = poisonRange.value;
let poisonMalus = poisonMalusRange.value;
let reprodNbr = reprodRange.value;
let debug = debugCheck.checked;


const labelSpeed = document.querySelector(".range-details-speed");
labelSpeed.innerText = speedNbr;
const labelForce = document.querySelector(".range-details-force");
labelForce.innerText = forceNbr;
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

pause.addEventListener('click', function() {
    if (isStop) {
        isStop = false;
        pauseElement.classList.toggle('fa-pause')
        pauseElement.classList.toggle('fa-play')
        draw();
    } else {
        isStop = true;
        pauseElement.classList.toggle('fa-play')
        pauseElement.classList.toggle('fa-pause')
    }   
})

speedRange.addEventListener('change', function() {
    labelSpeed.innerText = speedRange.value;
    speedNbr = speedRange.value 
})

forceRange.addEventListener('change', function() {
    labelForce.innerText = forceRange.value;
    forceNbr = forceRange.value 
})

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

debugCheck.addEventListener('change', function() {
    debug = debugCheck.checked;
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
        var animal = new Animal(getRnd(0, canvas.width), getRnd(0, canvas.height), speedNbr, forceNbr, false)
        if (animal.dna[7]) {
            lstPredator.push(animal);
            lstAnimal.push(animal);
        } else {
            lstAnimal.push(animal);
            lstProie.push(animal)
        }
    }
}

function sum(lst) {
    let total = 0;
    for (var i = 0; i < lst.length; i++) {
        total += lst[i];
    }
    return total
}

canvas.addEventListener("mouseup", add, false);

function add(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (e.button == 0) {
        var animal = new Animal(x, y, speedNbr, forceNbr, true)
        lstPredator.push(animal);
        lstAnimal.push(animal);
    } else if (e.button == 2) {
        var animal = new Animal(x, y, speedNbr, forceNbr, false)
        lstAnimal.push(animal);
        lstProie.push(animal)
    }

}

function updateConsole() {
    let consoledata = '';
    for (var i = 0; i < lstAnimal.length; i++) {
        var name = "Animal";
        var attrPred = ' | proie_fear: ' + lstAnimal[i].dna[4].toFixed(2)
        var percepPred = ' | proie_percep: ' + lstAnimal[i].dna[5].toFixed(2)
        var sexe = lstAnimal[i].dna[6]==0?"M":"F";
        if (lstAnimal[i].dna[7]) {
            name = "Predat"
            attrPred = ' | predator_attract: ' + lstAnimal[i].dna[8].toFixed(2);
            percepPred = ' | predator_percep: ' + lstAnimal[i].dna[9].toFixed(2)
        }
        consoledata += '[' + name + ' ' + (i+1) + ']' + 
        ' sexe: ' + sexe +
        ' | life: ' + lstAnimal[i].health.toFixed(2) + 
        ' | x: ' + lstAnimal[i].pos.x.toFixed(2) + 
        ' | y: ' + lstAnimal[i].pos.y.toFixed(2) + 
        ' | food_attract: ' + lstAnimal[i].dna[0].toFixed(2) +
        ' | poison_attract: ' + lstAnimal[i].dna[1].toFixed(2) +
        attrPred +
        ' | food_percep: ' + lstAnimal[i].dna[2].toFixed(2) +
        ' | poison_percep: ' + lstAnimal[i].dna[3].toFixed(2) +
        percepPred +
        '\n';
    }
    output.innerHTML = '<h3>Console</h3>\n<pre>' + consoledata + '</pre>';
}

function setup() {
    createAnimal(1);
    createAliment(0)
    createPoison(0);
    setInterval(updateConsole, 1000);
}

var last = 0;
function draw(now) {
    let myReq;
    if (isStop) {
        cancelAnimationFrame(myReq);
    } else {
        myReq = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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

/*     console.log("============================")
    console.log(now/1000)
    console.log(now/1000%5)
    if (now/1000 % 5 >= 0 && now/1000 % 5 < 0.02) {
        lstAnimalPerGen.push(lstAnimal.length)
        console.log(lstAnimalPerGen)
    } */

    ctx.textAlign = "left";
    ctx.font = "25px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Animal:"+lstAnimal.length, 10, 40, 300);
    ctx.fillText("Food:"+food.length, 10, 70, 300);
    ctx.fillText("Poison:"+poison.length, 10, 100, 300);
    ctx.fillText("Time: "+Math.round(now/1000, 2) + "s",10, 130, 300);
/*     ctx.fillText("Moyenne: "+Math.round(sum(lstAnimalPerGen)/lstAnimalPerGen.length, 2),10, 150, 300); */
    for (var i = lstAnimal.length - 1; i >= 0; i--) {
        let animal = lstAnimal[i];
        animal.behaviors(lstPredator, lstProie, food, poison, foodBonus, poisonMalus, 0.4);
        animal.bounceOffWalls();
        animal.updateMaxSpeed(speedNbr);
        animal.updateMaxForce(forceNbr);
        animal.update();
        animal.draw(debug);
        
        let newAnimal = animal.born(reprodNbr);

        if (newAnimal != null) {
            if (newAnimal.dna[7]) {
                lstPredator.push(newAnimal);
                lstAnimal.push(newAnimal);
            } else {
                lstAnimal.push(newAnimal);
                lstProie.push(newAnimal);
            }
        }

        if (animal.isDead()) {
            createAliment(1, animal.pos.x, animal.pos.y);
            lstAnimal.splice(i, 1)
        }
    }
}

setup();
draw();