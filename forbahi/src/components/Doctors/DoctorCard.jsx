/* eslint-disable no-unused-vars */
import React from 'react'
import starIcon from '../../assets/images/star.png'
import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'


 // eslint-disable-next-line react/prop-types
 const DoctorCard = ({ therapist }) => {
  const setProfilePicData = (data) => {
    if (!data || !data.profilePic) {
      return null;
    }
  
    if (typeof data.profilePic.data === 'string') {
      const base64Image = `data:${data.profilePic.contentType};base64,${data.profilePic.data}`;
      console.log('pro', base64Image)
      return base64Image;
    } else if (data.profilePic.data instanceof ArrayBuffer) {
      const base64Image = `data:${data.profilePic.contentType};base64,${arrayBufferToBase64(data.profilePic.data)}`;
      return base64Image;
    } else {
      return null;
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';

    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  const profilePic = setProfilePicData(therapist);
  // eslint-disable-next-line react/prop-types
  const {userId, username,  email, name, dateOfBirth, phoneNumber, registrationDate, therapistId, role, address, specialization, experience, education, rating} = therapist;
  return (
    <div className='p-3 lg:p-5'>
      <div>
        <img src={profilePic} className='w-[250px] h-[350px]' alt="" />
      </div>
      <h2 className='text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5'>
        {name}
        </h2>

        <div className='mt-2 lg:mt-4 flex items-center justify-between'>
          <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:px-6 text-[12px] leading-6 lg:text-[16px] lg:leading-7 font-semibold rounded'>{specialization}</span>
          <div className="flex items-center gap-[6px]">
            <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
              <img src={starIcon} alt="" /> {rating}
            </span>
          </div>
        </div>

<div className="mt-[18px] lg:mt-5 flex items-center justify-between">
  <div>
    <p className='text-[14px] leading-6 font-[400] text-textColor'>At {address}</p>
  </div>

  <Link to={`/doctor/${therapistId}`} className='w-[44px] h-[44px] rounded-full border border-solid border-[#1B1A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none'>
    <BsArrowRight className="group-hover:text-white w-6 h-5" />
  </Link>

</div>

    </div>
  )
}
export default DoctorCard;
