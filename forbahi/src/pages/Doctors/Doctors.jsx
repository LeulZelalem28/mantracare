import { useState, useEffect } from 'react';
import DoctorCard from './../../components/Doctors/DoctorCard';
import { useGlobalState } from '../../provider/GlobalStateProvider';

const Doctors = () => {
  const { accessToken } = useGlobalState();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
      } catch (error) {
        setError('Failed to fetch therapists');
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3500/therapists/name?name=${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch therapists');
      } 
      if(response.status == 200){
        const therapistsData = await response.json();
        setTherapists(therapistsData);
      } 
      if(response.status == 204) {
        setTherapists([])
      }
      
      setSearchTerm('');
    } catch (error) {
      setError('Failed to fetch therapists');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <section className='bg-[#fff9ea]'>
        <div className='container text-center'>
          <h2 className='heading'>Find a Doctor</h2>
          <div className='max-w-[570px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between'>
            <input
              type="search"
              className='py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor'
              placeholder="Search Doctor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className='btn mt-0 rounded-[0px] rounded-r-md' onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {therapists.length === 0 ? (
              <p>No therapists found</p>
            ) : (
              therapists.map(therapist => (
                <DoctorCard key={therapist.therapistId} therapist={therapist} />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Doctors;
