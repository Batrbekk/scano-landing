import React from "react"

export interface Props {
  title: string
}

const SectionTitle: React.FC<Props> = ({ title }) => {
  return (
    <div className="text-md w-fit rounded-2xl bg-green-50 px-8 py-4 font-bold text-green-500 lg:text-lg">
      {title}
    </div>
  )
}

export { SectionTitle }
