// Define variables for objects.
// # Cord
// - Properties:
//   - anchoredPin: Reference to the pin it's anchored to
//   - length: Length of the cord (number)
//   - angle: Rotation angle of the cord (number, in radians)
/** @type {{anchoredPin: {pos: Vector}, length: number, angle: number}} */
let cord;
const defaultCordLength = 7;
// # Pins
// - Properties:
//   - pos: The pin's position (Vector, x, y coordinates)
/** @type { {pos: Vector}[]} */
let pins;

// Define variables for games.
/** @type {Vector} */
let scrollingSpeed;
/** @type {Vector} */
let scrolledDistance;
const nextPinDistance = 10;

function update() {
  if (!ticks) {
    // Set the initial state of the game.
    // # Pins
    // - Initial state:
    //   - One pin at coordinates (50, 0) (the center-top of the screen) (cord's initial anchoredPin)
    pins = [{ pos: vec(50, 0) }];

    // # Cord
	//  - Initial state:
    //    - Anchored to the first pin at (50, 0) (the center-top of the screen)
    //    - length: 7 (defaultCordLength)
    //    - angle: 0 (pointing rightwards)
    cord = { anchoredPin: pins[0], length: defaultCordLength, angle: 0 };

    // Initialize all variables.
    scrollingSpeed = vec();
    scrolledDistance = vec();
  }
  // Implement the rules of the objects.

  // #  Additional game mechanics
  // - The game world scrolls vertically
  // - Pins are removed when they move off the bottom of the screen (y > 102)
  // - The scrolling speed adjusts to keep the player's anchored pin visible on screen
  scrollingSpeed.y = 0.01;
  if (cord.anchoredPin.pos.y < 80) {
    scrollingSpeed.y += (80 - cord.anchoredPin.pos.y) * 0.1;
  }

  // # Cord:
  //  - Shape: line
  //  - Color: black
  //  - Behavior:
  //    - Rotates clockwise (angle increases by 0.05 each update)
  //    - Length extends when input is pressed, retracts when released
  //  - One-button controls:
  //    - When pressed: Cord length increases
  //    - When released: Cord length gradually returns to default
  if (input.isPressed) {
    cord.length += 1;
  } else {
    cord.length += (defaultCordLength - cord.length) * 0.1;
  }
  cord.angle += 0.05;
  color("black");
  line(
    cord.anchoredPin.pos,
    vec(cord.anchoredPin.pos).addWithAngle(cord.angle, cord.length)
  );

  // # Pins
  //  - Shape: Small box (3x3 units)
  //  - Color: blue
  //  - Behavior:
  //    - Static, but move downward as the screen scrolls
  //  - Spawning rules:
  //    - New pins spawn at the top of the screen
  //    - Horizontal position is random between 10 and 90
  //    - Vertical spacing is 10 units (nextPinDistance)
  //  - Scrolling:
  //    - Pins move downward at a base speed of 0.01 units per update
  //    - Scrolling speed increases if the anchored pin is above y=80, pulling it downward faster
  //  - Collision events:
  //    - When the cord collides with a pin, it anchors to that pin and the cord length returns to default
  //    - The scrolling speed adjusts to keep the player's anchored pin visible on screen
  let currentAnchoredPin = cord.anchoredPin;
  color("blue");
  remove(pins, (p) => {
    p.pos.y += scrollingSpeed.y;
    if (box(p.pos, 3).isColliding.rect.black && p !== currentAnchoredPin) {
      cord.anchoredPin = p;
      cord.length = defaultCordLength;
    }
    return p.pos.y > 102;
  });
  scrolledDistance.add(scrollingSpeed);
  while (scrolledDistance.y > nextPinDistance) {
    scrolledDistance.y -= nextPinDistance;
    pins.push({ pos: vec(rnd(10, 90), -2 + scrolledDistance.y) });
  }
}
