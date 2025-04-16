import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Измените useHistory на useNavigate
import axios from 'axios';

const TestPage = () => {
    const { id } = useParams(); // Получаем id теста из URL
    const navigate = useNavigate(); // Используем useNavigate для навигации
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
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
                    setQuestions(response.data.data.questions);
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

    const handleAnswerChange = (questionId, answer) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            // Формируем массив ответов в нужном формате
            const answersToSubmit = Object.entries(userAnswers).map(([id, answer]) => ({
                id: parseInt(id),
                answer: answer,
            }));

            // Отправляем результаты попытки на сервер
            const response = await axios.post(`${apiAddress}${id}/pass`, { answers: answersToSubmit }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Проверяем результат ответа от сервера
            if (response.data.result) {
                navigate('/result', { state: { result: response.data.message || 'Вы успешно отправили ответы!' } });
            } else {
                navigate('/result', { state: { result: `Ошибка при отправке ответов: ${response.data.message}` } });
            }
        } catch (err) {
            console.error('Ошибка при проверке ответов:', err);
            setError(err.message || 'Не удалось проверить ответы');
        }
    };

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="test-page">
            <h2>Вопросы теста</h2>
            <form onSubmit={handleSubmit}>
                <ul>
                    {questions.map((question) => (
                        <li key={question.id}>
                            <p>{question.text}</p>
                            <input
                                type="text"
                                value={userAnswers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                placeholder="Ваш ответ"
                            />
                        </li>
                    ))}
                </ul>
                <button type="submit">Ответить</button>
            </form>
        </div>
    );
};

export default TestPage;