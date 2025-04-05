"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate: string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
        <div className="text-4xl font-bold">{timeLeft.days}</div>
        <div className="text-xs uppercase mt-1">ngày</div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
        <div className="text-4xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs uppercase mt-1">giờ</div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
        <div className="text-4xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs uppercase mt-1">phút</div>
      </div>
      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
        <div className="text-4xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs uppercase mt-1">giây</div>
      </div>
    </div>
  )
}

