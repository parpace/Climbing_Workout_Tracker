const {User} = require('../models');

//Read
const getAllUsers = async (req, res) => {
    try {
        const objectArray = await User.find()
        res.json(objectArray)
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

//Read
const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const singleObject = await User.findById(id)
        if (singleObject) {
            return res.json(singleObject)
        }
        return res.status(404).send(`that User doesn't exist`)
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That User doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//Read
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username, password })
        if (user) {
            return res.json({ id: user._id })
        } else {
            return res.status(401).send('Invalid username or password')
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

//create
const createUser = async (req, res) => {
    try {
        const newObject = new User(req.body)
        await newObject.save()
        return res.status(201).json({
            newObject,
        });
    } catch (error) {
        // if (error.name === 'CastError' && error.kind === 'ObjectId') {
        //     return res.status(404).send(`That User doesn't exist`)
        // }
        return res.status(500).json({ error: error.message })
    }
}

//update
const updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let changedObject = await User.findByIdAndUpdate(id, req.body, { new: true })
        if (changedObject) {
            return res.status(200).json(changedObject)
        }
        throw new Error("User not found and can't be updated")
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That User doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

//delete
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const erasedObject = await User.findByIdAndDelete(id)
        if (erasedObject) {
            return res.status(200).send("User deleted");
        }
        throw new Error("User not found and can't be deleted");
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(404).send(`That User doesn't exist`)
        }
        return res.status(500).send(error.message);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    loginUser,
    createUser,
    updateUser,
    deleteUser
}