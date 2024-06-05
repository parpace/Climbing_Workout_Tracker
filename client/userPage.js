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

    const userProfile = document.querySelector('.userProfile')
    const calendar = document.getElementById('calendar')
    const currentMonth = document.getElementById('currentMonth')
    const prevMonthButton = document.getElementById('prevMonth')
    const nextMonthButton = document.getElementById('nextMonth')
    const dayPlan = document.getElementById('dayPlan')
    const planDate = document.getElementById('planDate')
    const planContent = document.getElementById('planContent')
    const addWorkout = document.getElementById('addWorkout')
    const categoryContainer = document.getElementById('categoryContainer')
    const categoriesDiv = document.getElementById('categories')
    const workoutContainer = document.getElementById('workoutContainer')
    const workoutsDiv = document.getElementById('workouts')
    const overlay = document.createElement('div')

    let currentCalendar = 'planned'

    overlay.className = 'overlay'

    let currentDate = new Date()
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    function renderPlanner(date) {
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
            blankDay.classList.add(`blank`)
            calendar.appendChild(blankDay)
        }

        axios.get(`http://localhost:3001/getUserWorkouts/${userId}/${year}/${month}/${currentCalendar}`)
            .then(response => {
                const workouts = response.data
                console.log(workouts)

                // Fill in the days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = document.createElement('div')
                    dayElement.textContent = day

                    const plannedWorkouts = workouts.filter(workout => new Date(workout.date).getDate() === day)
                    // console.log(plannedWorkouts)
                    plannedWorkouts.forEach(workout => {
                        const workoutElement = document.createElement(`div`)
                        workoutElement.textContent = workout.name
                        dayElement.appendChild(workoutElement)
                    })

                    dayElement.addEventListener('click', () => openDayPlan(year, month, day))
                    calendar.appendChild(dayElement)
                }
            })
            .catch(error => {
                calendar.innerHTML = '<p>Error loading workouts.</p>'
            })
    }

    function openDayPlan(year, month, day) {
        const selectedDate = new Date(year, month, day)
        const formattedDate = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        planDate.textContent = formattedDate
        planContent.innerHTML = ''

        dayPlan.style.display = `block`
        overlay.style.display = 'block'

        axios.get(`http://localhost:3001/getUserWorkouts/${userId}/${year}/${month}/${currentCalendar}/${selectedDate.toISOString()}`)
            .then(response => {
                const workouts = response.data
                workouts.forEach(workout => {
                    const workoutElement = document.createElement(`div`)
                    workoutElement.textContent = workout.name

                    const logButton = document.createElement(`button`)
                    logButton.textContent = `Log`
                    // logButton.addEventListener(`click`, () => logWorkout(workout._id, selectedDate))
                    workoutElement.appendChild(logButton)

                    const deleteButton = document.createElement(`button`)
                    deleteButton.textContent = `x`;
                    // deleteButton.addEventListener(`click`, () => deleteWorkout(workout._id))
                    workoutElement.appendChild(deleteButton)

                    planContent.appendChild(workoutElement)
                })
            })
            .catch(error => {
                planContent.innerHTML = '<p>Error loading workouts.</p>'
            })
    }

    prevMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1)
        renderPlanner(currentDate)
    })

    nextMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1)
        renderPlanner(currentDate)
    })

    renderPlanner(currentDate)

//     function fetchAndRenderCategories() {
//         axios.get('http://localhost:3001/categories')
//             .then(response => {
//                 const categories = response.data
//                 categoriesDiv.innerHTML = ''
//                 categories.forEach(category => {
//                     const categoryElement = document.createElement('div')
//                     categoryElement.textContent = category.name
//                     categoriesDiv.appendChild(categoryElement)

//                     categoryElement.addEventListener('click', () => {
//                         fetchAndRenderWorkouts(category._id)
//                     })
//                 })
//                 categoryContainer.style.display = 'flex'
//             })
//             .catch(error => {
//                 console.error('Error fetching categories:', error)
//             })
//     }

//     function fetchAndRenderWorkouts(categoryId) {
//         axios.get(`http://localhost:3001/workouts?category=${categoryId}`)
//             .then(response => {
//                 const workouts = response.data
//                 workoutsDiv.innerHTML = ''
//                 workouts.forEach(workout => {
//                     const workoutElement = document.createElement('div')
//                     workoutElement.textContent = workout.name
//                     workoutsDiv.appendChild(workoutElement)

//                     workoutElement.addEventListener('click', () => {
//                         addWorkoutToPlan(workout)
//                     })
//                 })
//                 workoutContainer.style.display = 'flex'
//             })
//             .catch(error => {
//                 console.error('Error fetching workouts:', error)
//             })
//     }

//     function addWorkoutToPlan(workout) {
//         // Add the workout to the plan content
//         const workoutElement = document.createElement('div')
//         workoutElement.textContent = workout.name
//         planContent.appendChild(workoutElement)

//         // Save the workout to the user's plan in the database
//         axios.post(`http://localhost:3001/user/${userId}/addWorkout`, {
//             date: planDate.textContent,
//             workoutId: workout._id
//         })
//         .then(response => {
//             console.log('Workout added to plan:', response.data)
//         })
//         .catch(error => {
//             console.error('Error adding workout to plan:', error)
//         })
//     }

//     function fetchAndRenderWorkoutPlan(date, userId) {
//         const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
//         axios.get(`http://localhost:3001/user/${userId}/workouts?date=${formattedDate}`)
//             .then(response => {
//                 const workouts = response.data
//                 planContent.innerHTML = ''
//                 workouts.forEach(workout => {
//                     const workoutElement = document.createElement('div')
//                     workoutElement.textContent = workout.name
//                     planContent.appendChild(workoutElement)
//                 })
//             })
//             .catch(error => {
//                 console.error('Error fetching workout plan:', error)
//             })
//     }

