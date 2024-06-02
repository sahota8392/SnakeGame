#Microserivce B - Audio feature for 'Eating Apple' & GameOver
#source: https://www.geeksforgeeks.org/play-sound-in-python/#

from flask import Flask, request, jsonify
from flask_cors import CORS
from pydub import AudioSegment
from pydub.playback import play
import threading

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

hiss = AudioSegment.from_mp3("SnakeHiss.mp3")
gameOver = AudioSegment.from_mp3("GameOver.mp3")

#Hiss sound when snake eats the apple
def play_hiss():
    print('Playing HISS sound')
    play(hiss)

@app.route('/play_hiss', methods=['POST'])
def play_hiss_route():
    # Use threading to avoid blocking the request
    threading.Thread(target=play_hiss).start()
    return jsonify({'status': 'playing'}), 200

#game over sound
def play_gameOver():
    print('Playing GameOver sound')
    play(gameOver)

@app.route('/play_gameOver', methods=['POST'])
def play_gameOver_route():
    # Use threading to avoid blocking the request
    threading.Thread(target=play_gameOver).start()
    return jsonify({'status': 'playing'}), 200

if __name__ == '__main__':
    app.run(host='localhost', port=2500, debug=True)