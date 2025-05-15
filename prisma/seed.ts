import { PrismaClient } from '@prisma/client'
import { concerts } from '../lib/data'

const prisma = new PrismaClient()

async function main() {
  for (const concert of concerts) {
    await prisma.concert.upsert({
      where: { id: concert.id },
      update: {},
      create: {
        id: concert.id,
        name: concert.name,
        date: new Date(concert.date),
        time: concert.time,
        location: concert.location,
        description: concert.description,
        price: concert.price,
        availableTickets: concert.availableTickets,
        genre: concert.genre,
        image: concert.image,
      },
    })
  }

  console.log('✅ Conciertos insertados en la base de datos.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
