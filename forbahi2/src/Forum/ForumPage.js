import React, { useState, useEffect } from 'react';
import { FaThLarge, FaHome, FaCommentDots } from 'react-icons/fa';
import ForumCard from './ForumCard';
import ClipLoader from 'react-spinners/ClipLoader';
import './ForumPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowSize from '../hooks/useWindowSize';

const ForumPage = ({ accessToken, username }) => {
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [forumTitle, setForumTitle] = useState('');
  const [forumDescription, setForumDescription] = useState('');
  const [forumCategory, setForumCategory] = useState('');
  const [forums, setForums] = useState([]);
  const [categories, setCategories] = useState([
    "Anxiety", "Depression", "Stress Management", "Relationships",
    "Personal Growth", "Career Counseling", "Parenting", "Grief",
    "Addiction", "Others"
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedForumId, setSelectedForumId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);    
  const [likes, setLikes] = useState({});
  const [hasLiked, setHasLiked] = useState({});
 


  const windowSize = useWindowSize();
  const therapistsMap = {};
  const patientsMap = {};


  const url = `http://localhost:3500/forums`;
  const url2 = 'http://localhost:3500/forumposts'

  useEffect(() => {
    fetchForums(currentPage);
  }, [currentPage]);

  const fetchForums = async (page) => {
    try {
        setForums([])
      setIsLoading(true);
      const fetchUrl = `${url}?page=${page}&limit=10`; 
      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
       await fetchTherapistsAndPatients(data.forums);
        setForums(data.forums);
        console.log(data.forums);
        const totalPages = Math.ceil(data.totalForums / 10);
        setTotalPages(totalPages);
        toast.success('Forums fetched successfully');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch forums');
        toast.error(errorData.message || 'Failed to fetch forums');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch forums');
      toast.error('Failed to fetch forums');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyForums = async (page) => {
    try {
    setForums([])
      setIsLoading(true);
      const fetchUrl = `${url}/myforums?page=${page}&limit=10`;
      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        await fetchTherapistsAndPatients(data.forums);
        setForums(data.forums);
        const totalPages = Math.ceil(data.totalForums / 10); // Assuming limit is 10
        setTotalPages(totalPages);
        toast.success('My Forums fetched successfully');
        
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch forums');
        toast.error(errorData.message || 'Failed to fetch forums');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch forums');
      toast.error('Failed to fetch forums');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForumsByCategory = async (category, page) => {
    try {
      setIsLoading(true);
      const fetchUrl = `${url}/category/${category}?page=${page}&limit=10`;
      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        await fetchTherapistsAndPatients(data.forums);
        setForums(data.forums);
        const totalPages = Math.ceil(data.totalForums / 10); // Assuming limit is 10
        setTotalPages(totalPages);
        toast.success(`Forums fetched successfully in ${category} category`);
  
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || `Failed to fetch forums in ${category} category`);
        toast.error(errorData.message || `Failed to fetch forums in ${category} category`);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch forums in ${category} category`);
      toast.error(`Failed to fetch forums in ${category} category`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForumById = async (forumId) => {
    try {
        setForums([])
      setIsLoading(true);
      const fetchUrl = `${url}/${forumId}`;
      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const forumData = await response.json();
        fetchTherapistsAndPatients(forumData);
        setForums(forumData);
        console.log(forumData)
        setSelectedForumId(forumId); 
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch forum details');
        toast.error(errorData.message || 'Failed to fetch forum details');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch forum details');
      toast.error('Failed to fetch forum details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForum = async (event) => {
    event.preventDefault();

    if (!forumTitle || !forumDescription || !forumCategory) {
      setErrorMessage('All fields are required');
      toast.error('All fields are required');
      return;
    }

    const newForum = {
      forumTitle,
      forumDescription,
      forumCategory,
    };

    try {
      setIsLoading(true);
      setForumTitle('');
      setForumDescription('');
      setForumCategory('');
      setErrorMessage('');
      const response = await fetch('http://localhost:3500/forums', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForum),
      });

      if (response.ok) {
        toast.success('Forum created successfully');
        setIsModalOpen(false);
        await fetchForums(currentPage); 
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to create forum');
        toast.error(errorData.message || 'Failed to create forum');
      }
    } catch (error) {
      setErrorMessage('Failed to create forum');
      toast.error('Failed to create forum');
    } finally {
      setIsLoading(false);
    }
  };

  const searchForum = async (searchTerm) => {
    try {
        setForums([])
      setIsLoading(true);
      const fetchUrl = `${url}/search?search=${searchTerm}`;
      const requestOptions = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(fetchUrl, requestOptions);
      if (response.status === 204) {
        setForums([]);
        toast.info('No forums found');
        return;
      }
      if (response.ok) {
        const data = await response.json();
        await fetchTherapistsAndPatients(data.forums);
        setForums(data.forums);
        const totalPages = Math.ceil(data.totalForums / 10); // Assuming limit is 10
        setTotalPages(totalPages);
        toast.success('Forums fetched successfully');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch forums');
        toast.error(errorData.message || 'Failed to fetch forums');
      }
    } catch (error) {
      setErrorMessage('Failed to fetch forums');
      toast.error('Failed to fetch forums');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditForum = async (forumId) => {
    const forumToEdit = forums.find(forum => forum.forumId === forumId);
    setForumTitle(forumToEdit.forumTitle);
    setForumDescription(forumToEdit.forumDescription);
    setForumCategory(forumToEdit.forumCategory);
    setSelectedForumId(forumId);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleUpdateForum = async (event) => {
    event.preventDefault();

    if (!forumTitle || !forumDescription || !forumCategory) {
      setErrorMessage('All fields are required');
      toast.error('All fields are required');
      return;
    }

    const updatedForum = {
      forumTitle,
      forumDescription,
      forumCategory,
    };

    try {
      setIsLoading(true);

      const response = await fetch(`http://localhost:3500/forums/${selectedForumId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedForum),
      });

      if (response.ok) {
        const updatedForumData = await response.json();
        await fetchForums(currentPage);
        setForumTitle('');
        setForumDescription('');
        setForumCategory('');
        setErrorMessage('');
        setSelectedForumId(null);
        setIsEditing(false);
        setIsModalOpen(false);
        toast.success('Forum updated successfully');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update forum');
        toast.error(errorData.message || 'Failed to update forum');
      }
    } catch (error) {
      setErrorMessage('Failed to update forum');
      toast.error('Failed to update forum');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteForum = async (forumId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3500/forums/${forumId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        await fetchForums(currentPage);
        toast.success('Forum deleted successfully');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to delete forum');
        toast.error(errorData.message || 'Failed to delete forum');
      }
    } catch (error) {
      setErrorMessage('Failed to delete forum');
      toast.error('Failed to delete forum');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTherapistsAndPatients = async (forums) => {
    try {
      setIsLoading(true);
      for (const forum of forums) {
        const { forumCreatorId } = forum;

        const responseTherapist = await fetch(`http://localhost:3500/therapists/userId/${forumCreatorId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (responseTherapist.ok) {
          const therapistData = await responseTherapist.json();
          therapistsMap[forumCreatorId] = therapistData;
          console.log('hereapists',therapistsMap)
        }

        const responsePatient = await fetch(`http://localhost:3500/patients/userId/${forumCreatorId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (responsePatient.ok) {
          const patientData = await responsePatient.json();
          patientsMap[forumCreatorId] = patientData;
          console.log('patients',patientsMap)
        }
      }

      setTherapists(therapistsMap);
      setPatients(patientsMap);
      toast.success('Therapists and Patients fetched successfully');
    } catch (error) {
      setErrorMessage('Failed to fetch therapists and patients');
      toast.error('Failed to fetch therapists and patients');
    } finally {
      setIsLoading(false);
    }
  };

  

  
  const handleLike = async (forumId) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:3500/forums/like/${forumId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.status)
      if (response.ok) {
        const updatedForum = await response.json();
        
        setLikes(updatedForum[0]._likes);
        
        await setHasLiked(updatedForum[0]._likesBy.includes(username));
  
       
      } else {
        console.error('Failed to like the forums');
      }
    } catch (error) {
      console.error('An error occurred while liking the forum:', error);
    } finally {
      window.location.reload();
    }
  };
  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await searchForum(searchTerm);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
  };

  const handleForumClick = (forumId) => {
    fetchForumById(forumId);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedForumId(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedForumId(null);
    }
  };
  
    return (
      <div className="forum-page-container">
        <ToastContainer />
        {windowSize.width > 768 && (<div className="forum-sidebar">
          <ul>
            <li onClick={() => fetchForums(currentPage)}><FaHome /> Home</li>
            <li onClick={() => fetchMyForums(currentPage)}><FaCommentDots /> My Forums</li>
            <li onClick={toggleCategories}><FaThLarge /> Categories</li>
            {showCategories && categories.map(category => (
              <li key={category} className="category" onClick={() => fetchForumsByCategory(category, currentPage)}>
                {category}
              </li>
            ))}
          </ul>
        </div>)}
        <div className="forum-content">
            <div className='forum-header'>
                <form className="forum-search-bar" onSubmit={handleSearchSubmit}>
                    <input
                    type="text"
                    placeholder="Search for topics and discussions"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    />
                    <button type='submit'>Search</button>
                </form>
                {windowSize.width <= 768 && (
                <div className="forum-dropdown">
                    <select onChange={(e) => {
                    if (e.target.value === 'home') fetchForums(currentPage);
                    else if (e.target.value === 'myForums') fetchMyForums(currentPage);
                    else fetchForumsByCategory(e.target.value, currentPage);
                    }}>
                    <option value="home">Home</option>
                    <option value="myForums">My Forums</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                    </select>
                 </div>)}
          </div>
          <button className="forum-open-modal-button" onClick={openModal}>Create Forum</button>
          {isModalOpen && (
            <div className="forum-modal">
              <div className="forum-modal-content">
                <span className="forum-close" onClick={closeModal}>&times;</span>
                <form className="create-forum-form" onSubmit={isEditing ? handleUpdateForum : handleCreateForum}>
                  <label htmlFor="title">Forum Title:</label>
                  <input
                    id="title"
                    type="text"
                    value={forumTitle}
                    onChange={(e) => setForumTitle(e.target.value)}
                  />
  
                  <label htmlFor="description">Forum Description:</label>
                  <textarea
                    id="description"
                    value={forumDescription}
                    onChange={(e) => setForumDescription(e.target.value)}
                  />
  
                  <label htmlFor="category">Forum Category:</label>
                  <select
                    id="category"
                    value={forumCategory}
                    onChange={(e) => setForumCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
  
                  <button type="submit">{isEditing ? 'Update Forum' : 'Create Forum'}</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="forum-loader">
              <ClipLoader color="#3e92cc" loading={isLoading} size={100} />
            </div>
          ) : (
            <div className="forum-list">
              {forums.length === 0 ? (
                <p>No forums found</p>
              ) : (
                forums.map(forum => {
                  const userId = forum.forumCreatorId;
                  const user = therapists[userId] || patients[userId] || null;
                  return <ForumCard 
                            accessToken={accessToken}
                            key={forum.forumId} 
                            forum={forum} 
                            user={user} 
                            setErrorMessage={setErrorMessage}
                            errorMessage={errorMessage}
                            username={username} 
                            therapists={therapists}
                            patients={patients}
                            setTherapists={setTherapists}
                            setPatients={setPatients}
                            handleLike={() => handleLike(forum.forumId)}
                            hasLiked={hasLiked}
                            onEdit={handleEditForum}
                            onDelete={handleDeleteForum} 
                            onClick={() => handleForumClick(forum.forumId)} 
                          />;
                })
              )}
            </div>
          )}
         
        {!selectedForumId && ( 
            <div className="forum-pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
            </button>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
            </button>
            </div>
        )}
       
        </div>
      </div>
    );
  }; 

export default ForumPage;