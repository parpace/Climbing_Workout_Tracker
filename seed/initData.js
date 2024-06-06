const db = require('../db')
const { Category, Workout, User, Log } = require('../models')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const resetCollections = async () => {
  try {
      // await Category.deleteMany({})
      // await Workout.deleteMany({})
      await User.deleteMany({})
      // await Log.deleteMany({})
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
    profileName: 'Parker Pace',
    plannedWorkouts: [],
    loggedWorkouts: []
    })
    await user1.save()

  const user2 = new User({
    username: `parpace`,
    password: `parpace`,
    profileName: 'Parker Pace',
    plannedWorkouts: [],
    loggedWorkouts: []
    })
    await user2.save()

  // const category1 = new Category({
  //   name: 'Finger Training',
  //   img: 'jpeg goes here'
  // })
  // await category1.save()

  // const category2 = new Category({
  //   name: 'Upper Body',
  //   img: 'jpeg goes here'
  // })
  // await category2.save()

  // const category3 = new Category({
  //   name: 'Lower Body',
  //   img: 'jpeg goes here'
  // })
  // await category3.save()

  // const category4 = new Category({
  //   name: 'Bouldering',
  //   img: 'jpeg goes here'
  // })
  // await category4.save()

  // const category5 = new Category({
  //   name: 'Sport Climbing',
  //   img: 'jpeg goes here'
  // })
  // await category5.save()

  // const category6 = new Category({
  //   name: 'Mobility',
  //   img: 'jpeg goes here'
  // })
  // await category6.save()

  // const category7 = new Category({
  //   name: 'Core',
  //   img: 'jpeg goes here'
  // })
  // await category7.save()


  // const workoutArray = [
  //   {
  //     category_id: category1._id,
  //     name: 'Max Hangs',
  //     duration: 25,
  //     description: 'Hang off of a 20mm edge for 7 seconds.',
  //     sets: 5,
  //     reps: 1,
  //     rest: '3-5 minutes'
  //   },
  //   {
  //     category_id: category1._id,
  //     name: 'Max Arm Lifts',
  //     duration: 30,
  //     description: 'Use a 20mm edge attached to a pulling pin with the appropriate weight attached. Deadlift the weight using desired grip.',
  //     sets: 7,
  //     reps: 5,
  //     rest: '3-5 minutes'
  //   },
  //   {
  //     category_id: category1._id,
  //     name: 'One-Arm Hangs',
  //     duration: 25,
  //     description: 'Hang off of a 20mm edge with one arm for 7 seconds. Use a pulley to remove weight, or add weight if necessary.',
  //     sets: 5,
  //     reps: 1,
  //     rest: '3-5 minutes'
  //   },
  //   {
  //     category_id: category1._id,
  //     name: 'Campus Board',
  //     duration: 20,
  //     description: '3 variations. Max pull, max offset, and max extended.',
  //     sets: 4,
  //     reps: 2,
  //     rest: '3-5 minutes'
  //   },
  //   {
  //     category_id: category2._id,
  //     name: 'Scapular Pull-ups',
  //     duration: 5,
  //     description: 'Hang on bar and retract your scapula.',
  //     sets: 3,
  //     reps: 8,
  //     rest: '1 minute'
  //   },
  //   {
  //     category_id: category2._id,
  //     name: 'Lat Pulls',
  //     duration: 10,
  //     description: '3 variations: overhead, 45, face pulls.',
  //     sets: 3,
  //     reps: 8,
  //     rest: '2 minutes'
  //   },
  //   {
  //     category_id: category2._id,
  //     name: 'Weighted Pull-ups',
  //     duration: 15,
  //     description: 'Pull-ups with weight attached.',
  //     sets: 3,
  //     reps: 6,
  //     rest: '3-5 minutes'
  //   },
  //   {
  //     category_id: category3._id,
  //     name: 'Pistol Squats',
  //     duration: 5,
  //     description: 'Squat on 1 leg with other leg straightened in front of you.',
  //     sets: 3,
  //     reps: 3,
  //     rest: '1 minute'
  //   },
  //   {
  //     category_id: category3._id,
  //     name: 'Hamstring Curls',
  //     duration: 10,
  //     description: 'Your choice of method.',
  //     sets: 3,
  //     reps: 8,
  //     rest: '2-4 minutes'
  //   },
  //   {
  //     category_id: category3._id,
  //     name: 'Calf Raises',
  //     duration: 5,
  //     description: 'Stand up on those tip-toes.',
  //     sets: 3,
  //     reps: 20,
  //     rest: '1-2 minutes'
  //   },
  //   {
  //     category_id: category4._id,
  //     name: 'Limit Bouldering',
  //     duration: 60,
  //     description: 'Project your choice of boulder, as long as it\'s close to your limit!',
  //     sets: 1,
  //     reps: 1,
  //     rest: 'NA'
  //   },
  //   {
  //     category_id: category4._id,
  //     name: '4x4',
  //     duration: 30,
  //     description: 'Choose 4 boulders. Climb all 4 in a row with no rest. Rest 4 minutes, then repeat. 4 sets total.',
  //     sets: 4,
  //     reps: 4,
  //     rest: '4 minutes'
  //   },
  //   {
  //     category_id: category4._id,
  //     name: 'Alternating Feet',
  //     duration: 30,
  //     description: 'Climb a boulder with left foot only and then right foot only.',
  //     sets: 4,
  //     reps: 2,
  //     rest: '2-3 minutes'
  //   },
  //   {
  //     category_id: category5._id,
  //     name: 'Triples',
  //     duration: 60,
  //     description: 'Climb a route a bit beneath your limit three times in a row',
  //     sets: 1,
  //     reps: 3,
  //     rest: '10-20 minutes'
  //   },
  //   {
  //     category_id: category5._id,
  //     name: 'Projecting',
  //     duration: 60,
  //     description: 'Project your choice of route, as long as it\'s close to your limit!',
  //     sets: 1,
  //     reps: 1,
  //     rest: 'NA'
  //   },
  //   {
  //     category_id: category6._id,
  //     name: 'Weighted Butterfly',
  //     duration: 5,
  //     description: 'Sit against a wall in the butterfly position. Apply light weight against your knees for 30 seconds, then relax for 15.',
  //     sets: 3,
  //     reps: 3,
  //     rest: '1 minute'
  //   },
  //   {
  //     category_id: category6._id,
  //     name: 'Middle Splits',
  //     duration: 5,
  //     description: 'Sink as far as you can into a middle split.',
  //     sets: 3,
  //     reps: 3,
  //     rest: '1 minute'
  //   },
  //   {
  //     category_id: category6._id,
  //     name: 'Lizard Pose',
  //     duration: 5,
  //     description: 'Push-up position, and then bring one foot next to your hand.',
  //     sets: 3,
  //     reps: 3,
  //     rest: '1 minute'
  //   },
  //   {
  //     category_id: category7._id,
  //     name: 'Bar Core',
  //     duration: 10,
  //     description: 'Toe-ins, Heels-to-Hands, Leg Lifts',
  //     sets: 3,
  //     reps: 3,
  //     rest: '3 minutes'
  //   },
  //   {
  //     category_id: category7._id,
  //     name: 'TRX',
  //     duration: 10,
  //     description: '3 Variations: knees to chest, mountain climbers, knees to elbow',
  //     sets: 3,
  //     reps: 15,
  //     rest: '3 minutes'
  //   }
  // ]

  // await Workout.insertMany(workoutArray)
  // console.log('Created workouts!')
}

const run = async () => {
    await main()
    db.close()
}

run()