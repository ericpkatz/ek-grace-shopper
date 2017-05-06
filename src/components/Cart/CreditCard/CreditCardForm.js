import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addCreditCard,
  } from '../../../redux/reducers/userReducer';
import FormGroup from '../../../common/FormGroup';


class _CreditCardForm extends Component{
  constructor(){
    super();
    this.state = { brand: '', number: '' };
    this.onSave = this.onSave.bind(this);
  }
  onSave(ev){
    this.props.addCreditCard(this.props.user, this.state, this.props.cart)
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

export default connect(
  ({ user })=>{
    const cart = user.orders.filter(order => order.state === 'CART');
    return {
      user,
      cart: cart.length ? cart[0] : null,
    }
  },
  (dispatch)=>{
    return {
      addCreditCard: (user, card, cart)=> dispatch(addCreditCard(user, card, cart))
    }
  }
)(_CreditCardForm)

