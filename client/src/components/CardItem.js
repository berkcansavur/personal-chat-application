import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

function CardItem(props) {
  const { src, label, path, chatGroupName, onSelectChatGroup } = props;
  return (
    <>
      <li className='cards__item'>
        <Link className='cards__item__link' to={path} >
          <figure className='cards__item__pic-wrap' data-category={label} >
            <img className='cards__item__img' alt='Travel Image' src={src} />
          </figure>
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{chatGroupName}</h5>
            <Button 
            toOperation='create-defined-chat-group'
            buttonStyle='btn--outline__home'>
              Create
            </Button>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;