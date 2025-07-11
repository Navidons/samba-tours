import LoadingSpinner from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <LoadingSpinner />
    </div>
  )
}
