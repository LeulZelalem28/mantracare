import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { MdLocationOn, MdStar } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import './TherapistsPage.css';

const TherapistsPage = () => {
  const [therapists, setTherapists] = useState([]);
  const [therapistCount, setTherapistCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const therapistsResponse = await fetch('http://localhost:3500/therapists');
        const therapistsData = await therapistsResponse.json();
        setTherapists(therapistsData);
        toast.success('Therapists fetched successfully!');
      } catch (error) {
        toast.error('Failed to fetch therapists');
        console.error('Failed to fetch therapists', error);
      }
      
      try {
        const therapistCountResponse = await fetch('http://localhost:3500/therapists/number');
        const therapistCountData = await therapistCountResponse.json();
        setTherapistCount(therapistCountData.count);
      } catch (error) {
        console.error('Failed to fetch therapist count', error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (therapistId) => {
    try {
      await fetch(`http://localhost:3500/therapists/${therapistId}`, { method: 'DELETE' });
      setTherapists(therapists.filter(therapist => therapist.therapistId !== therapistId));
      setTherapistCount(therapistCount - 1);
      toast.success('Therapist deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete therapist');
      console.error('Failed to delete therapist', error);
    }
  };

  return (
    <div className="admin-therapists-page">
      <h2>Therapists ({therapistCount})</h2>
      {loading ? (
        <div className="loader-container">
          <ClipLoader color="#007bff" loading={loading} size={35} />
        </div>
      ) : (
        <div className="admin-therapists-list">
          {therapists.map(therapist => (
            <div key={therapist.therapistId} className="admin-therapists-item">
              <div className="admin-therapists-item-info">
                <p><FiUser /> <strong>Name:</strong> {therapist.name}</p>
                <p><MdLocationOn /> <strong>Address:</strong> {therapist.address}</p>
                <p><MdStar /> <strong>Rating:</strong> {therapist.rating}</p>
              </div>
              <button
                className="admin-therapists-delete-button"
                onClick={() => handleDelete(therapist.therapistId)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TherapistsPage;
