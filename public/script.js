
let squares;
let speed;
let size;
let sorting;
let spacing;
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
      generate();
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

    generate();
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

  }
  make(){
    if(this.done == false){
      this.pct += speed / 3;
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

  compareTo(square2){
    return (this.color > square2.color);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generate(){
  if(sorting){
    return;
  }
  squares = [];
  let count = document.getElementById("count").value;
  
  size = windowWidth / (count * 2.5);
  spacing = Math.floor(240/count) * 4.5;
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
  document.getElementById("count").disabled = true;
  if(sorting){
    return;
  }
  let square1;
  let square2;
  let tempX;
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < squares.length; j++){
      square1 = squares[j];
      let square2Box = Math.floor(Math.random()*squares.length)
      square2 = squares[square2Box];
      tempX = square1.x;
      square1.x = square2.x;
      square2.x = tempX;
      squares[j] = square2;
      squares[square2Box] = square1;
      await sleep(10);
    }
  }
  document.getElementById("count").disabled = false;
}


async function selectSort(){
  if(sorting){
    return;
  }
  sorting = true;
  document.getElementById("count").disabled = true;
  var selector = document.getElementById("selector");
  var selection = selector.value;

  if(selection == "insertion"){await insertionSort()}

  if(selection == "bubble"){await bubbleSort() }

  if(selection == "merge"){
    let tempList = squares.slice(0, squares.length);
    tempList = await mergeSort(tempList);
    squares = tempList;
    sorting = false;
  }

  if(selection == "quick"){
    let tempList = squares.slice(0, squares.length);
    tempList = await quickSort(tempList);
    squares = tempList;
    sorting = false;
  }
  document.getElementById("count").disabled = false;
}

async function insertionSort(){
  //Move em down
  document.getElementById("speed").disabled = true;
  let tempSpeed = speed;
  speed = 10;
  for(let i = 0; i < squares.length; i++){
    squares[i].move(0, 400);
  }
  
  while(squares[squares.length - 1].done == false) { await sleep(10); }
  speed = tempSpeed;

  document.getElementById("speed").disabled = false;
  // Sorting
  for(let i = 1; i < squares.length; i++){
    squares[i].move(0, -(size + 20))
    while(squares[i].done == false) { await sleep(10); }
    let pos = i;
    while(pos > 0){
      if(!squares[pos].compareTo(squares[pos-1])){
        squares[pos].move(squares[pos-1].x - squares[pos].x, 0);
        squares[pos-1].move(squares[pos].x - squares[pos-1].x, 0);
        while(squares[pos].done == false) { await sleep(10); }
        let tempSquare = squares[pos];
        squares[pos] = squares[pos-1];
        squares[pos-1] = tempSquare;
        pos--;
      } else{
        break;
      }
    }
    squares[pos].move(0, (size + 20))
    while(squares[pos].done == false) { await sleep(10); }
  }

  //Move back up
  document.getElementById("speed").disabled = true;
  tempSpeed = speed;
  speed = 10;
  for(let i = 0; i < squares.length; i++){
    squares[i].move(0, -400);
  }
  
  while(squares[squares.length - 1].done == false) { await sleep(10); }
  speed = tempSpeed;
  sorting = false;
  document.getElementById("speed").disabled = false;
}

async function bubbleSort(){
  //Move em down
  document.getElementById("speed").disabled = true;
  let tempSpeed = speed;
  speed = 10;
  for(let i = 0; i < squares.length; i++){
    squares[i].move(0, 400);
  }
  
  while(squares[squares.length - 1].done == false) { await sleep(10); }
  speed = tempSpeed;

  document.getElementById("speed").disabled = false;

  //Begin Sort
  for(let end = squares.length - 1; end > 0; end--){
    for(let i = 0; i < end; i++){
      squares[i].move(0, -(size + 20));
      squares[i+1].move(0, -(size + 20));
      while(squares[i].done == false) { await sleep(10); }
      if(squares[i].compareTo(squares[i+1])){
        squares[i].move(squares[i+1].x - squares[i].x, 0);
        squares[i+1].move(squares[i].x - squares[i+1].x, 0);
        while(squares[i].done == false) { await sleep(10); }
        let tempSquare = squares[i];
        squares[i] = squares[i+1];
        squares[i+1] = tempSquare;
      }
      squares[i].move(0, (size + 20));
      squares[i+1].move(0, (size + 20));
      while(squares[i].done == false) { await sleep(10); }
    }
    squares[end].move(0, -400);
  }
  squares[0].move(0, -400);

  while(squares[0].done == false) { await sleep(10); }

  sorting = false;
}

async function mergeSort(list){
  //Stopping case
  if(list.length < 2){
    return list;
  }

  //Shift Down
  for(let i = 0; i < list.length; i++){
    list[i].move(0, (size + 50));
  }
  while(list[list.length - 1].done == false) { await sleep(10); }

  
  let left = list.slice(0, Math.ceil(list.length/2));
  let right = list.slice(Math.ceil(list.length/2), list.length);
  left = await (mergeSort(left));
  right = await (mergeSort(right));
  //they are guaranteed to be sorted

  //begin merge
  let furthestLeft = left[0].x;
  let pointerLeft = 0;
  let pointerRight = 0;

  while(pointerLeft < left.length && pointerRight < right.length){
    if(!left[pointerLeft].compareTo(right[pointerRight])){
      //Moving
      left[pointerLeft].move(furthestLeft + spacing * (pointerLeft + pointerRight) - left[pointerLeft].x, -(size + 50));
      while(left[pointerLeft].done == false) { await sleep(10); }
      //Organizing list
      list[pointerLeft + pointerRight] = left[pointerLeft];
      pointerLeft++;
    } else {
      right[pointerRight].move(furthestLeft + spacing * (pointerLeft + pointerRight) - right[pointerRight].x, -(size + 50));
      while(right[pointerRight].done == false) { await sleep(10); }
      list[pointerLeft + pointerRight] = right[pointerRight];
      pointerRight++;
    }
  }
  //One of the lists has ran out
  if(pointerRight >= right.length){
    for(let i = pointerLeft; i < left.length; i++){
      left[pointerLeft].move(furthestLeft + spacing * (pointerLeft + pointerRight) - left[pointerLeft].x, -(size + 50));
      while(left[pointerLeft].done == false) { await sleep(10); }
      list[pointerLeft + pointerRight] = left[pointerLeft];
      pointerLeft++;
    }
  } else {
    for(let i = pointerRight; i < right.length; i++){
      right[pointerRight].move(furthestLeft + spacing * (pointerLeft + pointerRight) - right[pointerRight].x, -(size + 50));
      while(right[pointerRight].done == false) { await sleep(10); }
      list[pointerLeft + pointerRight] = right[pointerRight];
      pointerRight++;
    }
  }
  return list;

}


async function quickSort(list){
  //Stopping case
  if(list.length < 2){
    return list;
  }

  var firstX = list[0].x;
  var lastX = list[list.length - 1].x;

  var pivot = list[Math.floor(Math.random() * list.length)];
  pivot.move(0, size + 20);
  while(pivot.done == false) { await sleep(10); }
  
  var left = [];
  var right = [];
  
  for(let i = 0; i < list.length; i++){
    if(list[i] == pivot){continue;}
    if(pivot.compareTo(list[i])){
      list[i].move(firstX + spacing * left.length - list[i].x, 2 * size + 40);
      while(list[i].done == false) { await sleep(10); }
      left.push(list[i]);
    } else {
      list[i].move(lastX - spacing * right.length - list[i].x, 2 * size + 40);
      while(list[i].done == false) { await sleep(10); }
      right.unshift(list[i]);
    }
  }
  pivot.move(firstX + spacing * left.length - pivot.x, 0);
  while(pivot.done == false) { await sleep(10); }

  left = await (quickSort(left));
  right = await (quickSort(right));

  for(let i = 0; i < left.length; i++){
    left[i].move(0, -(2 * size + 40));
  }
  if(left.length > 0){
    while(left[0].done == false) { await sleep(10); }
  }

  for(let i = 0; i < right.length; i++){
    right[i].move(0, -(2 * size + 40));
  }
  if(right.length > 0){
    while(right[0].done == false) { await sleep(10); }
  }

  pivot.move(0, -(size+20));
  while(pivot.done == false) { await sleep(10); }

  
  list = left.concat(pivot).concat(right);

  return list;

}
