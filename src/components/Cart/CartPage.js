import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { checkout } from '../../redux/reducers/userReducer';

import CreditCardChooser from './CreditCardChooser';
import LineItem from './LineItem';

const CartPage = ({ cart, removeItemFromCart, user, addItemToCart, checkout})=> {
  if(!cart){
    return null;
  }

  return (
    <div>
      <CreditCardChooser />
      {
        cart.creditCard ? (
          <div className='alert alert-success'>
            Your { cart.creditCard.brand } Card will be used for this order.
          </div>
        ): (null)
      }
      <ul className='list-group'>
        {
          cart.lineItems.length === 0 ? (
            <li className='list-group-item list-group-item-warning'>
              Put some items in cart...
            </li>
          ) : ( null )
        }
        {
          cart.lineItems.map( lineItem => {
            return (
              <LineItem key={ lineItem.id } lineItem={ lineItem }/>
            )
          })
        }
      </ul>
      {
        cart.lineItems.length ? (
          <button disabled={ !cart.creditCardId } onClick={ ()=> checkout(user, cart)} className='btn btn-primary'>
            Checkout
          </button>
        ) : (null) 
      }
    </div>
 );
};

const mapDispatchToProps = (dispatch)=> (
  {
    checkout: (user, cart)=> {
      return dispatch(checkout(user, cart))
        .then(()=> hashHistory.push('orders'))
    },
  }
);

const mapStateToProps = ({ user })=> {
  const orders = user.orders;
  const cart = orders.filter(order => order.state === 'CART');
  return {
    cart: cart ? cart[0] : null,
    user,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
