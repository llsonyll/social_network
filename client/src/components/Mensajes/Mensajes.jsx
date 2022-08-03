import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import './Mensajes.css'
import {MdKeyboardArrowDown} from 'react-icons/md'

const arrayPrueba = [
    {
        content:'jaja hola',
        id:'Lanzador'
    },
    {
        content :' Hola como estas',
        id:'Receptor'
    },
    {
        content: 'Estoy muy bien mucho gusto jaja',
        id: 'Lanzador'
    },
    {
        content: 'B===D',
        id: 'Receptor'
    },
    {
        content: ':3',
        id: 'Lanzador'
    }
]


 const Mensajes = (props) => {
    
    let {id, messages} = props
    
    
    let messRef = useRef(null)
    useEffect(() => {
        if (messRef  !== null && messages.length > 0) {
            messRef.current.scrollIntoView({ block: 'end', behavior: 'smooth', inline: "nearest" });
        }
        
    }, [messages])
    
    console.log(messRef);

  return (
    <div id='coversation__container'>
        {
            messages.length ?
                messages.map((mensajes) => {
                    return(
                        mensajes.from === id 
                        ?  
                        <div id='receptor' ref={messRef}>{mensajes.content}</div>
                        
                        : 
                        <div id='lanzador' ref={messRef}>{mensajes.content}</div>
                    )
                })
            : <span className='no_mensajes'>There are no messages, send the first message   <span className='arrow_chat'><MdKeyboardArrowDown/></span></span>

        }
    </div>
  )
}
export default Mensajes