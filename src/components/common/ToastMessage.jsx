import React, { useEffect, useState } from 'react';
import { Toast } from 'flowbite-react';

const ToastMessage = ({ message, type, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose(); // Llama a la función onClose al cerrar el toast
        }, duration);

        return () => clearTimeout(timer); // Limpiar el temporizador al desmontar
    }, [duration, onClose]);

    if (!visible) return null; // Si no está visible, no renderizar nada

    return (
        <Toast
            className={`fixed top-4 right-4 z-50 ${type === 'success' ? 'bg-green-500 dark:bg-green-500' : 'bg-red-500 dark:bg-red-500'}`}
        >
            <div className="flex items-center">
                <div className="text-white">{message}</div>
            </div>
        </Toast>
    );
};

export default ToastMessage;
