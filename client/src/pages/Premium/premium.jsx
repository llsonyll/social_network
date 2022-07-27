import React from 'react'
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { useDispatch } from 'react-redux';
import { premiumSubscription } from '../../redux/actions/premiumAction';
import { useParams } from 'react-router-dom';


const stripePromise = loadStripe('pk_test_51LPwrkFSz33wG2VoI6sHlcmGHeyhu4qXrPjVocsztg3B23wkij5pXDyU4KPUmTzao3FoXyouZyUb9UuXKUsgQpS500D5FMAlEi');

const CheckoutForm = () => {

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
            dispatch(premiumSubscription(params.id, {id, amount: 2.99}));
            return elements.getElement(CardElement).clear();
        }
    }

    return <form onSubmit={handleSubmit}>
        <CardElement />
        <button>Become Premium</button>
    </form>
}

const Premium = () => {

    return (
        <div>
            <Elements stripe={stripePromise}>
                <CheckoutForm />
            </Elements>
        </div>
    );
};

export default Premium;
