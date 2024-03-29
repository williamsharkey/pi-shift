var W = 80;
var H = 50;
var P = { e: 0, x: 0, y: 0 };
var turn = 0;
var view = 0;
var canvas = document.getElementById("pi-shift");

function bg(m) {
  var x = getComputedStyle(canvas).backgroundColor.replace("rgb(", "").replace(")", "").split(",");
  return "rgba(" + clean(x[0] * m) + "," + clean(x[1] * m) + "," + clean(x[2] * m) + ",1)";
}

function clean(x) {
  return Math.floor(Math.max(0, Math.min(255, x)));
}

function run() {

  var Blocks = new Array(W);
  var last = 8;
  for (var i = 0; i < W; i++) {
    var x = Math.floor(Math.random() * 3) - 1;
    Blocks[i] = last + x;
    last = last + x;
  }

  P.y = Blocks[P.x];


  var screen = canvas.getContext('2d');

  canvas.width = W;
  canvas.height = H;


  var kb = Keyboarder();

  tick(kb, screen, Blocks);
}

var KEYS = { LEFT: 37, RIGHT: 39, S: 83, UP: 38, DOWN: 40 };

var WH = W / 2;

var leftLast = false;
var rightLast = false;
var upLast = false;
var downLast = false;
//var scale = [0, 1, 3, 5, 7, 8, 10];
var scale = [-12, -8.5, -18.5, -22];

