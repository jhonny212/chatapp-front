import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useAuth } from '../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); // Obtiene la función navigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/auth/login", {
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
        alert('Error al iniciar sesion, intente de nuevo');
        return;
      }

      //localStorage.setItem('token', data.token);
      const data = await response.json();
      login(data);


      navigate('/home');

    } catch (error) {
      alert('Error al iniciar sesion, intente de nuevo');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" value="Correo electrónico" />
            <TextInput
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
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
          <div className="flex items-center gap-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember">Recuérdame</Label>
          </div>
          <Button type="submit" color="blue" className="w-full">
            Iniciar sesión
          </Button>
          <p className="text-center text-sm mt-4">
            ¿No tienes cuenta?{' '}
            <a
              href="/register"
              className="text-blue-600 hover:underline"
            >
              Crear usuario
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
