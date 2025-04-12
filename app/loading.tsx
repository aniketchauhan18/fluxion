import { LoaderCircle } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderCircle className="animate-spin text-neutral-500" size={48} />
    </div>
  )
}