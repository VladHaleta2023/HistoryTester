import User from "../models/user.js";
import Test from "../models/test.js";
import Data from "../models/data.js";
import Image from "../models/image.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export const addTest = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const { name, data1Name, data2Name } = req.body;

        if (req.file) {
            const imageUrl = `https://historytester.onrender.com/uploads/${req.file.filename}`;
            const newTest = Test({
                name,
                data1Name,
                data2Name,
                userId: user._id,
                imageUrl
            });

            await newTest.save();

            return res.status(200).json({
                message: "Dodawanie testa udane",
                test: {
                    ...newTest._doc
                }
            });
        }
        else {
            const newTest = Test({
                name,
                data1Name,
                data2Name,
                userId: user._id
            });

            await newTest.save();

            return res.status(200).json({
                message: "Dodawanie testa udane",
                test: {
                    ...newTest._doc
                }
            });
        }
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const updateTest = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const { name, data1Name, data2Name } = req.body;

        if (req.file) {
            const test = await Test.findById(req.params.testId);

            if (!test) {
                return res.status(400).json({
                    message: "Test nie znaleziony"
                });
            }

            try {
                const imageName = test.imageUrl.split('/uploads/')[1];
                let imagePath = path.join(__dirname, '..', 'uploads', imageName);
                imagePath = imagePath.replace(/^\\/, '');

                if (!fs.existsSync(imagePath)) {
                    console.log("Obraza Fonowego nie znaleziono");
                }

                fs.unlink(imagePath, async (err) => {
                    if (err) {
                        console.log(`Server error: ${err}`);
                    }
                });
            }
            catch {}

            const imageUrl = `https://historytester.onrender.com/uploads/${req.file.filename}`;

            await Test.findByIdAndUpdate(req.params.testId, {
                name,
                data1Name,
                data2Name,
                imageUrl
            });

            return res.status(200).json({
                message: "Aktualizacja testa udana"
            });
        }
        else {
            await Test.findByIdAndUpdate(req.params.testId, {
                name,
                data1Name,
                data2Name,
            });

            return res.status(200).json({
                message: "Aktualizacja testa udana"
            });
        }
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const getTests = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const tests = await Test.find().sort({ name: 1 });

        return res.status(200).json({
            tests,
            message: "Uzyskanie testów udane"
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const changeTestStatus = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        await Test.findByIdAndUpdate(req.params.testId, {
            verified: req.verified
        });

        return res.status(200).json({
            message: "Zmiana statusa testa udana"
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const getTest = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const test = await Test.findById(req.params.testId)
    
        return res.status(200).json({
            test: {
                ...test._doc
            },
            message: "Uzyskanie testa udane"
        });
      } 
      catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const deleteImage = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(400).json({
                message: "Test nie znaleziony"
            });
        }

        if (!test.imageUrl || test.imageUrl === null || test.imageUrl === "null") {
            return res.status(400).json({
                message: "Obraza Fonowego nie znaleziono"
            });
        }

        const imageName = test.imageUrl.split('/uploads/')[1];
        let imagePath = path.join(__dirname, '..', 'uploads', imageName);
        imagePath = imagePath.replace(/^\\/, '');

        if (!fs.existsSync(imagePath)) {
            return res.status(400).json({
                message: "Obraza Fonowego nie znaleziono"
            });
        }

        fs.unlink(imagePath, async (err) => {
            if (err) {
                console.log(`Server error: ${err}`);
                return res.status(500).json({
                    message: `Błąd Usuwania Obraza Fonowego: ${err}`
                });
            }
            else {
                await Test.findByIdAndUpdate(test._id, { imageUrl: null });
                return res.status(200).json({
                    message: `Usuwanie Obraza Fonowego udane`
                });
            }
        });
      } 
      catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

const deleteData = async (dataId) => {
    try {
        const data = await Data.findById(dataId);

        if (!data) {
            return res.status(400).json({
                message: "Dane nie znalezione"
            });
        }

        const images = await Image.find({ dataId: data._id });

        for (let i = 0; i < images.length; i++) {
            let image = images[i];

            if (!image || !image.imageUrl || image.imageUrl === null || image.imageUrl === "null") {
                console.log("Obraz nie znaleziony");
            }
    
            try {
                const imageName = image.imageUrl.split('/uploads/')[1];
                let imagePath = path.join(__dirname, '..', 'uploads', imageName);
                imagePath = imagePath.replace(/^\\/, '');
    
                if (!fs.existsSync(imagePath)) {
                    console.log("Obraz nie znaleziony");
                }
    
                fs.unlink(imagePath, async (err) => {
                    if (err) {
                        console.log(`Server error: ${err}`);
                    }
                });
            }
            catch {
                console.log("Usuwanie obraza nie udane");
            }

            await Image.findByIdAndDelete(image._id);
        }

        await Data.findByIdAndDelete(data._id);
    }
    catch (err) {
        console.log(`Server error: ${err}`);
    }
}

export const deleteTest = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(400).json({
                message: "Test nie znaleziony"
            });
        }

        const datas = await Data.find({ testId: test._id });

        for (let i = 0; i < datas.length; i++)
            deleteData(datas[i]._id);
        
        if (!test.imageUrl || test.imageUrl === null || test.imageUrl === "null") {
            console.log("Obraz nie znaleziony");
        }
    
        try {
            const imageName = test.imageUrl.split('/uploads/')[1];
            let imagePath = path.join(__dirname, '..', 'uploads', imageName);
            imagePath = imagePath.replace(/^\\/, '');

            if (!fs.existsSync(imagePath)) {
                console.log("Obraz nie znaleziony");
            }

            fs.unlink(imagePath, async (err) => {
                if (err) {
                    console.log(`Server error: ${err}`);
                }
            });
        }
        catch {
            console.log("Usuwanie obraza nie udane");
        }

        await Test.findByIdAndDelete(test._id);

        return res.status(200).json({
            message: "Usuwanie testa udane"
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}