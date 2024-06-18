import React, { useState,userRef } from 'react';
import Styles from './IconComponent.module.css';
import { FaUserDoctor, FaUser } from "react-icons/fa6";

const IconComponent= ({role,setRole, resetForm, setSignupStep})=> {
  const [color, setColor] = useState('grey');
  const [color2, setColor2] = useState('#5cc7bf');


  const handleRoleChange = (roles) => {
    if(role != roles) {
      setRole(roles)
      setSignupStep(1);
      resetForm();
    }
  }
  
  return (
    <div className={Styles.container2}>

      <div onClick={() => handleRoleChange('Patient')} className='color-box'>
        <i style={{color: color2}}><FaUser /></i>
        <p style={{color: color2}} >Patient</p>
      </div>
      <div onClick={() => handleRoleChange('Doctor')} className='color-box'>
        <i style={{color: color}}><FaUserDoctor /></i>
        <p style={{color: color}}>Doctor</p>
      </div>
    </div>
  );
}

export default IconComponent;