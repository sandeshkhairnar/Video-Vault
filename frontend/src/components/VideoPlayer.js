import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

function VideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const filename = location.state?.filename;
    if (filename) {
      setVideoUrl(`http://localhost:5000/video/${filename}`);
    }
  }, [location]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      videoRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  const updateProgress = () => {
    if (videoRef.current) {
      const progressPercent = 
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressPercent);
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  if (!videoUrl) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-950 text-neutral-400">
        <p className="text-xl">No video selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-neutral-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
        <div className="relative">
          {/* Back button */}
          <div className="absolute top-4 left-4 z-10">
            <button 
              onClick={goBack}
              className="bg-neutral-800/50 p-2 rounded-full hover:bg-neutral-700/75 transition"
            >
              <ChevronLeft className="text-white" />
            </button>
          </div>

          {/* Video element */}
          <div className="relative">
            <video 
              ref={videoRef}
              src={videoUrl}
              className="w-full aspect-video bg-black"
              onTimeUpdate={updateProgress}
              onLoadedMetadata={() => {
                setIsPlaying(false);
              }}
            />

            <div 
              className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-700"
            >
              <div 
                className="h-full bg-indigo-600" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4 w-full">
              <button 
                onClick={togglePlay} 
                className="bg-indigo-700 text-white p-2 md:p-3 rounded-full hover:bg-indigo-600 transition"
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>

              <div className="flex items-center space-x-2 flex-grow">
                <input 
                  type="range" 
                  min="0" 
                  max={videoRef.current?.duration || 0} 
                  step="0.1" 
                  value={videoRef.current?.currentTime || 0}
                  onChange={handleSeek}
                  className="flex-grow appearance-none bg-neutral-700 h-1 md:h-2 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <button 
                onClick={() => {
                  setVolume(volume > 0 ? 0 : 1);
                  if (videoRef.current) {
                    videoRef.current.volume = volume > 0 ? 0 : 1;
                  }
                }}
                className="text-neutral-400 hover:text-white"
              >
                {volume === 0 ? <VolumeX /> : <Volume2 />}
              </button>
              
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 appearance-none bg-neutral-700 h-1 md:h-2 rounded-full"
              />
              
              <button 
                onClick={toggleFullScreen}
                className="text-neutral-400 hover:text-white"
              >
                {isFullScreen ? <Minimize2 /> : <Maximize2 />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;