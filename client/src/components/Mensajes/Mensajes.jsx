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


const Mensajes = () => {
  return (
    <div id='coversation__container'>
        {
            arrayPrueba.length ?
                arrayPrueba.map((mensajes) => {
                    return(
                        mensajes.id === 'Lanzador' 
                        ?  
                        <div id='lanzador'>{mensajes.content}</div> 
                        : 
                        <div id='receptor'>{mensajes.content}</div>
                    )
                })
            : <span>Man seleciona un cantacto y manda un mensaje</span>

        }
    </div>
  )
}

export default Mensajes