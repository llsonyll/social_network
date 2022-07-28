import React from 'react'
import { useState } from 'react'
import './Premium.css'


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
                
            </div>
            : null 
           }
           {
            planPay === 'Monthly' ? 
            <div className='plan-escogido'>
                <h1>10$</h1>
                
            </div>
            : null 
           }
           {
            planPay === 'Annual' ? 
            <div className='plan-escogido'>
                 <h1>31$</h1>
            </div>
            : null 
           }
        </div>
        </div>
    </div>
  )
}

export default Premium