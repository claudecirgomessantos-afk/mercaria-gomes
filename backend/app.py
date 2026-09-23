import os

from decimal import Decimal, InvalidOperation
import psycopg
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://127.0.0.1:5500"}})

def conectar_banco():
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        connect_timeout=5,
    )


@app.get("/api/status")
def verificar_status():
    return jsonify({
        "sistema": "Mercearia Gomes",
        "status": "online",
        "mensagem": "Backend funcionando com sucesso!"
    })


@app.get("/api/banco")
def verificar_banco():
    try:
        with conectar_banco() as conexao:
            with conexao.cursor() as cursor:
                cursor.execute("SELECT current_database()")
                nome_banco = cursor.fetchone()[0]

        return jsonify({
            "status": "conectado",
            "banco": nome_banco,
            "mensagem": "Conexão com PostgreSQL funcionando!"
        })

    except psycopg.Error:
        return jsonify({
            "status": "erro",
            "mensagem": "Não foi possível conectar ao PostgreSQL."
        }), 500

@app.post("/api/produtos")
def cadastrar_produto():
    dados = request.get_json(silent=True)

    if not isinstance(dados, dict):
        return jsonify({"erro": "Envie os dados do produto em JSON."}), 400

    nome = dados.get("nome")
    preco = dados.get("preco")
    quantidade = dados.get("quantidade_estoque", 0)
    codigo_barras = dados.get("codigo_barras") or None

    if not isinstance(nome, str) or not nome.strip():
        return jsonify({"erro": "Informe o nome do produto."}), 400

    try:
        preco = Decimal(str(preco))
        if not preco.is_finite() or preco < 0:
            raise ValueError

        if isinstance(quantidade, bool):
            raise ValueError
        quantidade = int(quantidade)
        if quantidade < 0:
            raise ValueError
    except (ValueError, TypeError, InvalidOperation):
        return jsonify({"erro": "Preço ou quantidade inválidos."}), 400

    try:
        with conectar_banco() as conexao:
            with conexao.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO produtos
                        (nome, codigo_barras, preco, quantidade_estoque)
                    VALUES (%s, %s, %s, %s)
                    RETURNING id
                    """,
                    (nome.strip(), codigo_barras, preco, quantidade),
                )
                produto_id = cursor.fetchone()[0]

        return jsonify({
            "mensagem": "Produto cadastrado com sucesso!",
            "id": produto_id
        }), 201

    except psycopg.errors.UniqueViolation:
        return jsonify({"erro": "Este código de barras já está cadastrado."}), 409
    except psycopg.Error:
        return jsonify({"erro": "Não foi possível cadastrar o produto."}), 500


@app.get("/api/produtos")
def listar_produtos():
    try:
        with conectar_banco() as conexao:
            with conexao.cursor() as cursor:
                cursor.execute("""
                    SELECT id, nome, codigo_barras, preco, quantidade_estoque
                    FROM produtos
                    ORDER BY id
                """)

                produtos = [
                    {
                        "id": id,
                        "nome": nome,
                        "codigo_barras": codigo_barras,
                        "preco": float(preco),
                        "quantidade_estoque": quantidade
                    }
                    for id, nome, codigo_barras, preco, quantidade
                    in cursor.fetchall()
                ]

        return jsonify(produtos)

    except psycopg.Error:
        return jsonify({
            "erro": "Não foi possível consultar os produtos."
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)