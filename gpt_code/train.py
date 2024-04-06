import torch
import torch.nn as nn
from torch.nn import functional as F
from typing import Tuple, Dict
import json

from model import CodeGPT


device = "cuda" if torch.cuda.is_available() else "cpu"

with open("config.json", "r") as f:
    config = json.load(f)

with open("data.txt", "r", encoding="utf-8") as f:
    data = f.read()


chars = sorted(list(set(data)))
vocab_size = len(chars)
stoi = {ch:i for i,ch in enumerate(chars)}
itos = {i:ch for i,ch in enumerate(chars)}

encode = lambda s: [stoi[ch] for ch in s]
decode = lambda l: "".join([itos[i] for i in l])

data = torch.tensor(encode(data))

n = int(0.9*len(data))
train_data = data[:n]
val_data = data[n:]


def get_random_batch(split: str="train") -> Tuple[torch.Tensor, torch.Tensor]:

    data = train_data if split=="train" else val_data

    batch_size = config["batch_size"]
    block_size = config["block_size"]

    idxs = torch.randint(0, len(data)-block_size, size=(batch_size,))
    x_batch = torch.stack([data[i:i+block_size] for i in idxs])
    y_batch = torch.stack([data[i+1:i+block_size+1] for i in idxs])

    x_batch, y_batch = x_batch.to(device), y_batch.to(device)
    return x_batch, y_batch


@torch.no_grad()
def eval_model() -> Dict[str, float]:
    losses = {}
    gpt.eval()

    for split in ["train", "val"]:
        data = train_data if split=="train" else val_data
        loss = 0
        for iter in range(config["eval_iters"]):
            x_batch, y_batch = get_random_batch(split)
            _, l_ = gpt(x_batch, y_batch)
            loss += l_.item()
        
        losses[split] = loss/config["eval_iters"]
    
    gpt.train()
    return losses


def train():

    for iter in range(config["train_iters"]):

        if iter%config["eval_interval"]==0:
            losses = eval_model()
            print(f"iter {iter} train_loss: {losses['train']} val_loss: {losses['val']}")
        
        x_batch, y_batch = get_random_batch()
        _, loss = gpt(x_batch, y_batch)

        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        optimizer.step()


gpt = CodeGPT(config, vocab_size)
gpt = gpt.to(device)
optimizer = torch.optim.AdamW(params=gpt.parameters(),
                              lr=config["learning_rate"])


if __name__ == "__main__":
    train()