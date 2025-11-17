import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React from "react";

function CircularProgress() {
  // Responsive size: min 10rem, max 16rem, scales with viewport
  const progressSize = "clamp(10rem, 20vw, 16rem)";

  return (
    <div className="relative w-full flex justify-center items-center p-4">
      <div style={{ width: progressSize, height: progressSize }}>
        <CircularProgressbar
          value={20}
          text={`${20}%`}
          styles={{
            // Customize the root svg element
            root: {},
            // Customize the path, i.e. the "completed progress"
            path: {
              // Path color
            //   stroke: `rgba(62, 152, 199, ${percentage / 100})`,
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "butt",
              // Customize transition animation
              transition: "stroke-dashoffset 0.5s ease 0s",
              // Rotate the path
              transform: "rotate(0.25turn)",
              transformOrigin: "center center",
            },
            // Customize the circle behind the path, i.e. the "total progress"
            trail: {
              // Trail color
              stroke: "#d6d6d6",
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "butt",
              // Rotate the trail
              transform: "rotate(0.25turn)",
              transformOrigin: "center center",
            },
            // Customize the text
            text: {
              // Text color
              fill: "#f88",
              // Text size
              fontSize: "16px",
            },
            // Customize background - only used when the `background` prop is true
            background: {
              fill: "#3e98c7",
            },
          }}
        />

        {/* Center text: 2/30 */}
        <div
          className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none"
          style={{ fontSize: "clamp(0.8rem, 2.5vw, 1.2rem)" }}
        >
          <span className="mt-18 text-sm font-medium text-primary/50">
            2/30
          </span>
          <p className="mt-1 text-xs text-primary">Progress</p>
        </div>
      </div>
    </div>
  );
}

export default CircularProgress;
