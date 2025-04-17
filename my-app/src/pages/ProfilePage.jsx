import React, { useEffect, useState } from 'react';
import axios from 'axios';
import profileImage from '../assets/profile.jpg';
import '../styles/ProfilePage.scss';

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
                    // Сортируем тесты по времени прохождения
                    const sortedTests = response.data.data.sort((a, b) => new Date(b.pass_time) - new Date(a.pass_time));
                    setTests(sortedTests); // Устанавливаем отсортированные тесты
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
        // Преобразуем строку "15.04.25 22:50:03" в "2025-04-15T22:50:03"
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('.');

        // Добавляем 2000 к году для получения полного года
        const fullYear = parseInt(year) + 2000;

        // Формируем строку в формате ISO
        const isoDateString = `${fullYear}-${month}-${day}T${timePart}`;

        const date = new Date(isoDateString);

        if (isNaN(date.getTime())) {
            return 'Некорректная дата'; // Обработка некорректной даты
        }

        const formattedDay = String(date.getDate()).padStart(2, '0');
        const formattedMonth = String(date.getMonth() + 1).padStart(2, '0');
        const formattedYear = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${formattedDay}.${formattedMonth}.${formattedYear} ${hours}:${minutes}`;
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
                        <form className="form-profile" onSubmit={handleUpdateProfile}>
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
                            <button className="button-update" type="submit">Обновить профиль</button>
                        </form>
                    </>
                )}
            </div>
            <div className="tests-container">
                <h2>Пройденные тесты</h2>
                {tests.length > 0 ? (
                    tests.map((test) => (
                        <div key={test.pass_time} className="test-card">
                            <h3>{test.test_name}</h3> {/* Отображаем имя теста */}
                            <p>Оценка: {test.score}</p>
                            <p>Дата прохождения: {formatDate(test.pass_time)}</p>
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