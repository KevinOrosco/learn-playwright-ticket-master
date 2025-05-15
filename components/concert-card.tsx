import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import type { Concert } from "@prisma/client"


interface ConcertCardProps {
  concert: Concert
}

export function ConcertCard({ concert }: ConcertCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={concert.image || "/placeholder.svg"} alt={concert.name} fill className="object-cover" priority />
      </div>
      <CardHeader>
        <h3 className="text-xl font-bold">{concert.name}</h3>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          {formatDate(concert.date)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          {concert.location}
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">{concert.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="font-bold">${concert.price.toFixed(2)}</div>
        <Button asChild>
          <Link href={`/concerts/${concert.id}`}>Ver detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
