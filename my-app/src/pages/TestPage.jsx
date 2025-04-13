import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TestPage = () => {
    const { id } = useParams(); // Получаем id теста из URL
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiAddress = 'http://127.0.0.1:8000/api/tests/';

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiAddress}${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.result) {
                    // Извлекаем массив вопросов из ответа
                    setQuestions(response.data.data.questions); // Устанавливаем вопросы в состояние
                } else {
                    throw new Error(response.data.message || 'Не удалось загрузить вопросы');
                }
            } catch (err) {
                console.error('Ошибка при загрузке вопросов:', err);
                setError(err.message || 'Не удалось загрузить вопросы');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [id]);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="test-page">
            <h2>Вопросы теста</h2>
            <ul>
                {questions.map((question) => (
                    <li key={question.id}>{question.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default TestPage;