
import pandas as pd
import torch
import os
from joblib import load

# torch device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Model name
MODEL_NAME = "mlp.pt"
# Model paths
MLP_MODEL_PATH = os.path.join(os.getcwd(), f"api/models/static/{MODEL_NAME}")
bundle_path = os.path.join(os.getcwd(), "api/models/static/crop_recommendation_bundle.joblib")
bundle = load(bundle_path)

num_features = bundle['model']
ct = bundle['column_transformer']
encoder = bundle['encoder']

def recommend_crop(details, model, device):
  features = pd.DataFrame([details])[num_features]
  features = ct.transform(features)
  features = torch.from_numpy(features).float()
  model.eval()
  with torch.no_grad():
    features = features.to(device)
    y_pred = model(features)
    probabilities = torch.softmax(y_pred.squeeze(), dim=0)
    label = probabilities.argmax(0).item()
    top = {
        "crop": encoder.classes_[label],
        "probability": float(probabilities[label]),
        "label": label
    }
    predictions = [{
        "crop": encoder.classes_[i],
        "probability": float(prob),
        "label": i
    } for i, prob in enumerate(probabilities)]
    return {"top": top, "predictions": predictions}