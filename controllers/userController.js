const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

// are other aggregates needed bc in the example they have grade, do you need something similar?

module.exports = {
    // Get all users
    async getUsers(req, res) {
        try {
        const users = await User.find();

        res.json(users);
        } catch (err) {
        console.log(err);
        return res.status(500).json(err);
        }
    },
    // Get a single user
    async getSingleUser(req, res) {
        try {
        const user = await User.findOne({ _id: req.params.userId })
            .select('-__v');

        if (!user) {
            return res.status(404).json({ message: 'No user with that ID' })
        }

        res.json(user);
        } catch (err) {
        console.log(err);
        return res.status(500).json(err);
        }
    },
    // create a new user
    async createUser(req, res) {
        try {
        const user = await User.create(req.body);
        res.json(user);
        } catch (err) {
        res.status(500).json(err);
        }
    },
    // update a new user
    async updateUser(req, res) {
        try {
        const user = await User.findByIdAndUpdate(
            { _id: req.params.id },
            { $set: req.body}, 
            { new: true, runValidators: true }
        );
        
        res.json(user);
        } catch (err) {
        res.status(500).send(err);
        }
    },
    // Delete a user and remove them
    async deleteUser(req, res) {
        try {
        const user = await User.findOneAndRemove({ _id: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'No such user exists' });
        }

        const thought = await Thought.findOneAndUpdate(
            { users: req.params.userId },
            { $pull: { users: req.params.userId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User deleted' });
        }

        res.json({ message: 'User successfully deleted' });
        } catch (err) {
        console.log(err);
        res.status(500).json(err);
        }
    },
    // Add an friend to a user
    async addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);

        try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.body } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res
            .status(404)
            .json({ message: 'No user found with that ID :(' });
        }

        res.json(user);
        } catch (err) {
        res.status(500).json(err);
        }
    },
    // Remove friend from a user
    async removeFriend(req, res) {
        try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friend: { friendId: req.params.friendId } } },
            { runValidators: true, new: true }
        );

        if (!user) {
            return res
            .status(404)
            .json({ message: 'No User found with that ID :(' });
        }

        res.json(user);
        } catch (err) {
        res.status(500).json(err);
        }
    },
};