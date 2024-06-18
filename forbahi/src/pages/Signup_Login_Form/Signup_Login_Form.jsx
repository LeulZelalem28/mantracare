import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,useNavigate,
} from "react-router-dom";
import { FaUser,FaKey} from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PasswordInput from '../PasswordInput/PasswordInput';
import IconComponent from '../IconComponent/IconComponent';
import './Signup_Login_Form.css';
import { useGlobalState } from '../../provider/GlobalStateProvider';
import RenderPatientSignupStep from './RenderPatientSignupStep';
import RenderTherapistSignupStep from './RenderTherapistSignupStep';
// import { navigate } from '@reach/router';


const Signup_Login_Form = () => {
  const { accessToken, setAccessToken, userRole, setUserRole, setUserName } = useGlobalState();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isForgotPassMode, setIsForgotPassMode] = useState(false);
  const [isEmailverified, setIsEmailverified] = useState(false);
  const [isOtpverified, setIsOtpverified] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [role,setRole] = useState('Patient');
  const[loader,setLoader] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signupStep, setSignupStep] = useState(1);
  const [address, setAddress] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [aboutDesc, setAboutDesc] = useState('');
  const [specializationDesc, setSpecializationDesc] = useState('');
  const [experienceDesc, setExperienceDesc] = useState('');
  const [educationDesc, setEducationDesc] = useState('');
  const [educationCertificate, setEducationCertificate] = useState(null);
  const [license, setLicense] = useState(null);
  // const [loginSuccess, setLoginSuccess] = useState(false);

  const navigate = useNavigate();

  const handlePatientRegistration = async (e) => {
    e.preventDefault();
    try {
        let url = 'http://localhost:3500/patients';
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('dateOfBirth', dob);
        formData.append('phoneNumber', phoneNumber);
        formData.append('profilePic', profilePic); // Append the profile picture as a file

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                // Set the content type
            },
        });

        const responseData = await response.json();
        toast(responseData.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        setTimeout(() => {
            setIsSignUpMode(false);
        }, 1200);
        resetForm();
    } catch (error) {
        console.error(error);
        toast.error('An error occurred while updating profile.');
    }
};



