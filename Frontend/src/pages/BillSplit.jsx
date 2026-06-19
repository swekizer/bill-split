import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function BillSplit() {
    const { uuid } = useParams()
    const [items, setItems] = useState([])
    const [selected, setSelected] = useState({})  // tracks what user picked
    const [payment, setPayment] = useState(null)

    useEffect(() => {
        fetch(`https://bill-split-8orc.onrender.com/${uuid}`)
            .then(res => res.json())
            .then(data => setItems(data))
    }, [])

    function toggleItem(item) {
        setSelected(prev => {
            if (prev[item.name]) {
                // already selected → remove it
                const copy = { ...prev }
                delete copy[item.name]
                return copy
            } else {
                // not selected → add with qty 1
                return { ...prev, [item.name]: { ...item, quantity: 1 } }
            }
        })
    }

    function changeQty(item, qty) {
        setSelected(prev => ({
            ...prev,
            [item.name]: { ...item, quantity: Number(qty) }
        }))
    }

    async function handlePay() {
        const email = localStorage.getItem('email')
        const password = localStorage.getItem('password')
        const credentials = btoa(email + ':' + password)

        const selectedItems = Object.values(selected)  // convert object to array

        const response = await fetch('https://bill-split-8orc.onrender.com/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + credentials
            },
            body: JSON.stringify({
                billUrl: uuid,
                selectedItems: selectedItems
            })
        })

        const result = await response.json()
        setPayment(result)  // { totalAmount, upiLink }
    }

    const total = Object.values(selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div>
            <h1>Select Your Items</h1>

            {items.map(item => (
                <div key={item.name}>
                    <input
                        type="checkbox"
                        onChange={() => toggleItem(item)}
                        checked={!!selected[item.name]}
                    />
                    <span>{item.name}</span>
                    <span> ₹{item.price} × </span>

                    {selected[item.name] && (
                        <input
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={selected[item.name].quantity}
                            onChange={(e) => changeQty(item, e.target.value)}
                            style={{ width: '50px' }}
                        />
                    )}

                    {!selected[item.name] && <span>{item.quantity}</span>}
                </div>
            ))}

            <h2>Your Total: ₹{total.toFixed(2)}</h2>
            <button onClick={handlePay} disabled={Object.keys(selected).length === 0}>
                Pay Now
            </button>

            {payment && (
                <div>
                    <h2>Pay ₹{payment.totalAmount.toFixed(2)}</h2>

                    {/* UPI Deep Links for each app */}
                    <a href={payment.upiLink.replace('upi://', 'gpay://')}>
                        <button>Pay with Google Pay</button>
                    </a>
                    <a href={payment.upiLink.replace('upi://', 'phonepe://')}>
                        <button>Pay with PhonePe</button>
                    </a>
                    <a href={payment.upiLink.replace('upi://', 'paytmmp://')}>
                        <button>Pay with Paytm</button>
                    </a>
                    <a href={payment.upiLink}>
                        <button>Any UPI App</button>
                    </a>
                </div>
            )}
        </div>
    )
}

export default BillSplit