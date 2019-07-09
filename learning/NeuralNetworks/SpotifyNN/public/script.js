async function getData() {
    const req = await fetch("http://localhost:3000/trainingData")
    const data = await req.json();
    return data;
}


async function run() {
    // Load and plot the original input data that we are going to train on.
    const data = await getData();

    let values = [];
    for (const song of data) {
        values.push({
            x: song.sentiment.polarity,
            y: song.sentiment.subjectivity
        });
    }

    tfvis.render.scatterplot({
        name: 'Polarity v Subjectivity'
    }, {
        values
    }, {
        xLabel: 'Polarity',
        yLabel: 'Subjectivity',
        height: 300,
    });

    function createModel() {
        // Create a sequential model
        const model = tf.sequential();

        // Hidden layer
        model.add(tf.layers.dense({
            inputShape: [2],
            units: 1,
            useBias: true
        }));

        // Add an output layer
        model.add(tf.layers.dense({
            units: 1,
            useBias: true
        }));

        return model;
    }
    // Create the model
    const model = createModel();

    tfvis.show.modelSummary({
        name: 'Model Summary'
    }, model);

    // Convert the data to a form we can use for training.
    const tensorData = convertToTensor(data);
    const {
        inputs,
        labels
    } = tensorData;

    // Train the model  
    await trainModel(model, inputs, labels);
    console.log('Done Training');
}

/**
 * Convert the input data to tensors that we can use for machine 
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 *  on the y-axis.
 */
function convertToTensor(data) {
    // Wrapping these calculations in a tidy will dispose any 
    // intermediate tensors.

    return tf.tidy(() => {
        // Step 1. Shuffle the data    
        tf.util.shuffle(data);

        // Step 2. Convert data to Tensor
        const inputs = [data.map(d => d.sentiment.polarity), data.map(d => d.sentiment.subjectivity)];
        const labels = [data.map(d => d.song_features.danceability), data.map(d => d.song_features.valence), data.map(d => d.song_features.energy)];

        const inputTensor = tf.tensor2d(inputs, [2, 8]);
        const labelTensor = tf.tensor2d(labels, [3, 8]);

        //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        }
    });
}

async function trainModel(model, inputs, labels) {
    // Prepare the model for training.  
    model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });

    const batchSize = 28;
    const epochs = 50;

    return await model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks({
                name: 'Training Performance'
            },
            ['loss', 'mse'], {
                height: 200,
                callbacks: ['onEpochEnd']
            }
        )
    });
}

document.addEventListener('DOMContentLoaded', run);