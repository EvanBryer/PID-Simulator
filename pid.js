/* PID Constants */
let pid = {
    kP: 0.1, // P = kP * error
    kI: 0.00001, // I = kI * accumulated error
    kD: 0.00001, // I = kD * dE / dT
    accError: 0,
    iThresh: 15, // The threshhold for I to start accumulating
    prevErr: -1 // Previous error, used for D
}

/* Simulation Constants */
let constants = {
    dt: 0.1, // The amount of time between cycles
    gravity: 9.8, // Gravitational constant
    friction: 0.000001, // Friction between ground and robot
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
    mass: 60,
    size: 20,
    maxVel: 35, 
    maxAcc: 5,
    maxJerk: 1,
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
    calcParam();
}

function calcParam() {
    // Calculate new position
    robot.x += (robot.vel*constants.dt) + (.5*robot.acc*pow(constants.dt,2));
    // Calculate error and update accumulated error
    let error = (width-finish.x) - robot.x;
    // If first run, ignore prevErr to prevent D from causing problems
    if(pid.prevErr == -1) pid.prevErr = error;
    if(abs(error) < pid.iThresh)
        pid.accError+= error;
    // Find Target
    let target = (error*pid.kP) + (pid.kI*pid.accError) + (pid.kD * ((error-pid.prevErr)/constants.dt));
    pid.prevError = error;
    // Update Acceleration
    let diff = target - robot.vel;
    // If velocity can be set to target within the parameters of acceleration, set it
    if(diff <= robot.acc*constants.dt) {
        robot.vel = target;
    } else {
        // Otherwise, change acceleration to affect velocity
        if(diff < 0) {
            robot.acc -= robot.maxJerk*constants.dt;
            if(robot.maxAcc < abs(robot.acc)) robot.acc = -robot.maxAcc;
        }
        else {
            robot.acc += robot.maxJerk*constants.dt;
            if(robot.maxAcc < abs(robot.acc)) robot.acc = robot.maxAcc;
        }
        // Update Velocity
        robot.vel += robot.acc*constants.dt;
    }
    
    //Change velocity to fit within the max velocity parameters
    if(robot.vel < 0 && abs(robot.vel) > robot.maxVel) robot.vel = -robot.maxVel;
    if(robot.vel > 0 && abs(robot.vel) > robot.maxVel) robot.vel = robot.maxVel;
    
    // Adjust due to friction
    if(robot.vel < 0) robot.vel += robot.vel*((robot.mass*constants.gravity) * constants.friction);
    if(robot.vel > 0) robot.vel -= robot.vel*((robot.mass*constants.gravity) * constants.friction);
}

function drawGround() {
    let c = color(0, 0, 0); // Define color 'c'
    fill(c); // Use color variable 'c' as fill color
    rect(0, height - ground.pos, width, ground.size); // Create ground
}