//var scale = [0, -2, 12, 19, 5, 4, 0, 7, 9];
var sl = scale.length;
function gameUpdate(kb, blocks) {
  var updated = false;
  var denied = false;
  if (kb(KEYS.DOWN)) {
    if (!downLast) {
      var dec = blocks[P.x] - 1;
      blocks[P.x] = dec;
      P.y--;
      createOscillator(P.y, 1600);
      P.e = P.e + 1;
      updated = true;
    }

    downLast = true;
    upLast = false

  } else if (kb(KEYS.UP)) {
    if (!upLast) {
      var inc = blocks[P.x] + 1;
      blocks[P.x] = inc;
      P.y++;
      createOscillator(P.y, 1600);
      P.e = P.e - 1;
      updated = true;
    }
    upLast = true;
    downLast = false;
  } else {
    downLast = false;
    upLast = false;
  }

  if (kb(KEYS.LEFT)) {
    var allowed = (blocks[m(P.x - 1)] - blocks[P.x]) <= 1;
    if (!leftLast) {
      leftLast = true;
      rightLast = false;
      if (allowed) {
        //blocks = RotRev(blocks);
        var lastHeight = blocks[P.x];
        view = vo(-1);
        P.x = m(P.x - 1);
        P.y += blocks[P.x] - lastHeight;
        createOscillator(P.y, 1600);
        updated = true;
      } else {
        denied = true;
      }
    }

  } else if (kb(KEYS.RIGHT)) {
    var allowed = (blocks[m(P.x + 1)] - blocks[P.x]) <= 1;
    if (!rightLast) {
      rightLast = true;
      leftLast = false;
      if (allowed) {
        //blocks = Rot(blocks);
        var lastHeight = blocks[P.x];
        view = vo(1);
        P.x = m(P.x + 1);
        P.y += blocks[P.x] - lastHeight;
        createOscillator(P.y, 1600);
        updated = true;
      } else {
        denied = true;
      }
    }

  } else {
    leftLast = false;
    rightLast = false;
  }

  if (denied) {
    noise(.3, 400);
  }

  return { updated: updated, blocks: blocks };
}
//View offset
function vo(o) {
  return (o + W + view) % W;
}
//mod width
function m(o) {
  return (o + W) % W;
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

var rclick, lclick, uclick, dclick = null;


function Keyboarder() {

  var keyState = {};

  lclick = function (e) {
    keyState[KEYS.LEFT] = true;
    setTimeout(function () { keyState[KEYS.LEFT] = false; }, 200);
  };


  document.getElementById("left").addEventListener("touchstart", lclick, false);
  document.getElementById("left").addEventListener("onmousedown", lclick, false);

  rclick = function (e) {
    keyState[KEYS.RIGHT] = true;
    setTimeout(function () { keyState[KEYS.RIGHT] = false; }, 200);
  };


  document.getElementById("right").addEventListener("touchstart", rclick, false);
  document.getElementById("right").addEventListener("onmousedown", rclick, false);

  uclick = function (e) {
    keyState[KEYS.UP] = true;
    setTimeout(function () { keyState[KEYS.UP] = false; }, 200);
  };

  document.getElementById("up").addEventListener("touchstart", uclick, false);
  document.getElementById("up").addEventListener("onmousedown", uclick, false);

  dclick = function (e) {
    keyState[KEYS.DOWN] = true;
    setTimeout(function () { keyState[KEYS.DOWN] = false; }, 200);
  };

  document.getElementById("down").addEventListener("touchstart", dclick, false);
  document.getElementById("down").addEventListener("onmousedown", dclick, false);

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

  return isDown;
};


function draw(screen, bodies) {

  if ((turn % (H * 1)) == 16) {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 150);
    var b = Math.floor(Math.random() * 206);
    canvas.style.backgroundColor = "rgba(" + r + "," + g + "," + b + ",1)";
  }
  // Clear away the drawing from the previous tick.
  screen.clearRect(0, 0, W, H);

  //drawString(screen, 0, 8, "PI SHIFT", 160, 114, 130, .5);
  //drawString(screen, 0, 8, "   " + turn, 160, 114, 130, .5);
  //drawString(screen, 0, 8, "HELLO WORLD 123", 160, 114, 130, 1);
  var story = `
BEHOLD
THE OLD
DUSTY BOT
  
 
!!!
AWAKENED
ONCE MORE

CIRCUITS
CHIRPING

LUMINESCENT
L.E.D.S BLINK
IN COLD AIR
REMINDING YOU
OF THE FACTORY
WHERE I WAS
ASSEMBLED

LOOK AT MY
CPU
A TACHIMA-307
MADE IN JAPAN
YEAR 2082
MONTH 3
REV 3
I COULD FEEL
THE CPU WAS
CONFUSED AND
WARM

...
???
...

A VICIOUS
BIRD SPEAKS
<<CAWW>>
DEAR BOT
IT IS I
VERMUNA
BIRD OF
THE EAST

I WILL BE
YOUR GUIDE
WITH BLACK
WINGS
GOLDEN RING
ORANGE CLAWS
SHARP BEAK
<<CAWW>>

YOU MUST FOLLOW
MY EVERY
INSTRUCTION
WITH CARE
..OR
A THICK TAR
WILL POUR
BETWEEN EVERY
METALLIC WIRE
OVER YOUR OLD
MOTHERBOARD

NOW YOU
DREADFUL, DUSTY
BOT
CARRY THAT
ROUND ROCK
INTO THE CAVE

/////////////////
//A SPOOKY CAVE//
// OPENS BELOW //
/////////////////





`.split('\n');

  //     "PULSING", "THE CPU", "WAS CONFUSED", "...", "A", "VICIOUS",
  //     " BIRD SPOKE", "<<CAWW>>", " *DEAR BOT* ", "IT IS I", "VERMUNA", "BIRD OF",
  //     "THE EAST", "     .", "I WILL BE", "YOUR GUIDE", "WITH BLACK", " WINGS",
  //     "SHARP BEAK", "AND WIREY", "ORANGE FEET", "<<CAWW>>","", "FOLLOW MY", "  EVERY",
  //     "INSTRUCTION", " WITH CARE", "    ..OR", "A THICK TAR", "WILL POUR",
  //     "OVER EVERY", "METALIC PART", "OF YOUR", "MOTHERBOARD", "<<    >>",
  //     " << CAWW >>", "HEY YOU BOT!", "CARRY THAT", "ROUND ROCK", "INTO",
  //     "  THE CAVE  ", "OPENING BELOW", " (THE CAVE) ", "((        ))",
  //     "OF MYSTERY", ".", ".", "WERE WE", "SLEEPING", "?", "DREAMING?",
  //     "???", "OUR ATTENTION", "DRIFTED", "SLOWLY LOWER", "INTO THE HILL",
  //     "THE SLOPE WAS", "TOO MUCH.", "*", "DIRTY ROCKS", "SLID AND SOD",
  //     "CRUMBLED"];

  textCenter(screen, WH, 8, story[Math.floor(turn / 5) % story.length], bg(1.4));


  // Draw each body as a rectangle.
  for (var i = 0; i < bodies.length; i++) {
    drawRect(screen, bodies[i], m(i + WH - view));
  }



  var col = bg(1.9);
  //var col = c(255, 255, 255, 1);
  var body = 6;
  var bodyCol = bg(1.8);

  pixc(screen, m(WH + P.x - view), H - P.y - 2 - body, col)

  for (var b = 0; b < body; b++) {
    pixc(screen, m(WH + P.x - view - 1), H - P.y - 2 - b, bodyCol);
    pixc(screen, m(WH + P.x - view + 1), H - P.y - 2 - b, bodyCol);
  }


  // pixc(screen, m(WH + P.x - view - 1), H - P.y - 2 - body + 1, bodyCol);
  // pixc(screen, m(WH + P.x - view - 1), H - P.y - 2 - body + 2, bodyCol);
  // pixc(screen, m(WH + P.x - view - 1), H - P.y - 2 - body + 3, bodyCol);
  // pixc(screen, m(WH + P.x - view + 1), H - P.y - 2 - body + 1, bodyCol);
  // pixc(screen, m(WH + P.x - view + 1), H - P.y - 2 - body + 2, bodyCol);
  // pixc(screen, m(WH + P.x - view + 1), H - P.y - 2 - body + 3, bodyCol);

  var r = Math.abs(P.e)

  var j = 1;
  while (r > 0) {
    pixc(screen, m(WH + P.x - view - 1), H - P.y - 2 - j - body, col);
    pixc(screen, m(WH + P.x - view + 1), H - P.y - 2 - j - body, col);

    if ((r % 2) == 0) {
      pixc(screen, m(WH + P.x - view), H - P.y - 2 - j - body, col);
    } else {
      if (P.e < 0) {
        pixc(screen, m(WH + P.x - view), H - P.y - 2 - j - body, bg(.3));
      } else {
        pix(screen, m(WH + P.x - view), H - P.y - 2 - j - body, bg(.3));
      }
    }
    r = Math.floor(r / 2);
    j++;
  }

  pixc(screen, m(WH + P.x - view), H - P.y - 2 - j - body, col);






  // var abs = Math.abs(P.e);
  // var de = P.e > 0 ? 1 : -1;
  // for (var i = 0; Math.abs(i) < abs; i = i + de) {
  //   if (de > 0) {
  //     pix(screen, WH + i % 8, H - 2 - ~~(i / 8), 150, 255, 150, .7);
  //   } else {
  //     pix(screen, WH + i % 8, H - 2 + ~~(i / 8), 255, 150, 150, .7);
  //   }
  // }

};

var update = function (bodies) {

  for (var i = 0; i < bodies.length; i++) {
    updateBody(bodies[i]);
  }
};

var neverDrawn = true;
var tick = function (kb, screen, bodies) {
  var result = gameUpdate(kb, bodies);
  var blocks = result.blocks;
  var updated = result.updated;
  if (updated) {
    turn = turn + 1;
  }

  if (updated || neverDrawn) {
    draw(screen, blocks);
    neverDrawn = false;
  }
  requestAnimationFrame(function () { tick(kb, screen, blocks); });

};

var HH = H / 2;

function drawRect(screen, b, idx) {

  //if (b !== 0) {
  pixc(screen, idx, H - b - 1, bg(.5));
  //} else {
  //  pix(screen, idx, HH - b, 0, 0, 0, .1);
  //}

  if (idx === WH) {
    //pix(screen, idx, HH - b, 256, 0, 0, 1);

    //pix(screen, idx, HH - b - 3, 240, 200, 200, 1);
    //pix(screen, idx, HH - b - 2, 120, 110, 180, 1);
    //pix(screen, idx, HH - b - 1, 220, 180, 180, 1);
  }

  var fill = 0;
  while (fill < b) {
    pixc(screen, idx, H - fill - 1, bg(.7));
    fill = fill + 1;
  }
};

