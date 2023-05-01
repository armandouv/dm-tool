import json

from flask import Flask, request, jsonify
from flask_cors import CORS

from componentes.analisis_exploratorio import obtener_analisis_exploratorio, obtener_datos_preparados
from util import csv_as_df

app = Flask(__name__)
CORS(app)


@app.route('/analisis-exploratorio', methods=['POST'])
def analisis_exploratorio():
    if not request.files.get("dataset"):
        print("No file attached")
        return jsonify({'error': 'No se adjuntó el archivo de dataset'}), 400

    df = csv_as_df(request.files["dataset"])
    if df is None:
        return jsonify({'error': 'Error al leer archivo CSV'}), 400

    result = obtener_analisis_exploratorio(df)

    return jsonify(result)


@app.route('/analisis-exploratorio/preparacion-datos', methods=['POST'])
def preparacion_datos():
    if not request.files.get("dataset"):
        print("No file attached")
        return jsonify({'error': 'No se adjuntó el archivo de dataset'}), 400

    df = csv_as_df(request.files["dataset"])
    if df is None:
        return jsonify({'error': 'Error al leer archivo CSV'}), 400

    json_data = request.form.get('json')
    if not json_data:
        return jsonify({'error': 'No se proporcionó el objeto JSON'}), 400
    json_obj = json.loads(json_data)

    delete_nulls = json_obj.get('delete_nulls', False)
    if type(delete_nulls) is not bool:
        return jsonify({'error': 'delete_nulls debe ser booleano'}), 400

    attributes = json_obj.get('attributes', {})
    if type(attributes) is not dict:
        return jsonify({'error': 'attributes debe ser un dict'}), 400
    for key in attributes.keys():
        value = attributes[key]
        if type(value) is not dict:
            return jsonify({'error': 'attributes tiene una estructura invalida'}), 400

    result = obtener_datos_preparados(df, delete_nulls, attributes)

    return jsonify(result), 400 if "error" in result else 200


if __name__ == '__main__':
    app.run(debug=True)
