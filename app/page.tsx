import { TimeZoneFinder } from "@/components/time-zone-finder"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Time Match</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Find the perfect time to connect with friends, family, or colleagues across different time zones
          </p>
        </header>

        <TimeZoneFinder />
      </div>
    </main>
  )
}
