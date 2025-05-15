import { ConcertCard } from "@/components/concert-card"
import { prisma } from "@/lib/prisma"

export default async function ConcertsPage() {
  const concerts = await prisma.concert.findMany({
    orderBy: { date: "asc" },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Todos los conciertos</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {concerts.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} />
        ))}
      </div>
    </div>
  )
}
