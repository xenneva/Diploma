import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
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
                    setAttempts(response.data.data);
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

    // Функция для преобразования строки даты в объект Date
    const parseDate = (dateString) => {
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('.').map(Number);
        // Преобразуем год из двух цифр в четыре
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        return new Date(fullYear, month - 1, day,
            ...timePart.split(':').map(Number));
    };

    // Подготовка данных для графика
    const dataForChart = attempts.map(attempt => ({
        date: parseDate(attempt.pass_time).getTime(), // Преобразуем дату в миллисекунды
        score: attempt.score,
    }));

    return (
        <div className="statistics-container">
            <h1>Статистика прохождения тестов</h1>
            {attempts.length === 0 ? (
                <p>Нет попыток прохождения тестов.</p>
            ) : (
                <div>
                    {/* График */}
                    <h2>График результатов по датам</h2>
                    <LineChart width={600} height={300} data={dataForChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleString()} />
                        <YAxis />
                        <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </div>
            )}
        </div>
    );
};

export default StatisticsPage;