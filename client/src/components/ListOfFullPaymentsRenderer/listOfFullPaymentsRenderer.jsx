import React from 'react'
import Avatar from '../Avatar'
//import './ListOfFullPaymentsRenderer.css'
import { useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { getReportsAction } from '../../redux/actions/reportActions'
import { useEffect, useState } from 'react'
import './listOfFullPaymentsRenderer.css'
//lo llamo desde adminPayments
//Sirve para renderizar la lista completa de pagos


const ListOfReportsRenderer = ({arrayOfPayments}) => {
    console.log(arrayOfPayments)

    let reportCounter = 1
    
    let reportsTest = arrayOfPayments?.map((p) => {
       const {_id, paymentId, userId, amount, plan, paymentDate, paymentStatus} = p
       const { email, firstname, lastname} = p.userId
                return(
                    <li className='li-payments  items-center justify-center text-slate-100 bg-[#2E2E2E]  shadow-xl  ' key={Math.random()}>
                                    <div className='li-payments-number justify-center bg-neutral-900 h-full'>{reportCounter++}</div>
                                    <div className='li-payments-fullname justify-center h-full bg-neutral-800'>{firstname + ' ' + lastname}</div>
                                    <div className='li-payments-ids overflow-y-auto p-2 bg-neutral-700'>Payment:{' '}{_id},{' '}Stripe:{' '} {paymentId}</div> 
                                    <div className='li-payments-amount justify-center border-r h-full'>${amount/100}</div> 
                                    <div className='li-payments-plan justify-center'>{plan}</div> 
                                    <div className='li-payments-date justify-center'>{paymentDate.slice(0,16)}</div> 
                                    <div className='li-payments-status justify-center  h-full bg-neutral-700'>{paymentStatus}</div> 
                    </li>
                    
                )
          } 
      )    
  return (
    <>
        <div className='flex-row  max-h-[580px]'>
          <div className='overflow-y-auto max-h-[580px]'>
                <ol className='list-payments__container' >
                {reportsTest}
                </ol>
          </div>
        </div>
     </>
  )
}

export default ListOfReportsRenderer