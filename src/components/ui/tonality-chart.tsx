import React from "react"

interface Props {
  positive: number
  negative: number
  neutral: number
}

const TonalityChart: React.FC<Props> = ({ positive, negative, neutral }) => {
  const total = positive + neutral + negative

  const positivePercent = (positive * 100) / total
  const neutralPercent = (neutral * 100) / total
  const negativePercent = (negative * 100) / total
  return (
    <div className="flex w-20 items-center gap-x-0.5">
      <div
        className={`${total === 0 ? "bg-gray-300" : "bg-primeGreen"} positive h-0.5`}
      />
      <div
        className={`${total === 0 ? "bg-gray-300" : "bg-blue-500"} neutral h-0.5`}
      />
      <div
        className={`${total === 0 ? "bg-gray-300" : "bg-red-500"} negative h-0.5`}
      />
      <style jsx>
        {`
          .positive {
            width: ${total === 0 ? "33.3" : positivePercent}%;
          }

          .neutral {
            width: ${total === 0 ? "33.3" : neutralPercent}%;
          }

          .negative {
            width: ${total === 0 ? "33.3" : negativePercent}%;
          }
        `}
      </style>
    </div>
  )
}

export { TonalityChart }
