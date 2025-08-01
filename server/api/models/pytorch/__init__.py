import torch
from torch import nn
from api.models import MLP_MODEL_PATH, device, encoder, num_features


class MLP(nn.Module):
  def __init__(self, input_dim, output_dim, dropout=.5):
    super(MLP, self).__init__()
    self.classifier = nn.Sequential(
        nn.Linear(input_dim, 128),
        nn.ReLU(),
        nn.Dropout(dropout),
        nn.Linear(128, 16),
        nn.ReLU(),
        nn.Dropout(dropout),
        nn.Linear(16, output_dim)
    )

  def forward(self, x):
    batch_size = x.shape[0]
    x = x.view(batch_size, -1)
    x = self.classifier(x)
    return x

print(" ✅ LOADING PYTORCH DL MODEL!\n") 

output_dim = 1 if len(encoder.classes_) == 2 else len(encoder.classes_)
mlp = MLP(input_dim=len(num_features), output_dim=output_dim, dropout=.11).to(device)

mlp.load_state_dict(torch.load(MLP_MODEL_PATH, map_location=device))
print(" ✅ LOADING PYTORCH DL MODEL DONE!\n")