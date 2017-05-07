import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  addAddress,
  } from '../../../redux/reducers/userReducer';
import FormGroup from '../../../common/FormGroup';


class _AddressForm extends Component{
  constructor(){
    super();
    this.state = { street: '' };
    this.onSave = this.onSave.bind(this);
  }
  onSave(ev){
    this.props.addAddress(this.props.user, this.state, this.props.cart)
      .then(()=> this.setState({ street: '' }));
  }
  render(){
    const { street } = this.state;
    return (
      <div className='well'>
        <FormGroup state={ this.state } name='street' value={ street } placeholder='enter street' component={ this }/>
        <div className='form-group'>
          <button onClick={ this.onSave } className='btn btn-primary' disabled={ !street }>Save</button>
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
      addAddress: (user, address, cart)=> dispatch(addAddress(user, address, cart))
    }
  }
)(_AddressForm)

