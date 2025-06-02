import React, { useState } from 'react';
import axios from 'axios';

const apiAddress = 'http://127.0.0.1:8000/api/';

const AddQuestionPage = () => {
    const [text, setText] = useState('');
    const [type, setType] = useState('choice'); // по умолчанию
    const [choices, setChoices] = useState(['']); // массив вариантов
    const [correctAnswers, setCorrectAnswers] = useState([]); // индексы правильных ответов
    const [singleCorrectAnswer, setSingleCorrectAnswer] = useState(''); // для simple
    const [allowSynonyms, setAllowSynonyms] = useState(false); // флаг для simple
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAddChoice = () => {
        setChoices([...choices, '']);
    };

    const handleChoiceChange = (index, value) => {
        const newChoices = [...choices];
        newChoices[index] = value;
        setChoices(newChoices);
    };

    const handleCheckboxChange = (index) => {
        if (correctAnswers.includes(index)) {
            setCorrectAnswers(correctAnswers.filter(i => i !== index));
        } else {
            setCorrectAnswers([...correctAnswers, index]);
        }
    };

    const handleSubmit = async () => {
        // Формируем payload в зависимости от типа вопроса
        const level = 3; // Можно сделать динамическим или оставить фиксированным
        let dataPayload = {
            text,
            answers: [],
            enable_synonyms: false,
            type,
            level,
        };

        if (type === 'simple') {
            dataPayload.answers.push({
                text: singleCorrectAnswer,
                is_correct: true,
            });
            dataPayload.enable_synonyms = allowSynonyms;
        } else if (type === 'choice') {
            choices.forEach((answerText, index) => {
                dataPayload.answers.push({
                    text: answerText,
                    is_correct: index === correctAnswers[0],
                });
            });
        } else if (type === 'multi_choice') {
            choices.forEach((answerText, index) => {
                dataPayload.answers.push({
                    text: answerText,
                    is_correct: correctAnswers.includes(index),
                });
            });
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token'); // получаем токен из localStorage
            const response = await axios.post(`${apiAddress}questions`, dataPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.result) {
                setMessage('Вопрос успешно добавлен!');
                // Очистка формы
                setText('');
                setChoices(['']);
                setCorrectAnswers([]);
                setSingleCorrectAnswer('');
                setAllowSynonyms(false);
            } else {
                setMessage(`Ошибка: ${response.data.message}`);
            }
        } catch (err) {
            console.error(err);
            setMessage('Произошла ошибка при отправке.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Добавить вопрос</h2>

            <div>
                <label>Текст вопроса:</label><br />
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    cols={50}
                />
            </div>

            <div style={{ marginTop: '10px' }}>
                <label>Тип вопроса:</label>
                <select
                    value={type}
                    onChange={(e) => {
                        const newType = e.target.value;
                        setType(newType);
                        // сбрасываем связанные состояния при смене типа
                        if (newType !== 'simple') {
                            setSingleCorrectAnswer('');
                            setAllowSynonyms(false);
                        }
                        if (newType !== 'choice' && newType !== 'multi_choice') {
                            setChoices(['']);
                            setCorrectAnswers([]);
                        }
                    }}
                >
                    <option value="choice">Выбор одного</option>
                    <option value="multi_choice">Множественный выбор</option>
                    <option value="simple">Вписывание</option>
                </select>
            </div>

            {/* Варианты для choice и multi_choice */}
            {(type === 'choice' || type === 'multi_choice') && (
                <div style={{ marginTop: '10px' }}>
                    <h4>Варианты ответов:</h4>
                    {choices.map((choice, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            {type === 'choice' ? (
                                <input
                                    type="radio"
                                    name="correct"
                                    checked={correctAnswers[0] === index}
                                    onChange={() => setCorrectAnswers([index])}
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={correctAnswers.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                />
                            )}
                            <input
                                type="text"
                                value={choice}
                                onChange={(e) => handleChoiceChange(index, e.target.value)}
                                placeholder={`Ответ ${index + 1}`}
                                style={{ marginLeft: '5px', width: '200px' }}
                            />
                        </div>
                    ))}
                    <button onClick={handleAddChoice}>Добавить вариант</button>
                </div>
            )}

            {/* Для simple — ввод правильного ответа и флаг "разрешить синонимы" */}
            {type === 'simple' && (
                <div style={{ marginTop: '10px' }}>
                    <label>Правильный ответ:</label><br />
                    <input
                        type="text"
                        value={singleCorrectAnswer}
                        onChange={(e) => setSingleCorrectAnswer(e.target.value)}
                        placeholder="Введите правильный ответ"
                        style={{ width: '300px' }}
                    />

                    {/* Чекбокс "Разрешить синонимы" */}
                    <div style={{ marginTop: '10px' }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={allowSynonyms}
                                onChange={(e) => setAllowSynonyms(e.target.checked)}
                            /> Разрешить синонимы
                        </label>
                    </div>
                </div>
            )}

            {/* Кнопка отправки */}
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Отправка...' : 'Добавить вопрос'}
                </button>
            </div>

            {message && (
                <p style={{ marginTop: '10px', color: message.startsWith('Ошибка') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AddQuestionPage;