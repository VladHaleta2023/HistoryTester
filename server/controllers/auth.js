import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res) => {
    try {
        const {username, password, status, classUser} = req.body;

        if (!username || !password || !status || !classUser ||
            password == "" || username == "" || status == "" || classUser == "") {
            return res.ststus(400).json({
                message: "Proszę uzupełnić wszystkie dane rejestracji"
            })
        }

        const isUsernameUsed = await User.findOne({username});

        if (isUsernameUsed) {
            return res.status(400).json({
                message: "Taki użytkownik już istnieje"
            });
        }

        const newUser = new User({
            username,
            password,
            status,
            class: classUser
        });

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        await newUser.save();

        return res.status(200).json({
            token,
            user: {
                ...newUser._doc,
            },
            message: "Rejetracja została zakończona"
        })
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Błąd Rejestracji: ${err}`
        });
    }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        if (!username || !password ||
            username == "" || password == "") {
            return res.status(400).json({
                message: "Proszę uzupełnić wszystkie dane"
            })
        }

        const user = await User.findOne({username});

        if (!user) {
            return res.status(400).json({
                message: "Nieprawidłowy użytkownik"
            })
        }

        if (user.password != password) {
            return res.status(400).json({
                message: "Nieprawidłowe hasło"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            token,
            user: {
                ...user._doc,
            },
            message: "Logowanie udane"
        })
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Błąd Logowania: ${err}`
        });
    }
}

export const logOut = async (req, res) => {
    try {
        delete req.headers.authorization;

        return res.status(200).json({
            message: "Wylogowanie udane"
        })
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        const token = req.token;

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        return res.status(200).json({
            token,
            user: {
                ...user._doc
            },
            message: "Uzyskanie użytkownika udane"
        })
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const getUsers = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const users = await User.find({ status: { $ne: "admin" } });

        return res.status(200).json({
            users,
            message: "Uzyskanie użytkowników udane"
        })
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        await User.findByIdAndUpdate(req.params.userId, { status: req.body.status });

        return res.status(200).json({
            message: "Aktualizacja użytkownika udana"
        })
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}