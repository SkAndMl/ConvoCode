import torch
import json
from .model import VanillaGPT
device = "cuda" if torch.cuda.is_available() else "cpu"

with open("data/itos.json", "r") as f, open("data/stoi.json", "r") as f_:
    itos = json.loads(f.read())
    itos = {int(k): v for k, v in itos.items()}
    stoi = json.loads(f_.read())
    stoi = {k:int(v) for k, v in stoi.items()}

with open("data/config.json", "r") as f:
    config = json.load(f)
    config["device"] = device
    config["vocab_size"] = len(itos)


decode = lambda l: "".join([itos[i] for i in l]) 
encode = lambda s: [stoi[ch] for ch in s]

gpt = VanillaGPT(config=config)
gpt.load_state_dict(torch.load("checkpoints/vanillagpt.pt",
                                map_location=torch.device(device=device)))


def complete_code(incomplete_code: str) -> str:

    x = torch.tensor(encode(incomplete_code), dtype=torch.long).view(1, -1)
    out = gpt.generate(max_new_tokens=100, x=x) # [1, S]
    text = decode(out[0].cpu().numpy())
    return text