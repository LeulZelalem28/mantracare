import React from 'react';
import { FaUser, FaKey, FaAddressCard, FaAddressBook } from 'react-icons/fa';
import {BsCalendarDate} from "react-icons/bs"
import { FaMobileScreen, FaUserDoctor } from "react-icons/fa6";
import { MdWork } from "react-icons/md";
import { MdCastForEducation } from "react-icons/md";
import { TbLicense } from "react-icons/tb";
import { GrMail } from 'react-icons/gr';

const RenderTherapistSignupStep = ({ 
    username, email, password, name, dob, phoneNumber, address, specialization, 
    experience, education, description, profilePic, educationCertificate, license, 
    aboutDesc, educationDesc, experienceDesc, specializationDesc,
    setUsername, setEmail, setPassword, setName, setDob, setPhoneNumber, setAddress, 
    setSpecialization, setExperience, setEducation, setDescription, setProfilePic, 
    setEducationCertificate, setLicense, setAboutDesc, setSpecializationDesc, setExperienceDesc, setEducationDesc, signupStep, handleNextStep, handlePrevStep,
    handleTherapistRegistration 
}) => {
    switch (signupStep) {
        case 1:
            return (
                <>
                    <div className="input-field">
                        <i><FaUser /></i>
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <i><GrMail /></i>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-field">
                        <i><FaKey /></i>
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="buttons">
                        <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
                    </div>
                </>
            );
        case 2:
            return (
                <>
                     <div className="input-field">
            <i><FaUser /></i>
              <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
            </div>
            <div className="input-field">
            <i><FaMobileScreen /></i>
              <input type="tel" name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
            </div>
            <div className="input-field">
            <i><BsCalendarDate /></i>
              <input type="date" name="dateOfBirth" value={dob} onChange={(e) => setDob(e.target.value)} required />
            </div>
            <div className="buttons">
              <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
              <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
            </div>
                </>
            );

        case 3: 
            return(
                <>
                     <div className="input-field">
                     <i><FaAddressBook /></i>
                        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>
                    <div className="input-field">
                    <i><FaUserDoctor /></i>
                        <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                    </div>
                    <div className="input-field">
                    <i><MdWork/></i>
                        <input type="text" placeholder="Experience" value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>
                    <div className="input-field">
                    <i><MdCastForEducation /></i>
                        <input type="text" placeholder="Education" value={education} onChange={(e) => setEducation(e.target.value)} />
                    </div>
                    <div className="buttons">
                        <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
                        <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
                    </div>
                </>
            )

        case 4:
            return (
                <>
                    <div className='input-fields'>
                        <label htmlFor="about-description" className="ld input-field">About</label>
                        <textarea id="about-description" className="ld input-field" value={aboutDesc} onChange={(e) => setAboutDesc(e.target.value)} placeholder="Describe yourself..."></textarea>
                    </div>
                    
                    <div className="buttons">
                        <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
                        <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
                    </div>
                    
                </>
            );
        case 5:
            return (
                <>
                <div className='input-fields'>
                        <label htmlFor="about-description" className="ld input-field">Specialization</label>
                        <textarea id="specialization-description" className="ld input-field" value={specializationDesc} onChange={(e) => setSpecializationDesc(e.target.value)} placeholder="Describe yourself..."></textarea>
                    </div>
                   
                    
                    <div className="buttons">
                        <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
                        <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
                    </div>
                    
                </>
            );
        case 6:
            return (
                <>
                    <div className='input-fields'>
                        <label htmlFor="experience-description" className="ld input-field">Experience</label>
                        <textarea id="experience-description" className="ld input-field" value={experienceDesc} onChange={(e) => setExperienceDesc(e.target.value)} placeholder="Describe yourself..."></textarea>
                    </div>
                   
                    
                    <div className="buttons">
                        <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
                        <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
                    </div>
                    
                </>
            );
        case 7:
            return (
                <>
                <div className='input-fields'>
                        <label htmlFor="education-description" className="ld input-field">Education</label>
                        <textarea id="education-description" className="ld input-field" value={educationDesc} onChange={(e) => setEducationDesc(e.target.value)} placeholder="Describe yourself..."></textarea>
                    </div>

                    
                    <div className="buttons">
                        <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
                        <button className="btn1" type="button" onClick={handleNextStep}>Next</button>
                    </div>
                    
                </>
            );
        case 8:
            return (
                <>
                    <div className="input-field">
                    <i><FaUser /></i>
                        <input className='input-field' type="file" placeholder="Profile Picture" onChange={(e) => setProfilePic(e.target.files[0])} />
                    </div>
                    <div className="input-field">
                    <i><MdCastForEducation /></i>
                        <input type="file" placeholder="Education Certificate" onChange={(e) => setEducationCertificate(e.target.files[0])} />
                    </div>
                    <div className="input-field">
                    <i><TbLicense /></i>
                        <input type="file" placeholder="License" onChange={(e) => setLicense(e.target.files[0])} />
                    </div>
                    <div className="buttons">
                        <button className="btn1" type="button" onClick={handlePrevStep}>Back</button>
                        <button className="btn1" type="submit" onClick={handleTherapistRegistration}>Register</button>
                    </div>
                </>
            );
        default:
            return null;
    }
};

export default RenderTherapistSignupStep;
