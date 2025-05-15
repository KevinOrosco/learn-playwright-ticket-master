import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ConcertCard } from "@/components/concert-card"

export default async function Home() {
  const concerts = await prisma.concert.findMany({
    orderBy: { date: "asc" },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Conciertos Disponibles
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Encuentra los mejores conciertos y asegura tus entradas de forma rápida y segura.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {concerts.map((concert) => (
          <ConcertCard key={concert.id} concert={concert} />
        ))}
      </section>

      <section className="mt-16 rounded-lg bg-muted p-8 text-center">
        <h2 className="mb-4 text-3xl font-bold">¿Buscas algo especial?</h2>
        <p className="mb-6 text-muted-foreground">
          Explora nuestra selección completa de eventos y encuentra el concierto perfecto para ti.
        </p>
        <Button asChild>
          <Link href="/concerts">
            Ver todos los conciertos
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
