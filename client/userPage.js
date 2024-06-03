document.addEventListener('DOMContentLoaded', function() {
    // Get the user ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get('userId')

    if (!userId) {
        document.querySelector('userProfile').innerHTML = '<p>User ID not found in the URL.</p>'
        return
    }

    // Fetch user data from the server
    axios.get(`http://localhost:3001/user/${userId}`)
        .then(response => {
            const user = response.data
            const profileName = document.getElementById('profileName')
            profileName.innerText = user.profileName
        })
        .catch(error => {
            const userProfileDiv = document.querySelector('userProfile')
            userProfileDiv.innerHTML = `<p>Error loading user data.</p>`
        })
})

document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar')
    const currentMonth = document.getElementById('currentMonth')
    const prevMonthButton = document.getElementById('prevMonth')
    const nextMonthButton = document.getElementById('nextMonth')

    let currentDate = new Date()
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    function renderCalendar(date) {
        calendar.innerHTML = ''
        const month = date.getMonth()
        const year = date.getFullYear()
        currentMonth.textContent = `${months[month]} ${year}`

        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Fill in the days of the week headers
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div')
            dayElement.textContent = day
            dayElement.style.fontWeight = 'bold'
            calendar.appendChild(dayElement)
        })

        // Fill in the blank days before the start of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const blankDay = document.createElement('div')
            calendar.appendChild(blankDay)
        }

        // Fill in the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div')
            dayElement.textContent = day
            calendar.appendChild(dayElement)
        }
    }

    prevMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1)
        renderCalendar(currentDate)
    })

    nextMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1)
        renderCalendar(currentDate)
    })

    renderCalendar(currentDate)
})

const addWorkout = document.querySelector('#add')
const categoryContainer = document.querySelector('.categoryContainer')
const subcategoryContainer = document.querySelector('.subcategoryContainer')
const categories = document.querySelector('.categories')
const subcategories = document.querySelector('.subcategories')
const userProfile = document.querySelector('.userProfile')
const overlay = document.createElement('div')

overlay.className = 'overlay'

addWorkout.addEventListener('click', async () => {
    userProfile.classList.add('dimmed')
    document.body.appendChild(overlay)
    categoryContainer.style.display = 'flex'

    categories.innerHTML = ''

    let categoryResponse = await axios.get(`http://localhost:3001/categories`)
    console.log(categoryResponse.data)
    const categoryArray = categoryResponse.data
    categoryArray.forEach(category => {
        const categoryElement = document.createElement('div')
        categoryElement.textContent = category.name
        categories.appendChild(categoryElement)

        categoryElement.addEventListener('click', () => {
            fetchAndRenderSubcategories(category._id)
        })
    })
})

async function fetchAndRenderSubcategories(categoryId) {
    try{
        let subcategoryResponse = await axios.get(`http://localhost:3001/subcategories`)
        console.log(subcategoryResponse.data)
        const subcategoryArray = subcategoryResponse.data
        
        const filteredSubcategories = subcategoryArray.filter(subcategory => subcategory.category_id === categoryId)
        console.log('Filtered Subcategories:', filteredSubcategories)

        subcategories.innerHTML = ''

        filteredSubcategories.forEach(subcategory => {
                const subcategoryElement = document.createElement('div')
                subcategoryElement.textContent = subcategory.name
                subcategories.appendChild(subcategoryElement)
        })

        userProfile.classList.add('dimmed')
        document.body.appendChild(overlay)
        categoryContainer.style.display = `none`
        subcategoryContainer.style.display = 'flex'

        if (filteredSubcategories.length === 0) {
            console.log('No subcategories found for category ID:', categoryId);
        }
    } catch (error) {
        console.error('Error fetching subcategories:', error);
    }
}

document.addEventListener('click', function(event) {
    const outsideCategoryContainer = !categoryContainer.contains(event.target) && event.target !== addWorkout
    const outsideSubcategoryContainer = !subcategoryContainer.contains(event.target) && event.target !== addWorkout

    if (outsideCategoryContainer && outsideSubcategoryContainer) {
        userProfile.classList.remove('dimmed')
        categoryContainer.style.display = 'none'
        subcategoryContainer.style.display = 'none'
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay)
        }
    }
})