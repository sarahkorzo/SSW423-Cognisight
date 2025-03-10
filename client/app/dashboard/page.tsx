import type React from "react"
import Link from "next/link"
import { Brain, Database, Activity, UserCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header - No back button since this is the main dashboard */}
        <header className="flex items-center justify-between mb-12">
          <div className="w-6" />
          <h1 className="text-3xl font-bold text-slate-800">Cognisight</h1>
          <div className="w-6" />
        </header>

        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 mb-4">AI-Powered Concussion Detection</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Enhancing athletic safety through real-time, objective concussion detection data for athletic trainers.
          </p>
        </section>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <NavigationCard href="/devices" icon={Brain} title="Your Devices" />
          <NavigationCard href="/players" icon={Database} title="Player Database" />
          <NavigationCard href="/testing/start" icon={Activity} title="Testing" />
          <NavigationCard href="/profile" icon={UserCircle} title="AT Profile" />
        </div>
      </div>
    </div>
  )
}

function NavigationCard({
  href,
  icon: Icon,
  title,
}: {
  href: string
  icon: React.ElementType
  title: string
}) {
  return (
    <Card className="group relative overflow-hidden">
      <Link
        href={href}
        className="flex flex-col items-center justify-center p-6 h-full transition-colors hover:bg-slate-100"
      >
        <Icon className="h-8 w-8 mb-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
        <h3 className="text-lg font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{title}</h3>
      </Link>
    </Card>
  )
}

