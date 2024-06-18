import React from 'react';
import DoctorCard from '../../components/Doctors/DoctorCard';
import { useGlobalState } from '../../provider/GlobalStateProvider';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const DoctorLists = () => {
  const { accessToken } = useGlobalState();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
        };
        const response = await fetch('http://localhost:3500/therapists', requestOptions);
        if (!response.ok) {
          throw new Error('Failed to fetch therapists');
        }
        const therapistsData = await response.json();
        setTherapists(therapistsData);
        setLoading(false);
        if (therapistsData.length === 0) {
          toast.info('No therapists found', { position: 'top-right' });
        }
      } catch (error) {
        setError('Failed to fetch therapists');
        setLoading(false);
        toast.error('Failed to fetch therapists', { position: 'top-right' });
      }
    };
    fetchTherapists();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
      {therapists.map(therapist => (
        <DoctorCard key={therapist.therapistId} therapist={therapist} />
      ))}
    </div>
  );
};

export default DoctorLists;
