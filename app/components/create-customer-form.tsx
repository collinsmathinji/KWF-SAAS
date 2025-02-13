"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { createCustomer } from "../actions/create-customer"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Customer"}
    </Button>
  )
}

export default function CreateCustomerForm() {
  const [result, setResult] = useState<{ success?: boolean; message?: string; customerId?: string }>({})

  async function handleSubmit(formData: FormData) {
    const response = await createCustomer(formData)
    setResult(response)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Stripe Customer</CardTitle>
        <CardDescription>Enter customer details to create a new Stripe customer</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="customer@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required placeholder="John Doe" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <SubmitButton />
          {result.message && (
            <div className={`text-sm ${result.success ? "text-green-600" : "text-red-600"}`}>
              {result.message}
              {result.customerId && (
                <div className="mt-2">
                  Customer ID: <code className="bg-gray-100 px-2 py-1 rounded">{result.customerId}</code>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

