import React from 'react';
import './ResourceList.css';

const ResourceCard = ({ resource }) => {
    return (
        <div className="blog-page-resource-card">
            <h2>{resource.resourceTitle}</h2>
            <p>{resource.resourceDescription}</p>
            <div className="meta">
                <span>Author: {resource.resourceAuthor}</span>
                <span> | </span>
                <span>Date: {new Date(resource.resourceTimeStamp).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default ResourceCard;
