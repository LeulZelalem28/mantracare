/* eslint-disable no-unused-vars */
import React from 'react'
import { formateDate } from '../../utils/formateDate'


const DoctorAbout = ({therapist}) => {
// const {userId, userName, password, email, name, dateOfBirth, phoneNumber, registration, profilePic, therapistId, role, address, specialization, experience, rating };
  return (
    <div>
        <div>
            <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold flex itmes-center gap-2 '>
                About
            </h3>
            <p className="text__para">
                {therapist.description.about}
            </p>
        </div>

        <div className='mt-5'>
            <h3 className='text-[20px] leading-[30px] text-headingColor font-semibold flex itmes-center gap-2 '>
                Specialization
                <span className="text-irisBlueColor font-bold text-[24px] leading-9">
                </span>
            </h3>
            <p className="text__para">
                    {therapist.description.specialization}

            </p>
        </div>

        
        <div className="mt-12">
            <h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
                Education
            </h3>
<p className='text__para'>{therapist.description.education}</p>
        </div>
<div className='mt-12'>
<h3 className="text-[20px] leading-[30px] text-headingColor font-semibold">
Experience
            </h3>
            <p className='text__para'>{therapist.description.experience}</p>
</div>

    </div>
  )
}

export default DoctorAbout