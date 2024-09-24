import User from "../models/UserModel.js";

export const getUsers = async (req, res) => {
    try {
        const filter = {};
        const sort = {};

        // Use a regular expression for partial matching
        if (req.query.name) {
            const nameRegex = new RegExp(req.query.name, 'i'); // 'i' makes it case-insensitive
            filter.name = { $regex: nameRegex };
        }
        if (req.query.gender) filter.gender = req.query.gender;

        if (req.query.sort) {
            const sortField = req.query.sort.startsWith('-') ? req.query.sort.substring(1) : req.query.sort;
            const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;
            sort[sortField] = sortOrder;
        }

        const users = await User.find(filter).sort(sort);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

export const saveUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const inserteduser = await user.save();
        res.status(201).json(inserteduser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const updateUser = async (req, res) => {
    try {
        const updateduser = await User.updateOne({_id:req.params.id}, {$set: req.body});
        res.status(200).json(updateduser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deleteduser = await User.deleteOne({_id:req.params.id});
        res.status(200).json(deleteduser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}