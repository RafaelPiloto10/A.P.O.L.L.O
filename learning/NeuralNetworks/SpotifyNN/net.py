import tensorflow as tf
import json
import os
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D


def input_fn():
    print("\n\nLoading Data....\n\n")

    polarity = []
    subjectivity = []

    danceability = []
    energy = []
    valence = []

    with open("assets/lyrics-clean.json", 'r') as f:
        data = json.load(f)
        for i in range(len(data)):
            song = data[i]
            polarity.append(song["sentiment"]["polarity"])
            subjectivity.append(song["sentiment"]["subjectivity"])
            danceability.append(song["features"]["danceability"])
            energy.append(song["features"]["energy"])
            valence.append(song["features"]["valence"])

    print("\n\n Data Loading Complete!")
    return polarity, subjectivity, danceability, energy, valence


pol_data, sub_data, danceability_data, energy_data, valence_data = input_fn()

# Training
d_train_input_fn = tf.estimator.inputs.numpy_input_fn(
    # Input features
    x={"polarity": np.array(pol_data[:600]),
       "subjectivity": np.array(sub_data[:600])},
    y=np.array(danceability_data[:600]),          # true labels
    batch_size=64,
    num_epochs=None,                             # Supply unlimited epochs of data
    shuffle=True)

e_train_input_fn = tf.estimator.inputs.numpy_input_fn(
    # Input features
    x={"polarity": np.array(pol_data[:600]),
       "subjectivity": np.array(sub_data[:600])},
    y=np.array(energy_data[:600]),          # true labels
    batch_size=64,
    num_epochs=None,                             # Supply unlimited epochs of data
    shuffle=True)
v_train_input_fn = tf.estimator.inputs.numpy_input_fn(
    # Input features
    x={"polarity": np.array(pol_data[:600]),
       "subjectivity": np.array(sub_data[:600])},
    y=np.array(valence_data[:600]),          # true labels
    batch_size=64,
    num_epochs=None,                             # Supply unlimited epochs of data
    shuffle=True)

# Testing
d_test_input_fn = tf.estimator.inputs.numpy_input_fn(
    x={"polarity": np.array(pol_data[:-100]),
       "subjectivity": np.array(sub_data[:-100])},
    y=np.array(danceability_data[:-100]),          # true labels
    num_epochs=1,
    shuffle=False)
e_test_input_fn = tf.estimator.inputs.numpy_input_fn(
    x={"polarity": np.array(pol_data[:-100]),
       "subjectivity": np.array(sub_data[:-100])},
    y=np.array(energy_data[:-100]),          # true labels
    num_epochs=1,
    shuffle=False)
v_test_input_fn = tf.estimator.inputs.numpy_input_fn(
    x={"polarity": np.array(pol_data[:-100]),
       "subjectivity": np.array(sub_data[:-100])},
    y=np.array(valence_data[:-100]),          # true labels
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

d_estimator = tf.estimator.DNNRegressor(
    hidden_units=[8, 4, 4],
    feature_columns=[polarity, subjectivity]
)

e_estimator = tf.estimator.DNNRegressor(
    hidden_units=[8, 4, 4],
    feature_columns=[polarity, subjectivity]
)

v_estimator = tf.estimator.DNNRegressor(
    hidden_units=[8, 4, 4],
    feature_columns=[polarity, subjectivity]
)

print("\n\nTraining Estimators\n\n")

d_estimator.train(input_fn=d_train_input_fn, steps=2500)
e_estimator.train(input_fn=e_train_input_fn, steps=2500)
v_estimator.train(input_fn=v_train_input_fn, steps=2500)


print("\n\nTraining complete\n\n")

d_average_loss = d_estimator.evaluate(input_fn=d_test_input_fn)["average_loss"]
e_average_loss = d_estimator.evaluate(input_fn=e_test_input_fn)["average_loss"]
v_average_loss = d_estimator.evaluate(input_fn=v_test_input_fn)["average_loss"]


print(
    f"Average loss in testing:\nDanceability: {d_average_loss:.4f}\nEnergy: {e_average_loss:.4f}\nValence: {e_average_loss:.4f}")

d_predictions = list(d_estimator.predict(input_fn=predict_input_fn))
e_predictions = list(e_estimator.predict(input_fn=predict_input_fn))
v_predictions = list(v_estimator.predict(input_fn=predict_input_fn))


total_avg_error = 0
counter = 0

for d_actual, e_actual, v_actual, d_p, e_p, v_p in zip(danceability_data[::-1], energy_data[::-1], valence_data[::-1], d_predictions, e_predictions, v_predictions):
    d_value = d_p["predictions"][0]
    e_value = e_p["predictions"][0]
    v_value = v_p["predictions"][0]

    d_error = abs((d_value - d_actual)/d_actual*100)
    e_error = abs((e_value - e_actual)/e_actual*100)
    v_error = abs((v_value - v_actual)/v_actual*100)

    avg_error = (d_error + e_error + v_error) / 3

    total_avg_error += avg_error
    counter += 1

    print(f"Average Error: {avg_error:.2f}")


print(f"Total Estimators Average Error: {total_avg_error/counter:.2f}")


def show_plt(x, y, z, x_title="X", y_title="Y", z_title="Z"):
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')

    xs, ys = x, y
    ax.scatter(xs, ys, z)

    ax.set_xlabel(x_title)
    ax.set_ylabel(y_title)
    ax.set_zlabel(z_title)

    plt.show()

# show_plt(pol_data, sub_data, danceability_data, "Polarity", "Subjectivity", "Danceability")
