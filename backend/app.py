import json

from flask import Flask, request, jsonify
from flask_cors import CORS

from componentes.analisis_exploratorio import obtener_analisis_exploratorio, obtener_datos_preparados
from util import csv_as_df

app = Flask(__name__)
CORS(app)


@app.route('/analisis-exploratorio', methods=['GET'])
def analisis_exploratorio():
    if not request.files.get("dataset"):
        print("No file attached")
        return jsonify({'error': 'No se adjuntó el archivo de dataset'})

    df = csv_as_df(request.files["dataset"])
    if df is None:
        return jsonify({'error': 'Error al leer archivo CSV'})

    result = obtener_analisis_exploratorio(df)

    return jsonify(result)


@app.route('/analisis-exploratorio/preparacion-datos', methods=['POST'])
def preparacion_datos():
    if not request.files.get("dataset"):
        print("No file attached")
        return jsonify({'error': 'No se adjuntó el archivo de dataset'})

    df = csv_as_df(request.files["dataset"])
    if df is None:
        return jsonify({'error': 'Error al leer archivo CSV'})

    json_data = request.form.get('json')
    if not json_data:
        return jsonify({'error': 'No se proporcionó el objeto JSON'})
    json_obj = json.loads(json_data)

    delete_nulls = json_obj.get('delete_nulls', False)
    if type(delete_nulls) is not bool:
        return jsonify({'error': 'delete_nulls debe ser booleano'})

    attributes = json_obj.get('attributes', {})
    if type(attributes) is not dict:
        return jsonify({'error': 'attributes debe ser un dict'})
    for key in attributes.keys():
        value = attributes[key]
        if type(value) is not dict:
            return jsonify({'error': 'attributes tiene una estructura invalida'})

    result = obtener_datos_preparados(df, delete_nulls, attributes)

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
