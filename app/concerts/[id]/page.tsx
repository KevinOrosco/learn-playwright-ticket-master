import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, MapPin, Music, Users } from "lucide-react"

import { TicketSelector } from "@/components/ticket-selector"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

interface ConcertPageProps {
  params: {
    id: string
  }
}

export default async function ConcertPage({ params }: ConcertPageProps) {
  // params es async en Next.js App Router, pero ya está desestructurado aquí
  const concert = await prisma.concert.findUnique({
    where: { id: params.id },  // id es string, usar directo
  })

  if (!concert) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={concert.image || "/placeholder.svg"}
            alt={concert.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="mb-4 text-3xl font-bold">{concert.name}</h1>

          <div className="mb-6 space-y-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{formatDate(concert.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{concert.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{concert.location}</span>
            </div>
            <div className="flex items-center">
              <Music className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>{concert.genre}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>Disponibles: {concert.availableTickets} entradas</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-xl font-semibold">Descripción</h2>
            <p className="text-muted-foreground">{concert.description}</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="mb-4 text-xl font-semibold">Comprar Entradas</h2>
            <div className="mb-2 flex items-center justify-between">
              <span>Precio por entrada:</span>
              <span className="font-bold">${concert.price.toFixed(2)}</span>
            </div>
            <TicketSelector concert={concert} />
          </div>
        </div>
      </div>
    </div>
  )
}
