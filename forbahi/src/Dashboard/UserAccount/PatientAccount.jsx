import userImg from '../../assets/images/d.jpg';
import { useState, useEffect } from 'react';
import PatientProfile from './PatientProfile';
import { useNavigate, useParams } from 'react-router-dom';
import { useGlobalState } from '../../provider/GlobalStateProvider';

const PatientAccount = () => {
  const [tab, setTab] = useState('settings'); 
  const { id } = useParams();
  const navigate = useNavigate();
  const { setAccessToken, userRole, setUserRole, setUserName } = useGlobalState();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3500/patients/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch patient');
        }
        const patientData = await response.json();
        setPatient(patientData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch patient');
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3500/patients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }
      navigate('/login');
    } catch (error) {
      setError('Failed to delete patient');
    }
  };

  const handleLogout = () => {
    setAccessToken('');
    setUserRole('');
    setUserName('');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!patient) return <div>No patient data found</div>;

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
  
  const profilePic = setProfilePicData(patient);

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
            <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">Name: {patient.name}</h3>
            <p className="text-textColor text-[15px] leading-6 font-medium">Email: {patient.email}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">Username: {patient.username}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">Date Of Birth: {patient.dateOfBirth}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">Phone Number: {patient.phoneNumber}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">Registration Date: {formatRegistrationDate(patient.registrationDate)}</p>
          </div>
          <div className="mt-[50px] md:mt-[100px]">
            <button onClick={handleLogout} className='w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white'>Logout</button>
            <button onClick={handleDelete} className='w-full bg-red-600 p-3 mt-4 text-[16px] leading-7 rounded-md text-white'>Delete account</button>
          </div>
        </div>
        <div className="md:col-span-2 md:px-[30px]">
          <div>
            <button
              onClick={() => setTab("settings")}
              className={`${
                tab === "settings" && "bg-primaryColor text-white font-normal"
              } p-2 px-rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
            >
              Profile Settings
            </button>
          </div>
          {tab === "settings" && <PatientProfile patient={patient}/>}
        </div>
      </div>
    </div>
  )
}

export default PatientAccount;
