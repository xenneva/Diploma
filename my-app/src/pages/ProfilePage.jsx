import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiAddress = 'http://127.0.0.1:8000/api/';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token'); // Получаем токен из localStorage
                const response = await axios.get(apiAddress + 'profile', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Добавляем заголовок Authorization с токеном
                    },
                });

                setUserData(response.data); // Устанавливаем данные пользователя
            } catch (err) {
                console.error('Ошибка при получении данных пользователя:', err);
                setError('Не удалось загрузить данные пользователя');
            } finally {
                setLoading(false); // Сбрасываем состояние загрузки
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Профиль пользователя</h1>
            {userData && (
                <>
                    <p>Email: {userData.email}</p>
                    {/* Другие данные пользователя */}
                </>
            )}
        </div>
    );
};

export default ProfilePage;