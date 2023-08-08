import React from 'react'
import CardItem from './CardItem';
import './Cards.css'

function Cards() {
  return (
    <>
        <div className='cards'>
            <h1>Check out these Epic Destinations!</h1>
            <div className='cards__container'>
                <div className='cards__wrapper'>
                    <ul className='cards__items'>
                        <CardItem
                            src='images/img-2.jpg'
                            text='Create your game based chat group features like voice chatting and high performance'
                            label='Game'
                            path= '/services'
                        />
                        <CardItem
                            src='images/img-1.jpg'
                            text='Create your business based chat group features like video chatting '
                            label='Business'
                            path= '/services'
                        />
                        <CardItem
                            src='images/img-1.jpg'
                            text='Create your Regular Chat group only contains Chatting.'
                            label='Basic Chat group'
                            path= '/services'
                        />

                    </ul>
                </div>
            </div>
        </div>
    </>
  )
}

export default Cards;
