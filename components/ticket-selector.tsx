"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Concert } from "@prisma/client"

interface TicketSelectorProps {
  concert: Concert
}

export function TicketSelector({ concert }: TicketSelectorProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < concert.availableTickets) {
      setQuantity(quantity + 1)
    } else {
      toast({
        title: "No hay suficientes entradas disponibles",
        description: `Solo quedan ${concert.availableTickets} entradas para este concierto.`,
        variant: "destructive",
      })
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value) || value < 1) {
      setQuantity(1)
    } else if (value > concert.availableTickets) {
      setQuantity(concert.availableTickets)
      toast({
        title: "No hay suficientes entradas disponibles",
        description: `Solo quedan ${concert.availableTickets} entradas para este concierto.`,
        variant: "destructive",
      })
    } else {
      setQuantity(value)
    }
  }

  const handleCheckout = async () => {
    if (quantity > concert.availableTickets) {
      toast({
        title: "No hay suficientes entradas disponibles",
        description: `Solo quedan ${concert.availableTickets} entradas para este concierto.`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // En un entorno real, aquí verificaríamos la disponibilidad en tiempo real
      // antes de proceder al checkout
      router.push(`/checkout?concertId=${concert.id}&quantity=${quantity}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al procesar tu solicitud.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalPrice = concert.price * quantity

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          max={concert.availableTickets}
          value={quantity}
          onChange={handleQuantityChange}
          className="mx-2 w-16 text-center"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={increaseQuantity}
          disabled={quantity >= concert.availableTickets}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between font-bold">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <Button className="w-full" onClick={handleCheckout} disabled={isLoading || concert.availableTickets === 0}>
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? "Procesando..." : "Comprar entradas"}
      </Button>

      {concert.availableTickets === 0 && (
        <p className="text-center text-sm text-destructive">
          Lo sentimos, no hay entradas disponibles para este concierto.
        </p>
      )}
    </div>
  )
}
