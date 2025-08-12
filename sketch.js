let mic;
let amp; // p5.Amplitude object to measure audio levels
let shapes = []; // Array to store shape objects

function setup() {
  // Create a full-window canvas
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(24);
  // Use Lexend Giga for all canvas text (make sure the font is loaded via your HTML)
  textFont("Lexend Giga");
}

function mousePressed() {
  startMic();
}

function touchStarted() {
  startMic();
  // Prevent default touch behavior
  return false;
}

function startMic() {
  // Resume the AudioContext (required by some browsers)
  userStartAudio();
  console.log("Screen pressed; attempting to start microphone...");

  // Only start the mic once
  if (!mic) {
    mic = new p5.AudioIn();
    mic.start(
      () => {
        console.log("Microphone started successfully");
        // Initialize amplitude analyzer and set its input to the microphone
        amp = new p5.Amplitude();
        amp.setInput(mic);
      },
      (err) => {
        console.error("Error starting microphone:", err);
      }
    );
  }
}

function draw() {
  // Clear the background each frame
  background(0);

  // Draw the header text "get loud" at the top (this is drawn first so shapes can cover it later)
  fill(255);
  textSize(48);
  text("GET LOUD", width / 2, 50);

  // If the microphone hasn't started yet, display the prompt text
  if (!amp) {
    fill(255);
    textSize(24);
    text("Click or tap to start microphone", width / 2, height / 2);
  } else {
    // Get the current amplitude level from the microphone
    let level = amp.getLevel();

    // Determine how many new shapes to create:
    // If the level is below 0.04, then create 0 new shapes.
    let numNewShapes = 0;
    if (level >= 0.0) {
      // Map levels from 0.03 to 0.3 into a range of 0 to 50 new shapes.
      numNewShapes = floor(map(level, 0.03, 0.3, 0, 50));
      numNewShapes = constrain(numNewShapes, 0, 50);
    }

    // Create the new shapes and add them to the array.
    for (let i = 0; i < numNewShapes; i++) {
      shapes.push(createRandomShape());
    }
  }

  // Update and display all shapes.
  // Loop backwards so we can safely remove shapes that have fully faded.
  for (let i = shapes.length - 1; i >= 0; i--) {
    let s = shapes[i];
    // Decrease the shape's alpha to fade it out (adjust this value for faster or slower fade)
    s.alpha -= 2;

    // Remove the shape if it's completely faded out.
    if (s.alpha <= 0) {
      shapes.splice(i, 1);
    } else {
      drawShape(s);
    }
  }
}

// Function to create a random shape object
function createRandomShape() {
  // Randomly choose one of three shape types: 0 for ellipse, 1 for rectangle, 2 for triangle.
  let shapeType = floor(random(3));

  // Choose random size, position, and color.
  let size = random(10, 50);
  let x = random(width);
  let y = random(height);
  let r = random(255);
  let g = random(255);
  let b = random(255);

  // Return an object representing the shape, with full opacity (alpha 255).
  return { shapeType, x, y, size, r, g, b, alpha: 255 };
}

// Function to draw a shape based on its properties
function drawShape(s) {
  noStroke();
  fill(s.r, s.g, s.b, s.alpha);

  if (s.shapeType === 0) {
    // Draw an ellipse (circle)
    ellipse(s.x, s.y, s.size, s.size);
  } else if (s.shapeType === 1) {
    // Draw a rectangle
    rect(s.x, s.y, s.size, s.size);
  } else if (s.shapeType === 2) {
    // Draw a triangle centered around (s.x, s.y)
    triangle(
      s.x,
      s.y - s.size / 2,
      s.x - s.size / 2,
      s.y + s.size / 2,
      s.x + s.size / 2,
      s.y + s.size / 2
    );
  }
}

// Make the canvas responsive to window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