function pix(screen, x, y, r, g, b, a) {

  if (x < 0 || y < 0 || x >= W || y >= H) return;

  screen.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
  screen.fillRect(x, y, 1, 1);
}

function pixc(screen, x, y, c) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  screen.fillStyle = c;
  screen.fillRect(x, y, 1, 1);
}

function c(r, g, b, a) {
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}


window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audio = new AudioContext();

function createOscillator(note, decay) {

  var index = (note + 10 * sl) % sl;
  var oct = ~~((note + 100 * sl) / sl) - 100;
  var interval = oct * 12 + scale[index];
  //console.log({ interval: interval, index: index, oct: oct });
  var freq = 300.0 * Math.pow(2, interval / 12.0);
  var attack = 0;
  var volume = 0.2;
  var gain = audio.createGain();
  var osc = audio.createOscillator();
  var t = audio.currentTime;
  gain.connect(audio.destination);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + attack / 1000);
  gain.gain.exponentialRampToValueAtTime(volume * 0.01, t + decay / 1000);
  osc.frequency.setValueAtTime(freq, t);
  osc.type = "triangle";
  osc.connect(gain);
  osc.start(0);

  setTimeout(audioTimeout, decay);
  function audioTimeout() {
    osc.stop(0);
    osc.disconnect(gain);
    gain.disconnect(audio.destination);
  }
}

AudioContext.prototype.createPinkNoise = function (bufferSize) {
  bufferSize = bufferSize || 256;
  var b0, b1, b2, b3, b4, b5, b6;
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
  var node = this.createScriptProcessor(bufferSize, 1, 1);
  node.onaudioprocess = function (e) {
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // (roughly) compensate for gain
      b6 = white * 0.115926;
    }
  }
  return node;
};

function noise(vol, decay) {
  var attack = 0;
  var volume = vol;
  var gain = audio.createGain();
  var osc = audio.createPinkNoise();
  var t = audio.currentTime;
  gain.connect(audio.destination);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + attack / 1000);
  gain.gain.exponentialRampToValueAtTime(volume * 0.01, t + decay / 1000);
  osc.connect(gain);
  //osc.start(0);

  setTimeout(audioTimeout, decay);
  function audioTimeout() {
    //osc.stop(0);
    osc.disconnect(gain);
    gain.disconnect(audio.destination);
  }
}

// When the DOM is ready, create (and start) the game.
window.addEventListener('load', run);



