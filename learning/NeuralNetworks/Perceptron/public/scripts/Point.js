function f(m, x, b) {
    return m * x + b;
}

class Point {
    constructor(x = random(1, -1), y = random(-1, 1)) {
        this.x = x;
        this.y = y;
        this.label = this.y > f(0.3, this.x, 0.2) ? 1 : -1;
        this.bias = 1;
    }

    pixelX() {
        return map(this.x, -1, 1, 0, width);
    }
    pixelY() {
        return map(this.y, -1, 1, height, 0);
    }

    show() {
        stroke(0);
        if (this.label == 1) {
            fill(255);
        } else {
            fill(0);
        }

        ellipse(this.pixelX(), this.pixelY(), 16);
    }
}