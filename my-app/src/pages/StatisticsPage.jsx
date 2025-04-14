import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatisticCard from '../components/StatisticCard'; // Импортируем StatisticCard
import '../styles/StatisticsPage.scss';

const StatisticsPage = () => {
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiAddress = 'http://127.0.0.1:8000/api/';

    useEffect(() => {
        const fetchAttempts = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiAddress}my`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.result) {
                    setAttempts(response.data.data); // Устанавливаем попытки в состояние
                } else {
                    throw new Error(response.data.message || 'Не удалось загрузить статистику');
                }
            } catch (err) {
                console.error('Ошибка при загрузке статистики:', err);
                setError(err.message || 'Не удалось загрузить статистику');
            } finally {
                setLoading(false);
            }
        };

        fetchAttempts();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="statistics-container">
            <h1>Статистика прохождения тестов</h1>
            {attempts.length === 0 ? (
                <p>Нет попыток прохождения тестов.</p>
            ) : (
                <div className="statistic-cards">
                    {attempts.map((attempt) => (
                        <StatisticCard
                            key={attempt.test_id}
                            attempt={attempt}
                            onClick={(id) => console.log(`Clicked on test with ID: ${id}`)} // Обработчик клика
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default StatisticsPage;