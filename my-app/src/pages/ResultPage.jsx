import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultPage = () => {
    const location = useLocation();
    const { result } = location.state || { result: 'Нет данных о результате' };

    return (
        <div className="result-page">
            <h2>Результат теста</h2>
            <p>{result}</p>
            <button onClick={() => window.location.href = '/profile'}>Перейти в профиль</button>
        </div>
    );
};

export default ResultPage;