import React from 'react'
import Avatar from '../Avatar'
import './ListOfFullPaymentsRenderer.css'
import { useDispatch, useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import { getReportsAction } from '../../redux/actions/reportActions'
import { useEffect, useState } from 'react'

//lo llamo desde adminPayments
//Sirve para renderizar la lista completa de pagos


const ListOfReportsRenderer = ({arrayOfPayments}) => {
    console.log(arrayOfPayments)

    let reportCounter = 1
    
    let reportsTest = arrayOfPayments?.map((p) => {
       const {_id, paymentId, userId, amount, plan, paymentDate, paymentStatus} = p
       const { email, firstname, lastname} = p.userId
                return(
                    <li className='flex items-center justify-center text-slate-100 bg-[#2E2E2E]  shadow-xl rounded-lg mb-2' key={Math.random()}>
                                    <div className='w-10 ml-2'>{reportCounter++}</div>
                                    <div className='w-32'>{firstname + ' ' + lastname}</div>
                                    <div className='w-36 ml-4 text-xs mt-2 mb-2'>Payment:{' '}{_id},{' '}Stripe:{' '} {paymentId}</div> 
                                    <div className='w-20 ml-16'>${amount/100}</div> 
                                    <div className='w-16 ml-10'>{plan}</div> 
                                    <div className='w-50 ml-8 mr-16'>{paymentDate.slice(0,16)}</div> 
                                    <div className='w-20 ml-8'>{paymentStatus}</div> 
                    </li>
                    
                )
          } 
      )    
  return (
    <>
        <div className='flex-row  max-h-[580px]'>
          <div className='overflow-y-auto max-h-[580px]'>
                <ol >
                {reportsTest}
                </ol>
          </div>
        </div>
     </>
  )
}

export default ListOfReportsRenderer