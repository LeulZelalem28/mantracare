import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResourceList.css';
import ResourceCard from './ResourceCard';

const MyResourcePage = ({ accessToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessages, setErrorMessages] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const baseUrl = 'http://localhost:3500';

  useEffect(() => {
    fetchResources(currentPage);
  }, [currentPage]);

  const fetchResources = async (page) => {
    try {
      setIsLoading(true);
      const url = `${baseUrl}/resources/therapist?page=${page}&limit=10`;
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, requestOptions);

      if (response.ok) {
        const data = await response.json();
        setResources(data.resources);
        const totalPages = Math.ceil(data.totalCount / 10); 
        setTotalPages(totalPages);
      } else if (response.status === 204) {
        setResources([]);
      } else {
        const errorMessages = await response.json();
        setErrorMessages(errorMessages);
      }
    } catch (error) {
      setErrorMessages('Failed to fetch resources');
    } finally {
      setIsLoading(false);
    }
  };

  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  

  const handleDeleteResource = async (resourceId) => {
    try {
      setIsLoading(true);
      const url = `${baseUrl}/resources/${resourceId}`;
      const requestOptions = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, requestOptions);

      if (response.ok) {
        toast.success('Resource deleted successfully');
        // Remove the deleted resource from the state
        setResources(resources.filter((resource) => resource.resourceId !== resourceId));
      } else {
        const errorMessages = await response.json();
        toast.error(errorMessages.message || 'Failed to delete resource');
      }
    } catch (error) {
      toast.error('Failed to delete resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="MyresourcePage" className="resource-page-container">
      <ToastContainer />
      <div id="MyresourcePageContainer">
        {isLoading ? (
          <div className="resource-page-loader">
            <ClipLoader
              color={'#0426FA'}
              loading={isLoading}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : resources.length === 0 ? (
          <p style={{ margin: 20 }}>No resources available</p>
        ) : (
          <div className="resource-page-resource-list">
            {resources.map((resource) => (
              <div key={resource.resourceId} className="resource-page-resource-card">
                <Link to={`/resources/${resource.resourceId}`}>
                  <ResourceCard resource={resource} />
                </Link>
                <div className="resource-page-resource-actions">
                  <button onClick={() => handleDeleteResource(resource.resourceId)}>
                    <FaTrash /> 
                  </button>
                  <Link to={`/resources/${resource.resourceId}/update`}>
                    <button>
                      <FaEdit /> 
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="resource-page-pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MyResourcePage;
