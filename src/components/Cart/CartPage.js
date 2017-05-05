import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {
  addCreditCardToOrder,
  addCreditCard,
  removeCreditCard,
  checkout, 
  removeItemFromCart,
  addItemToCart } from '../../redux/reducers/userReducer';

const FormGroup = ({ value, name, component, placeholder } ) => {
  const onChange = (ev) => {
    let change = {};
    change[ev.target.name] = ev.target.value;
    component.setState(change);
  }
  return (
    <div className='form-group'>
      <input className='form-control' placeholder={ placeholder} onChange={ onChange } name={name} value={ value } />
    </div>
  );
}

class CreditCardForm extends Component{
  constructor(){
    super();
    this.state = { brand: '', number: '' };
    this.onSave = this.onSave.bind(this);
  }
  onSave(ev){
    this.props.addCreditCard(this.state)
      .then(()=> this.setState({ brand: '', number: '' }));
  }
  render(){
    const { brand, number } = this.state;
    return (
      <div className='well'>
        <FormGroup state={ this.state } name='brand' value={ brand } placeholder='enter brand' component={ this }/>
        <FormGroup state={ this.state } name='number' value={ number } placeholder='enter number' component={ this }/>
        <div className='form-group'>
          <button onClick={ this.onSave } className='btn btn-primary' disabled={ !brand || !number }>Save</button>
        </div>
      </div>
    );
  }
}

const CreditCardChooser = ({ creditCards, addCreditCard, addCreditCardToOrder, cart, removeCreditCard })=> {
  const click = ()=> {
    addCreditCardToOrder({ id: selector.value });
  }
  let selector;
  return (
    <div className='well'>
      <h3>Credit Cards</h3>
      <CreditCardForm addCreditCard={ addCreditCard }/>
      {
        creditCards.length === 0 ? (null) : (
          <div>
            <select ref={ (ref)=> selector = ref } className='form-control' defaultValue={ cart.creditCardId}>
              {
                creditCards.map( creditCard => <option value={ creditCard.id } key={ creditCard.id }>{ creditCard.brand }</option> )
              }
            </select>
            <button disabled={ creditCards.length === 0} style={ { marginTop: '10px' }} className='btn btn-primary' onClick={ ()=> addCreditCardToOrder({ id: selector.value }) }>Use This Credit Card</button> 
            <button disabled={ creditCards.length === 0} style={ { marginTop: '10px' }} className='btn btn-warning' onClick={ ()=> removeCreditCard({ id: selector.value }) }>Delete this credit card</button>
          </div>

        )
      }
    </div>
  );
};

const CartPage = ({ cart, removeItemFromCart, user, addItemToCart, checkout, creditCards, addCreditCard,  addCreditCardToOrder, removeCreditCard })=> {
  if(!cart){
    return null;
  }

  return (
    <div>
      <CreditCardChooser
        creditCards={ creditCards }
        addCreditCard={ (creditCard)=> addCreditCard(user, creditCard)}
        removeCreditCard={ (creditCard)=> removeCreditCard(user, creditCard)}
        addCreditCardToOrder={ (creditCard)=> addCreditCardToOrder(user, cart, creditCard )}
        cart={ cart }
      />
      { cart.creditCardId }
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
              <li key={ lineItem.id } className='list-group-item'>
                { lineItem.product.name }
                <span
                  onClick={()=> addItemToCart(user, cart, lineItem.product) }
                  style={ { marginLeft: '10px' } }
                  className='label label-default'>
                    { lineItem.quantity }
                </span>
                <button className='btn btn-warning pull-right' onClick={ ()=> removeItemFromCart(user, cart, lineItem)}>x</button>
                <br style={ { clear: 'both' }} />
              </li>
            )
          })
        }
      </ul>
      {
        cart.lineItems.length ? (
          <button onClick={ ()=> checkout(user, cart)} className='btn btn-primary'>
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
    removeItemFromCart: (user, cart, lineItem)=> {
      return dispatch(removeItemFromCart(user, cart, lineItem));
    },
    addItemToCart: ( user, cart, product )=> dispatch(addItemToCart( user, cart, product)),
    addCreditCard: ( user, creditCard )=> dispatch(addCreditCard( user, creditCard)),
    removeCreditCard: ( user, creditCard )=> dispatch(removeCreditCard( user, creditCard)),
    addCreditCardToOrder: ( user, cart, creditCard )=> dispatch(addCreditCardToOrder( user, cart, creditCard))
  }
);

const mapStateToProps = ({ user })=> {
  const orders = user.orders;
  const creditCards = user.creditCards;
  const cart = orders.filter(order => order.state === 'CART');
  return {
    cart: cart ? cart[0] : null,
    user,
    creditCards
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
