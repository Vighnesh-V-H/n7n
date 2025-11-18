import { createFileRoute } from '@tanstack/react-router'
import Navbar from '@/components/header-landing'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Navbar />
    </div>
  )
}
