import React from "react";

const VideoCall = ({remoteVideoRef}) => {
  return (
    <>
      <div>
        <video />
      </div>
      <div>
        <video ref={remoteVideoRef}/>
      </div>
    </>
  );
};

export default VideoCall;
