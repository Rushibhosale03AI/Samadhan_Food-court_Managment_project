import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Admin = () => {
    const [menu, setMenu] = useState({ menu_id: '', name: '', price: '', description: '' });
    const [menus, setMenus] = useState([]);
    const [staff, setStaff] = useState({ staff_id: '', staff_name: '', salary: '', designation: '' });
    const [staffList, setStaffList] = useState([]);

    const handleMenuSubmit = async () => {
        try {
            await fetch('http://localhost:5000/api/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(menu),
            });
            toast.success('Menu item added successfully!');
            fetchMenus();
        } catch (error) {
            console.error('Error adding menu item:', error);
            toast.error('Failed to add menu item. Please try again.');
        }
    };

    const handleStaffSubmit = async () => {
        try {
            await fetch('http://localhost:5000/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(staff),
            });
            toast.success('Staff added successfully!');
            fetchStaff();
        } catch (error) {
            console.error('Error adding staff:', error);
            toast.error('Failed to add staff. Please try again.');
        }
    };

    const fetchMenus = async () => {
        const response = await fetch('http://localhost:5000/api/menu');
        const data = await response.json();
        setMenus(data);
    };

    const fetchStaff = async () => {
        const response = await fetch('http://localhost:5000/api/staff');
        const data = await response.json();
        setStaffList(data);
    };

    useEffect(() => {
        fetchMenus();
        fetchStaff();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <h2 style={styles.heading}>Menu Operations</h2>
                <input
                    style={styles.input}
                    placeholder="Menu ID"
                    onChange={(e) => setMenu({ ...menu, menu_id: e.target.value })}
                />
                <input
                    style={styles.input}
                    placeholder="Menu Name"
                    onChange={(e) => setMenu({ ...menu, name: e.target.value })}
                />
                <input
                    style={styles.input}
                    placeholder="Price"
                    onChange={(e) => setMenu({ ...menu, price: e.target.value })}
                />
                <input
                    style={styles.input}
                    placeholder="Description"
                    onChange={(e) => setMenu({ ...menu, description: e.target.value })}
                />
                <button style={styles.button} onClick={handleMenuSubmit}>
                    Add Menu
                </button>
                <ul style={styles.list}>
                    {menus.map((item) => (
                        <li key={item.menu_id} style={styles.listItem}>
                            {item.name} - ₹{item.price}
                        </li>
                    ))}
                </ul>
            </div>

            <div style={styles.section}>
                <h2 style={styles.heading}>Staff Operations</h2>
                <input
                    style={styles.input}
                    placeholder="Staff ID"
                    onChange={(e) => setStaff({ ...staff, staff_id: e.target.value })}
                />
                <input
                    style={styles.input}
                    placeholder="Staff Name"
                    onChange={(e) => setStaff({ ...staff, staff_name: e.target.value })}
                />
                <input
                    style={styles.input}
                    placeholder="Salary"
                    onChange={(e) => setStaff({ ...staff, salary: e.target.value })}
                />
                <input
                    style={styles.input}
                    placeholder="Designation"
                    onChange={(e) => setStaff({ ...staff, designation: e.target.value })}
                />
                <button style={styles.button} onClick={handleStaffSubmit}>
                    Add Staff
                </button>
                <ul style={styles.list}>
                    {staffList.map((member) => (
                        <li key={member.staff_id} style={styles.listItem}>
                            {member.staff_name} - {member.designation}
                        </li>
                    ))}
                </ul>
            </div>

            {/* ToastContainer to display the toast notifications */}
            <ToastContainer />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '20%',
        paddingRight: '10%',
        paddingTop: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    section: {
        marginBottom: '30px',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        marginBottom: '15px',
        color: '#333',
    },
    input: {
        display: 'block',
        width: '100%',
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    },
    button: {
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    list: {
        listStyleType: 'none',
        padding: '0',
        marginTop: '20px',
    },
    listItem: {
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
    },
};

export default Admin;
