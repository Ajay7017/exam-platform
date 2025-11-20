// app/(student)/exams/[slug]/components/PurchaseButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Add Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

interface PurchaseButtonProps {
  examId: string
  examTitle: string
  price: number
  isFree: boolean
  isPurchased: boolean
}

export default function PurchaseButton({
  examId,
  examTitle,
  price,
  isFree,
  isPurchased
}: PurchaseButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)

    try {
      // 1. Create order
      const orderResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId,
          type: 'single_exam'
        })
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        alert(orderData.error || 'Failed to create order')
        setLoading(false)
        return
      }

      // Handle free exam
      if (orderData.isFree) {
        alert('Successfully enrolled in free exam!')
        router.refresh()
        return
      }

      // 2. Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Exam Platform',
        description: orderData.examTitle,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 3. Verify payment
          try {
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                purchaseId: orderData.purchaseId
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              alert('Payment successful! You can now start the exam.')
              router.refresh()
            } else {
              alert(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Verification error:', error)
            alert('Payment verification failed. Please contact support.')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Purchase error:', error)
      alert('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  if (isPurchased) {
    return (
      <button
        onClick={() => router.push(`/exam/${examId}`)}
        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
      >
        Start Exam
      </button>
    )
  }

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Processing...' : isFree ? 'Enroll Free' : `Buy Now - ₹${price / 100}`}
    </button>
  )
}