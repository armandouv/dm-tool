import io

import pandas as pd
import base64

from matplotlib import pyplot as plt


def csv_as_df(file):
    try:
        return pd.read_csv(file)
    except Exception as e:
        print("Error while reading csv")
        return None


def encode_to_base64(binary_data):
    return base64.b64encode(binary_data.getvalue()).decode('utf-8')


def save_plot_and_encode():
    # It is assumed the plot has already been generated.
    to_encode = io.BytesIO()
    plt.savefig(to_encode, format='png')
    to_encode.seek(0)
    return encode_to_base64(to_encode)