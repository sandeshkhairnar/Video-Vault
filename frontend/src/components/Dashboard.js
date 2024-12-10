import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Plus,
  Film,
  Trash2,
  Edit,
  Info
} from 'lucide-react';

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/videos');
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleVideoSelect = (filename) => {
    navigate('/play', { state: { filename } });
  };

  const handleNewRecording = () => {
    navigate('/record');
  };

  const handleDelete = async (filename) => {
    try {
      const response = await fetch('http://localhost:5000/delete_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
      });

      if (response.ok) {
        fetchVideos();
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleRename = async (oldFilename, newFilename) => {
    try {
      const response = await fetch('http://localhost:5000/rename_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_filename: oldFilename,
          new_filename: newFilename
        }),
      });

      if (response.ok) {
        fetchVideos();
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error('Error renaming video:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const VideoInfoModal = ({ video, onClose, onDelete, onRename }) => {
    const [newFileName, setNewFileName] = useState(video.filename);
    const [isEditing, setIsEditing] = useState(false);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-neutral-900 rounded-3xl w-96 p-6 border border-neutral-800 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <Info className="mr-2 text-indigo-400" size={24} />
              Video Details
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="flex-grow bg-neutral-800 text-white px-3 py-2 rounded"
                />
                <button
                  onClick={() => {
                    onRename(video.filename, newFileName);
                    setIsEditing(false);
                  }}
                  className="bg-indigo-700 text-white px-3 py-2 rounded hover:bg-indigo-600"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Filename:</span>
                <div className="flex items-center">
                  <span className="text-white">{video.filename}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-2 text-neutral-400 hover:text-white"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-neutral-300">Size:</span>
              <span className="text-white">{formatFileSize(video.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-300">Created:</span>
              <span className="text-white">{formatDate(video.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-300">Modified:</span>
              <span className="text-white">{formatDate(video.modified_at)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => onDelete(video.filename)}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg 
              hover:bg-red-500 transition duration-300"
            >
              <Trash2 className="mr-2" size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
          <div className="flex items-center mb-4 md:mb-0">
            <Film className="mr-4 text-indigo-400" size={36} />
            <h1 className="text-2xl md:text-4xl font-extralight text-white tracking-tight">
              Video Vault
            </h1>
          </div>
          <button
            onClick={handleNewRecording}
            className="flex items-center bg-indigo-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg 
            hover:bg-indigo-600 transition duration-300 font-medium 
            shadow-xl hover:shadow-indigo-500/30 tracking-wider"
          >
            <Plus className="mr-2" size={20} />
            New Recording
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center bg-neutral-900 p-6 md:p-12 rounded-3xl border border-neutral-800">
            <Video className="mx-auto mb-4 md:mb-6 text-neutral-700" size={64} />
            <p className="text-neutral-300 text-lg md:text-xl mb-2 md:mb-4">
              Your video collection is empty
            </p>
            <p className="text-neutral-500 text-sm md:text-base mb-4 md:mb-6">
              Start capturing memories by clicking "New Recording"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {videos.map((video) => (
              <div
                key={video.filename}
                className="bg-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden 
                cursor-pointer transform transition duration-300 
                hover:scale-105 hover:bg-neutral-800 border border-neutral-800 
                hover:border-indigo-600 shadow-xl hover:shadow-indigo-500/30"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Video className="text-indigo-500 mr-3" size={32} />
                      <span className="text-sm text-neutral-500">
                        {formatFileSize(video.size)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedVideo(video)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <Info size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(video.filename)}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <h3
                    onClick={() => handleVideoSelect(video.filename)}
                    className="text-lg font-semibold text-white truncate mb-2"
                  >
                    {video.filename}
                  </h3>
                  <div
                    className="mt-2 h-1 bg-neutral-700 rounded-full overflow-hidden"
                    onClick={() => handleVideoSelect(video.filename)}
                  >
                    <div className="h-full bg-indigo-600 w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedVideo && (
          <VideoInfoModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;