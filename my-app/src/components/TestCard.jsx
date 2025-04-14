import React from 'react';
import PropTypes from 'prop-types';
import '../styles/TestCard.scss'

const TestCard = ({ test, onClick }) => {
    return (
        <div className="test-card" onClick={() => onClick(test.id)}>
            <h3>{test.name}</h3>
            <p>{test.description || 'Описание отсутствует'}</p>
        </div>
    );
};

TestCard.propTypes = {
    test: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default TestCard;