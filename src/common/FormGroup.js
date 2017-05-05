import React from 'react';

export default ({ value, name, component, placeholder } ) => {
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
