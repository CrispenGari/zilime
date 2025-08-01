from ariadne import MutationType
from api.types import Error
from api.models import device, recommend_crop
from api.models.pytorch import mlp

mutation = MutationType()


@mutation.field("recommendCrop")
def recommend_crop_resolver(obj, info, input):
    try:
        top = input["top"] if input["top"] is not None else 3  # default to top 3
        res = recommend_crop(input["features"], mlp, device)
        best = list(
            sorted(res["predictions"], key=lambda x: x["probability"], reverse=True)
        )[:top]

        return {
            "success": True,
            "predictions": {
                "top": res["top"],
                "predictions": best,
            },
        }

    except Exception:
        return {
            "success": False,
            "error": Error(
                message="Something went wrong on the server", field="server"
            ).to_json(),
        }