const handleTherapistRegistration = async (e) => {
  e.preventDefault();
  try {
      let url = 'http://localhost:3500/therapists';
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('name', name);
      formData.append('dateOfBirth', dob);
      formData.append('phoneNumber', phoneNumber);
      formData.append('address', address);
      formData.append('specialization', specialization);
      formData.append('experience', experience);
      formData.append('education', education);
      formData.append('description', JSON.stringify({
          aboutDesc: aboutDesc,
          experienceDesc: experienceDesc,
          educationDesc: educationDesc,
          specializationDesc: specializationDesc
      }));
      formData.append('profilePic', profilePic); // Append the profile picture as a file
      formData.append('educationCertificate', educationCertificate); // Append the education certificate as a file
      formData.append('license', license); // Append the license as a file

      const response = await fetch(url, {
          method: 'POST',
          body: formData,
          
      });

      const responseData = await response.json();
      toast(responseData.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
      });
      console.log(responseData.id)
      resetForm();
      setTimeout(() => {
          setIsSignUpMode(false);
      }, 1200);
  } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating profile.');
  }
};



  const handleLoginClick = async (e) => {
    e.preventDefault();
    try {
      let url = 'http://localhost:3500/auth/login'
      const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            {
              loginMode: 'email',
              email: email,
              password: password
            }
          ),
      })

      const responseData = await response.json();
      
      if(response.ok){
        setUserRole(responseData.role);
        setAccessToken(responseData.accessToken);
        setUserName(responseData.username);
        console.log(responseData.username)
        navigate('/home');
      }

      console.log(accessToken)
      toast(responseData.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      resetForm();
      // Redirect to '/ProfilePage' if needed
      // window.location = '/ProfilePage';

    } catch (error) {
      console.error(error);
      toast.error('An error occurred while updating profile.');
    }
  };


  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setName('');
    setDob('');
    setProfilePic(null);
    setPhoneNumber('');
    setSignupStep(1);
    setAddress('');
    setSpecialization('');
    setExperience('');
    setEducation('');
    setAboutDesc('');
    setEducationDesc('');
    setExperienceDesc('');
    setSpecializationDesc('')
    setEducationCertificate(null);
    setLicense(null);
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
    setEmail('');
    setPassword('');
    setUsername('');
    setIsForgotPassMode(false);
    setIsEmailverified(false);
    setIsOtpverified(false);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
    setIsForgotPassMode(false);
    setIsEmailverified(false);
    setIsOtpverified(false);
  };

  const handleForgotPass = ()=>{
    setPassword('');
    setIsForgotPassMode(true);
    setIsEmailverified(false);
    setIsOtpverified(false);
  }
  const handleEmailVerification = async(e)=>{ 
    e.preventDefault();
    setIsOtpverified(false);
    setLoader(true);
    try{
      const response = await axios.post('http://localhost:3000/user/forgot-password', {
        email
      });
      toast(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      
      if(response.status === 200){
        setIsEmailverified(true);
        setLoader(false);
      }
    }catch(error){
      console.error(error);
      toast.error('An error occurred while updating profile.');
    }
    
  }


  const handleOtpVerification = async(e)=>{
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:3000/user/verify-otp',{
        otp
      });
      toast(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if(response.status === 200){
        setIsOtpverified(true);
      }
    }catch(error){
      console.error(error);
      toast.error('An error occurred while updating profile.');
    }
   
  }
  const handleResetPass = async(e)=>{
    e.preventDefault();
    try{
      const response = await axios.post('http://localhost:3000/user/reset-password',{
       otp, password,confirmPassword
      });
      console.log(response);
      toast(response.data.message, {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      if(response.status === 200){
        setIsForgotPassMode(false);
        setIsEmailverified(false);
        setIsOtpverified(false);
        setOtp('');
      }
    }catch(error){
      console.error(error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(` ${error.response.data.message}`);
      } 
    }
    
  }

  const renderHeading = () => {
    if (isForgotPassMode) {
      if(isEmailverified){
        if(isOtpverified){
          return 'Reset Password';
      }else{
          return 'Enter OTP'
      } 
    } else {
      return 'Forgot Password';
    }
  }else{
    return 'Sign In';
  }
  };

  const handleNextStep = () => {
    setSignupStep(prevStep => prevStep + 1);
    console.log(signupStep); 
  };

  const handlePrevStep = () => {
      setSignupStep(prevStep => prevStep - 1);
      console.log(signupStep); 
  };

  

 

  return (
  
    <div className={`form-main-container ${isSignUpMode  ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form  className="sign-in-form">
         
            <h2 className="title">{renderHeading()}</h2>
            {/* <IconComponent role={role} setRole={setRole}/> */}
            
            
            {!isForgotPassMode ? (
              <>
              <div className="input-field">
              <i><FaUser /></i>
              <input type="text" className='focus:ring-0' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <PasswordInput password={password} setPassword={setPassword} placeholder={"Password"} />
             
            <div className="abc ">
              <div className="login_page_remember_me ">
                <input type="checkbox" className='focus:ring-0'  id="remember_me" />
                <label htmlFor="remember_me"> Remember Me</label>
              </div>
              <div className="forgot_password">
                <div onClick={handleForgotPass} style={{cursor : "pointer"}}>Forgot Password?</div>
              </div>
            </div>
            
            <input type="submit" value="Login" className="btn1 solid" onClick={handleLoginClick} />
              </>
            ) : null
              }

            { isForgotPassMode && !isEmailverified && !isOtpverified? (
            <>
            <div className="input-field">
              <i><GrMail /></i>
              <input type="text" className='focus:ring-0' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {loader ? (
                <div className="loader">
              <span>Please wait...</span> 
                </div>
              ) : null}
              <input type="submit"  value="Send Otp" className="btn1 solid focus:ring-0" onClick={handleEmailVerification} />
              </>
              ) : null
              }

              {isForgotPassMode && isEmailverified && !isOtpverified ?(
                <>
                <div className="input-field">
                <i><FaKey /></i>
              <input type="text" className='focus:ring-0' placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              </div>
              <input type="submit" value="Next" className="btn1 solid" onClick={handleOtpVerification} />
              </>

              ): null}

              {isForgotPassMode && isEmailverified && isOtpverified ?(
                <>
              
                <PasswordInput password={password} setPassword={setPassword} placeholder={"Password"} />
                <PasswordInput password={confirmPassword} setPassword={setConfirmPassword}  placeholder={"Confirm Password"}/>
              
              <input type="submit" value="Save" className="btn1 solid" onClick={handleResetPass} />
              </>
            ): null}

          </form>

          {/* Forgot Password Form */}
        

          {/* Sign Up Form */}
          <form className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <IconComponent role={role} setRole={setRole} resetForm={resetForm} setSignupStep={setSignupStep}/>
            {role === 'Patient' ? (
                  <RenderPatientSignupStep
                    username={username}
                    email={email}
                    password={password}
                    name={name}
                    dob={dob}
                    profilePic={profilePic}
                    phoneNumber={phoneNumber}
                    setUsername={setUsername}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setName={setName}
                    setDob={setDob}
                    setProfilePic={setProfilePic}
                    setPhoneNumber={setPhoneNumber}
                    signupStep={signupStep}
                    handleNextStep={handleNextStep}
                    handlePrevStep={handlePrevStep}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    handlePatientRegistration={handlePatientRegistration}
                  />
                ) : (
                  <RenderTherapistSignupStep
                    username={username}
                    email={email}
                    password={password}
                    name={name}
                    dob={dob}
                    phoneNumber={phoneNumber}
                    address={address}
                    specialization={specialization}
                    experience={experience}
                    education={education}
                    profilePic={profilePic}
                    educationCertificate={educationCertificate}
                    license={license}
                    setUsername={setUsername}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    setName={setName}
                    setDob={setDob}
                    setPhoneNumber={setPhoneNumber}
                    setAddress={setAddress}
                    setSpecialization={setSpecialization}
                    setExperience={setExperience}
                    setEducation={setEducation}
                    setProfilePic={setProfilePic}
                    setEducationCertificate={setEducationCertificate}
                    setLicense={setLicense}
                    signupStep={signupStep}
                    aboutDesc={aboutDesc}
                    setAboutDesc={setAboutDesc}
                    educationDesc={educationDesc}
                    setEducationDesc={setEducationDesc}
                    experienceDesc={experienceDesc}
                    setExperienceDesc={setExperienceDesc}
                    specializationDesc={specializationDesc}
                    setSpecializationDesc={setSpecializationDesc}
                    handleNextStep={handleNextStep}
                    handlePrevStep={handlePrevStep}
                    handleTherapistRegistration={handleTherapistRegistration}
                  />
                )}
          </form>
          
        </div>
        <ToastContainer />
      </div>

      <div className="panels-container">
        {/* Left and Right Panel code goes here */}
        <div className="panels-container">
        {/* Left Panel */}
        <div className={`panel left-panel ${isSignUpMode ? 'hidden' : ''}`}>
          <div className="content">
            <h3>New here ?</h3>
             <p>
              Your Path To Mental Wellness Starts here; Empowering Your Mind, One Session at a Time. Join Here and Build a New Life Tap The Button Below.
              </p>
            <button className="btn1 transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img src="images/5861790.webp" className="image" alt="" />
        </div>

        {/* Right Panel */}
        <div className={`panel right-panel ${isSignUpMode ? '' : 'hidden'}`}>
          <div className="content">
            <h2>One of us ?</h2>
            <p>
            Welcome back! Sign in to continue your Mindcare journey towards mental well-being.</p>
            <button className="btn1 transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img src="images/login-img.png" className="image" alt="" />
        </div>
      </div>
      </div>
    </div>
    
  );
};

export default Signup_Login_Form;
