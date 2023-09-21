import React from 'react';
import '../style/LeaveAccountButton.css'

const LeaveAccountButton = () => {
    return (
        <button
            className="leave-account"
            onClick={() => {
                        localStorage.removeItem('token')
                        window.location.reload()
                    }}
        >
            Log out
        </button>
    );
};

export default LeaveAccountButton;