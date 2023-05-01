import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from pandas import DataFrame

from util import save_plot_and_encode


def obtener_analisis_exploratorio(df: DataFrame):
    plt.switch_backend('Agg')

    df.hist(figsize=(14, 14), xrot=45)
    hist = save_plot_and_encode()

    plt.figure(figsize=(14, 7))
    box_plots = {}
    for column in df.select_dtypes(include='number').columns.tolist():
        sns.boxplot(x=column, data=df)
        box_plots[column] = save_plot_and_encode()
        plt.clf()

    categorical_hists = {}
    categorical_groupings = {}
    numerical_columns = df.select_dtypes(include=['int', 'float']).columns.tolist()
    for column in df.select_dtypes(include='object').columns.tolist():
        if df[column].nunique() > 10:
            continue

        sns.countplot(y=column, data=df)
        categorical_hists[column] = save_plot_and_encode()
        plt.clf()

        categorical_groupings[column] = df[numerical_columns + [column]].groupby(column).mean().reset_index().to_csv()

    correlation_matrix = df.select_dtypes(include=['int', 'float']).corr()

    plt.figure(figsize=(14, 7))
    sns.heatmap(correlation_matrix, cmap='RdBu_r', annot=True)
    heatmap = save_plot_and_encode()

    plt.figure(figsize=(14, 7))
    sns.heatmap(correlation_matrix, cmap='RdBu_r', annot=True, mask=np.triu(correlation_matrix))
    trimmed_heatmap = save_plot_and_encode()

    return {
        "head": df.head(10).to_csv(),
        "shape": df.shape,
        "types": df.dtypes.to_csv(),
        "null_count": df.isnull().sum().to_frame().reset_index().rename(
            columns={'index': 'variable', 0: 'null_count'}).to_csv(),
        "hist": hist,
        "describe": df.describe().to_csv(),
        "box_plots": box_plots,
        "describe_object": df.describe(include='object').to_csv() if df.select_dtypes(include='object').shape[
                                                                         1] > 0 else "",
        "categorical_hists": categorical_hists,
        "categorical_groupings": categorical_groupings,
        "correlation_matrix": correlation_matrix.to_csv(),
        "heatmap": heatmap,
        "trimmed_heatmap": trimmed_heatmap
    }


def obtener_datos_preparados(df: DataFrame, delete_nulls: bool, attributes: dict):
    plt.switch_backend('Agg')

    if delete_nulls:
        df = df.dropna()

    plt.figure(figsize=(14, 7))
    box_plots = {}
    for attribute, bounds in attributes.items():
        if attribute not in df:
            return {"error": attribute + " no está presente en el dataset"}

        lower = bounds.get("lower", -float('inf'))
        upper = bounds.get("upper", float('inf'))

        if type(lower) not in [int, float] or type(upper) not in [int, float]:
            return {"error": "Los valores de límite deben ser números para " + attribute}

        df = df[df[attribute] >= lower]
        df = df[df[attribute] <= upper]

        sns.boxplot(x=attribute, data=df)
        box_plots[attribute] = save_plot_and_encode()
        plt.clf()

    return {
        "null_count": df.isnull().sum().to_frame().reset_index().rename(
            columns={'index': 'variable', 0: 'null_count'}).to_csv(),
        "box_plots": box_plots,
        "new_csv": df.to_csv()
    }