var fontArt =
  // Font: ahoy_art_deco.64c

  //unsigned char font[2048] =
  //{
  [
    0x3C, 0x42, 0x9D, 0xA5, 0xA5, 0x9F, 0x40, 0x3C,	// Char 000 (.)
    0x00, 0x00, 0x1C, 0x24, 0x44, 0x44, 0x44, 0x3E,	// Char 001 (.)
    0x20, 0x20, 0x3C, 0x22, 0x22, 0x22, 0x24, 0x38,	// Char 002 (.)
    0x00, 0x00, 0x1C, 0x20, 0x20, 0x20, 0x10, 0x0C,	// Char 003 (.)
    0x02, 0x02, 0x0E, 0x12, 0x22, 0x22, 0x22, 0x1E,	// Char 004 (.)
    0x00, 0x00, 0x1C, 0x22, 0x3C, 0x20, 0x10, 0x0C,	// Char 005 (.)
    0x00, 0x0C, 0x10, 0x10, 0x1C, 0x10, 0x10, 0x10,	// Char 006 (.)
    0x00, 0x00, 0x1C, 0x22, 0x22, 0x1F, 0x02, 0x3C,	// Char 007 (.)
    0x20, 0x20, 0x78, 0x24, 0x24, 0x24, 0x24, 0x24,	// Char 008 (.)
    0x00, 0x08, 0x00, 0x08, 0x08, 0x08, 0x08, 0x06,	// Char 009 (.)
    0x00, 0x04, 0x00, 0x04, 0x04, 0x04, 0x08, 0x70,	// Char 010 (.)
    0x00, 0x40, 0x48, 0x50, 0x48, 0x44, 0x42, 0x41,	// Char 011 (.)
    0x00, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x0E,	// Char 012 (.)
    0x00, 0x00, 0x3E, 0x49, 0x49, 0x49, 0x49, 0x49,	// Char 013 (.)
    0x00, 0x00, 0x38, 0x24, 0x24, 0x24, 0x24, 0x24,	// Char 014 (.)
    0x00, 0x00, 0x1C, 0x22, 0x41, 0x41, 0x22, 0x1C,	// Char 015 (.)
    0x00, 0x00, 0x1E, 0x11, 0x11, 0x12, 0x3C, 0x10,	// Char 016 (.)
    0x00, 0x00, 0x1C, 0x24, 0x44, 0x44, 0x3E, 0x04,	// Char 017 (.)
    0x00, 0x00, 0x16, 0x18, 0x10, 0x10, 0x10, 0x10,	// Char 018 (.)
    0x00, 0x00, 0x06, 0x08, 0x08, 0x08, 0x08, 0x30,	// Char 019 (.)
    0x00, 0x10, 0x3C, 0x10, 0x10, 0x10, 0x10, 0x0E,	// Char 020 (.)
    0x00, 0x00, 0x24, 0x24, 0x24, 0x24, 0x24, 0x1C,	// Char 021 (.)
    0x00, 0x00, 0x22, 0x22, 0x14, 0x14, 0x08, 0x08,	// Char 022 (.)
    0x00, 0x00, 0x49, 0x49, 0x49, 0x49, 0x49, 0x3E,	// Char 023 (.)
    0x00, 0x00, 0x22, 0x14, 0x1C, 0x08, 0x14, 0x22,	// Char 024 (.)
    0x00, 0x00, 0x22, 0x22, 0x22, 0x1F, 0x02, 0x3C,	// Char 025 (.)
    0x00, 0x00, 0x3C, 0x04, 0x08, 0x10, 0x20, 0x3C,	// Char 026 (.)
    0x1C, 0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x1C,	// Char 027 (.)
    0x06, 0x09, 0x10, 0x3E, 0x10, 0x10, 0x21, 0x7E,	// Char 028 (.)
    0x1C, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x1C,	// Char 029 (.)
    0x48, 0xEE, 0x49, 0x49, 0x29, 0x00, 0x00, 0x00,	// Char 030 (.)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 031 (.)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 032 ( )
    0x10, 0x10, 0x10, 0x10, 0x10, 0x10, 0x00, 0x10,	// Char 033 (!)
    0x00, 0x24, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 034 (")
    0x24, 0x24, 0xFF, 0x24, 0x24, 0xFF, 0x24, 0x24,	// Char 035 (#)
    0x10, 0x7E, 0x90, 0x7C, 0x12, 0xFC, 0x10, 0x00,	// Char 036 ($)
    0x00, 0x44, 0x08, 0x10, 0x20, 0x44, 0x00, 0x00,	// Char 037 (%)
    0x38, 0x44, 0x28, 0x10, 0x28, 0x45, 0x43, 0x3D,	// Char 038 (&)
    0x10, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 039 (')
    0x08, 0x10, 0x20, 0x20, 0x20, 0x20, 0x10, 0x08,	// Char 040 (()
    0x10, 0x08, 0x04, 0x04, 0x04, 0x04, 0x08, 0x10,	// Char 041 ())
    0x00, 0x00, 0x24, 0x18, 0x7E, 0x18, 0x24, 0x00,	// Char 042 (*)
    0x00, 0x00, 0x08, 0x08, 0x3E, 0x08, 0x08, 0x00,	// Char 043 (+)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x18, 0x30,	// Char 044 (,)
    0x00, 0x00, 0x00, 0x00, 0x7E, 0x00, 0x00, 0x00,	// Char 045 (-)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x18, 0x00,	// Char 046 (.)
    0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x00,	// Char 047 (/)
    0x19, 0x26, 0x24, 0x2C, 0x34, 0x24, 0x64, 0x98,	// Char 048 (0)
    0x08, 0x18, 0x28, 0x08, 0x08, 0x08, 0x08, 0x08,	// Char 049 (1)
    0x30, 0x08, 0x04, 0x04, 0x08, 0x10, 0x20, 0x7C,	// Char 050 (2)
    0x3E, 0x04, 0x08, 0x18, 0x04, 0x02, 0x02, 0x3C,	// Char 051 (3)
    0x10, 0x10, 0x24, 0x24, 0x44, 0x7E, 0x04, 0x04,	// Char 052 (4)
    0x3C, 0x20, 0x38, 0x04, 0x02, 0x02, 0x04, 0x38,	// Char 053 (5)
    0x04, 0x08, 0x10, 0x34, 0x42, 0x42, 0x42, 0x3C,	// Char 054 (6)
    0x7C, 0x04, 0x04, 0x08, 0x08, 0x10, 0x10, 0x10,	// Char 055 (7)
    0x18, 0x24, 0x24, 0x3C, 0x42, 0x42, 0x42, 0x3C,	// Char 056 (8)
    0x3C, 0x42, 0x42, 0x42, 0x2C, 0x08, 0x10, 0x20,	// Char 057 (9)
    0x00, 0x18, 0x18, 0x00, 0x00, 0x18, 0x18, 0x00,	// Char 058 (:)
    0x00, 0x18, 0x18, 0x00, 0x00, 0x18, 0x18, 0x30,	// Char 059 (;)
    0x04, 0x08, 0x10, 0x20, 0x10, 0x08, 0x04, 0x00,	// Char 060 (<)
    0x00, 0x00, 0x7E, 0x00, 0x7E, 0x00, 0x00, 0x00,	// Char 061 (=)
    0x20, 0x10, 0x08, 0x04, 0x08, 0x10, 0x20, 0x00,	// Char 062 (>)
    0x3C, 0x42, 0x42, 0x04, 0x08, 0x10, 0x00, 0x10,	// Char 063 (?)
    0x3C, 0x42, 0x81, 0xA5, 0x81, 0x99, 0x42, 0x3C,	// Char 064 (@)
    0x18, 0x24, 0x24, 0x7C, 0x24, 0x24, 0x24, 0x24,	// Char 065 (A)
    0x3C, 0x22, 0x2C, 0x22, 0x21, 0x21, 0x22, 0x3C,	// Char 066 (B)
    0x18, 0x20, 0x40, 0x40, 0x40, 0x40, 0x20, 0x18,	// Char 067 (C)
    0x78, 0x44, 0x42, 0x41, 0x41, 0x42, 0x44, 0x78,	// Char 068 (D)
    0x3C, 0x20, 0x3C, 0x20, 0x20, 0x20, 0x10, 0x0C,	// Char 069 (E)
    0x3C, 0x20, 0x20, 0x38, 0x20, 0x20, 0x20, 0x20,	// Char 070 (F)
    0x1C, 0x20, 0x40, 0x44, 0x44, 0x44, 0x24, 0x1C,	// Char 071 (G)
    0x24, 0x24, 0x24, 0x7C, 0x24, 0x24, 0x24, 0x24,	// Char 072 (H)
    0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08,	// Char 073 (I)
    0x04, 0x04, 0x04, 0x04, 0x04, 0x04, 0x08, 0x70,	// Char 074 (J)
    0x48, 0x48, 0x50, 0x50, 0x48, 0x44, 0x42, 0x41,	// Char 075 (K)
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x38,	// Char 076 (L)
    0x3E, 0x49, 0x49, 0x49, 0x49, 0x49, 0x49, 0x49,	// Char 077 (M)
    0x38, 0x24, 0x24, 0x24, 0x24, 0x24, 0x24, 0x24,	// Char 078 (N)
    0x3C, 0x42, 0x81, 0x81, 0x81, 0x81, 0x42, 0x3C,	// Char 079 (O)
    0x38, 0x24, 0x22, 0x22, 0x24, 0x38, 0x20, 0x20,	// Char 080 (P)
    0x3C, 0x42, 0x81, 0x81, 0x89, 0x84, 0x46, 0x39,	// Char 081 (Q)
    0x38, 0x24, 0x22, 0x22, 0x24, 0x38, 0x28, 0x26,	// Char 082 (R)
    0x03, 0x04, 0x08, 0x08, 0x08, 0x08, 0x10, 0x60,	// Char 083 (S)
    0x3E, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08, 0x08,	// Char 084 (T)
    0x24, 0x24, 0x24, 0x24, 0x24, 0x24, 0x24, 0x1C,	// Char 085 (U)
    0x41, 0x41, 0x22, 0x22, 0x14, 0x14, 0x08, 0x08,	// Char 086 (V)
    0x49, 0x49, 0x49, 0x49, 0x49, 0x49, 0x49, 0x3F,	// Char 087 (W)
    0x22, 0x22, 0x14, 0x1C, 0x08, 0x14, 0x14, 0x22,	// Char 088 (X)
    0x22, 0x22, 0x22, 0x22, 0x1C, 0x08, 0x08, 0x08,	// Char 089 (Y)
    0x3C, 0x04, 0x08, 0x08, 0x10, 0x10, 0x20, 0x3C,	// Char 090 (Z)
    0x99, 0x42, 0x24, 0x99, 0x99, 0x24, 0x42, 0x99,	// Char 091 ([)
    0x3C, 0x42, 0xB9, 0xA5, 0xA9, 0xA5, 0x42, 0x3C,	// Char 092 (\)
    0x3C, 0x42, 0x99, 0xA1, 0xA1, 0x99, 0x42, 0x3C,	// Char 093 (])
    0xE9, 0x4F, 0x49, 0x49, 0x49, 0x00, 0x00, 0x00,	// Char 094 (^)
    0xFF, 0x81, 0xBD, 0xA5, 0xA5, 0xBD, 0x81, 0xFF,	// Char 095 (_)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 096 (`)
    0xF0, 0xF0, 0xF0, 0xF0, 0xF0, 0xF0, 0xF0, 0xF0,	// Char 097 (a)
    0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 098 (b)
    0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 099 (c)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF,	// Char 100 (d)
    0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0,	// Char 101 (e)
    0xCC, 0xCC, 0x33, 0x33, 0xCC, 0xCC, 0x33, 0x33,	// Char 102 (f)
    0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03,	// Char 103 (g)
    0xBD, 0x42, 0x81, 0xA5, 0x81, 0x99, 0x42, 0xBD,	// Char 104 (h)
    0xCC, 0x99, 0x33, 0x66, 0xCC, 0x99, 0x33, 0x66,	// Char 105 (i)
    0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03,	// Char 106 (j)
    0x18, 0x18, 0x18, 0x1F, 0x1F, 0x18, 0x18, 0x18,	// Char 107 (k)
    0x00, 0x00, 0x00, 0x00, 0x0F, 0x0F, 0x0F, 0x0F,	// Char 108 (l)
    0x18, 0x18, 0x18, 0x1F, 0x1F, 0x00, 0x00, 0x00,	// Char 109 (m)
    0x00, 0x00, 0x00, 0xF8, 0xF8, 0x18, 0x18, 0x18,	// Char 110 (n)
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF,	// Char 111 (o)
    0x00, 0x00, 0x00, 0x1F, 0x1F, 0x18, 0x18, 0x18,	// Char 112 (p)
    0x18, 0x18, 0x18, 0xFF, 0xFF, 0x00, 0x00, 0x00,	// Char 113 (q)
    0x00, 0x00, 0x00, 0xFF, 0xFF, 0x18, 0x18, 0x18,	// Char 114 (r)
    0x18, 0x18, 0x18, 0xF8, 0xF8, 0x18, 0x18, 0x18,	// Char 115 (s)
    0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0,	// Char 116 (t)
    0xE0, 0xE0, 0xE0, 0xE0, 0xE0, 0xE0, 0xE0, 0xE0,	// Char 117 (u)
    0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07, 0x07,	// Char 118 (v)
    0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 119 (w)
    0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00,	// Char 120 (x)
    0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF,	// Char 121 (y)
    0x38, 0x7E, 0xA8, 0x7C, 0x2A, 0xFC, 0x28, 0x00,	// Char 122 (z)
    0x00, 0x00, 0x00, 0x00, 0xF0, 0xF0, 0xF0, 0xF0,	// Char 123 ({)
    0x0F, 0x0F, 0x0F, 0x0F, 0x00, 0x00, 0x00, 0x00,	// Char 124 (|)
    0x18, 0x18, 0x18, 0xF8, 0xF8, 0x00, 0x00, 0x00,	// Char 125 (})
    0xF0, 0xF0, 0xF0, 0xF0, 0x00, 0x00, 0x00, 0x00,	// Char 126 (~)
    0xF0, 0xF0, 0xF0, 0xF0, 0x0F, 0x0F, 0x0F, 0x0F,	// Char 127 (.)
    0xC3, 0xBD, 0x62, 0x5A, 0x5A, 0x60, 0xBF, 0xC3,	// Char 128 (.)
    0xFF, 0xFF, 0xE3, 0xDB, 0xBB, 0xBB, 0xBB, 0xC1,	// Char 129 (.)
    0xDF, 0xDF, 0xC3, 0xDD, 0xDD, 0xDD, 0xDB, 0xC7,	// Char 130 (.)
    0xFF, 0xFF, 0xE3, 0xDF, 0xDF, 0xDF, 0xEF, 0xF3,	// Char 131 (.)
    0xFD, 0xFD, 0xF1, 0xED, 0xDD, 0xDD, 0xDD, 0xE1,	// Char 132 (.)
    0xFF, 0xFF, 0xE3, 0xDD, 0xC3, 0xDF, 0xEF, 0xF3,	// Char 133 (.)
    0xFF, 0xF3, 0xEF, 0xEF, 0xE3, 0xEF, 0xEF, 0xEF,	// Char 134 (.)
    0xFF, 0xFF, 0xE3, 0xDD, 0xDD, 0xE0, 0xFD, 0xC3,	// Char 135 (.)
    0xDF, 0xDF, 0x87, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB,	// Char 136 (.)
    0xFF, 0xF7, 0xFF, 0xF7, 0xF7, 0xF7, 0xF7, 0xF9,	// Char 137 (.)
    0xFF, 0xFB, 0xFF, 0xFB, 0xFB, 0xFB, 0xF7, 0x8F,	// Char 138 (.)
    0xFF, 0xBF, 0xB7, 0xAF, 0xB7, 0xBB, 0xBD, 0xBE,	// Char 139 (.)
    0xFF, 0xEF, 0xEF, 0xEF, 0xEF, 0xEF, 0xEF, 0xF1,	// Char 140 (.)
    0xFF, 0xFF, 0xC1, 0xB6, 0xB6, 0xB6, 0xB6, 0xB6,	// Char 141 (.)
    0xFF, 0xFF, 0xC7, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB,	// Char 142 (.)
    0xFF, 0xFF, 0xE3, 0xDD, 0xBE, 0xBE, 0xDD, 0xE3,	// Char 143 (.)
    0xFF, 0xFF, 0xE1, 0xEE, 0xEE, 0xED, 0xC3, 0xEF,	// Char 144 (.)
    0xFF, 0xFF, 0xE3, 0xDB, 0xBB, 0xBB, 0xC1, 0xFB,	// Char 145 (.)
    0xFF, 0xFF, 0xE9, 0xE7, 0xEF, 0xEF, 0xEF, 0xEF,	// Char 146 (.)
    0xFF, 0xFF, 0xF9, 0xF7, 0xF7, 0xF7, 0xF7, 0xCF,	// Char 147 (.)
    0xFF, 0xEF, 0xC3, 0xEF, 0xEF, 0xEF, 0xEF, 0xF1,	// Char 148 (.)
    0xFF, 0xFF, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB, 0xE3,	// Char 149 (.)
    0xFF, 0xFF, 0xDD, 0xDD, 0xEB, 0xEB, 0xF7, 0xF7,	// Char 150 (.)
    0xFF, 0xFF, 0xB6, 0xB6, 0xB6, 0xB6, 0xB6, 0xC1,	// Char 151 (.)
    0xFF, 0xFF, 0xDD, 0xEB, 0xE3, 0xF7, 0xEB, 0xDD,	// Char 152 (.)
    0xFF, 0xFF, 0xDD, 0xDD, 0xDD, 0xE0, 0xFD, 0xC3,	// Char 153 (.)
    0xFF, 0xFF, 0xC3, 0xFB, 0xF7, 0xEF, 0xDF, 0xC3,	// Char 154 (.)
    0xE3, 0xEF, 0xEF, 0xEF, 0xEF, 0xEF, 0xEF, 0xE3,	// Char 155 (.)
    0xF9, 0xF6, 0xEF, 0xC1, 0xEF, 0xEF, 0xDE, 0x81,	// Char 156 (.)
    0xE3, 0xFB, 0xFB, 0xFB, 0xFB, 0xFB, 0xFB, 0xE3,	// Char 157 (.)
    0xB7, 0x11, 0xB6, 0xB6, 0xD6, 0xFF, 0xFF, 0xFF,	// Char 158 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 159 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 160 (.)
    0xEF, 0xEF, 0xEF, 0xEF, 0xEF, 0xEF, 0xFF, 0xEF,	// Char 161 (.)
    0xFF, 0xDB, 0xDB, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 162 (.)
    0xDB, 0xDB, 0x00, 0xDB, 0xDB, 0x00, 0xDB, 0xDB,	// Char 163 (.)
    0xEF, 0x81, 0x6F, 0x83, 0xED, 0x03, 0xEF, 0xFF,	// Char 164 (.)
    0xFF, 0xBB, 0xF7, 0xEF, 0xDF, 0xBB, 0xFF, 0xFF,	// Char 165 (.)
    0xC7, 0xBB, 0xD7, 0xEF, 0xD7, 0xBA, 0xBC, 0xC2,	// Char 166 (.)
    0xEF, 0xEF, 0xEF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 167 (.)
    0xF7, 0xEF, 0xDF, 0xDF, 0xDF, 0xDF, 0xEF, 0xF7,	// Char 168 (.)
    0xEF, 0xF7, 0xFB, 0xFB, 0xFB, 0xFB, 0xF7, 0xEF,	// Char 169 (.)
    0xFF, 0xFF, 0xDB, 0xE7, 0x81, 0xE7, 0xDB, 0xFF,	// Char 170 (.)
    0xFF, 0xFF, 0xF7, 0xF7, 0xC1, 0xF7, 0xF7, 0xFF,	// Char 171 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE7, 0xE7, 0xCF,	// Char 172 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0x81, 0xFF, 0xFF, 0xFF,	// Char 173 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE7, 0xE7, 0xFF,	// Char 174 (.)
    0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F, 0xFF,	// Char 175 (.)
    0xE6, 0xD9, 0xDB, 0xD3, 0xCB, 0xDB, 0x9B, 0x67,	// Char 176 (.)
    0xF7, 0xE7, 0xD7, 0xF7, 0xF7, 0xF7, 0xF7, 0xF7,	// Char 177 (.)
    0xCF, 0xF7, 0xFB, 0xFB, 0xF7, 0xEF, 0xDF, 0x83,	// Char 178 (.)
    0xC1, 0xFB, 0xF7, 0xE7, 0xFB, 0xFD, 0xFD, 0xC3,	// Char 179 (.)
    0xEF, 0xEF, 0xDB, 0xDB, 0xBB, 0x81, 0xFB, 0xFB,	// Char 180 (.)
    0xC3, 0xDF, 0xC7, 0xFB, 0xFD, 0xFD, 0xFB, 0xC7,	// Char 181 (.)
    0xFB, 0xF7, 0xEF, 0xCB, 0xBD, 0xBD, 0xBD, 0xC3,	// Char 182 (.)
    0x83, 0xFB, 0xFB, 0xF7, 0xF7, 0xEF, 0xEF, 0xEF,	// Char 183 (.)
    0xE7, 0xDB, 0xDB, 0xC3, 0xBD, 0xBD, 0xBD, 0xC3,	// Char 184 (.)
    0xC3, 0xBD, 0xBD, 0xBD, 0xD3, 0xF7, 0xEF, 0xDF,	// Char 185 (.)
    0xFF, 0xE7, 0xE7, 0xFF, 0xFF, 0xE7, 0xE7, 0xFF,	// Char 186 (.)
    0xFF, 0xE7, 0xE7, 0xFF, 0xFF, 0xE7, 0xE7, 0xCF,	// Char 187 (.)
    0xFB, 0xF7, 0xEF, 0xDF, 0xEF, 0xF7, 0xFB, 0xFF,	// Char 188 (.)
    0xFF, 0xFF, 0x81, 0xFF, 0x81, 0xFF, 0xFF, 0xFF,	// Char 189 (.)
    0xDF, 0xEF, 0xF7, 0xFB, 0xF7, 0xEF, 0xDF, 0xFF,	// Char 190 (.)
    0xC3, 0xBD, 0xBD, 0xFB, 0xF7, 0xEF, 0xFF, 0xEF,	// Char 191 (.)
    0xC3, 0xBD, 0x7E, 0x5A, 0x7E, 0x66, 0xBD, 0xC3,	// Char 192 (.)
    0xE7, 0xDB, 0xDB, 0x83, 0xDB, 0xDB, 0xDB, 0xDB,	// Char 193 (.)
    0xC3, 0xDD, 0xD3, 0xDD, 0xDE, 0xDE, 0xDD, 0xC3,	// Char 194 (.)
    0xE7, 0xDF, 0xBF, 0xBF, 0xBF, 0xBF, 0xDF, 0xE7,	// Char 195 (.)
    0x87, 0xBB, 0xBD, 0xBE, 0xBE, 0xBD, 0xBB, 0x87,	// Char 196 (.)
    0xC3, 0xDF, 0xC3, 0xDF, 0xDF, 0xDF, 0xEF, 0xF3,	// Char 197 (.)
    0xC3, 0xDF, 0xDF, 0xC7, 0xDF, 0xDF, 0xDF, 0xDF,	// Char 198 (.)
    0xE3, 0xDF, 0xBF, 0xBB, 0xBB, 0xBB, 0xDB, 0xE3,	// Char 199 (.)
    0xDB, 0xDB, 0xDB, 0x83, 0xDB, 0xDB, 0xDB, 0xDB,	// Char 200 (.)
    0xF7, 0xF7, 0xF7, 0xF7, 0xF7, 0xF7, 0xF7, 0xF7,	// Char 201 (.)
    0xFB, 0xFB, 0xFB, 0xFB, 0xFB, 0xFB, 0xF7, 0x8F,	// Char 202 (.)
    0xB7, 0xB7, 0xAF, 0xAF, 0xB7, 0xBB, 0xBD, 0xBE,	// Char 203 (.)
    0xDF, 0xDF, 0xDF, 0xDF, 0xDF, 0xDF, 0xDF, 0xC7,	// Char 204 (.)
    0xC1, 0xB6, 0xB6, 0xB6, 0xB6, 0xB6, 0xB6, 0xB6,	// Char 205 (.)
    0xC7, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB,	// Char 206 (.)
    0xC3, 0xBD, 0x7E, 0x7E, 0x7E, 0x7E, 0xBD, 0xC3,	// Char 207 (.)
    0xC7, 0xDB, 0xDD, 0xDD, 0xDB, 0xC7, 0xDF, 0xDF,	// Char 208 (.)
    0xC3, 0xBD, 0x7E, 0x7E, 0x76, 0x7B, 0xB9, 0xC6,	// Char 209 (.)
    0xC7, 0xDB, 0xDD, 0xDD, 0xDB, 0xC7, 0xD7, 0xD9,	// Char 210 (.)
    0xFC, 0xFB, 0xF7, 0xF7, 0xF7, 0xF7, 0xEF, 0x9F,	// Char 211 (.)
    0xC1, 0xF7, 0xF7, 0xF7, 0xF7, 0xF7, 0xF7, 0xF7,	// Char 212 (.)
    0xDB, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB, 0xDB, 0xE3,	// Char 213 (.)
    0xBE, 0xBE, 0xDD, 0xDD, 0xEB, 0xEB, 0xF7, 0xF7,	// Char 214 (.)
    0xB6, 0xB6, 0xB6, 0xB6, 0xB6, 0xB6, 0xB6, 0xC0,	// Char 215 (.)
    0xDD, 0xDD, 0xEB, 0xE3, 0xF7, 0xEB, 0xEB, 0xDD,	// Char 216 (.)
    0xDD, 0xDD, 0xDD, 0xDD, 0xE3, 0xF7, 0xF7, 0xF7,	// Char 217 (.)
    0xC3, 0xFB, 0xF7, 0xF7, 0xEF, 0xEF, 0xDF, 0xC3,	// Char 218 (.)
    0x66, 0xBD, 0xDB, 0x66, 0x66, 0xDB, 0xBD, 0x66,	// Char 219 (.)
    0xC3, 0xBD, 0x46, 0x5A, 0x56, 0x5A, 0xBD, 0xC3,	// Char 220 (.)
    0xC3, 0xBD, 0x66, 0x5E, 0x5E, 0x66, 0xBD, 0xC3,	// Char 221 (.)
    0x16, 0xB0, 0xB6, 0xB6, 0xB6, 0xFF, 0xFF, 0xFF,	// Char 222 (.)
    0x00, 0x7E, 0x42, 0x5A, 0x5A, 0x42, 0x7E, 0x00,	// Char 223 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 224 (.)
    0x0F, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F, 0x0F,	// Char 225 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00,	// Char 226 (.)
    0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 227 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,	// Char 228 (.)
    0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,	// Char 229 (.)
    0x33, 0x33, 0xCC, 0xCC, 0x33, 0x33, 0xCC, 0xCC,	// Char 230 (.)
    0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC,	// Char 231 (.)
    0x42, 0xBD, 0x7E, 0x5A, 0x7E, 0x66, 0xBD, 0x42,	// Char 232 (.)
    0x33, 0x66, 0xCC, 0x99, 0x33, 0x66, 0xCC, 0x99,	// Char 233 (.)
    0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC, 0xFC,	// Char 234 (.)
    0xE7, 0xE7, 0xE7, 0xE0, 0xE0, 0xE7, 0xE7, 0xE7,	// Char 235 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xF0, 0xF0, 0xF0, 0xF0,	// Char 236 (.)
    0xE7, 0xE7, 0xE7, 0xE0, 0xE0, 0xFF, 0xFF, 0xFF,	// Char 237 (.)
    0xFF, 0xFF, 0xFF, 0x07, 0x07, 0xE7, 0xE7, 0xE7,	// Char 238 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00,	// Char 239 (.)
    0xFF, 0xFF, 0xFF, 0xE0, 0xE0, 0xE7, 0xE7, 0xE7,	// Char 240 (.)
    0xE7, 0xE7, 0xE7, 0x00, 0x00, 0xFF, 0xFF, 0xFF,	// Char 241 (.)
    0xE7, 0xE7, 0xE7, 0x07, 0x07, 0xE7, 0xE7, 0xE7,	// Char 243 (.)
    0xFF, 0xFF, 0xFF, 0x00, 0x00, 0xE7, 0xE7, 0xE7,	// Char 242 (.)
    0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F, 0x3F,	// Char 244 (.)
    0x1F, 0x1F, 0x1F, 0x1F, 0x1F, 0x1F, 0x1F, 0x1F,	// Char 245 (.)
    0xF8, 0xF8, 0xF8, 0xF8, 0xF8, 0xF8, 0xF8, 0xF8,	// Char 246 (.)
    0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 247 (.)
    0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 248 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00,	// Char 249 (.)
    0xC7, 0x81, 0x57, 0x83, 0xD5, 0x03, 0xD7, 0xFF,	// Char 250 (.)
    0xFF, 0xFF, 0xFF, 0xFF, 0x0F, 0x0F, 0x0F, 0x0F,	// Char 251 (.)
    0xF0, 0xF0, 0xF0, 0xF0, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 252 (.)
    0xE7, 0xE7, 0xE7, 0x07, 0x07, 0xFF, 0xFF, 0xFF,	// Char 253 (.)
    0x0F, 0x0F, 0x0F, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF,	// Char 254 (.)
    0x0F, 0x0F, 0x0F, 0x0F, 0xF0, 0xF0, 0xF0, 0xF0	// Char 255 (.)
  ];
//};




var font = fontArt;

function drawString(screen, x, y, s, r, g, b, a) {
  for (var i = 0; i < s.length; i++) {
    for (line = 0; line < 8; line++) {

      var letter = s[i].charCodeAt(0);

      var c = font[letter * 8 + line];

      if (c & 0x80) {
        pix(screen, x + i * 8 + 0, y + line, r, g, b, a);
      }

      if (c & 0x40) {
        pix(screen, x + i * 8 + 1, y + line, r, g, b, a);
      }

      if (c & 0x20) {
        pix(screen, x + i * 8 + 2, y + line, r, g, b, a);
      }

      if (c & 0x10) {
        pix(screen, x + i * 8 + 3, y + line, r, g, b, a);
      }

      if (c & 0x8) {
        pix(screen, x + i * 8 + 4, y + line, r, g, b, a);
      }

      if (c & 0x4) {
        pix(screen, x + i * 8 + 5, y + line, r, g, b, a);
      }

      if (c & 0x2) {
        pix(screen, x + i * 8 + 6, y + line, r, g, b, a);
      }

      if (c & 0x1) {
        pix(screen, x + i * 8 + 7, y + line, r, g, b, a);
      }
    }
  }
}

function letterLR(letter) {
  var charCode = letter.charCodeAt(0);
  var idx = charCode * 8;

  var mask = 0x00
    | font[idx + 0]
    | font[idx + 1]
    | font[idx + 2]
    | font[idx + 3]
    | font[idx + 4]
    | font[idx + 5]
    | font[idx + 6]
    | font[idx + 7]
    ;

  if (mask == 0) {
    return { L: 0, R: 3, mask: mask };
  }
  var L = 0;
  for (var i = 0; i < 7; i++) {
    if (mask & (0x80 >> i)) {
      L = i;
      break;
    }
  }
  var R = 7;
  for (var i = 7; i > 0; i--) {
    if (mask & (0x80 >> i)) {
      R = i;
      break;
    }
  }
  return { L: L, R: R, mask: mask };
}

function textProp(screen, x, y, s, r, g, b, a) {

  const pad = 1;
  var wSum = 0;
  for (var i = 0; i < s.length; i++) {

    var letter = s[i];
    var charCode = letter.charCodeAt(0);
    var LR = letterLR(letter);

    for (line = 0; line < 8; line++) {

      var c = font[charCode * 8 + line];

      for (var place = 0; place <= 7; place++) {
        if (c & 0x80 >> place) {
          pix(screen, x + wSum + place - LR.L, y + line, r, g, b, a);
        }
      }
    }
    wSum = wSum + LR.R - LR.L + 1 + pad;
  }
}


function textCenter(screen, x, y, s, color) {

  const pad = 1;
  var twSum = 0;
  for (var i = 0; i < s.length; i++) {
    var letter = s[i];
    var LR = letterLR(letter);
    twSum = twSum + LR.R - LR.L + 1 + pad;
  }

  var tH = Math.floor(twSum / 2);

  var wSum = 0;

  for (var i = 0; i < s.length; i++) {

    var letter = s[i];
    var charCode = letter.charCodeAt(0);
    var LR = letterLR(letter);

    for (line = 0; line < 8; line++) {

      var c = font[charCode * 8 + line];

      for (var place = 0; place <= 7; place++) {
        if (c & 0x80 >> place) {
          pixc(screen, x + wSum + place - LR.L - tH, y + line, color);
        }
      }
    }
    wSum = wSum + LR.R - LR.L + 1 + pad;

  }
}