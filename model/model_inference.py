import torch
from transformers import ViTForImageClassification, ViTFeatureExtractor

model_id = "Anthuni/thesis_model"
token = "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"

model = ViTForImageClassification.from_pretrained(model_id, token=token)
feature_extractor = ViTFeatureExtractor.from_pretrained(model_id, token=token)

def model_inference(image):
    inputs = feature_extractor(images=image, return_tensors="pt")
    with torch.no_grad():
        logits = model(**inputs).logits
    predicted_label = torch.round(torch.sigmoid(logits.argmax(-1)))
    if int(predicted_label.item()) == 0:
        result = "Fake"
    else:
        result = "Real"
    return result