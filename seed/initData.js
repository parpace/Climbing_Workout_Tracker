const db = require('../db')
const { Category, Subcategory, Workout, User, Log } = require('../models')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const resetCollections = async () => {
  try {
      await Category.deleteMany({})
      await Subcategory.deleteMany({})
      await Workout.deleteMany({})
      await User.deleteMany({})
      await Log.deleteMany({})
      console.log('All collection reset')
  } catch (error) {
      console.error('Error resetting collections:', error)
  }
}

const main = async () => {

  await resetCollections()
    
  const user1 = new User({
    username: `parkerpace`,
    password: `parkerpace`,
    profileName: 'Parker Pace'
    })
    user1.save()

  const user2 = new User({
    username: `parpace`,
    password: `parpace`,
    profileName: 'Parker Pace'
    })
    user2.save()

  const category1 = new Category({
    name: 'Finger Training',
    img: 'jpeg goes here'
  })
  category1.save()

  const category2 = new Category({
    name: 'Upper Body',
    img: 'jpeg goes here'
  })
  category2.save()

  const category3 = new Category({
    name: 'Lower Body',
    img: 'jpeg goes here'
  })
  category3.save()

  const category4 = new Category({
    name: 'Bouldering',
    img: 'jpeg goes here'
  })
  category4.save()

  const category5 = new Category({
    name: 'Sport Climbing',
    img: 'jpeg goes here'
  })
  category5.save()

  const category6 = new Category({
    name: 'Mobility',
    img: 'jpeg goes here'
  })
  category6.save()

  const category7 = new Category({
    name: 'Core',
    img: 'jpeg goes here'
  })
  category7.save()


  const subcategoryArray = [
    {
        category_id: category1._id,
        name: `Strength`,
        numberOfWorkouts: 3,
        img: `jpeg goes here`
    },
    {
        category_id: category1._id,
        name: `Power`,
        numberOfWorkouts: 3,
        img: `jpeg goes here`
    },
    {
        category_id: category1._id,
        name: `Endurance`,
        numberOfWorkouts: 3,
        img: `jpeg goes here`
    },
    {
        category_id: category2._id,
        name: `Pulling Power`,
        numberOfWorkouts: 3,
        img: `jpeg goes here`
    },
    {
        category_id: category2._id,
        name: `Shoulders`,
        numberOfWorkouts: 3,
        img: `jpeg goes here`
    },
    {
        category_id: category2._id,
        name: `Chest and Biceps`,
        numberOfWorkouts: 3,
        img: `jpeg goes here`
    },
    {
      category_id: category3._id,
      name: `Hamstrings`,
      numberOfWorkouts: 3,
      img: `jpeg goes here`
    },
    {
      category_id: category4._id,
      name: `Limit Bouldering`,
      numberOfWorkouts: 3,
      img: `jpeg goes here`
    },
    {
      category_id: category5._id,
      name: `Projecting`,
      numberOfWorkouts: 3,
      img: `jpeg goes here`
    },
    {
      category_id: category6._id,
      name: `Lower Body`,
      numberOfWorkouts: 3,
      img: `jpeg goes here`
    },
    {
      category_id: category7._id,
      name: `Power`,
      numberOfWorkouts: 3,
      img: `jpeg goes here`
    },
  ]

  const subcategories = await Subcategory.insertMany(subcategoryArray)
  console.log('Created subcategories!')


  const workoutArray = [
    {
        subcategory_id: subcategories[0]._id,
        name: `Max Hangs`,
        duration: 25,
        description: `Hang off of a 20mm edge for 7 seconds`,
        sets: 5,
        reps: 1,
        rest: '3-5 minutes'
    },
    {
        subcategory_id: subcategories[0]._id,
        name: `Max Arm Lifts`,
        duration: 30,
        description: `Use a 20mm edge attached to a pulling pin with the appropriate weight attached. Deadlift the weight using desired grip`,
        sets: 7,
        reps: 5,
        rest: '3-5 minutes'
    },
    {
        subcategory_id: subcategories[0]._id,
        name: `One-Arm Hangs`,
        duration: 25,
        description: `Hang off of a 20mm edge with one arm for 7 seconds. Use a pulley to remove weight, or add weight if neccessary.`,
        sets: 5,
        reps: 1,
        rest: '3-5 minutes'
    },
    {
        subcategory_id: subcategories[1]._id,
        name: `Campus Board`,
        duration: 20,
        description: `3 variations. Max pull, max offset, and max extended`,
        sets: 4,
        reps: 2,
        rest: '3-5 minutes'
    },
  ]

await Workout.insertMany(workoutArray)
  console.log('Created workouts!')
}

const run = async () => {
    await main()
    db.close()
}

run()
