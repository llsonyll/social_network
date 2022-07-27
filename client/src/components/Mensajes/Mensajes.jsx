import React from 'react'
import './Mensajes.css'

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


  return (
    <div id='coversation__container'>
        {
            messages.length ?
                messages.map((mensajes) => {
                    return(
                        mensajes.from === id 
                        ?  
                        <div id='receptor'>{mensajes.content}</div> 
                        : 
                        <div id='lanzador'>{mensajes.content}</div>
                    )
                })
            : <span>Manda el primer mensajeeee</span>

        }
    </div>
  )
}

export default Mensajes