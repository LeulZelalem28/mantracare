import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';

const FeedbackForm = ({ therapistId, onSubmit, loading }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [error, setError] = useState(null);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!rating || !reviewText) {
            setError('Rating and comment are required.');
            return;
        }

        const feedback = {
            therapistId,
            rating,
            comment: reviewText,
        };

        onSubmit(feedback);
    };

    return (
        <form onSubmit={handleSubmitReview}>
            <div>
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                    How would you rate the overall experience?
                </h3>
                <div>
                    {[...Array(5)].map((_, index) => {
                        index += 1;
                        return (
                            <button
                                key={index}
                                type='button'
                                className={`${
                                    index <= (rating || hover)
                                        ? "text-yellowColor"
                                        : "text-gray-400"
                                } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                                onClick={() => setRating(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <span><AiFillStar /></span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className='mt-[30px]'>
                <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
                    Share your feedback or suggestion
                </h3>
                <textarea
                    className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md"
                    rows="5"
                    placeholder='Write your message'
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button type='submit' className='btn'>
                {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
        </form>
    );
};

export default FeedbackForm;
