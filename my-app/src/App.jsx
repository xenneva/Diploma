import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'; // Импортируйте страницу профиля
import StatisticsPage from './pages/StatisticsPage';
import TestsPage from "./pages/TestsPage.jsx";
import './styles/App.scss';
import TestPage from "./pages/TestPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import AddQuestionPage from "./pages/AddQuestionPage.jsx";
import CreateTestPage from "./pages/CreateTestPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
const App = () => {
    const token = localStorage.getItem('token'); // Проверяем наличие токена

    const handleLogout = () => {
        localStorage.removeItem('token'); // Удаляем токен при выходе
        window.location.reload(); // Перезагружаем страницу для обновления состояния
    };

    return (
        <Router>
            <div>
                <header className="app-header">
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Главная</Link>
                            </li>
                            {token ? (
                                <>
                                    <li>
                                        <Link to="/profile">Профиль</Link>
                                    </li>
                                    <li>
                                        <Link to="/statistics">Статистика</Link>
                                    </li>
                                    <li>
                                        <Link to="/tests">Тесты</Link>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link to="/auth">Вход</Link>
                                </li>
                            )}
                        </ul>
                        {token && (
                            <button className="buttonLogout" onClick={handleLogout}>Выход</button>
                        )}
                    </nav>
                </header>

                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={token ? <Navigate to="/profile" /> : <AuthPage />} />
                        <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/auth" />} />
                        <Route path="/statistics" element={token ? <StatisticsPage /> : <Navigate to="/auth" />} />
                        <Route path="/tests" element={token ? <TestsPage /> : <Navigate to="/auth" />} />
                        <Route path="/tests/:id" element={<TestPage />} />
                        <Route path="/result" element={<ResultPage />} />
                        <Route path="/addQuestion" element={<AddQuestionPage />} />
                        <Route path="/createTest" element={<CreateTestPage />} />
                        <Route path="/quiz" element={<QuizPage />} />
                        <Route path="/adminPage" element={<AdminPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;