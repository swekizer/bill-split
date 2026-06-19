import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Dashboard(){

        const [bills, setBill] = useState([])
        const navigate = useNavigate()
    
        useEffect(() => {
            const email = localStorage.getItem('email')
            const password = localStorage.getItem('password')
            const credentials = btoa(email + ':' + password)

            fetch ('https://bill-split-8orc.onrender.com/bills', {
                headers: {'Authorization': 'Basic ' + credentials }
            })
            .then(res => res.json())
            .then(data => setBill(data))
        }, [])      

        return (
            <div>
                <h1>My Bills</h1>
                <button onClick={() => navigate('/create')}>+ Create New Bill</button>

                {bills.length === 0
                    ? <p>No bills yet.  Create your first one!</p>
                    : bills.map(bill => (
                        <div key={bill.billId}>
                        <h3>{bill.title}</h3>
                        <p>Share link: /bill/{bill.url}</p>
                    </div>
                    )
                    )
                }
            </div>
        )
}

export default Dashboard