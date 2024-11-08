import { Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita el comportamiento por defecto del formulario

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                alert('Error al crear usuario, intente de nuevo');
                return;
            }

            alert("Usuario creado exitosamente")
            setEmail("")
            setPassword("")

        } catch (error) {
            alert('Error al crear usuario, intente de nuevo');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Crear usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="email" value="Correo electrónico" />
                        <TextInput
                            id="email"
                            type="email"
                            placeholder="email@ejemplo.com"
                            required={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" value="Contraseña" />
                        <TextInput
                            id="password"
                            type="password"
                            placeholder="********"
                            required={true}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" color="green" className="w-full">
                        Crear cuenta
                    </Button>
                    <p className="text-center text-sm mt-4">
                        ¿Ya tienes cuenta?{' '}
                        <a
                            href="/"
                            className="text-blue-600 hover:underline"
                        >
                            Iniciar sesión
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );

}
