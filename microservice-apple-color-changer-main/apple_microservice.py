from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def generate_random_color():
    colors = ['red', 'green', 'blue', 'yellow', 'purple', 'black', 'white']
    return random.choice(colors)

@app.route('/apple_eaten', methods=['POST'])
def apple_eaten():
    print('Changing apple color...')
    new_color = generate_random_color()
    response = jsonify({'response': 'OK', 'color': new_color})
    response.headers.add('Access-Control-Allow-Origin', '*')  # stops the cor issue
    return response

if __name__ == '__main__':
    app.run(host='localhost', port=5555)
