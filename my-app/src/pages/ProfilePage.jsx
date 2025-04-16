import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profileImage from '../assets/profile.jpg'; // Импортируем изображение
import '../styles/ProfilePage.scss' // Импортируем CSS файл для стилей

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [tests, setTests] = useState([]);
    const apiAddress = 'http://127.0.0.1:8000/api/';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(apiAddress + 'me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.result) {
                    setUserData(response.data.data);
                    setName(response.data.data.name);
                } else {
                    throw new Error(response.data.message || 'Не удалось загрузить данные пользователя');
                }
            } catch (err) {
                console.error('Ошибка при получении данных пользователя:', err);
                setError('Не удалось загрузить данные пользователя');
            } finally {
                setLoading(false);
            }
        };

        const fetchTests = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(apiAddress + 'my', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.result) {
                    setTests(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Не удалось загрузить тесты');
                }
            } catch (err) {
                console.error('Ошибка при получении тестов:', err);
            }
        };

        fetchUserData();
        fetchTests();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            await axios.put(apiAddress + 'updateUser', { name, password }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Данные профиля успешно обновлены!');
        } catch (err) {
            console.error('Ошибка при обновлении данных профиля:', err);
            alert('Не удалось обновить данные профиля');
        }
    };

    // Функция для форматирования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Некорректная дата'; // Обработка некорректной даты
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="profile-container">
            <div className="avatar-container">
                <img src={profileImage} alt="Аватар" className="avatar" />
            </div>
            <div className="profile-info">
                <h1>Профиль пользователя</h1>
                {userData && (
                    <>
                        <p>Email: {userData.email}</p>
                        <form onSubmit={handleUpdateProfile}>
                            <div>
                                <label>
                                    Имя:
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label>
                                    Пароль:
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>
                            <button type="submit">Обновить профиль</button>
                        </form>
                    </>
                )}
            </div>
            <div className="tests-container">
                <h2>Пройденные тесты</h2>
                {tests.length > 0 ? (
                    tests.map((test) => (
                        <div key={test.test_id} className="test-card">
                            <h3>{test.test_name}</h3>
                            <p>Оценка: {test.score}</p>
                            <p>Дата прохождения: {formatDate(test.pass_time)}</p> {/* Используем функцию форматирования */}
                        </div>
                    ))
                ) : (
                    <p>Нет пройденных тестов.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;