/* PID Constants */
let pid = {
    kP: 0.1, // P = kP * error
    kI: 0.0005, // I = kI * accumulated error
    kD: 0.0,
    accError: 0
}

/* Simulation Constants */
let constants = {
    dt: 0.1, // The amount of time between cycles
    gravity: 9.8, // Gravitational constant
    friction: 0.1, // Friction between ground and robot
}

/* Ground object, use to configure friction and position */
let ground = {
    pos: 100, // Height relative to the bottom of the canvas
    size: 20,
};

/* Robot object, use to configure starting position and constants */
let robot = {
    x: 0,
    y: ground.pos+ground.size,
    weight: 60,
    size: 20,
    maxVel: 10, 
    maxAcc: 2,
    MaxJerk: 1,
    acc: 0,
    vel: 0,
};

/* Finish object, use to mark goal location */
let finish = {
    x: 50, // How far it is from end of canvas
    y: ground.pos+ground.size,
    width: 5,
    height: 20
};

/* Runs once, at the start. Creates the canvas in this case */
function setup() {
    createCanvas(500, 500);
}

/* Runs continuously, until stopped */
function draw() {
    background(220); //Set background color
    drawGround();
    drawRobot();
    checkFinish();
}

function checkFinish() {
    let c = color(0, 255, 0);
    fill(c);
    rect(width-finish.x, height-finish.y, finish.width, finish.height)
}

function drawRobot() {
    // Draw the initial pos
    let c = color(0, 0, 255);
    fill(c);
    square(robot.x, height-robot.y, robot.size);
    // Update robot params
    robot.x += (robot.vel*constants.dt) + (.5*robot.acc*pow(constants.dt,2));
    let error = (width-finish.x) - robot.x;
    pid.accError+= error;
    robot.vel = error*pid.kP + pid.kI*pid.accError;
}

function drawGround() {
    let c = color(0, 0, 0); // Define color 'c'
    fill(c); // Use color variable 'c' as fill color
    rect(0, height - ground.pos, width, ground.size); // Create ground
}
