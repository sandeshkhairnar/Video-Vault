import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  StopCircle,
  Save,
  RadioReceiver,
  Edit,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
function VideoRecorder() {
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [customFileName, setCustomFileName] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('webm');
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: `video/${selectedFormat}` });
        setRecordedBlob(blob);
        videoRef.current.srcObject = null;
        chunksRef.current = [];
        setRecordingTime(0);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        setCustomFileName(`recording-${timestamp}`);
      };

      mediaRecorderRef.current.start();
      setRecording(true);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  };

  const uploadVideo = async () => {
    if (!recordedBlob) return;

    const formData = new FormData();
    const filename = `${customFileName}.${selectedFormat}`;
    formData.append('video', recordedBlob, filename);

    try {
      const response = await fetch('http://localhost:5000/record', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          navigate('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 sm:p-8">
      {/* Success Alert */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="bg-green-600 text-white border-green-500">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Video Saved!</AlertTitle>
            <AlertDescription>
              Your video has been successfully saved.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="w-full max-w-2xl">
        <div className="bg-neutral-900 rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
          {/* Rest of the existing component remains the same */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full aspect-video bg-neutral-800"
            />
            {recording && (
              <div className="absolute top-3 left-3 sm:top-6 sm:left-6 bg-red-600 text-white 
              px-3 py-1 sm:px-4 sm:py-2 rounded-full flex items-center 
              font-medium tracking-wider text-sm sm:text-base">
                <RadioReceiver
                  className="mr-2"
                  size={window.innerWidth < 640 ? 16 : 20}
                />
                {formatTime(recordingTime)}
              </div>
            )}
          </div>

          {recordedBlob && (
            <div className="p-4 sm:p-6 bg-neutral-800">
              <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
                <FileText className={`text-indigo-400 ${window.innerWidth < 640 ? 'w-5 h-5' : 'w-6 h-6'}`} />
                <div className="flex-grow">
                  {isEditingName ? (
                    <input
                      type="text"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      className="w-full bg-neutral-900 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-sm sm:text-base"
                      placeholder="Enter filename"
                    />
                  ) : (
                    <span className="text-neutral-300 text-sm sm:text-base">{customFileName}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="text-neutral-400 hover:text-white"
                >
                  <Edit size={window.innerWidth < 640 ? 16 : 20} />
                </button>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
                <label className="text-neutral-300 text-sm sm:text-base mr-2">Format:</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="bg-neutral-900 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-sm sm:text-base"
                >
                  <option value="webm">WebM</option>
                  <option value="mp4">MP4</option>
                </select>
              </div>
            </div>
          )}

          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              {!recording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center justify-center bg-indigo-700 text-white 
                  px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-indigo-600 
                  transition duration-300 font-medium shadow-xl hover:shadow-indigo-500/30 
                  tracking-wider text-base sm:text-lg"
                >
                  <Camera
                    className="mr-2 sm:mr-3"
                    size={window.innerWidth < 640 ? 20 : 24}
                  />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center justify-center bg-red-600 text-white 
                  px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-red-500 
                  transition duration-300 font-medium shadow-xl hover:shadow-red-500/30 
                  tracking-wider text-base sm:text-lg"
                >
                  <StopCircle
                    className="mr-2 sm:mr-3"
                    size={window.innerWidth < 640 ? 20 : 24}
                  />
                  Stop Recording
                </button>
              )}

              {recordedBlob && (
                <button
                  onClick={uploadVideo}
                  className="flex items-center justify-center bg-green-700 text-white 
                px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-green-600 
                transition duration-300 font-medium shadow-xl hover:shadow-green-500/30 
                tracking-wider text-base sm:text-lg"
                >
                  <Save
                    className="mr-2 sm:mr-3"
                    size={window.innerWidth < 640 ? 20 : 24}
                  />
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoRecorder;