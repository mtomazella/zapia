'use client'
import { ReactPortal, useEffect, useState } from 'react'

export default function OwlbearGate({ children }: ReactPortal) {
  useEffect(() => {
    console.log('🔍 [OWLBEAR_GATE] useEffect triggered')

    const handleMessage = (event: MessageEvent) => {
      console.log(event)
      window.removeEventListener('message', handleMessage)

      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          console.log('Attempting to resend the message')
          window.dispatchEvent(event)
        }, 500 + i * 1000)
      }
    }

    // Add message listener
    window.addEventListener('message', handleMessage)
    console.log('🔧 [DEBUG] Message listeners added')

    import('@owlbear-rodeo/sdk')
      .then(obrModule => {
  }, []) 
}
