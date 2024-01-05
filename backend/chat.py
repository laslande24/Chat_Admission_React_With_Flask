import random
import json
import torch
import time
import sys
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# import nltk_utils and model from the existing code
from nltk_utils import bag_of_words, tokenize
from model import NeuralNet

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the intents.json file and initialize the intent-based model
with open("intents.json", "r") as json_data:
    intents = json.load(json_data)

FILE = "model_intent.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data["all_words"]
tags = data["tags"]
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

# Initialize the DialoGPT model and tokenizer
dialogpt_model = GPT2LMHeadModel.from_pretrained("microsoft/DialoGPT-medium")
dialogpt_tokenizer = GPT2Tokenizer.from_pretrained("microsoft/DialoGPT-medium")

def typing_effect(text):
    for character in text:
        sys.stdout.write(character)
        sys.stdout.flush()
        time.sleep(0.05)


def user_type():
    print("Let's chat! (type 'quit' to exit)")
    sentence = input("You: ")
    if sentence == "quit":
        sys.exit("Goodbye")

    resp = generate_bot_response(sentence)
    typing_effect("Bot: " + resp + "\n")


def generate_bot_response(msg):
    # Check if the message matches any intents in the intents.json file
    sentence = tokenize(msg)
    X = bag_of_words(sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.75:
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                reply = random.choice(intent["responses"])
                return reply

    else:
        # Use DialoGPT for generating response
        bot_input_ids = dialogpt_tokenizer.encode(msg + dialogpt_tokenizer.eos_token, return_tensors='pt')
        dialogpt_model.eval()
        bot_input_ids = bot_input_ids.to(device)
        chat_history_ids = dialogpt_model.generate(bot_input_ids, max_length=1000, pad_token_id=dialogpt_tokenizer.eos_token_id)
        response = dialogpt_tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
        return response


if __name__ == "__main__":
    while True:
        user_type()
