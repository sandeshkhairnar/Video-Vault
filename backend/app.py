import os
import uuid
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import werkzeug
import datetime

app = Flask(__name__)
CORS(app)

VIDEOS_DIRECTORY = os.path.join(os.path.dirname(__file__), 'videos')
os.makedirs(VIDEOS_DIRECTORY, exist_ok=True)

@app.route('/record', methods=['POST'])
def record_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file"}), 400
    
    video_file = request.files['video']
    
    filename = video_file.filename
    filepath = os.path.join(VIDEOS_DIRECTORY, filename)
    
    video_file.save(filepath)
    
    return jsonify({
        "message": "Video saved successfully", 
        "filename": filename
    }), 201

@app.route('/videos', methods=['GET'])
def list_videos():
    video_files = []
    for filename in os.listdir(VIDEOS_DIRECTORY):
        if filename.endswith(('.webm', '.mp4')):
            filepath = os.path.join(VIDEOS_DIRECTORY, filename)
            stats = os.stat(filepath)
            video_files.append({
                "filename": filename,
                "size": stats.st_size,
                "created_at": datetime.datetime.fromtimestamp(stats.st_ctime).isoformat(),
                "modified_at": datetime.datetime.fromtimestamp(stats.st_mtime).isoformat()
            })
    
    return jsonify(video_files), 200

@app.route('/video/<filename>', methods=['GET'])
def get_video(filename):
    filepath = os.path.join(VIDEOS_DIRECTORY, filename)
    
    # Check if file exists
    if not os.path.exists(filepath):
        return jsonify({"error": "Video not found"}), 404
    
    return send_file(filepath, mimetype='video/webm')

@app.route('/rename_video', methods=['POST'])
def rename_video():
    old_filename = request.json.get('old_filename')
    new_filename = request.json.get('new_filename')

    if not old_filename or not new_filename:
        return jsonify({"error": "Both old and new filenames are required"}), 400

    old_filepath = os.path.join(VIDEOS_DIRECTORY, old_filename)
    new_filepath = os.path.join(VIDEOS_DIRECTORY, new_filename)

    if not os.path.exists(old_filepath):
        return jsonify({"error": "Original video not found"}), 404

    os.rename(old_filepath, new_filepath)
    return jsonify({"message": "Video renamed successfully"}), 200

@app.route('/delete_video', methods=['POST'])
def delete_video():
    filename = request.json.get('filename')

    if not filename:
        return jsonify({"error": "Filename is required"}), 400

    filepath = os.path.join(VIDEOS_DIRECTORY, filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "Video not found"}), 404

    os.remove(filepath)
    return jsonify({"message": "Video deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)