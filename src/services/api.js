export const fetchWithToken = async (url, options = {}, type = "application/json") => {
    const token = localStorage.getItem('token'); 
    if (token) {
        if(type){
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': type 
            };
        }else{
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
            };
        }
    }

    // Realiza la solicitud fetch
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + url, options);
    if (!response.ok) {
        if (response.status === 401) {
            console.log('Token inválido, redirigiendo a login...');
            window.location.href="/"
        }
    }
    return response;
};