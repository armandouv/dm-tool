from itertools import count

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from pandas import DataFrame, concat

from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from typing import List

from util import save_plot_and_encode


def obtener_analisis_componentes_principales(df: DataFrame, min_max: bool):
    plt.switch_backend('Agg')

    correlation_matrix = df.select_dtypes(include=['int', 'float']).corr(method="pearson")

    plt.figure(figsize=(14, 7))
    sns.heatmap(correlation_matrix, cmap='RdBu_r', annot=True, mask=np.triu(correlation_matrix))
    trimmed_heatmap = save_plot_and_encode()

    numerical_df = df.select_dtypes(include=['int', 'float'])

    standardize = StandardScaler() if not min_max else MinMaxScaler()
    standardized_matrix = standardize.fit_transform(numerical_df)
    standardized_dataset = DataFrame(standardized_matrix, columns=numerical_df.columns)

    pca = PCA(n_components=len(numerical_df.columns))
    pca.fit(standardized_matrix)
    eigenvectors = pca.components_

    explained_variances = pca.explained_variance_ratio_

    cumulative_variances = np.cumsum(explained_variances)
    candidate_variances = []
    for n_components in count(start=1):
        if 0.75 <= cumulative_variances[n_components - 1] <= 0.9:
            candidate_variances.append((n_components, cumulative_variances[n_components - 1]))
        elif cumulative_variances[n_components - 1] > 0.9:
            break

    plt.clf()
    plt.plot(cumulative_variances)
    plt.xlabel('Número de componentes')
    plt.ylabel('Varianza acumulada')
    plt.grid()
    cumulative_variances_graph = save_plot_and_encode()

    return {
        "head": df.head(10).to_csv(),
        "shape": df.shape,
        "correlation_matrix": correlation_matrix.to_csv(),
        "trimmed_heatmap": trimmed_heatmap,
        "standardized_dataset": standardized_dataset.to_csv(),
        "eigenvectors": DataFrame(eigenvectors).to_csv(),
        "explained_variances": DataFrame(explained_variances).to_csv(),
        "candidate_variances": DataFrame(candidate_variances).to_csv(),
        "cumulative_variances_graph": cumulative_variances_graph,
        "relevance_proportion": DataFrame(abs(eigenvectors)).to_csv(),
        "components_load": DataFrame(eigenvectors, columns=numerical_df.columns).to_csv(),
        "abs_components_load": DataFrame(abs(eigenvectors), columns=numerical_df.columns).to_csv()
    }


def obtener_componentes_principales(df: DataFrame, num_components: int):
    numerical_df = df.select_dtypes(include=['int', 'float'])
    non_numerical_df = df.select_dtypes(exclude=['int', 'float'])

    standardize = StandardScaler()
    standardized_matrix = standardize.fit_transform(numerical_df)

    pca = PCA(n_components=num_components)
    transformed_matrix = pca.fit_transform(standardized_matrix)

    # Create column names for the components based on original attribute names
    component_names = [f'Component {i + 1}: {col}' for i, col in enumerate(numerical_df.columns)]
    component_names = component_names[:num_components]

    # Transform the matrix back to the original space
    transformed_numerical = DataFrame(standardize.inverse_transform(transformed_matrix), columns=numerical_df.columns)[
        component_names]

    # Concatenate the transformed numerical dataset with the non-numerical dataset
    transformed_dataset = concat([transformed_numerical, non_numerical_df], axis=1)

    return {
        "transformed_dataset": transformed_dataset
    }


def analisis_correlacional(df: DataFrame, hue: str, x: str, y: str):
    plt.switch_backend('Agg')

    plt.figure(figsize=(14, 7))
    sns.pairplot(df, hue=hue)
    hue_plot = save_plot_and_encode()

    plt.clf()
    sns.scatterplot(x=x, y=y, data=df, hue=hue)
    plt.title('Gráfico de dispersión')
    plt.xlabel(x)
    plt.ylabel(y)
    scatter_plot = save_plot_and_encode()

    top_values = df[x].sort_values(ascending=False)[:10]

    return {
        "hue_plot": hue_plot,
        "scatter_plot": scatter_plot,
        "top_values": top_values
    }


def drop_columns(df: DataFrame, columns: List[str]):
    new_dataset = df.drop(columns=columns)

    return {
        "new_dataset": new_dataset
    }
