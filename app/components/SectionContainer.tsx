import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    //app/components/SectionContainer.tsx 
    <section className="max-w-screen w-full px-4 sm:px-6 xl:px-0 ">
      {children}
    </section>

  )
}
