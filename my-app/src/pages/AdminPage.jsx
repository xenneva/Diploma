// AdminPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();

    const handleCreateTest = () => {
        navigate('/createTest');
    };

    const handleAddQuestion = () => {
        navigate('/addQuestion');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontSize: '24px'
        }}>
            <h1>Добро пожаловать в панель администрирования!</h1>
            <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                <button onClick={handleCreateTest}>Создать тест</button>
                <button onClick={handleAddQuestion}>Добавить вопрос</button>
            </div>
        </div>
    );
};

export default AdminPage;