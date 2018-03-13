
function run() {
  var shootSound = document.getElementById('shoot-sound');
  shootSound.load();
  
  var N = 4;

  var Primes = [-7, -5, -3, -2, 2, 3, 5, 7];

  var Blocks = [0, 0, 0, 2, 1, 3, 0, 0];


  var canvas = document.getElementById("pi-shift");

  var screen = canvas.getContext('2d');


  var W = canvas.width;
  var H = canvas.height;



  var kb = Keyboarder();

  tick(kb,W,H,screen,Blocks);
}

var KEYS = { LEFT: 37, RIGHT: 39, S: 83 };

function gameUpdate(kb,blocks) {

  if (kb.isDown(KEYS.LEFT)) {
    blocks = arrayRotate(blocks,true);

  } else if (kb.isDown(KEYS.RIGHT)) {
    blocks = arrayRotate(blocks,false);
  }

  if (kb.isDown(KEYS.S)) {
    blocks[0]= blocks[0]+1;
    
    shootSound.play();
  }

  return blocks;
}

function arrayRotate(arr, reverse){
  if(reverse)
    arr.unshift(arr.pop())
  else
    arr.push(arr.shift())
  return arr
} 


function Keyboarder() {
  var keyState = {};
  window.addEventListener('keydown', function (e) {
    keyState[e.keyCode] = true;
  });

  window.addEventListener('keyup', function (e) {
    keyState[e.keyCode] = false;
  });
  var isDown = function (keyCode) {
    return keyState[keyCode] === true;
  };
  
  return {keyState:keyState, isDown:isDown};
};


function draw(screen, W,H, bodies) {
  // Clear away the drawing from the previous tick.
  screen.clearRect(0, 0, W,H);

  // Draw each body as a rectangle.
  for (var i = 0; i < bodies.length; i++) {
    drawRect(screen, bodies[i], i, W, H);
  }
};

var update = function (bodies) {

  for (var i = 0; i < bodies.length; i++) {
    updateBody(bodies[i]);
  }
};

var tick = function (kb,W,H,screen,bodies) {
  bodies = gameUpdate(kb,bodies);
  draw(screen, W,H, bodies);
  requestAnimationFrame(function(){tick(kb,W,H,screen,bodies);});
  //tick();
};


// **drawRect()** draws passed body as a rectangle to `screen`, the drawing context.
function drawRect(screen, b, idx, W, H) {
  if (b>0) {
    screen.fillRect(idx , b , 1, 1);
  }  
};


// Start game
// ----------

// When the DOM is ready, create (and start) the game.
window.addEventListener('load', run);
