# Backend de DM Tool

Consiste en una API REST implementada utilizando el framework Flask de Python.


## Ejecución

Crear venv:

`python -m venv venv`

`source venv/bin/activate`

`pip install -r requirements.txt`


Generar llaves (necesarias para utilizar HTTPS):

`openssl req -x509 -out localhost.crt -keyout localhost.key   -newkey rsa:2048 -nodes -sha256   -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")`

Ejecutar la aplicación:

`flask run --cert=localhost.crt --key=localhost.key`

Para realizar correctamente peticiones desde el navegador, es necesario modificar la opción de Chrome:

`chrome://flags/#allow-insecure-localhost`
