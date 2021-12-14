import React from "react";
import Hypnosis from "react-cssfx-loading/lib/Hypnosis";

const Loading = () => {
  return (
    <div style={{ position: "relative" }}>
      <Hypnosis
        color="#0462FF"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
        width="100px"
        height="100px"
        duration="1s"
      />
    </div>
  );
};
export default Loading;
