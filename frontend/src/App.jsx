import { useState } from 'react';
import axios from 'axios';
import './App.css';

function AddEmployee() {
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        dateOfJoining: '',
        role: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({}); 
    const today = new Date().toISOString().split('T')[0];
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'employeeId') {
            const integerOnly = value.replace(/[^0-9]/g, ''); 
            setFormData({ ...formData, [name]: integerOnly });
            return;
        }
        if (name === 'name') {
            const alphabetOnly = value.replace(/[^a-zA-Z\s]/g, ''); 
            setFormData({ ...formData, [name]: alphabetOnly });
            return;
        }
        if (name === 'phone') {
            const phoneValue = value.replace(/\D/g, ''); 
            if (phoneValue.length <= 10) {
                setFormData({ ...formData, [name]: phoneValue });
            }
            return;
        }

        setFormData({ ...formData, [name]: value });
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');
        setValidationErrors({});

        const errors = {};
        if (!formData.employeeId || isNaN(formData.employeeId)) {
            errors.employeeId = 'Employee ID must be a valid integer';
        }

        if (!isValidEmail(formData.email)) {
            errors.email = 'Please enter a valid email address (e.g., example@gmail.com)';
        }

        if (formData.phone.length !== 10) {
            errors.phone = 'Phone number must be exactly 10 digits';
        }
        if (!formData.dateOfJoining || formData.dateOfJoining > today) {
            errors.dateOfJoining = 'Date of joining cannot be in the future';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/employee', formData);
            setSuccessMessage(response.data.message);
            setFormData({
                employeeId: '',
                name: '',
                email: '',
                phone: '',
                department: '',
                dateOfJoining: '',
                role: '',
            });
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Something went wrong!');
        }
    };

    const handleReset = () => {
        setFormData({
            employeeId: '',
            name: '',
            email: '',
            phone: '',
            department: '',
            dateOfJoining: '',
            role: '',
        });
        setSuccessMessage('');
        setErrorMessage('');
        setValidationErrors({});
    };

    return (
        <div className="container">
            <h1>Employee Management</h1>
            {successMessage && <p className="message success">{successMessage}</p>}
            {errorMessage && <p className="message error">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Employee ID:
                    <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                    />
                    {validationErrors.employeeId && (
                        <p className="error-text">{validationErrors.employeeId}</p>
                    )}
                </label>

                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    {validationErrors.name && <p className="error-text">{validationErrors.name}</p>}
                </label>

                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {validationErrors.email && <p className="error-text">{validationErrors.email}</p>}
                </label>

                <label>
                    Phone:
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    {validationErrors.phone && <p className="error-text">{validationErrors.phone}</p>}
                </label>

                <label>
                    Department:
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                    </select>
                </label>

                <label>
                    Date of Joining:
                    <input
                        type="date"
                        name="dateOfJoining"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                        max={today} 
                        required
                    />
                    {validationErrors.dateOfJoining && (
                        <p className="error-text">{validationErrors.dateOfJoining}</p>
                    )}
                </label>

                <label>
                    Role:
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                </label>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit">Submit</button>
                    <button
                        type="button"
                        onClick={handleReset}
                        style={{ backgroundColor: '#f44336', color: '#fff' }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddEmployee;
