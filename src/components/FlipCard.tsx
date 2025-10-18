import React, { useState } from "react";
import "./FlipCard.css";

type FlipCardProps = {
  width?: number;           // px
  height?: number;          // px
  rounded?: number;         // px corner radius
  shadow?: boolean;         // drop shadow
  hoverFlip?: boolean;      // flip on hover
  initialFlipped?: boolean; // start flipped
  front: React.ReactNode;
  back: React.ReactNode;
};

export default function FlipCard({
  width = 280,
  height = 180,
  rounded = 12,
  shadow = true,
  hoverFlip = false,
  initialFlipped = false,
  front,
  back,
}: FlipCardProps) {
  const [flipped, setFlipped] = useState(initialFlipped);

  const toggle = () => {
    if (hoverFlip) return;
    setFlipped((f) => !f);
  };

  return (
    <div
      className="flipcard-wrapper"
      style={{ width, height }}
      aria-live="polite"
    >
      <button
        type="button"
        className={`flipcard ${shadow ? "shadow" : ""} ${
          flipped ? "is-flipped" : ""
        } ${hoverFlip ? "hover-flip" : ""}`}
        aria-pressed={flipped}
        aria-label={flipped ? "Show front of card" : "Show back of card"}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        style={{ borderRadius: rounded }}
      >
        <div className="flipcard-face flipcard-front" style={{ borderRadius: rounded }}>
          {front}
        </div>
        <div className="flipcard-face flipcard-back" style={{ borderRadius: rounded }}>
          {back}
        </div>
      </button>
    </div>
  );
}
