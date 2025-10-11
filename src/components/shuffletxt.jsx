import React, { useEffect, useRef } from "react";
import "./shuffletxt.css";

const MovieverseShuffleNoGSAP = ({ text = "Movieverse" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const letters = containerRef.current.querySelectorAll(".letter");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    letters.forEach((letter, i) => {
      let count = 0;
      const maxCount = 8; // How many scrambles
      const interval = setInterval(() => {
        letter.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
        count++;
        if (count > maxCount) {
          letter.textContent = text[i];
          clearInterval(interval);
        }
      }, 50 + i * 10); // stagger effect
    });
  }, [text]);

  return (
    <h1 ref={containerRef} className="movieverse-title">
      {text.split("").map((char, idx) => (
        <span key={idx} className="letter">
          {char}
        </span>
      ))}
    </h1>
  );
};

export default MovieverseShuffleNoGSAP;
