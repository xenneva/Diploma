import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AuthPage.scss';
import { useNavigate } from "react-router-dom"; // Импортируйте стили для страницы

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState(''); // Состояние для имени пользователя
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const apiAddress = 'http://127.0.0.1:8000/api/';
    const navigate = useNavigate(); // Инициализируем navigate

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError(null); // Сбрасываем ошибку при переключении форм
        setName(''); // Сбрасываем имя пользователя при переключении форм
        setEmail(''); // Сбрасываем email при переключении форм
        setPassword(''); // Сбрасываем пароль при переключении форм
        setConfirmPassword(''); // Сбрасываем подтверждение пароля при переключении форм
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        setLoading(true);
        setError(null); // Сбрасываем ошибки перед новым запросом

        try {
            const url = isLogin ? apiAddress + 'login' : apiAddress + 'register';
            const response = await axios.post(url, {
                email,
                password,
                ...(isLogin ? {} : { name, confirmPassword }), // Добавляем username и confirmPassword только для регистрации
            });

            // Обработка успешного ответа
            console.log('Успех:', response.data);

            // Сохранение Bearer токена в localStorage
            localStorage.setItem('token', response.data.token); // Предполагается, что токен приходит в response.data.token

            // Перенаправление на страницу профиля
            navigate('/profile');

        } catch (err) {
            console.error('Ошибка:', err);
            setError(isLogin ? 'Неверные учетные данные' : 'Ошибка регистрации'); // Устанавливаем сообщение об ошибке
        } finally {
            setLoading(false); // Сбрасываем состояние загрузки
            window.location.reload();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Имя пользователя</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? (isLogin ? 'Загрузка...' : 'Создание...') : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>
                <p onClick={toggleForm} className="toggle-form">
                    {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
                </p>
            </div>
        </div>
    );
};

export default AuthPage;