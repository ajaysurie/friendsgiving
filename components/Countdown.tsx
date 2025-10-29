"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const targetDate = new Date("2025-11-16T14:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  const isPast = new Date().getTime() > targetDate;

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 border-thanksgiving-orange/20">
      <div className="text-center mb-6">
        <h3 className="font-heading text-2xl font-bold text-thanksgiving-red mb-2">
          {isPast ? "Friendsgiving has passed!" : "Countdown to Friendsgiving"}
        </h3>
        <p className="text-thanksgiving-orange font-semibold text-lg">
          November 16, 2025 at 2:00 PM
        </p>
      </div>

      {!isPast && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-gradient-to-br from-thanksgiving-orange to-thanksgiving-pumpkin rounded-2xl p-4 text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {item.value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs md:text-sm text-white/90 font-semibold uppercase tracking-wide">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
