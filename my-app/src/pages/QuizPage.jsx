import React, { useState } from 'react';

const QuizPage = () => {
    // Предположим, что данные получены и сохранены в состоянии
    const questions = [
        {
            id: 44,
            text: "Choose the correct word: «You look ___?»",
            type: "choice",
            choices: ["kitten", "dog", "cow"]
        },
        {
            id: 45,
            text: "Choose the correct word: «You look ___?»",
            type: "multy_choice",
            choices: ["kitten", "puppy", "dog", "cow"]
        },
        {
            id: 46,
            text: "Choose the correct word: «You look ___?»",
            type: "simple"
        }
    ];

    // Состояние для ответов
    const [answers, setAnswers] = useState({});

    const handleRadioChange = (questionId, choice) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: choice
        }));
    };

    const handleCheckboxChange = (questionId, choice) => {
        setAnswers(prev => {
            const prevAnswers = prev[questionId] || [];
            if (prevAnswers.includes(choice)) {
                // Удаляем выбор
                return {
                    ...prev,
                    [questionId]: prevAnswers.filter(c => c !== choice)
                };
            } else {
                // Добавляем выбор
                return {
                    ...prev,
                    [questionId]: [...prevAnswers, choice]
                };
            }
        });
    };

    const handleInputChange = (questionId, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>Тест</h1>

            {questions.map((q) => (
                <div key={q.id} style={{ marginBottom: '20px' }}>
                    <p>{q.text}</p>

                    {q.type === 'choice' && (
                        q.choices.map((choice) => (
                            <label key={choice} style={{ display: 'block' }}>
                                <input
                                    type="radio"
                                    name={`question-${q.id}`} // имя группы радиокнопок
                                    checked={answers[q.id] === choice}
                                    onChange={() => handleRadioChange(q.id, choice)}
                                />
                                {choice}
                            </label>
                        ))
                    )}

                    {q.type === 'multy_choice' && (
                        q.choices.map((choice) => (
                            <label key={choice} style={{ display: 'block' }}>
                                <input
                                    type="checkbox"
                                    checked={(answers[q.id] || []).includes(choice)}
                                    onChange={() => handleCheckboxChange(q.id, choice)}
                                />
                                {choice}
                            </label>
                        ))
                    )}

                    {q.type === 'simple' && (
                        <input
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    )}
                </div>
            ))}

            {/* Можно добавить кнопку отправки */}
            <button onClick={() => console.log(answers)}>Отправить</button>
        </div>
    );
};

export default QuizPage;