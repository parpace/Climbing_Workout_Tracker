document.addEventListener('DOMContentLoaded', function() {
    
    const userProfile = document.querySelector('.userProfile')
    const calendar = document.getElementById('calendar')
    const planToggle = document.getElementById('planToggle')
    const logToggle = document.getElementById('logToggle')
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

    planToggle.addEventListener(`click`, () => {
        renderPlan(currentDate)
    })
    function renderPlan(date) {
        calendar.innerHTML = ``

        const planCalendar = document.createElement(`div`)
        planCalendar.classList.add(`planCalendar`)
        calendar.appendChild(planCalendar)

        planCalendar.innerHTML = ''
        const month = date.getMonth()
        const year = date.getFullYear()
        currentMonth.textContent = `${months[month]} ${year}`

        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Fill in the days of the week headers
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div')
            dayElement.classList.add(`week`)
            dayElement.textContent = day
            dayElement.style.fontWeight = 'bold'
            planCalendar.appendChild(dayElement)
        })

        // Fill in the blank days before the start of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const blankDay = document.createElement('div')
            blankDay.classList.add(`blank`)
            planCalendar.appendChild(blankDay)
        }

        axios.get(`http://localhost:3001/getUserPlannedWorkouts/${userId}/${year}/${month}/${currentCalendar}`)
            .then(response => {
                const workouts = response.data

                // Fill in the days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = document.createElement('div')
                    dayElement.classList.add(`planDay`)

                    const dayNumber = document.createElement(`div`)
                    dayNumber.textContent = day
                    dayNumber.classList.add(`planDayNumber`)
                    dayElement.appendChild(dayNumber)

                    const plannedWorkouts = workouts.filter(workout => {
                        const workoutDate = new Date(workout.date)
                        return workoutDate.getDate() === day
                    })
                    
                    // forEach inception here.. Was having trouble accessing the workout name because my request is returning the workoutId and not the full model. ChatGBT saved me by explaining how to get from the workoutId number to the actual object of it's parent model.
                    plannedWorkouts.forEach(workoutId => {
                        workoutId.workouts.forEach(workout => {
                            const workoutElement = document.createElement(`div`)
                            workoutElement.classList.add(`planDayWorkouts`)
                            workoutElement.textContent = workout.name
                            dayElement.appendChild(workoutElement)
                        })
                    })

                    dayElement.addEventListener('click', () => openDayPlan(year, month, day))
                    planCalendar.appendChild(dayElement)
                }
            })
            .catch(error => {
                planCalendar.innerHTML = '<p>Error loading workouts.</p>'
            })
    }

    logToggle.addEventListener(`click`, () => {
        renderLog(currentDate)
    })
    function renderLog(date) {
        calendar.innerHTML = ``
        
        const logCalendar = document.createElement(`div`)
        logCalendar.classList.add(`logCalendar`)
        calendar.appendChild(logCalendar)

        logCalendar.innerHTML = ''
        const month = date.getMonth()
        const year = date.getFullYear()
        currentMonth.textContent = `${months[month]} ${year}`

        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        // Fill in the days of the week headers
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div')
            dayElement.classList.add(`week`)
            dayElement.textContent = day
            dayElement.style.fontWeight = 'bold'
            logCalendar.appendChild(dayElement)
        })

        // Fill in the blank days before the start of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const blankDay = document.createElement('div')
            blankDay.classList.add(`blank`)
            logCalendar.appendChild(blankDay)
        }

        axios.get(`http://localhost:3001/getUserLoggedWorkouts/${userId}/${year}/${month}`)
            .then(response => {
                const workouts = response.data

                // Fill in the days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                    const dayElement = document.createElement('div')
                    dayElement.classList.add(`logDay`)

                    const dayNumber = document.createElement(`div`)
                    dayNumber.textContent = day
                    dayNumber.classList.add(`logDayNumber`)
                    dayElement.appendChild(dayNumber)

                    const loggedWorkouts = workouts.filter(workout => {
                        const workoutDate = new Date(workout.date)
                        return workoutDate.getDate() === day
                    })
                    
                    loggedWorkouts.forEach(workoutId => {
                        workoutId.workouts.forEach(workout => {
                            const workoutElement = document.createElement(`div`)
                            workoutElement.classList.add(`logDayWorkouts`)
                            workoutElement.textContent = workout.name
                            dayElement.appendChild(workoutElement)
                        })
                    })

                    dayElement.addEventListener('click', () => openDayPlan(year, month, day))
                    logCalendar.appendChild(dayElement)
                }
            })
            .catch(error => {
                logCalendar.innerHTML = '<p>Error loading workouts.</p>'
            })
    }

    function openDayPlan(year, month, day) {

        userProfile.classList.add('dimmed')
        const selectedDate = new Date(year, month, day)
        const formattedDate = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        planDate.textContent = formattedDate
        planContent.innerHTML = ''

        dayPlan.style.display = `block`

        axios.get(`http://localhost:3001/getUserPlannedWorkouts/${userId}/${year}/${month}/${currentCalendar}/${selectedDate.toISOString()}`)
            .then(response => {
                const workouts = response.data
                workouts.forEach(workoutId => {
                    workoutId.workouts.forEach(workout => {
                        const workoutElement = document.createElement(`div`)
                        workoutElement.textContent = workout.name

                        const logButton = document.createElement(`button`)
                        logButton.textContent = `Log`
                        logButton.addEventListener(`click`, () => logWorkout(workout._id))
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

    function logWorkout(workoutId) {
        const selectedDate = new Date(planDate.textContent)
        const formattedDate = selectedDate.toISOString()

        axios.post(`http://localhost:3001/addWorkoutToLog`, {
            userId: userId,
            workoutId: workoutId,
            date: formattedDate
        })
        .then(response => {
            deleteWorkout(workoutId)
        })
        .catch(error => {
            console.error('Error adding workout to log:', error)
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
        renderPlan(currentDate)
    })
    categoryExit.addEventListener(`click`, () => {
        dayPlan.style.display = 'none'
        categoryContainer.style.display = 'none'
        workoutContainer.style.display = 'none'
        userProfile.classList.remove('dimmed')
        renderPlan(currentDate)
    })
    workoutExit.addEventListener(`click`, () => {
        dayPlan.style.display = 'none'
        categoryContainer.style.display = 'none'
        workoutContainer.style.display = 'none'
        userProfile.classList.remove('dimmed')
        renderPlan(currentDate)
    })

    prevMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1)
        renderPlan(currentDate)
    })

    nextMonthButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1)
        renderPlan(currentDate)
    })

    renderPlan(currentDate)
})

 // body.addEventListener('click', function(event) {
    //     const outsideDayPlan = !dayPlan.contains(event.target)
    //     const outsideCategoryContainer = !categoryContainer.contains(event.target)
    //     const outsideWorkoutContainer = !workoutContainer.contains(event.target)
    //     if (outsideDayPlan && outsideCategoryContainer && outsideWorkoutContainer) {
    //         userProfile.classList.remove('dimmed')
    //         dayPlan.style.display = 'none'
    //     }
    // })

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

// const overlay = document.createElement('div')

// overlay.className = 'overlay'