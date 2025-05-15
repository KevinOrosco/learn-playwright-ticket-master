import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Datos recibidos:", body) // <- Agregá esto

    const { concertId, quantity, name, email } = body

    // Validaciones básicas
    if (!concertId || !quantity || !name || !email) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    // Buscar el concierto
    const concert = await prisma.concert.findUnique({
      where: { id: concertId }
    })

    if (!concert) {
      return NextResponse.json({ error: "Concierto no encontrado" }, { status: 404 })
    }

    // Verificar stock
    if (concert.availableTickets < quantity) {
      return NextResponse.json({ error: "No hay suficientes entradas disponibles" }, { status: 400 })
    }

    // Guardar la compra
    const purchase = await prisma.purchase.create({
      data: {
        concertId,
        quantity,
        name,
        email,
      }
    })

    // Actualizar tickets disponibles
    await prisma.concert.update({
      where: { id: concertId },
      data: {
        availableTickets: concert.availableTickets - quantity,
      }
    })

    return NextResponse.json({ message: "Compra registrada correctamente", purchase })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
