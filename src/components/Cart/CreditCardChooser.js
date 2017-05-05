import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {
  addCreditCardToOrder,
  removeCreditCard,
  } from '../../redux/reducers/userReducer';
import FormGroup from '../../common/FormGroup';
import CreditCardForm from './CreditCardForm';


const _CreditCardChooser = ({ user, creditCards, addCreditCardToOrder, cart, removeCreditCard })=> {
  let selector;
  return (
    <div className='well'>
      <h3>Credit Cards</h3>
      <CreditCardForm />
      {
        creditCards.length === 0 ? (null) : (
          <div>
            <select ref={ (ref)=> selector = ref } className='form-control'>
              {
                creditCards.map( creditCard => <option value={ creditCard.id } key={ creditCard.id } selected={ cart.creditCardId === creditCard.id}>{ creditCard.brand }</option> )
              }
            </select>
            <button disabled={ creditCards.length === 0} style={ { marginTop: '10px' }} className='btn btn-primary' onClick={ ()=> addCreditCardToOrder(user, cart, { id: selector.value }) }>Use This Credit Card</button> 
            <button disabled={ creditCards.length === 0} style={ { marginTop: '10px' }} className='btn btn-warning' onClick={ ()=> removeCreditCard(user, { id: selector.value }) }>Delete this credit card</button>
          </div>

        )
      }
    </div>
  );
};

export default connect(
  ({ user })=> {
    const cart = user.orders.filter(order => order.state === 'CART');
    return {
      user,
      cart: cart.length ? cart[0] : null,
      creditCards: user.creditCards
    }
  },
  (dispatch)=> {
    return {
      addCreditCard: (user, creditCard, cart)=> dispatch( addCreditCard(user, creditCard, cart)),
      addCreditCardToOrder: (user, cart, creditCard) => dispatch(addCreditCardToOrder(user, cart, creditCard )),
      removeCreditCard: (user, creditCard)=> dispatch(removeCreditCard(user, creditCard))
    };
  }
)(_CreditCardChooser);
