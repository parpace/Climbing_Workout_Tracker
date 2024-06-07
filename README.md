# Climbing_Workout_Tracker

## Goal
The goal of this project is to create a training plan application that allows users to add workouts to a plan, as well as log what workouts they have completed. 
Each user should have those plans and logs stored into their profile based on the date that they are planning to do the workout, or the date in which they are trying to log it. 
When the user logs in, the site should then be able to render a calendar for them using that data, and allow them to interact with it.

## Stretch Goal
As a stretch goal, I would like for the user to be able to log specifics about the workout that they did. They could have many optional attributes to fill out (weights, reps, sets, etc) based on what the workout looks like. Then, when they log it, all of those attributes are saved.

## Back End

__Models__
* Categories will be our parent database. Workouts will be the child of Categories, and Users will be the child of Workouts.
* Users should include attributes of plannedWorkouts and loggedWorkouts.
* Both plannedWorkouts and loggedWorkouts will need to be an array of objects based on a date, and each date will have a unique id in that array so that we can reference it in our calendar.
* Along with a date, plannedWorkouts and loggedWorkouts should have a workouts attribute. This workouts attribute will also need to be an array, so that it can store all of the workouts for that date.
  
![image](https://github.com/parpace/Climbing_Workout_Tracker/assets/168449799/f1a3914d-b875-45f0-8ae6-743f3fe82903)

__Controllers__
* For our CategoryController, we only need to be able to get all categories.
* Our WorkoutController needs a few functions. We need to be able to:
  1. Get workouts by category for selecting and adding to the plan.
  2. Create a workout in a user's plan or log.
  3. Delete a workout from a user's plan or log.
* Our UserContoller needs a few functions:
  1. Get User by id in order to update our calendar and find a User's data.
  2. Get plannedWorkouts for a User.
  3. Get loggedWorkouts for a User.
