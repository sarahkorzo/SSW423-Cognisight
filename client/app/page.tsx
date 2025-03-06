import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Cognisight</h1>
          <p className="text-slate-600">AI-Powered Concussion Detection for Athletic Trainers</p>
        </div>

        <div className="space-y-4">
          <Button className="w-full py-6" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button variant="outline" className="w-full py-6" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        <p className="text-center text-sm text-slate-500">
          Enhancing athletic safety through real-time, objective concussion detection data
        </p>
      </Card>
    </div>
  )
}

