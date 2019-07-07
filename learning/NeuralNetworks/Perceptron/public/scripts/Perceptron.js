function sign(num) {
    return num >= 0 ? 1 : -1;
}

class Perceptron {
    weights = [];
    lr = 0.01;

    constructor(num_weights) {
        for (let i = 0; i < num_weights; i++) {
            this.weights[i] = random(-1, 1);
        }
    }

    guess(inputs) {
        let sum = 0;
        for (let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i];
        }

        let output = sign(sum);
        return output;
    }

    train(inputs, target) {
        let guess = this.guess(inputs);
        let error = target - guess;

        for (let i = 0; i < this.weights.length; i++) {
            this.weights[i] += error * inputs[i] * this.lr;
        }
    }

    guessY(x) {
        let w0 = this.weights[0];
        let w1 = this.weights[1];
        let w2 = this.weights[2];

        return -(w2 / w1) - (w0 / w1) * x;

    }
}