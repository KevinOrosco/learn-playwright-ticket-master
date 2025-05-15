"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentForm } from "@/components/payment-form"
import { useToast } from "@/hooks/use-toast"
import { concerts } from "@/lib/data"
import { formatDate } from "@/lib/utils"
import type { Concert } from "@/lib/types"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [concert, setConcert] = useState<Concert | null>(null)
  const [quantity, setQuantity] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const concertId = searchParams.get("concertId")
    const quantityParam = searchParams.get("quantity")

    if (!concertId || !quantityParam) {
      setError("Información de compra incompleta")
      setIsLoading(false)
      return
    }

    const selectedConcert = concerts.find((c) => c.id === concertId)
    const parsedQuantity = Number.parseInt(quantityParam)

    if (!selectedConcert) {
      setError("Concierto no encontrado")
      setIsLoading(false)
      return
    }

    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      setError("Cantidad de entradas inválida")
      setIsLoading(false)
      return
    }

    if (parsedQuantity > selectedConcert.availableTickets) {
      setError("No hay suficientes entradas disponibles")
      setIsLoading(false)
      return
    }

    setConcert(selectedConcert)
    setQuantity(parsedQuantity)
    setIsLoading(false)
  }, [searchParams])

  const handlePaymentSubmit = async (paymentData: any) => {
  if (!concert) return

  setIsLoading(true)

  try {
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        concertId: concert.id,
        quantity,
        name: paymentData.name,  // Debe venir de tu formulario
        email: paymentData.email,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Error en la compra")
    }

    router.push(`/confirmation?concertId=${concert.id}&quantity=${quantity}`)
  } catch (error) {
    toast({
      title: "Error en el pago",
      description: (error as Error).message,
      variant: "destructive",
    })
    setIsLoading(false)
  }
}



  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Cargando información de compra...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-destructive">{error}</h1>
          <p className="mb-6 text-muted-foreground">No podemos procesar tu compra en este momento.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  if (!concert) return null

  const totalPrice = concert.price * quantity

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" className="mb-6" onClick={() => router.push(`/concerts/${concert.id}`)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al concierto
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen de compra</CardTitle>
              <CardDescription>Detalles de tu pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{concert.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(concert.date)} - {concert.time}
                </p>
                <p className="text-sm text-muted-foreground">{concert.location}</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Precio por entrada:</span>
                  <span>${concert.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cantidad:</span>
                  <span>{quantity}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Información de pago</CardTitle>
              <CardDescription>Ingresa los datos de tu tarjeta</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm onSubmit={handlePaymentSubmit} isLoading={isLoading} />
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CreditCard className="mr-2 h-4 w-4" />
                Pago seguro con cifrado SSL
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
