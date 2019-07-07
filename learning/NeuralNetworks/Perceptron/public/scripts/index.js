let points = [];
let perceptron;

let trainingIndex = 0;

function setup() {
    createCanvas(500, 500);

    for (let i = 0; i < 100; i++) {
        points[i] = new Point();
    }
    perceptron = new Perceptron(3);
}

function draw() {
    background(255);
    stroke(0);


    let p1 = new Point(-1, f(0.3, -1, 0.2));
    let p2 = new Point(1, f(0.3, 1, 0.2));
    line(p1.pixelX(), p1.pixelY(), p2.pixelX(), p2.pixelY());

    let p3 = new Point(-1, perceptron.guessY(-1));
    let p4 = new Point(1, perceptron.guessY(1));

    line(p3.pixelX(), p3.pixelY(), p4.pixelX(), p4.pixelY());


    for (let point of points) {
        point.show();
        let guess = perceptron.guess([point.x, point.y, point.bias]);
        if (guess == point.label) {
            fill(0, 255, 0);
        } else {
            fill(255, 0, 0);
        }
        noStroke();
        ellipse(point.pixelX(), point.pixelY(), 8);
    }

    let training = points[trainingIndex];
    perceptron.train([training.x, training.y, training.bias], training.label);
    trainingIndex = (trainingIndex + 1) % points.length;

}