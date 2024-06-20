import librosa
import numpy as np
import matplotlib.pyplot as plt
import PIL.Image as Image

def wav2melspec(fp):
    y, sr = librosa.load(fp)
    S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
    log_S = librosa.amplitude_to_db(S, ref=np.max)
    img = librosa.display.specshow(log_S, sr=sr, x_axis='time', y_axis='mel')
    img = plt.gcf()
    img.gca().xaxis.set_major_locator(plt.NullLocator())
    img.gca().yaxis.set_major_locator(plt.NullLocator())
    img.subplots_adjust(top = 1, bottom = 0, right = 1, left = 0,
            hspace = 0, wspace = 0)
    img.gca().xaxis.set_major_locator(plt.NullLocator())
    img.gca().yaxis.set_major_locator(plt.NullLocator())
    # to pil image
    img.canvas.draw()
    img = Image.frombytes('RGB', img.canvas.get_width_height(), img.canvas.tostring_rgb())
    return img