
let movers = [];

let attractor;

function setup() {
  createCanvas(640, 360);
  for (let i = 0; i < 10; i++) {
    movers[i] = new Mover(random(0.1, 2), random(width), random(height));
  }
  attractor = new Attractor();
}

function draw() {
  background(mouseX/30,mouseY/6,random(130,180));

  attractor.display();

  for (let i = 0; i < movers.length; i++) {
    let force = attractor.calculateAttraction(movers[i]);
    movers[i].applyForce(force);
    movers[i].update();
    movers[i].display();

  }

}

function mouseMoved() {
  attractor.handleHover(mouseX, mouseY);
}

function mousePressed() {
  attractor.handlePress(mouseX, mouseY);
  
}

function mouseDragged() {
  attractor.handleHover(mouseX, mouseY);
  attractor.handleDrag(mouseX, mouseY);
}

function mouseReleased() {
  attractor.stopDragging();
}




// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

class Mover {
  constructor(mass, x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(1, 0);
    this.acceleration = createVector(0, 0);
    this.mass = mass;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    stroke(0);
    strokeWeight(2);
    fill(255, 255, 7);
    ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
    //if(mousePressed){
    //line(this.position.x, this.position.y, mouseX,mouseY);
    //}
  }

  checkEdges() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if (this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
  }
}



// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// An object for a draggable attractive body in our world

class Attractor {

  constructor() {
    this.position = createVector(width / 2, height / 2);
    this.mass = 20;
    this.G = 1;
    this.dragOffset = createVector(0, 0);
    this.dragging = false;
    this.rollover = false;
  }

  calculateAttraction(m) {
    // Calculate direction of force
    let force = p5.Vector.sub(this.position, m.position);
    // Distance between objects
    let distance = force.mag();
    // Limiting the distance to eliminate "extreme" results for very close or very far objects
    distance = constrain(distance, 5, 25);
    // Normalize vector (distance doesn't matter here, we just want this vector for direction)
    force.normalize();
    // Calculate gravitional force magnitude
    let strength = (this.G * this.mass * m.mass) / (distance * distance);
    // Get force vector --> magnitude * direction
    force.mult(strength);
    return force;
  }

  // Method to display
  display() {
    ellipseMode(CENTER);
    strokeWeight(2);
    stroke(0);
    if (this.dragging) {
      fill(9,100,39);
    } else if (this.rollover) {
      fill(9,30,100);
    } else {
      fill(101, 200);
    }
    ellipse(this.position.x, this.position.y, this.mass * 2, this.mass * 2);
    line(mouseX,mouseY, this.position.x,this.position.y);
    ellipse(mouseX,mouseY,10,10);
    strokeWeight(3);
  }

  handlePress(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.mass) {
      this.dragging = true;
      this.dragOffset.x = this.position.x - mx;
      this.dragOffset.y = this.position.y - my;
    }
  }

  handleHover(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.mass) {
      this.rollover = true;
      
    } else {
      this.rollover = false;
    }
  }

  stopDragging() {
    this.dragging = false;
  }

  handleDrag(mx, my) {
    if (this.dragging) {
      this.position.x = mx + this.dragOffset.x;
      this.position.y = my + this.dragOffset.y;
    }
  }
}