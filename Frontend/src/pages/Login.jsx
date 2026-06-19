import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login () {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('') 

    async function handleLogin(){
        const credentials = btoa(email + ':' + password)
        const response = await fetch('http://localhost:8080/create', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + credentials
            }
        })

        if(response.ok || response.status === 405){
            localStorage.setItem('email',email)
            localStorage.setItem('password',password)
            navigate('/dashboard')
        }else{
            alert('Wrong email or password')
        }
    }


    return (
        <div>
            <div>
            <input 
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <p>You typed: {email}</p>
        </div>

        <div>
            <input 
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p>You typed: {password}</p>
        </div>

        <button onClick={handleLogin}>Login</button>
        </div>
    )
}


export default Login