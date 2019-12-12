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
    loudness = []
    tempo = []
    liveness = []

    with open("../assets/lyrics-clean.json", 'r') as f:
        data = json.load(f)
        for i in range(len(data)):
            song = data[i]
            polarity.append(song["sentiment"]["polarity"])
            subjectivity.append(song["sentiment"]["subjectivity"])
            danceability.append(song["features"]["danceability"])
            energy.append(song["features"]["energy"])
            valence.append(song["features"]["valence"])
            loudness.append(song["features"]["loudness"])
            tempo.append(song["features"]["tempo"])
            liveness.append(song["features"]["liveness"])

    print("\nData Loading Complete!\n")
    return polarity, subjectivity, danceability, energy, valence, loudness, tempo, liveness


p, s, d, e, v, l, t, ll = load_data()

fig = plt.figure(figsize=(12, 20))
fig.suptitle("Song Sentiment Analysis")

fig2 = plt.figure(figsize=(12, 20))
fig2.suptitle("Spotify Song Analysis")


# Sentiment Analysis 3D plot
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


# Sentiment Analysis 2D plot

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

ax = fig2.add_subplot(331)
ax.boxplot(v, vert=False)
ax.set_xlabel("Valence")

ax = fig2.add_subplot(332)
ax.boxplot(e, vert=False)
ax.set_xlabel("Energy")

ax = fig2.add_subplot(333)
ax.boxplot(d, vert=False)
ax.set_xlabel("Danceability")

ax = fig2.add_subplot(334)
ax.scatter(l, v, marker=".")
ax.set_xlabel("Loudness")
ax.set_ylabel("Valence")

ax = fig2.add_subplot(335)
ax.scatter(l, e, marker=".")
ax.set_xlabel("Loudness")
ax.set_ylabel("Energy")

ax = fig2.add_subplot(336)
ax.scatter(l, d, marker=".")
ax.set_xlabel("Loudness")
ax.set_ylabel("Danceability")

ax = fig2.add_subplot(337)
ax.boxplot(l, vert=False)
ax.set_xlabel("Loudness")

ax = fig2.add_subplot(338)
ax.boxplot(t, vert=False)
ax.set_xlabel("Tempo")

ax = fig2.add_subplot(339)
ax.boxplot(ll, vert=False)
ax.set_xlabel("Liveness")

fig.subplots_adjust(left=None, bottom=None, right=None,
                    top=None, wspace=.3, hspace=.3)

fig2.subplots_adjust(left=None, bottom=None, right=None,
                     top=None, wspace=.3, hspace=.3)


plt.show()
