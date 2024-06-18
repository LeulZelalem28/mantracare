import userImg from '../../assets/images/d.jpg';
import { useState, useEffect } from 'react';
import Profile from './Profile';
import MyBooking from './MyBooking';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalState } from '../../provider/GlobalStateProvider';

const MyAccount = () => {
  const [tab, setTab] = useState('settings'); 
  const { id } = useParams();
  const navigate = useNavigate();
  const { setAccessToken, userRole, setUserRole, setUserName } = useGlobalState();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3500/therapists/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch therapist');
        }
        const therapistData = await response.json();
        setTherapist(therapistData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch therapist');
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3500/therapists/${id}`, {
        method: 'DELETE',
        
      });
      if (!response.ok) {
        throw new Error('Failed to delete therapist');
      }
      // Assuming the therapist is deleted successfully, redirect to /login
      navigate('/login');
    } catch (error) {
      setError('Failed to delete therapist');
    }
  };

  const handleLogout = () => {
    // Clearing local storage
    setAccessToken('');
    setUserRole('');
    setUserName('');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    // Redirecting to /login
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!therapist) return <div>No therapist data found</div>;

  const setProfilePicData = (data) => {
    if (!data || !data.profilePic) {
      return null;
    }
  
    if (typeof data.profilePic.data === 'string') {
      const base64Image = `data:${data.profilePic.contentType};base64,${data.profilePic.data}`;
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

  // Function to format the registration date
  const formatRegistrationDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='max-w-[1170px] px-5 mx-auto'>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="pb-[50px] px-[30px] rounded-md">
          <div className="flex items-center justify-center">
            <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
              <img src={profilePic} alt="" className="w-full h-full rounded-full" />
            </figure>
          </div>

          <div className="text-center mt-4">
            <h3 className="text-[18px] leading-[30px] text-headingColor font-bold ">name: {therapist.name}</h3>
            <p className="text-textColor text-[15px] leading-6 font-medium">email: {therapist.email}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">username: {therapist.username}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">Date Of Birth: {therapist.dateOfBirth}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">Phone Number: {therapist.phoneNumber}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">Registration Date: {formatRegistrationDate(therapist.registrationDate)}</p>
          </div>

          <div className="mt-[50px] md:mt-[100px]">
            <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Logout</button>
            <button onClick={handleDelete} className='w-full bg-red-600 p-3 mt-4 text-[16px] leading-7 rounded-md text-white'>Delete account</button>
          </div>
        </div>

        <div className="md:col-span-2 md:px-[30px]">
          <div>
            {/* <button
              onClick={() => setTab("bookings")}
              className={`${
                tab === "bookings" && "bg-primaryColor text-white font-normal"
              } p-2 mr-5 px-rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
            >
              My Bookings
            </button> */}

            <button
              onClick={() => setTab("settings")}
              className={`${
                tab === "settings" && "bg-primaryColor text-white font-normal"
              } p-2 px-rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
            >
              Profile Settings
            </button>
          </div>
          {/* {tab === "bookings" && <MyBooking />} */}
          {tab === "settings" && <Profile therapist={therapist}/>}
        </div>
      </div>
    </div>
  )
}

export default MyAccount;
