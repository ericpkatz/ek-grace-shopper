import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { checkout, removeItemFromCart, addItemToCart } from '../../redux/reducers/ordersReducer';
import { addCreditCard, addAddress } from '../../redux/reducers/userReducer.js';

const Form = ({ name, onChange, error, save, text, formName } )=> {
  return (
    <form className='well'>
      {
        error ? (
          <div className='alert alert-warning'>Error</div>
        ): (null)
      }
      <div className='form-group'>
        <input value={ name } placeholder={text} className='form-control' name={ formName} onChange={ onChange }/>
      </div>
      <button className='btn btn-primary' onClick={ save } disabled={ !name }>Save</button>
    </form>
  );
};


class CheckoutPage extends Component{
  constructor(props){
    super();
    this.state = { creditCardName: '', addressName: '', creditCardId: props.creditCardId, addressId: props.addressId};
    this.onChange = this.onChange.bind(this);
  }
  onChange(ev){
    let change = {};
    change[ev.target.name] = ev.target.value;
    this.setState(change);
  }
  render(){
    const { cart, removeItemFromCart, user, addItemToCart, checkout, goToCheckout, creditCards, addresses } = this.props;
    if(!cart){
      return null;
    }
    const { creditCardName, error, addressName, creditCardId, addressId } = this.state;
    const addCreditCard = (ev)=> {
      ev.preventDefault();
      this.props.addCreditCard(user, { name: creditCardName })
        .then(()=> this.setState({ creditCardName: '', error: null }))
        .catch((ex)=> { this.setState( { error: ex })});
    }
    const addAddress = (ev)=> {
      ev.preventDefault();
      this.props.addAddress(user, { name: addressName })
        .then(()=> this.setState({ addressName: '', error: null }))
        .catch((ex)=> { this.setState( { error: ex })});
    }
  return (
    <div>
      <Form error={error} save={ addCreditCard } text='add credit card' name={ creditCardName } onChange={ this.onChange } formName='creditCardName'></Form>
      <Form error={error} save={ addAddress } text='add address' name={ addressName } onChange={ this.onChange } formName='addressName'></Form>
      <div className='well'>
      { this.state.creditCardId }
        <select className='form-control' value={ creditCardId } onChange={(ev)=> this.setState({ creditCardId: ev.target.value })}>
        {
          creditCards.map( creditCard => <option value={ creditCard.id }> { creditCard.name }</option>)
        }
        </select>
      </div>
      <div className='well'>
        <select className='form-control' value={ addressId } onChange={(ev)=> this.setState( addressId: ev.target.value )}>
        {
          addresses.map( address => <option value={ address.id }> { address.name }</option>)
        }
        </select>
      </div>
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
        cart.lineItems.length && addressId && creditCardId ? (
          <button onClick={ ()=> checkout(user, cart)} className='btn btn-primary'>
            Checkout
          </button>
        ) : (null) 
      }
    </div>
    );
  }
}

const mapDispatchToProps = (dispatch)=> (
  {
    addCreditCard: (user, creditCard)=> {
      return dispatch(addCreditCard(user, creditCard))
    },
    addAddress: (user, address)=> {
      return dispatch(addAddress(user, address))
    },
    goToCheckout: ()=> {
      hashHistory.push('/checkout');
    },
    checkout: (user, cart)=> {
      return dispatch(checkout(user, cart));
    },
    removeItemFromCart: (user, cart, lineItem)=> {
      return dispatch(removeItemFromCart(user, cart, lineItem));
    },
    addItemToCart: ( user, cart, product )=> dispatch(addItemToCart( user, cart, product))
  }
);

const mapStateToProps = ({ orders, user })=> {
  const cart = orders.filter(order => order.state === 'CART');
  return {
    cart: cart ? cart[0] : null,
    user,
    addresses: user ? user.addresses: [],
    creditCards: user ? user.creditCards: [],
    creditCardId: user && user.creditCards && user.creditCards[0] ? user.creditCards[0].id : null,
    addressId: user && user.addresses && user.addresses[0] ? user.addresses[0].id : null 
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage);
