"use client";

import { useEffect, useState } from "react";

interface Props {
  target: string;
  label: string;
}

export default function ContestCountdown({ target, label }: Props) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    function update() {
      setRemaining(Math.max(0, new Date(target).getTime() - Date.now()));
    }

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div>
      <div className="text-xs text-fg-muted">{label}</div>
      <div className="font-mono text-2xl font-bold">{pad(hours)}:{pad(minutes)}:{pad(seconds)}</div>
    </div>
  );
}
