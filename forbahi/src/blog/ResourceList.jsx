import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './ResourceList.css';
import ResourceCard from './ResourceCard';

const ResourcePage = ({ accessToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorMessages, setErrorMessages] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const baseUrl = `http://localhost:3500`;

  useEffect(() => {
    fetchResources(currentPage);
  }, [currentPage]);

  const fetchResources = async (page) => {
    try {
      setIsLoading(true);
      const url = `${baseUrl}/resources?page=${page}&limit=10`;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, requestOptions);

      if (response.ok) {
        const data = await response.json();
        setResources(data.resources);
        const totalPages = Math.ceil(data.totalCount / 2); // Assuming limit is 2
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

  const searchResources = async (search) => {
    try {
      setIsLoading(true);
      const url = `${baseUrl}/resources/search?search=${encodeURIComponent(search)}`;
      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };
  
      const response = await fetch(url, requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        setResources(data.resources);
        setCurrentPage(1); 
        setTotalPages(1); // Reset total pages for search results
      } else if (response.status === 204) {
        setResources([]); // No resources found
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to the first page on new search
    searchResources(searchTerm);
  };
  

  return (
    <div id='resourcePage' className='resource-page-container'>
      <ToastContainer />
      <h1>Resources</h1>
      <form className='resource-page-search-bar' onSubmit={handleSearchSubmit}>
        <input
          type='text'
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder='Search by title or author...'
        />
        <button type="submit">Search</button>
      </form>
      <div id='resourcePageContainer'>
        {isLoading ? (
          <div className="resource-page-loader">
            <ClipLoader color={'#0426FA'} loading={isLoading} size={100} aria-label="Loading Spinner" data-testid="loader" />
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

export default ResourcePage;
