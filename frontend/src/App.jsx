import { Dashboard } from '@pages/Dashboard/Dashboard';
import { Register } from './pages/Register/Register.jsx';
import { Login } from './pages/Login/Login.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <>
            <Routes>
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </>
    );
}

export default App;
