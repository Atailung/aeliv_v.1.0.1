import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import React from "react";

function CircularProgress({
  percentage,
  current,
  total,
}: {
  percentage: number;
  current: number;
  total: number;
}) {
  // Responsive size: min 10rem, max 16rem, scales with viewport
  const progressSize = "clamp(10rem, 20vw, 12rem)";

  return (
    <div className="relative w-full flex justify-center items-center p-0 bg-linear-to-br from-background to-muted/20 rounded-full shadow-sm">
      <div style={{ width: progressSize, height: progressSize }}>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={{
            // Customize the root svg element
            root: {},
            // Customize the path, i.e. the "completed progress"
            path: {
              // Path color based on percentage
              stroke:
                percentage >= 80
                  ? "#10b981"
                  : percentage >= 50
                  ? "#f59e0b"
                  : "#ef4444",
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "round",
              // Customize transition animation
              transition: "stroke-dashoffset 0.5s ease 0s",
              // Rotate the path
              transform: "rotate(0.25turn)",
              transformOrigin: "center center",
              strokeWidth: 8,
            },
            // Customize the circle behind the path, i.e. the "total progress"
            trail: {
              // Trail color
              stroke: "#e5e7eb",
              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
              strokeLinecap: "round",
              // Rotate the trail
              transform: "rotate(0.25turn)",
              transformOrigin: "center center",
              strokeWidth: 4,
            },
            // Customize the text
            text: {
              // Text color
              fill:
                percentage >= 80
                  ? "#10b981"
                  : percentage >= 50
                  ? "#f59e0b"
                  : "#ef4444",
              // Text size
              fontSize: "18px",
              fontWeight: "bold",
            },
            // Customize background - only used when the `background` prop is true
            background: {
              fill: "#f3f4f6",
            },
          }}
        />

        {/* Center text: current/total */}
        <div
          className="absolute mt-18 inset-0 flex flex-col justify-center items-center pointer-events-none"
          style={{ fontSize: "clamp(0.8rem, 2.5vw, 1.2rem)" }}
        >
          <span className="text-sm font-medium text-muted-foreground mb-1">
            {current}/{total}
          </span>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>
    </div>
  );
}

export default CircularProgress;
