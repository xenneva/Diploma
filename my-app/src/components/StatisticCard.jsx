import React from 'react';
import PropTypes from 'prop-types';
import '../styles/StatisticCard.scss';

const StatisticCard = ({ attempt, onClick }) => {
    return (
        <div className="statistic-card" onClick={() => onClick(attempt.test_id)}>
            <h3>{attempt.test_name}</h3>
            <p>Score: {attempt.score}</p>
        </div>
    );
};

StatisticCard.propTypes = {
    attempt: PropTypes.shape({
        test_id: PropTypes.number.isRequired,
        test_name: PropTypes.string.isRequired,
        score: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default StatisticCard;