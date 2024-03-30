import { useState, useRef, useEffect } from "react";
import { debounce } from "../utils";

const mimeType = 'video/webm; codecs="opus,vp8"';

const useVideoRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const mediaRecorder = useRef(null);
  let liveVideoFeed = useRef(null);
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [error, setError] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorderState, setMediaRecorderState] = useState(null);
  let animationId = useRef(null);
  let totalPauseTime = useRef(0);
  let startTime = useRef(0);
  let totalElapsedTime = useRef(0);
  const [recordTimerLive, setRecordTimerLive] = useState(0);

  const getCameraPermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setPermission(true);
        setError("");
        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
        ]);
        setStream(combinedStream);
        liveVideoFeed.current.srcObject = videoStream;
      } catch (err) {
        setError(err.message);
        setPermission(false);
      }
    } else {
      setError("MediaRecorder not found");
    }
  };

  const startRecording = async () => {
    setMediaRecorderState("recording");
    startTime = Date.now();
    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localVideoChunks = [];
    mediaRecorder.current.ondataavailable = (event) =>
      handleDataAvailable(event, localVideoChunks);
    setVideoChunks(localVideoChunks);
    updateDuration();
  };

  const handleDataAvailable = (event, localVideoChunks) => {
    if (typeof event.data === "undefined") return;
    if (event.data.size === 0) return;
    localVideoChunks.push(event.data);
  };

  const updateDuration = () => {
    let elapsedRecordTime = (Date.now() - startTime) / 1000;
    let debouncedUpdate = debounce(
      () => setRecordTimerLive(elapsedRecordTime),
      1000
    );
    debouncedUpdate();
    if (mediaRecorder.current.state === "recording") {
      animationId = requestAnimationFrame(() => updateDuration(startTime));
    }
  };

  useEffect(() => {
    if (mediaRecorder && mediaRecorder.current) {
      console.log("hello", mediaRecorder.current.state, isPaused);
      if (isPaused) {
        mediaRecorder.current.pause();
        setMediaRecorderState("paused");
        totalPauseTime += Date.now() - startTime;
        cancelAnimationFrame(animationId);
      } else {
        mediaRecorder.current.resume();
        setMediaRecorderState("recording");
        updateDuration(Date.now() - totalPauseTime);
      }
    }
  }, [isPaused]);

  const resetRecorder = () => {
    setRecordedVideo(null);
  };

  const pauseRecording = async () => {
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    setPermission(false);
    setMediaRecorderState("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      setVideoChunks([]);
      cancelAnimationFrame(animationId);
    };
  };

  return {
    permission,
    recordedVideo,
    getCameraPermission,
    startRecording,
    stopRecording,
    liveVideoFeed,
    error,
    pauseRecording,
    mediaRecorderState,
    resetRecorder,
    totalElapsedTime,
    recordTimerLive,
  };
};

export default useVideoRecorder;
