import React from "react";

const MediaControls = ({
  startRecording,
  pauseRecording,
  stopRecording,
  mediaRecorderState,
}) => {
  return (
    <div className="media-control">
      <button
        onClick={startRecording}
        type="button"
        disabled={
          mediaRecorderState === "recording" || mediaRecorderState === "paused"
        }
      >
        Start Recording
      </button>

      <button
        onClick={pauseRecording}
        type="button"
        disabled={!mediaRecorderState || mediaRecorderState === "inactive"}
      >
        {`${mediaRecorderState === "paused" ? "Resume" : "Pause"} Recording`}
      </button>
      <button
        onClick={stopRecording}
        type="button"
        disabled={!mediaRecorderState || mediaRecorderState === "inactive"}
      >
        Stop Recording
      </button>
    </div>
  );
};

export default MediaControls;
