import React from 'react';
import { useState } from 'react';
import './ForumCard.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast } from 'react-toastify';
import { AiOutlineComment, AiOutlineLike, AiOutlineHeart, } from 'react-icons/ai';
import { FaEdit, FaTrash, FaRegCommentAlt } from 'react-icons/fa';

const ForumCard = ({ accessToken, forum, errorMessage, setErrorMessage, onClick, user, therapists, patients, hasLiked, setTherapists, setPatients, username, onEdit, onDelete, handleLike }) => {
  const [postContent, setPostContent] = useState('') ;
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forumPosts, setForumPosts] = useState([]);
  const [therpistsPostComm, setTherapistsPostComm] = useState([])
  const [patientsPostComm, setPatientsPostComm] = useState([])
  
  const userHasLiked = forum.likesBy.includes(username);
  let posts = []
  let commentProfilePic = []
  

  const commentOnClick = async (forumId) => {
    setShowComments(!showComments);
    console.log(showComments)
    if(!showComments) {
      console.log('hi')
      await fetchForumPosts(forumId);
    } 
    
  }

  const fetchForumPosts = async(forumId) => {
    try {
      setForumPosts([])
      setIsLoading(true);
      const fetchUrl = `http://localhost:3500/forumposts/forum/${forumId}`; 
      const response = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.ok) {
      const data = await response.json();
     await fetchTherapistsAndPatientsByForumPosts(data);
     console.log('123', data)
      await setForumPosts(data);
      
      forumPosts.map((post) => {
        if(post.forumId == forum.forumId) {
          posts[post.authorId] = post
        }
      })
      console.log(forumPosts)
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
  }

  const fetchTherapistsAndPatientsByForumPosts = async (forumPosts) => {
    try {
      setIsLoading(true);
      const therapistsMap = {};
      const patientsMap = {};
      for (const forumPost of forumPosts) {
        const { authorId } = forumPost;

        const responseTherapist = await fetch(`http://localhost:3500/therapists/userId/${authorId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (responseTherapist.ok) {
          const therapistData = await responseTherapist.json();
          therapistsMap[authorId] = therapistData;
          console.log('therapists',therapistsMap)
        }

        const responsePatient = await fetch(`http://localhost:3500/patients/userId/${authorId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (responsePatient.ok) {
          const patientData = await responsePatient.json();
          patientsMap[authorId] = patientData;
          console.log('patients',patientsMap)
        }
      }

      setTherapistsPostComm(therapistsMap);
      setPatientsPostComm(patientsMap);
      toast.success('Therapists and Patients fetched successfully');
    } catch (error) {
      setErrorMessage('Failed to fetch therapists and patients');
      toast.error('Failed to fetch therapists and patients');
    } finally {
      setIsLoading(false);
    }
  };

  
  const createForumPost = async (event) => {
    event.preventDefault(); 
    const newForumPost = {
      forumId: forum.forumId,
      postContent: postContent,
    };
  
    try {
      setIsLoading(true);
      setPostContent('');
      const response = await fetch('http://localhost:3500/forumposts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newForumPost),
      });
  
      if (response.ok) {
        const createdPost = await response.json();
        setForumPosts([...forumPosts, createdPost]); 
        toast.success('Forum created successfully');
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
  
  const handleForumClick = () => {
    onClick(forum.forumId);
  };


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

  const profilePic = setProfilePicData(user);
  
  forumPosts.forEach(post => {
    const userId = post.authorId;
    
    const user = therpistsPostComm[userId] || patientsPostComm[userId] || null;
    console.log('userID', )
    commentProfilePic[post.authorId] = setProfilePicData(user)
    console.log('hi',setProfilePicData(user))
  });
  console.log('prpfo;',commentProfilePic)
  let date = forum.forumTimeStamp
  date = new Date(date);
  date = date.toLocaleDateString();




  return (
    <div className="forum-card">
      <div className="forum-data-header">
        <div className="forum-user-info">
          <img src={profilePic} alt="profile pic" />
          <p>{forum.forumCreatorName}</p>
          <p>{new Date(forum.forumTimeStamp).toDateString()}</p>
        </div>
        {username === forum.forumCreatorName && (
          <div className="forum-actions">
            <FaEdit
              className="forum-action-icon forum-edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(forum.forumId);
              }}
            />
            <FaTrash
              className="forum-action-icon forum-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(forum.forumId);
              }}
            />
          </div>
        )}
      </div>
      <h3 className="forum-title" onClick={handleForumClick}>
        {forum.forumTitle}
      </h3>
      <p>{forum.forumDescription}</p>
      <div className="forum-meta">
        <div>
          <span onClick={() => commentOnClick(forum.forumId)}>
            <AiOutlineComment /> {/* Corrected indentation */}
          </span>
          <span style={{ color: userHasLiked ? 'red' : '#ccc' }} onClick={handleLike}>
            <AiOutlineHeart /> {forum.likes}
          </span>
        </div>
        <span>{forum.forumCategory}</span>
      </div>
      {showComments && (
        <div className="forum-posts">
          <p>
            <span>comments: </span>
          </p>
          {isLoading ? (
            <div className="forum-loader">
              <ClipLoader color="#3e92cc" loading={isLoading} size={80} />
            </div>
          ) : (
            <>
              <form className="create-forum-post" onSubmit={createForumPost}>
                <input
                  type="text"
                  placeholder="Search for topics and discussions"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <button type="submit">
                  <FaRegCommentAlt />
                </button>
              </form>
                      {forumPosts.map((post) => (
              <div className="forum-post" key={post.postId}>
                <div className="forum-post-user-info">
                  <img src={commentProfilePic[post.authorId]} alt="profile pic" />
                  <div className="forum-post-user-details">
                      <p className="forum-post-username">{post.postCreatorUsername}</p>
                      <p className="forum-post-date">{new Date(post.postTimeStamp).toDateString()}</p>
                    </div>
                </div>
                <div className="forum-post-body">
                  <p>{post.postContent}</p>
                </div>
              </div>
            ))}
            </>
          )}
        </div>
      )}
    </div>
  );
  
};

export default ForumCard;