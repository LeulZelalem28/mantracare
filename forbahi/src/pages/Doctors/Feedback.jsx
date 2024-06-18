import React, { useState, useEffect } from 'react';
import avatar from '../../assets/images/avatar-icon.png';
import { useGlobalState } from '../../provider/GlobalStateProvider';
import { AiFillStar } from "react-icons/ai";
import FeedbackForm from "./FeedbackForm";

const Feedback = ({ therapist }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { accessToken } = useGlobalState();

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const response = await fetch(`http://localhost:3500/feedbackAndRating/therapist/${therapist.therapistId}`, requestOptions);
                const data = await response.json();
                setFeedbacks(data.feedbacks || []);
                setTotalFeedbacks(data.totalFeedbacks || 0);
            } catch (error) {
                console.error('Failed to fetch feedbacks:', error);
            }
        };

        fetchFeedbacks();
    }, [therapist.therapistId, accessToken, feedbacks]);

    const handleFeedbackSubmit = async (feedback) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3500/feedbackAndRating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(feedback),
            });

            if (response.ok) {
                const newFeedback = await response.json();
                setFeedbacks(prevFeedbacks => [newFeedback, ...prevFeedbacks]);
                setTotalFeedbacks(prevTotal => prevTotal + 1);
                setShowFeedbackForm(false);
            } else {
                console.error('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
    
      const profilePic = setProfilePicData(therapist);

    return (
        <div>
            <div className="mb-[50px]">
                <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px]">
                    All reviews ({totalFeedbacks})
                </h4>
                {feedbacks.map((feedback) => (
                    <div key={feedback.feedbackId} className="flex justify-between gap-10 mb-[30px]">
                        <div className="flex gap-3">
                            {/* <figure className="w-10 h-10 rounded-full">
                                <img className="w-full" src={avatar} alt="" />
                            </figure> */}
                            <div>
                                <h5 className="text-[15px] leading-6 text-primaryColor font-bold">
                                    {feedback.raterName}
                                </h5>
                                <p className="text-[16px] leading-6 text-textColor">
                                    {formatDate(feedback.timeStamp)}
                                </p>
                                <p className="text__para mt-3 font-medium text-[15px]">
                                    {feedback.comment}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, index) => (
                                <AiFillStar key={index} color={index < feedback.rating ? "#0067FF" : "#ccc"} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {!showFeedbackForm && (
                <div className="text-center">
                    <button className="btn" onClick={() => setShowFeedbackForm(true)}>
                        Give Feedback
                    </button>
                </div>
            )}
            {showFeedbackForm && <FeedbackForm therapistId={therapist.therapistId} onSubmit={handleFeedbackSubmit} loading={loading} />}
        </div>
    );
};

export default Feedback;
