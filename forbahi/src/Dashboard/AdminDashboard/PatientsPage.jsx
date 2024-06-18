import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import './PatientsPage.css';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:3500/patients');
        const data = await response.json();
        setPatients(data.patients);
        setPatientCount(data.count);
        setLoading(false);
        toast.success('Patients fetched successfully!');
      } catch (error) {
        toast.error('Failed to fetch patients');
        console.error('Failed to fetch patients', error);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (patientId) => {
    try {
      await fetch(`http://localhost:3500/patients/${patientId}`, { method: 'DELETE' });
      setPatients(patients.filter(patient => patient.patientId !== patientId));
      setPatientCount(patientCount - 1);
      toast.success('Patient deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete patient');
      console.error('Failed to delete patient', error);
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  return (
    <div className="admin-patients-page">
      <h2>Patients ({patientCount})</h2>
      <div className="clip-loader">
        <ClipLoader color="#007bff" loading={loading} css={override} size={35} />
      </div>
      <div className="admin-patients-list">
        {patients.map(patient => (
          <div key={patient.patientId} className="admin-patients-item">
            <div className="admin-patients-item-info">
              <p><strong>Username:</strong> {patient.username}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>User ID:</strong> {patient.userId}</p>
            </div>
            <button
              className="admin-patients-delete-button"
              onClick={() => handleDelete(patient.patientId)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PatientsPage;
