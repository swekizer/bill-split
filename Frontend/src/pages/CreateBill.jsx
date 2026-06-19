import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function CreateBill() {
    const [title, setTitle] = useState('')
    const [image, setImage] = useState(null)   // file, not text!
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleCreate() {
        setLoading(true)

        // Step 1: Upload image to Supabase
        const fileName = Date.now() + '-' + image.name   // unique filename
        const { data, error } = await supabase.storage
            .from('bills')
            .upload(fileName, image)

        if (error) {
            alert('Image upload failed: ' + error.message)
            setLoading(false)
            return
        }

        // Step 2: Get the public URL
        const { data: urlData } = supabase.storage
            .from('bills')
            .getPublicUrl(fileName)
        
        const imageUrl = urlData.publicUrl

        // Step 3: Call Spring Boot /create
        const email = localStorage.getItem('email')
        const password = localStorage.getItem('password')
        const credentials = btoa(email + ':' + password)

        const response = await fetch('http://localhost:8080/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + credentials
            },
            body: JSON.stringify({
                title: title,
                billImage: imageUrl,
                generatedAt: new Date().toISOString()
            })
        })

        const bill = await response.json()
        console.log('Bill created:', bill)
        setLoading(false)
        navigate('/dashboard')
    }

    return (
        <div>
            <h1>Create New Bill</h1>

            <input
                type="text"
                placeholder="Bill title (e.g. Dinner at Foo Bar)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
            />

            <button onClick={handleCreate} disabled={loading}>
                {loading ? 'Processing... AI is reading your bill...' : 'Create Bill'}
            </button>
        </div>
    )
}

export default CreateBill