//     const outsideDayPlan = !dayPlan.contains(event.target) && event.target !== addWorkout
//     const outsideCategoryContainer = !categoryContainer.contains(event.target) && event.target !== addWorkout
//     const outsideWorkoutContainer = !workoutContainer.contains(event.target) && event.target !== addWorkout

//     if (outsideCategoryContainer && outsideDayPlan && outsideWorkoutContainer) {
//         userProfile.classList.remove('dimmed')
//         dayPlan.style.display = 'none'
//         categoryContainer.style.display = 'none'
//         workoutContainer.style.display = 'none'
//         if (overlay.parentNode) {
//             overlay.parentNode.removeChild(overlay)
//         }
//     }
})




// document.addEventListener('DOMContentLoaded', function() {
//     const calendar = document.getElementById('calendar')
//     const currentMonth = document.getElementById('currentMonth')
//     const prevMonthButton = document.getElementById('prevMonth')
//     const nextMonthButton = document.getElementById('nextMonth')

//     let currentDate = new Date()
//     const months = [
//         'January', 'February', 'March', 'April', 'May', 'June',
//         'July', 'August', 'September', 'October', 'November', 'December'
//     ]

//     function renderCalendar(date) {
//         calendar.innerHTML = ''
//         const month = date.getMonth()
//         const year = date.getFullYear()
//         currentMonth.textContent = `${months[month]} ${year}`

//         const firstDayOfMonth = new Date(year, month, 1).getDay()
//         const daysInMonth = new Date(year, month + 1, 0).getDate()

//         // Fill in the days of the week headers
//         const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
//         daysOfWeek.forEach(day => {
//             const dayElement = document.createElement('div')
//             dayElement.textContent = day
//             dayElement.style.fontWeight = 'bold'
//             calendar.appendChild(dayElement)
//         })

//         // Fill in the blank days before the start of the month
//         for (let i = 0; i < firstDayOfMonth; i++) {
//             const blankDay = document.createElement('div')
//             calendar.appendChild(blankDay)
//         }

//         // Fill in the days of the month
//         for (let day = 1; day <= daysInMonth; day++) {
//             const dayElement = document.createElement('div')
//             dayElement.textContent = day
//             calendar.appendChild(dayElement)

//             dayElement.addEventListener('click', () => {
//                 fetchAndRenderWorkoutPlan(category._id)
//             })
//         }
//     }

//     prevMonthButton.addEventListener('click', function() {
//         currentDate.setMonth(currentDate.getMonth() - 1)
//         renderCalendar(currentDate)
//     })

//     nextMonthButton.addEventListener('click', function() {
//         currentDate.setMonth(currentDate.getMonth() + 1)
//         renderCalendar(currentDate)
//     })

//     renderCalendar(currentDate)
// })


// document.addEventListener('click', function(event) {
//     const outsideCategoryContainer = !categoryContainer.contains(event.target) && event.target !== addWorkout
//     const outsideSubcategoryContainer = !subcategoryContainer.contains(event.target) && event.target !== addWorkout

//     if (outsideCategoryContainer && outsideSubcategoryContainer) {
//         userProfile.classList.remove('dimmed')
//         categoryContainer.style.display = 'none'
//         subcategoryContainer.style.display = 'none'
//         if (overlay.parentNode) {
//             overlay.parentNode.removeChild(overlay)
//         }
//     }
// })


// const addWorkout = document.querySelector('#add')
// const categories = document.querySelector('.categories')
// const userProfile = document.querySelector('.userProfile')
// const overlay = document.createElement('div')

// overlay.className = 'overlay'

// addWorkout.addEventListener('click', async () => {
//     userProfile.classList.add('dimmed')
//     document.body.appendChild(overlay)
//     categoryContainer.style.display = 'flex'

//     categories.innerHTML = ''

//     let categoryResponse = await axios.get(`http://localhost:3001/categories`)
//     console.log(categoryResponse.data)
//     const categoryArray = categoryResponse.data
//     categoryArray.forEach(category => {
//         const categoryElement = document.createElement('div')
//         categoryElement.textContent = category.name
//         categories.appendChild(categoryElement)

//         categoryElement.addEventListener('click', () => {
//             fetchAndRenderSubcategories(category._id)
//         })
//     })
// })

// async function fetchAndRenderSubcategories(categoryId) {
//     try{
//         let subcategoryResponse = await axios.get(`http://localhost:3001/subcategories`)
//         console.log(subcategoryResponse.data)
//         const subcategoryArray = subcategoryResponse.data
        
//         const filteredSubcategories = subcategoryArray.filter(subcategory => subcategory.category_id === categoryId)
//         console.log('Filtered Subcategories:', filteredSubcategories)

//         subcategories.innerHTML = ''

//         filteredSubcategories.forEach(subcategory => {
//                 const subcategoryElement = document.createElement('div')
//                 subcategoryElement.textContent = subcategory.name
//                 subcategories.appendChild(subcategoryElement)
//         })

//         userProfile.classList.add('dimmed')
//         document.body.appendChild(overlay)
//         categoryContainer.style.display = `none`
//         subcategoryContainer.style.display = 'flex'

//         if (filteredSubcategories.length === 0) {
//             console.log('No subcategories found for category ID:', categoryId);
//         }
//     } catch (error) {
//         console.error('Error fetching subcategories:', error);
//     }
// }