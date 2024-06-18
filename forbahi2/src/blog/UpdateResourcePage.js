import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import './UpdateResourcePage.css';

const UpdateResourcePage = ({ accessToken }) => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [resourceTitle, setResourceTitle] = useState('');
    const [resourceContent, setResourceContent] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
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
                setResourceTitle(data.resourceTitle);
                setResourceContent(data.resourceContent);
            } else {
                const errorMessages = await response.json();
                setMessage(errorMessages.message || 'Failed to fetch resource');
            }
        } catch (error) {
            setMessage('Failed to fetch resource');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true); // Start loading state

            const response = await fetch(`${baseUrl}/resources/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resourceTitle,
                    resourceContent,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(result.message || 'Resource updated successfully');
                navigate(`/resources/${id}`); // Redirect to resource detail page
            } else {
                const errorMessages = await response.json();
                setMessage(errorMessages.message || 'Failed to update resource');
            }
        } catch (error) {
            setMessage('Failed to update resource');
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <div className="update-resource-page">
            <h2>Update Resource</h2>
            {isLoading ? (
                <div className="resource-detail-page-spinner">
                    <ClipLoader color={'#0426FA'} loading={isLoading} size={100} aria-label="Loading Spinner" />
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {message && <p className="message">{message}</p>}
                    <label htmlFor="resourceTitle">Resource Title</label>
                    <input
                        type="text"
                        id="resourceTitle"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                        required
                    />
                    <label htmlFor="resourceContent">Resource Content</label>
                    <textarea
                        id="resourceContent"
                        value={resourceContent}
                        onChange={(e) => setResourceContent(e.target.value)}
                        required
                    />
                    <button type="submit">Update Resource</button>
                </form>
            )}
        </div>
    );
};

export default UpdateResourcePage;
