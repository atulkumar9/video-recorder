import useVideoRecorder from "../hooks/useVideoRecorder";
import MediaControls from "./MediaControls";

const VideoRecorder = () => {
  const {
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
    recordTimerLive,
  } = useVideoRecorder();

  return (
    <div>
      <h2>Audio Recorder</h2>
      <main>
        <div className="video-controller">
          {recordedVideo ? (
            <button onClick={resetRecorder}>Take another video</button>
          ) : !permission ? (
            <button onClick={getCameraPermission} type="button">
              Get Camera
            </button>
          ) : null}
          {error ? (
            <div>{`Error: ${error}`}</div>
          ) : permission ? (
            <>
              <MediaControls
                startRecording={startRecording}
                stopRecording={stopRecording}
                pauseRecording={pauseRecording}
                mediaRecorderState={mediaRecorderState}
              />
            </>
          ) : null}
        </div>
        {/* <div>{timeElapsed}</div> */}
        <div className="video-player">
          {!recordedVideo ? (
            <div className="recorder-container">
              <video ref={liveVideoFeed} autoPlay className="live-player" />
              {mediaRecorderState === "recording" ? (
                <div className="recording-icon" />
              ) : null}
            </div>
          ) : null}
          {recordedVideo ? (
            <div className="recorded-player">
              <video className="recorded" src={recordedVideo} controls></video>
              <a className="download-button" download href={recordedVideo}>
                Download Recording
              </a>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
export default VideoRecorder;
