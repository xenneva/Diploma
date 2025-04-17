import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
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
        const [datePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('.').map(Number);
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        return new Date(fullYear, month - 1, day); // Убираем время
    };

    // Подготовка данных для линейного графика
    const dataForLineChart = attempts.map(attempt => ({
        date: parseDate(attempt.pass_time).getTime(), // Преобразуем дату в миллисекунды
        score: attempt.score,
        test_name: attempt.test_name
    }));

    // Сортируем данные по дате
    dataForLineChart.sort((a, b) => a.date - b.date); // Сортировка по возрастанию

    // Подготовка данных для столбчатой диаграммы
    const dataForBarChart = attempts.reduce((accumulator, attempt) => {
        const existingTest = accumulator.find(item => item.test_name === attempt.test_name);

        if (existingTest) {
            existingTest.totalScore += attempt.score;
            existingTest.attempts_count += 1;
            existingTest.averageScore = existingTest.totalScore / existingTest.attempts_count; // Пересчитываем средний балл
        } else {
            accumulator.push({
                test_name: attempt.test_name,
                totalScore: attempt.score,
                attempts_count: 1,
                averageScore: attempt.score // Начальный средний балл
            });
        }

        return accumulator;
    }, []).map(item => ({
        test_name: item.test_name,
        averageScore: item.averageScore,
        attempts_count: item.attempts_count
    }));

    // Сортируем данные по тесту для столбчатой диаграммы
    dataForBarChart.sort((a, b) => a.test_name.localeCompare(b.test_name));

    return (
        <div className="statistics-container">
            <h1>Статистика прохождения тестов</h1>
            {attempts.length === 0 ? (
                <p>Нет попыток прохождения тестов.</p>
            ) : (
                <div className="dia">
                    <div className="charts-container">
                        {/* Столбчатая диаграмма */}
                        <div className="bar-chart-container">
                            <h2>Средний балл по тестам</h2>
                            <BarChart width={400} height={300} data={dataForBarChart}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="test_name"/>
                                <YAxis/>
                                <Tooltip
                                    formatter={(value) => [`${value}`, `Количество попыток: ${value.attempts_count}`]}
                                    labelFormatter={(label) => `Тест: ${label}`}
                                />
                                <Legend/>
                                <Bar dataKey="averageScore" fill="#8884d8"/>
                            </BarChart>
                        </div>

                        {/* Линейный график */}
                        <div className="line-chart-container">
                            <h2>График результатов по датам</h2>
                            <LineChart width={600} height={300} data={dataForLineChart}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(tick) => new Date(tick).toLocaleDateString()} // Форматируем дату
                                />
                                <YAxis/>
                                <Tooltip
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    formatter={(value, name, props) => [`${value}`, `Тест ${props.payload.test_name}`]}
                                />
                                <Legend/>
                                {/* Отображаем все результаты по датам */}
                                <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{r: 8}}/>
                            </LineChart>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatisticsPage;