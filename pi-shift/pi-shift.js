var shootsound;
gameWidth = 64;
gameHeight = 64;
function run() {
  shootSound = document.getElementById('shoot-sound');
  shootSound.load();



  var Primes = [-7, -5, -3, -2, 2, 3, 5, 7];


  var Blocks = new Array(gameWidth);
  for (var i = 0; i < gameWidth; i++) Blocks[i] = 0;

  var canvas = document.getElementById("pi-shift");

  var screen = canvas.getContext('2d');

  canvas.width = gameWidth;
  canvas.height = gameHeight;

  var W = canvas.width;
  var H = canvas.height;

  console.log({ W: W, H: H });

  var kb = Keyboarder();

  tick(kb, W, H, screen, Blocks);
}

var KEYS = { LEFT: 37, RIGHT: 39, S: 83, UP: 38, DOWN: 40 };

var WH = gameWidth / 2;

var leftLast = false;
var rightLast = false;
var upLast = false;
var downLast = false;

function gameUpdate(kb, blocks) {
  var updated = false;

  if (kb.isDown(KEYS.DOWN)) {
    if (!downLast) {
      blocks[WH] = blocks[WH] - 1;
      shootSound.play();
      updated = true;
    } 
    
    downLast = true;
    upLast =false


  } else if (kb.isDown(KEYS.UP)) {
    if (!upLast) {
    blocks[WH] = blocks[WH] + 1;
    shootSound.play();
    updated = true;
    }
    upLast = true;
    downLast = false;
  } else {
    downLast = false;
    upLast = false;
  }

  if (kb.isDown(KEYS.LEFT)) {

    blocks = RotRev(blocks);
    updated = true;

  } else if (kb.isDown(KEYS.RIGHT)) {

    blocks = Rot(blocks);
    updated = true;
  }

  return { updated: updated, blocks: blocks };
}

function Rot(arr) {
  arr.push(arr.shift());
  return arr;
}

function RotRev(arr) {
  arr.unshift(arr.pop());
  return arr;
}

var allKeys = [KEYS.UP, KEYS.DOWN, KEYS.LEFT, KEYS.RIGHT];

function Keyboarder() {
  var keyState = {};
  window.addEventListener('keydown', function (e) {
    keyState[e.keyCode] = true;
    if (allKeys.indexOf(e.keyCode) != -1) {
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', function (e) {
    keyState[e.keyCode] = false;
  });
  var isDown = function (keyCode) {
    return keyState[keyCode] === true;
  };

  return { keyState: keyState, isDown: isDown };
};


function draw(screen, W, H, bodies) {
  // Clear away the drawing from the previous tick.
  screen.clearRect(0, 0, W, H);

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

var tick = function (kb, W, H, screen, bodies) {
  var result = gameUpdate(kb, bodies);
  var updated = result.blocks;
  var blocks = result.blocks;

  if (updated) {
    draw(screen, W, H, blocks);
  }
  requestAnimationFrame(function () { tick(kb, W, H, screen, blocks); });

};

var HH = gameHeight / 2;

function drawRect(screen, b, idx, W, H) {
  if (b !== 0) {
    pix(screen, idx,  HH - b, 0, 0, 0, 1);
  } else {
    pix(screen, idx,  HH - b, 0, 0, 0, .1);
  }
};

function pix(screen, x, y, r, g, b, a) {
  screen.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
  screen.fillRect(x, y, 1, 1);
}

// When the DOM is ready, create (and start) the game.
window.addEventListener('load', run);
