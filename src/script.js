
let squares;
let speed;
let sleep;
function setup() {
    const canv = document.getElementById("canv");
    let canvas = createCanvas(windowWidth * .8, windowHeight, canv);
    canvas.style('display', 'block');
    background("#151515");
    squares = [];

    //Sliders
    var numSlider = document.getElementById("count");
    var counter = document.getElementById("number");
    counter.innerHTML = "Elements: " + numSlider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    numSlider.oninput = function() {
      counter.innerHTML = "Elements: " + this.value;
    }

    //Sliders
    var speedSlider = document.getElementById("speed");
    var speedNum = document.getElementById("speedNumber");
    speedNum.innerHTML = "Speed: " + speedSlider.value + "%"; // Display the default slider value
    speed = speedSlider.value;
    // Update the current slider value (each time you drag the slider handle)
    speedSlider.oninput = function() {
      speedNum.innerHTML = "Speed: " + this.value + "%";
      speed = this.value;
    }


    //Sleep function
    sleep = ms => new Promise(r => setTimeout(r, ms));
}

class Square{
  constructor(xPos, yPos, color, size){
    this.x = xPos;
    this.y = yPos;
    this.color = color;
    this.size = size;
    this.xToMove = 0;
    this.yToMove = 0;
    this.beginX;
    this.beginY;
    this.pct = 0;
    this.done = true;
  }
  move(xDist, yDist){
    this.xToMove = xDist;
    this.yToMove = yDist;
    this.beginX = this.x;
    this.beginY = this.y;
    this.done = false;
    this.pct = 0.0;
    console.log("hi");
  }
  make(){
    if(this.done == false){
      console.log(this.pct);
      this.pct += speed / 10;
      if(this.pct < 100){
        this.x = this.beginX + Math.sin(PI * .5 * (this.pct/100)) * this.xToMove;
        this.y = this.beginY + Math.sin(PI * .5 * (this.pct/100)) * this.yToMove;
      } else if (this.pct >= 100 && this.done == false){
        this.x = this.beginX + this.xToMove;
        this.y = this.beginY + this.yToMove;
        this.done = true;
      }
    }
    

    colorMode(HSB);
    fill(this.color, 100, 100);
    rect(this.x, this.y, this.size, this.size);
  }
}

function generate(){
  squares = [];
  let count = document.getElementById("count").value;
  if(isNaN(count)){count = 100}
  if(count > 240){
    count = 240;
  }
  if(count < 5){
    count = 5;
  }
  let size = windowWidth / (count * 2.5);
  for(let i = 0; i < 240; i += Math.floor(240/count)){
    squares.push(new Square(50 + i*4.5, 50, i, size));
  }
  
}

function draw(){
  background("#151515");
  for (let index = 0; index < squares.length; ++index) {
    const element = squares[index];
    element.make();
}
}

async function randomize(){
  let square1;
  let square2;
  let tempX;
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < squares.length; j++){
      square1 = squares[j];
      square2 = squares[Math.floor(Math.random()*squares.length)];
      tempX = square1.x;
      square1.x = square2.x;
      square2.x = tempX;
      await sleep(1);
    }
  }
}

function moveFirst(){
  console.log("hi");
  squares[0].move(50, 0);
}

