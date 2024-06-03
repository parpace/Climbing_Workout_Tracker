document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault()
    
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const errorMessage = document.getElementById('error-message')
    
    if (username === '' || password === '') {
        errorMessage.textContent = 'Both fields are required.'
        return
    }

    axios.post('http://localhost:3001/api/authenticate', { username, password })
        .then(response => {
            const userId = response.data.id
            if (userId) {
                window.location.href = `/client/userPage.html?userId=${userId}`
            } else {
                errorMessage.textContent = 'Invalid username or password.'
            }
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                errorMessage.textContent = 'Invalid username or password.'
            } else {
                errorMessage.textContent = 'An error occurred. Please try again later.'
            }
        }
    )
})