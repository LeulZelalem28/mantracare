import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; 
import './ResourceDetailPage.css';

const ResourceDetailPage = ({ accessToken, username }) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [resource, setResource] = useState(null);
  const [errorMessages, setErrorMessages] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false); // State to toggle comments visibility
  const baseUrl = `http://localhost:3500`;

  useEffect(() => {
    fetchResourceById();
  }, [id]);

  const fetchResourceById = async () => {
    try {
      setIsLoading(true);

      const url = `${baseUrl}/resources/${id}`;
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
        setResource(data);
        checkIfLiked(data);
      } else if (response.status === 204) {
        setResource(null);
      } else {
        const errorMessages = await response.json();
        setErrorMessages(errorMessages);
      }
    } catch (error) {
      setErrorMessages('Failed to fetch resource');
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfLiked = (resource) => {
     console.log(resource)
    if (resource.likesBy && resource.likesBy.includes(username)) {
      setIsLiked(true);
      console.log('hii', isLiked)
    } else {
      setIsLiked(false);
      console.log('hi', isLiked)
    }
  };

  const handleAddComment = async () => {
    try {
      setIsLoading(true);
      if (!commentInput.trim()) {
        toast.error('Please enter a comment');
        return;
      }

      const url = `${baseUrl}/resources/${id}/comment`;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: commentInput }),
      };

      const response = await fetch(url, requestOptions);

      if (response.ok) {
        toast.success('Comment added successfully');
        setCommentInput('');
        fetchResourceById();
      } else {
        const errorMessages = await response.json();
        setErrorMessages(errorMessages);
      }
    } catch (error) {
      setErrorMessages('Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      setIsLoading(true); // Start loading state for immediate feedback

      const url = `${baseUrl}/resources/${id}/like`;
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch(url, requestOptions);

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setIsLiked(result.liked);
        fetchResourceById();
      } else {
        const errorMessages = await response.json();
        setErrorMessages(errorMessages);
      }
    } catch (error) {
      setErrorMessages('Failed to like/unlike resource');
    } finally {
      setIsLoading(false); // Stop loading state after operation completes
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className='resource-detail-page'>
      <ToastContainer />
      <div className='resource-detail-page-container'>
        {isLoading ? (
          <div className="resource-detail-page-spinner">
            <ClipLoader color={'#0426FA'} loading={isLoading} size={100} aria-label="Loading Spinner" />
          </div>
        ) : resource === null ? (
          <p style={{ margin: 20 }}>No resource found</p>
        ) : (
          <div className="resource-detail-container">
            <h2>{resource.resourceTitle}</h2>
            <div className="meta">
              <span>Author: {resource.resourceAuthor}</span>
              <span> | </span>
              <span>Date: {new Date(resource.resourceTimeStamp).toLocaleDateString()}</span>
              <span> | </span>
              <span>Likes: {resource.likes}</span>
            </div>
            <p className="resource-content">{resource.resourceContent}</p>
            <div className="comments-section">
              <button className="toggle-comments-button" onClick={toggleComments}>
                {showComments ? 'Hide Comments' : 'Show Comments'}
              </button>
              {showComments && (
                <>
                  <h3>Comments</h3>
                  {resource.comments && resource.comments.length > 0 ? (
                    resource.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <p>{comment.comment}</p>
                        <p>Commented by: {comment.commentedBy}</p>
                      </div>
                    ))
                  ) : (
                    <p>No comments available</p>
                  )}
                </>
              )}
              <div className="add-comment-form">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment..."
                />
                <button onClick={handleAddComment}>Add Comment</button>
              </div>
              <div className="like-section">
                <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                  {isLiked ? <AiFillHeart color="red" /> : <AiOutlineHeart color="#ccc" />}
                  {isLiked ? ' Unlike' : ' Like'}
                </button>
                {isLoading && <ClipLoader color={'#0426FA'} loading={isLoading} size={20} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetailPage;
