import React from 'react'
import { useState } from 'react'
import './Premium.css'
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useDispatch } from 'react-redux';
import { premiumSubscription } from '../../redux/actions/premiumAction';
import { useParams } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51LPwrkFSz33wG2VoI6sHlcmGHeyhu4qXrPjVocsztg3B23wkij5pXDyU4KPUmTzao3FoXyouZyUb9UuXKUsgQpS500D5FMAlEi');

const CheckoutForm = ({amount, plan}) => {

    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const params = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })

        if (!error) {
            console.log(paymentMethod)
            const { id } = paymentMethod;
            dispatch(premiumSubscription(params.id, {id, amount: amount, plan: plan}));
            return elements.getElement(CardElement).clear();
        }
    }

    return( 
    <form className='card_payment' onSubmit={handleSubmit}>
        <CardElement />
        <button type='button'>Become Premium</button>
    </form>
    )
}


const Premium = () => {

    const [planPay, setplanPay] = useState('Weekly')
    

  return (
    <div>
        <div className='premium_container'>
        <div className='payments_container'>
            <div className="plan">
                <h1>3$</h1>
                <span>Weekly</span>
                <button type='button' onClick={() => setplanPay('Weekly')}>Get</button>
            </div>
            <div className="plan">
                <h1>10$</h1>
                <span>Monthly</span>
                <button type='button' onClick={() => setplanPay('Monthly')}>Get</button>
            </div>
            <div className="plan">
                <h1>31$</h1>
                <span>Annual</span>
                <button type='button'  onClick={() => setplanPay('Annual')}>Get</button>
            </div>
        </div>
        <div className='pay_container'>
           {
            planPay === 'Weekly' ? 
            <div className='plan-escogido'>
                <h1>3$</h1>
                <p>
                *Cover photo
                *See dislikes
                *Private profile
                *Exclusive profile
                </p>
                <Elements stripe={stripePromise}>
                    <CheckoutForm amount={3} plan={'weekly'}/>
                </Elements>
            </div>
            : null 
           }
           {
            planPay === 'Monthly' ? 
            <div className='plan-escogido'>
                <h1>10$</h1>
                <p>
                *Cover photo
                *See dislikes
                *Private profile
                *Exclusive profile
                </p>
                <Elements stripe={stripePromise}>
                    <CheckoutForm amount={10} plan={'monthly'}/>
                </Elements>
            </div>
            : null 
           }
           {
            planPay === 'Annual' ? 
            <div className='plan-escogido'>
                 <h1>31$</h1>
                 <p>
                 *Cover photo
                 *See dislikes
                 *Private profile
                 *Exclusive profile
                 </p>
                 <Elements stripe={stripePromise}>
                    <CheckoutForm amount={31} plan={'yearly'}/>
                </Elements>
            </div>
            : null 
           }
        </div>
        </div>
    </div>
  )
}

export default Premium