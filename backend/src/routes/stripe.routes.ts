import { Router, Request, Response } from "express";
import Stripe from 'stripe'
import db from '../lib/db'
import express from 'express'

export const stripeRouter = Router()

stripeRouter.post('/create-checkout-session', async (req: Request, res: Response) => {
   try {
        const userId = req.user?.id
        if(!userId) {
          res.status(401).json({msg: 'Not authorized'})
          return
      } 
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {apiVersion: '2024-12-18.acacia'})
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: 'pro'
                    },
                    unit_amount: 100 * 20
                }, 
                quantity: 1
            }
        ],
        customer_creation: 'always',
        mode: 'payment',
        success_url: `${process.env.CLIENT_BASE_URL}/editor`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/`,
        client_reference_id: userId.toString(),
    })

    res.status(200).json({sessionUrl: session.url})
    // res.redirect(session.url!)
   } catch(err) {
    console.error(err) 
    res.status(500).json({msg: 'Internal server error'})
   }
})

stripeRouter.post('/webhook', express.raw({type: 'application/json'}) ,async (req: Request, res: Response) => {
    try {
        const body = req.body 
        const signature = req.headers['stripe-signature'] as string
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {apiVersion: '2024-12-18.acacia'})
        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)
         } catch(err) {
            res.status(500).json({msg: 'Internal signature'})
            return
         }
     
         const session = event.data.object as Stripe.Checkout.Session

         if(event.type === 'checkout.session.completed') {
            const userId = Number(session.client_reference_id)

            await db.user.update({where: { id: userId}, data: { isPro: true}})

            res.status(200).json({msg: 'Payment successfull'})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({msg: 'Internal server error'})
    }
})
