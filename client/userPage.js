document.addEventListener('DOMContentLoaded', function() {
    
    const body = document.querySelector(`.body`)
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
    const planExit = document.getElementById(`planExit`)
    const categoryExit = document.getElementById(`categoryExit`)
    const workoutExit = document.getElementById(`workoutExit`)
    
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


    let currentCalendar = 'planned'

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

                // Fill in the days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = document.createElement('div')
                    dayElement.textContent = day

                    const plannedWorkouts = workouts.filter(workout => {
                        const workoutDate = new Date(workout.date)
                        return workoutDate.getDate() === day
                    })
                    
                    // forEach inception here.. Was having trouble accessing the workout name because my request is returning the workoutId and not the full model. ChatGBT saved me by explaining how to get from the workoutId number to the actual object of it's parent model.
                    plannedWorkouts.forEach(workoutId => {
                        workoutId.workouts.forEach(workout => {
                            const workoutElement = document.createElement(`div`)
                            workoutElement.textContent = workout.name
                            dayElement.appendChild(workoutElement)
                        })
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

        userProfile.classList.add('dimmed')
        const selectedDate = new Date(year, month, day)
        const formattedDate = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        planDate.textContent = formattedDate
        planContent.innerHTML = ''

        dayPlan.style.display = `block`

        axios.get(`http://localhost:3001/getUserWorkouts/${userId}/${year}/${month}/${currentCalendar}/${selectedDate.toISOString()}`)
            .then(response => {
                const workouts = response.data
                workouts.forEach(workoutId => {
                    workoutId.workouts.forEach(workout => {
                        const workoutElement = document.createElement(`div`)
                        workoutElement.textContent = workout.name

                        const logButton = document.createElement(`button`)
                        logButton.textContent = `Log`
                        // logButton.addEventListener(`click`, () => logWorkout(workout._id, selectedDate))
                        workoutElement.appendChild(logButton)

                        const deleteButton = document.createElement(`button`)
                        deleteButton.textContent = `Delete`;
                        deleteButton.addEventListener(`click`, () => deleteWorkout(workout._id))
                        workoutElement.appendChild(deleteButton)

                        planContent.appendChild(workoutElement)
                    })
                })
            })
            .catch(error => {
                planContent.innerHTML = '<p>Error loading workouts.</p>'
            })
    }

    function renderCategories() {
        categoriesDiv.innerHTML = ``
        categoryContainer.style.display = `block`

        axios.get(`http://localhost:3001/categories`)
            .then(response => {
                const categories = response.data
                categories.forEach(category => {
                    const categoryElement = document.createElement(`div`)
                    categoryElement.textContent = category.name
                    categoriesDiv.appendChild(categoryElement)

                    categoryElement.addEventListener(`click`, () => renderWorkouts(category._id))
                })
            })
            .catch(error => {
                categoriesDiv.innerHTML = '<p>Error loading categories.</p>'
            })
    }

    function renderWorkouts(categoryId) {
        categoryContainer.style.display = `none`
        categoriesDiv.innerHTML = ``
        workoutsDiv.innerHTML = ``
        workoutContainer.style.display = `block`

        axios.get(`http://localhost:3001/workouts/${categoryId}`)
            .then(response => {
                const workouts = response.data
                workouts.forEach(workout => {
                    const workoutElement = document.createElement(`div`)
                    workoutElement.textContent = workout.name
                    workoutsDiv.appendChild(workoutElement)

                    workoutElement.addEventListener('click', () => addWorkoutToPlan(workout._id))
                })
            })
            .catch(error => {
                workoutsDiv.innerHTML = '<p>Error loading workouts.</p>'
            })
    }

    function addWorkoutToPlan(workoutId) {
        workoutContainer.style.display = `none`
        workoutsDiv.innerHTML = ``
        const selectedDate = new Date(planDate.textContent)
        const formattedDate = selectedDate.toISOString()

        axios.post(`http://localhost:3001/addWorkoutToPlan`, {
            userId: userId,
            workoutId: workoutId,
            date: formattedDate
        })
        .then(response => {
            openDayPlan(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        })
        .catch(error => {
            console.error('Error adding workout to plan:', error)
        })
    }

    function deleteWorkout(workoutId) {
        const selectedDate = new Date(planDate.textContent)
        const formattedDate = selectedDate.toISOString()

        axios.delete(`http://localhost:3001/removeFromPlan`, {
            data: {
                userId: userId,
                workoutId: workoutId,
                date: formattedDate
            }
        })
        .then(response => {
            openDayPlan(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
        })
        .catch(error => {
            console.error('Error removing workout to plan:', error)
        })
    }

    addWorkout.addEventListener(`click`, () => {
        dayPlan.style.display = `none`
        renderCategories()
    })

    planExit.addEventListener(`click`, () => {
        dayPlan.style.display = 'none'
        categoryContainer.style.display = 'none'
        workoutContainer.style.display = 'none'
        userProfile.classList.remove('dimmed')
    })
    categoryExit.addEventListener(`click`, () => {
        dayPlan.style.display = 'none'
        categoryContainer.style.display = 'none'
        workoutContainer.style.display = 'none'
        userProfile.classList.remove('dimmed')
    })
    workoutExit.addEventListener(`click`, () => {
        dayPlan.style.display = 'none'
        categoryContainer.style.display = 'none'
        workoutContainer.style.display = 'none'
        userProfile.classList.remove('dimmed')
    })

    prevMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1)
        renderPlanner(currentDate)
    })

    nextMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1)
        renderPlanner(currentDate)
    })

    renderPlanner(currentDate)

    // body.addEventListener('click', function(event) {
    //     const outsideDayPlan = !dayPlan.contains(event.target)
    //     const outsideCategoryContainer = !categoryContainer.contains(event.target)
    //     const outsideWorkoutContainer = !workoutContainer.contains(event.target)
    //     if (outsideDayPlan && outsideCategoryContainer && outsideWorkoutContainer) {
    //         userProfile.classList.remove('dimmed')
    //         dayPlan.style.display = 'none'
    //     }
    // })

})

// document.addEventListener('click', function(event) {
    //     const outsideDayPlan = !dayPlan.contains(event.target) && event.target !== addWorkout
    //     const outsideCategoryContainer = !categoryContainer.contains(event.target)
    //     const outsideWorkoutContainer = !workoutContainer.contains(event.target)

    //     if (outsideCategoryContainer && outsideDayPlan && outsideWorkoutContainer) {
    //         userProfile.classList.remove('dimmed')
    //         dayPlan.style.display = 'none'
    //         categoryContainer.style.display = 'none'
    //         workoutContainer.style.display = 'none'
    //         if (overlay.parentNode) {
    //             overlay.parentNode.removeChild(overlay)
    //         }
    //     }
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