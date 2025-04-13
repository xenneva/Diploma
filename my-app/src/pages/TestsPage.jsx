import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TestCard from '../components/TestCard';
import '../styles/TestsPage.css';
import { useNavigate } from 'react-router-dom';

const TestsPage = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiAddress = 'http://127.0.0.1:8000/api/tests/';
    const navigate = useNavigate();
    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(apiAddress, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.result) {
                    const testsData = response.data.data.filter(test => test.id && test.name);
                    setTests(testsData);
                } else {
                    throw new Error(response.data.message || 'Не удалось загрузить тесты');
                }
            } catch (err) {
                console.error('Ошибка при загрузке тестов:', err);
                setError(err.message || 'Не удалось загрузить тесты');
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    const handleTestClick = (testId) => {
        navigate(`/tests/${testId}`); // Редирект на страницу TestPage с id теста
    };

    return (
        <div className="tests-container">
            <h2>Список тестов</h2>
            <div className="test-cards">
                <div>
                    {tests.map((test) => (
                        <TestCard key={test.id} test={test} onClick={handleTestClick}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestsPage;