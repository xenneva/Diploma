import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TestCard from '../components/TestCard';

const TestsPage = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]); // Состояние для хранения вопросов
    const apiAddress = 'http://127.0.0.1:8000/api/tests/'; // Убедитесь, что адрес правильный

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

    // Функция для обработки клика по карточке теста
    const handleTestClick = async (testId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${apiAddress}${testId}/questions/`, { // Предполагаем, что API возвращает вопросы по этому адресу
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.result) {
                setQuestions(response.data.data); // Устанавливаем вопросы в состояние
                console.log('Вопросы:', response.data.data); // Выводим вопросы в консоль
            } else {
                throw new Error(response.data.message || 'Не удалось загрузить вопросы');
            }
        } catch (err) {
            console.error('Ошибка при загрузке вопросов:', err);
            setError(err.message || 'Не удалось загрузить вопросы');
        }
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="tests-container">
            <h2>Список тестов</h2>
            <div className="test-cards">
                {tests.map((test) => (
                    <TestCard key={test.id} test={test} onClick={handleTestClick} /> // Используем компонент TestCard
                ))}
            </div>
            {/* Здесь можно отобразить список вопросов */}
            {questions.length > 0 && (
                <div className="questions-container">
                    <h3>Список вопросов</h3>
                    <ul>
                        {questions.map((question) => (
                            <li key={question.id}>{question.text}</li> // Предполагаем, что у каждого вопроса есть уникальный id и текст
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TestsPage;