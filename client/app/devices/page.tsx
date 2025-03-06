import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DevicesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-6 w-6" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Connect Device</h1>
          <div className="w-6" />
        </header>

        <div className="max-w-md mx-auto">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-slate-500">Device Status</h2>
              <p className="text-lg font-semibold text-slate-700">Disconnected</p>
            </div>

            <Button className="w-full text-lg py-6" asChild>
              <Link href="/devices/device">Connect Device?</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

