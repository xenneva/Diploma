import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateTestPage = () => {
    // Исправленный базовый URL API
    const baseUrl = 'http://127.0.0.1:8000/api';

    // Получение токена из localStorage
    const token = localStorage.getItem('token');

    const [testName, setTestName] = useState('');
    const [searchParams, setSearchParams] = useState({
        level: 'B2',
        text: '',
        type: '',
    });
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [creatingTest, setCreatingTest] = useState(false);
    const [message, setMessage] = useState('');

    // Получение всех вопросов при монтировании
    useEffect(() => {
        fetchQuestions();
    }, []);

    // Функция получения вопросов
    const fetchQuestions = async () => {
        try {
            setLoadingQuestions(true);
            const response = await axios.get(`${baseUrl}/questions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data && response.data.data) {
                // добавляем уровень "B2" ко всем вопросам
                const questionsWithLevel = response.data.data.map(q => ({
                    ...q,
                    level: 'B2',
                }));
                setQuestions(questionsWithLevel);
                setFilteredQuestions(questionsWithLevel);
            }
        } catch (error) {
            console.error('Ошибка при получении вопросов:', error);
        } finally {
            setLoadingQuestions(false);
        }
    };

    // Фильтрация вопросов по поисковым параметрам
    const handleSearch = () => {
        let filtered = questions.filter(q => {
            const matchesText = searchParams.text ? q.text.toLowerCase().includes(searchParams.text.toLowerCase()) : true;
            const matchesType = searchParams.type ? q.type === searchParams.type : true;
            // уровень фиксирован "B2"
            const matchesLevel = q.level === 'B2';
            return matchesText && matchesType && matchesLevel;
        });
        setFilteredQuestions(filtered);
    };

    // Обработка выбора вопроса для добавления в тест
    const toggleQuestionSelection = (questionId) => {
        if (selectedQuestions.includes(questionId)) {
            setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
        } else {
            setSelectedQuestions([...selectedQuestions, questionId]);
        }
    };

    // Создание теста
    const handleCreateTest = async () => {
        if (!testName.trim()) {
            alert('Введите название теста');
            return;
        }
        if (selectedQuestions.length === 0) {
            alert('Добавьте вопросы в тест');
            return;
        }

        try {
            setCreatingTest(true);
            // Формируем payload: список вопросов по их id
            const payload = {
                name: testName,
                questions: selectedQuestions,
            };

            // Отправляем POST-запрос на создание теста с заголовком авторизации
            const response = await axios.post(`${baseUrl}/tests`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.result) {
                setMessage('Тест успешно создан!');
                // Очистка формы
                setTestName('');
                setSelectedQuestions([]);
            } else {
                setMessage(`Ошибка: ${response.data.message || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            console.error('Ошибка при создании теста:', error);
            setMessage('Произошла ошибка при создании теста.');
        } finally {
            setCreatingTest(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Создать новый тест</h2>

            {/* Название теста */}
            <div>
                <label>Название теста:</label><br />
                <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    style={{ width: '300px' }}
                />
            </div>

            {/* Поиск вопросов */}
            <h3 style={{ marginTop: '20px' }}>Поиск вопросов</h3>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <div>
                    <label>Текст вопроса:</label><br />
                    <input
                        type="text"
                        value={searchParams.text}
                        onChange={(e) => setSearchParams({ ...searchParams, text: e.target.value })}
                        placeholder="Введите текст"
                        style={{ width: '200px' }}
                    />
                </div>

                <div>
                    <label>Тип ответа:</label><br />
                    <select
                        value={searchParams.type}
                        onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
                        style={{ width: '150px' }}
                    >
                        <option value="">Все</option>
                        <option value="simple">Simple</option>
                        <option value="choice">Choice</option>
                        <option value="multi_choice">Multi Choice</option>
                        {/* добавьте другие типы по необходимости */}
                    </select>
                </div>

                {/* Уровень фиксирован "B2" */}

                <button onClick={handleSearch}>Поиск</button>
            </div>





















            {/* Список вопросов */}

            {loadingQuestions ? (
                <p>Загрузка вопросов...</p>
            ) : (
                <>
                    {filteredQuestions.length === 0 ? (
                        <p>Нет подходящих вопросов.</p>
                    ) : (
                        <table border="1" cellPadding="5" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr>
                                <th>Выбрать</th>
                                <th>Текст вопроса</th>
                                <th>Тип вопроса</th>
                                <th>Уровень</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredQuestions.map((q) => (
                                <tr key={q.id}>
                                    <td style={{ textAlign: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestions.includes(q.id)}
                                            onChange={() => toggleQuestionSelection(q.id)}
                                        />
                                    </td>
                                    <td>{q.text}</td>
                                    <td>{q.type}</td>
                                    {/* Уровень фиксирован "B2" */}
                                    <td>B2</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}

            {/* Список выбранных вопросов */}
            <h3 style={{ marginTop: '20px' }}>Вопросы в тесте:</h3>
            {selectedQuestions.length === 0 ? (
                <p>Нет выбранных вопросов.</p>
            ) : (
                <ul>
                    {selectedQuestions.map((qid) => {
                        const questionObj = questions.find(q => q.id === qid);
                        return (
                            questionObj && (
                                <li key={qid}>
                                    {questionObj.text} ({questionObj.type})
                                </li>
                            )
                        );
                    })}
                </ul>
            )}

            {/* Кнопка создания теста */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleCreateTest} disabled={creatingTest}>
                    {creatingTest ? 'Создается...' : 'Создать тест'}
                </button>
            </div>

            {/* Сообщение о результате */}
            {message && (
                <p style={{ marginTop: '10px', color: message.startsWith('Ошибка') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}

        </div>);
};

export default CreateTestPage;