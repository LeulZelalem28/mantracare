import g from '../../assets/images/g.jpg';
import starIcon from '../../assets/images/star.png';
import { useState, useEffect } from 'react';
import DoctorAbout from './DoctorAbout';
import { useGlobalState } from '../../provider/GlobalStateProvider';
import Feedback from './Feedback';
import SidePanel from './SidePanel';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';



const DoctorDetails = () => {
  const { accessToken, username } = useGlobalState();
  const [tab, setTab] = useState('about');
  const { id } = useParams(); 
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        console.log('hiii')
        setLoading(true);
        const requestOptions = {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
        };
        const response = await fetch(`http://localhost:3500/therapists/${id}`, requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch therapist');
        }
        const therapistData = await response.json();
        console.log('therapist: ',therapistData, 'username: ', username)
        setTherapist(therapistData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch therapist');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!therapist) return <div>No therapist data found</div>;

  return (
    <section>
      <ToastContainer />
      <div className="max-w-[1170px] px-5 mx-auto">
        <div className="grid md:grid-cols-3 gap-[50px]">
          <div className="md:col-span-2">
            <div className="flex items-center gap-5">
              <figure className='max-w-[200px] max-h-[200px]'>
                {username === therapist.username ? (
                  <Link to={`/therapists/profile/${therapist.therapistId}`}>
                    <img src={profilePic} alt="" className='w-[180px]'/>
                  </Link>
                ) : (
                  <img src={profilePic} alt="" className='w-[180px]'/>
                )}
              </figure>
              
              <div>
                <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
                  Therapist
                </span>
                <h3 className='text-headingColor text-[22px] leading-9 mt-3 font-bold'> Leul Zelalem</h3>
                <div className='flex items-center gap-[6px]'>
                  <span className='flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
                    <img src={starIcon} alt="" /> {therapist.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-[110px] border-b border-solid border-[#0066ff34]">
              <button 
                onClick={() => setTab('about')}
                className={`${tab === 'about' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                About
              </button>

              <button 
                onClick={() => setTab('feedback')}
                className={`${tab === 'feedback' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
              >
                Feedbacks
              </button>
            </div>

            <div className='mt-[50px]'>
              {tab === 'about' && <DoctorAbout therapist={therapist}/>}
              {tab === 'feedback' && <Feedback setTab={setTab} therapist={therapist}/>}
            </div>
          </div>
          <div>
            <SidePanel therapist={therapist}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
