from flask import Flask, jsonify

app = Flask(__name__)


@app.get("/api/status")
def verificar_status():
    return jsonify({
        "sistema": "Mercearia Gomes",
        "status": "online",
        "mensagem": "Backend funcionando com sucesso!"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)