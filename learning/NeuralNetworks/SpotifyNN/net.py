import tensorflow as tf
import json
import os
import numpy as np


def input_fn():
    polarity = []
    subjectivity = []
    label = []
    with open("assets/lyrics-clean.json", 'r') as f:
        data = json.load(f)
        for i in range(len(data)):
            song = data[i]
            polarity.append(song["sentiment"]["polarity"])
            subjectivity.append(song["sentiment"]["subjectivity"])
            label.append(song["features"]["danceability"])

    return polarity, subjectivity, label


pol_data, sub_data, danceability_data = input_fn()

# Training
train_input_fn = tf.estimator.inputs.numpy_input_fn(
    # Input features
    x={"polarity": np.array(pol_data[:600]),
       "subjectivity": np.array(sub_data[:600])},
    y=np.array(danceability_data[:600]),          # true labels
    batch_size=2,
    num_epochs=None,                             # Supply unlimited epochs of data
    shuffle=True)

# Testing
test_input_fn = tf.estimator.inputs.numpy_input_fn(
    x={"polarity": np.array(pol_data[:-100]),
       "subjectivity": np.array(sub_data[:-100])},
    y=np.array(danceability_data[:-100]),          # true labels
    num_epochs=1,
    shuffle=False)

# Prediction
predict_input_fn = tf.estimator.inputs.numpy_input_fn(
    x={"polarity": np.array(pol_data[::-1]),
       "subjectivity": np.array(sub_data[::-1])},
    num_epochs=1,
    shuffle=False)


polarity = tf.feature_column.numeric_column('polarity')
subjectivity = tf.feature_column.numeric_column('subjectivity')

estimator = tf.estimator.LinearRegressor(
    feature_columns=[polarity, subjectivity],
)

estimator.train(input_fn=train_input_fn, steps=2500)

average_loss = estimator.evaluate(input_fn=test_input_fn)["average_loss"]
print(f"Average loss in testing: {average_loss:.4f}")

predictions = list(estimator.predict(input_fn=predict_input_fn))

for input, p in zip(danceability_data[::-1], predictions):
    v = p["predictions"][0]
    print(
        f"Actual Danceability = {input:.2f} -> Predicted = {v:.2f} : Error={abs((v - input)/input*100):.2f}%")
