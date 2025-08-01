
import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
from api.app import app
from flask import jsonify, request, make_response
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync
from ariadne.explorer import ExplorerGraphiQL
from api.resolvers.queries import query
from api.resolvers.mutations import mutation
from api.blueprints import blueprint 
from api.types import Meta
from dotenv import load_dotenv

load_dotenv()

type_defs = load_schema_from_path("schema/schema.graphql")
explorer_html = ExplorerGraphiQL().html(None)
schema = make_executable_schema(
    type_defs,
    [
        query,
        mutation,
    ],
)

class AppConfig:
    PORT = 3001
    DEBUG = True


app.register_blueprint(blueprint, url_prefix="/api/v1")

@app.route("/", methods=["GET"])
def meta():
    meta = Meta(
      main = "Crop Recommendation AI",
      description = "This is a python graphql server for serving crop recommendation model.",
      language = "python",
      libraries = ["pytorch", "pandas", "googletrans"],
   ).to_json()
    return make_response(jsonify(meta)), 200

@app.route("/api/v1/graphql", methods=["GET"])
def graphql_explorer():
    return explorer_html, 200


@app.route("/api/v1/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema, data, context_value={"request": request}, debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code


if __name__ == "__main__":
    app.run(
        debug=AppConfig().DEBUG,
        port=AppConfig().PORT,
        host='0.0.0.0'
    )
