import { use, useState } from "react"

function Register(){

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [upiId, setUpiId] = useState('')

    async function handleRegister() {
    const response = await fetch('http://localhost:8080/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:  JSON.stringify({
            username: username,
            email: email,
            password: password,
            upiId: upiId
        })
    })

    const result = await response.text()
    console.log(result)
}

    return (
        <div>


        
        <div>
            <input 
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <p>You typed: {username}</p>
        </div>

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

        <div>
            <input 
                type="text"
                placeholder="Enter your UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
            />
            <p>You typed: {upiId}</p>
        </div>

        <button onClick={handleRegister}>Register</button>
        </div>
    );
}




export default Register