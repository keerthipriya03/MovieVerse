import React, { useEffect, useState } from "react";

function Toast({ message, duration = 3000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      {message}
    </div>
  );
}

export default Toast;