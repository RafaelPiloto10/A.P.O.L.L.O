import json
import os
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D


def load_data():
    print("\nLoading Data....\n")

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

    print("\nData Loading Complete!\n")
    return polarity, subjectivity, danceability, energy, valence


p, s, d, e, v = load_data()

fig = plt.figure(figsize=(12, 20))
fig.suptitle("Song Analysis")


# 3D plot
ax = fig.add_subplot(334, projection='3d')
xs, ys = p, s
ax.scatter(xs, ys, d, marker=".")
ax.set_xlabel("Polarity")
ax.set_ylabel("Subjectivity",)
ax.set_zlabel("Danceability")

ax = fig.add_subplot(335, projection='3d')
xs, ys = p, s
ax.scatter(xs, ys, e, marker=".")
ax.set_xlabel("Polarity")
ax.set_ylabel("Subjectivity",)
ax.set_zlabel("Energy")

ax = fig.add_subplot(336, projection='3d')
xs, ys = p, s
ax.scatter(xs, ys, v, marker=".")
ax.set_xlabel("Polarity")
ax.set_ylabel("Subjectivity",)
ax.set_zlabel("Valence")


# 2D plot

ax = fig.add_subplot(332)
ax.scatter(p, d, marker=".")
ax.set_xlabel("Polarity")
ax.set_ylabel("Danceability")

ax = fig.add_subplot(333)
ax.scatter(p, e, marker=".")
ax.set_xlabel("Polarity")
ax.set_ylabel("Energy")

ax = fig.add_subplot(331)
ax.scatter(p, v, marker=".")
ax.set_xlabel("Polarity")
ax.set_ylabel("Valence")


ax = fig.add_subplot(337)
ax.scatter(s, d, marker=".")
ax.set_xlabel("Subjectivity")
ax.set_ylabel("Danceability")

ax = fig.add_subplot(338)
ax.scatter(s, e, marker=".")
ax.set_xlabel("Subjectivity")
ax.set_ylabel("Energy")

ax = fig.add_subplot(339)
ax.scatter(s, v, marker=".")
ax.set_xlabel("Subjectivity")
ax.set_ylabel("Valence")

fig.subplots_adjust(left=None, bottom=None, right=None,
                    top=None, wspace=.3, hspace=.3)


plt.show()
