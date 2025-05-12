let leftCircles = [];
let rightCircles = [];
let emoji = "🤝";
let emojiPositions = [];
const palette = ["#F1C416", "orange", "#F95A76", "#EF9CC7", "#ff1020", "#3B38EB", "#9F81CD", "#FE8718", "#20903A", "#EC9E8A", "#EF9CC7", "#FFFD8A"];

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  background(0);
  cnv.parent('game-container');
  frameRate(50);

  for (let i = 0; i < 40; i++) {
    leftCircles.push(new MovingCircle(-random(100, 400), random(height), random(4, 8), randomColor(), "left"));
    rightCircles.push(new MovingCircle(width / 2 + random(50, 200), random(height), -random(4, 8), color(255), "right"));
  }
}

function draw() {
  background(0);

  for (let lc of leftCircles) {
    lc.move();
    lc.display();
  }

  for (let rc of rightCircles) {
    rc.move();
    rc.display();
  }

  emojiPositions = [];
  for (let lc of leftCircles) {
    for (let rc of rightCircles) {
      let d = dist(lc.x, lc.y, rc.x, rc.y);
      if (d < 50) {
        emojiPositions.push({ x: (lc.x + rc.x) / 2, y: (lc.y + rc.y) / 2 });
      }
    }
  }

  textSize(140);
  textAlign(CENTER, CENTER);
  fill(255);
  for (let e of emojiPositions) {
    text(emoji, e.x, e.y);
  }
}

class MovingCircle {
  constructor(x, y, speed, col, side) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.col = col;
    this.trail = [];
    this.side = side;

    if (this.side === "right") {
      this.stepSize = 50;
      this.pauseDuration = int(random(5, 5));
      this.pauseCounter = 0;
      this.directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      ];
      this.currentDirection = random(this.directions);
    }
  }

  move() {
    if (this.side === "right") {
      if (this.pauseCounter <= 0) {
        this.x += this.currentDirection.x * this.stepSize;
        this.y += this.currentDirection.y * this.stepSize;

        if (random(1) < 0.3) {
          this.currentDirection = random(this.directions);
        }

        this.pauseCounter = this.pauseDuration;
      } else {
        this.pauseCounter--;
      }

      if (this.x > width + 50) this.x = -50;
      if (this.x < -50) this.x = width + 80;
      if (this.y > height + 50) this.y = -50;
      if (this.y < -50) this.y = height + 50;

    } else {
      // Smooth straight left-to-right motion
      this.x += this.speed;

      if (this.x > width + 50) {
        this.x = -random(100, 400);
        this.y = random(height);
      }
    }

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 800) this.trail.shift();
  }

  display() {
    noStroke();

    if (this.side === "left") {
      for (let i = 0; i < this.trail.length; i++) {
        let alpha = map(i, 0, this.trail.length - 1, 0, 500);
        let size = map(i, 0, this.trail.length - 1, 20, 50);
        fill(red(this.col), green(this.col), blue(this.col), alpha);
        ellipse(this.trail[i].x, this.trail[i].y, size);
      }
      fill(this.col);
      ellipse(this.x, this.y, 50);
    } else if (this.side === "right") {
      fill(255);
      push();
      rectMode(CENTER);
      rect(this.x, this.y, 50, 50);
      pop();
    }
  }
}

function randomColor() {
  let c = palette[Math.floor(Math.random() * palette.length)];
  return color(c);
}
