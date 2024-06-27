import React from "react"

interface PageTitleProps {
  title: string
  text: string
}

const PageTitle: React.FC<PageTitleProps> = ({ title, text }) => {
  return (
    <div
      data-aos="fade-up"
      className="flex w-full flex-col items-center gap-y-4"
    >
      <h2 className="text-4xl font-bold text-[#242331] lg:text-5xl">{title}</h2>
      <p className="text-md w-full text-center text-[#797979] lg:w-[55%] lg:text-lg">
        {text}
      </p>
    </div>
  )
}

export { PageTitle }
