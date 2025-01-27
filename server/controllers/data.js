import User from "../models/user.js";
import Data from "../models/data.js";
import Test from "../models/test.js";
import Image from "../models/image.js";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export const addData = async (req, res) => {
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

        const { data1, data2 } = req.body;

        const newData = new Data({
            data1,
            data2,
            testId: test._id
        });

        await newData.save();

        if (!req.files || req.files.length === 0) {
            return res.status(200).json({
                images: [],
                data: {
                    ...newData._doc
                },
                message: "Dodawanie danych udane. Dodawanie obrazów nie udane"
            });
        }
        else {
            const uploadedFiles = await Promise.all(
                req.files.map(async (file) => {
                    const imageUrl = `http://localhost:5000/uploads/${file.filename}`;
    
                    const newImage = new Image({
                        dataId: newData._id,
                        imageUrl
                    });
    
                    await newImage.save();

                    return { imageUrl };
                })
            );

            const images = uploadedFiles.map(file => file.imageUrl);
        
            res.status(200).json({
                message: 'Dodawanie danych udane',
                images,
                data: {
                    ...newData._doc
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

export const getData = async (req, res) => {
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

        const data = await Data.findById(req.params.dataId);

        if (!data) {
            return res.status(400).json({
                message: "Dane nie znalezione"
            });
        }

        const images = await Image.find({ dataId: data._id });

        return res.status(200).json({
            data,
            images,
            message: `Uzyskanie danych udane`
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const getDatas = async (req, res) => {
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
        let fetchData = [];

        for (let i = 0; i < datas.length; i++) {
            const images = await Image.find({ dataId: datas[i]._id });
            
            let fetchImages = [];
            for (let j = 0; j < images.length; j++)
                fetchImages.push(images[j]._doc.imageUrl);
            
            fetchData.push({
                data1Name: test.data1Name,
                data2Name: test.data2Name,
                data: {
                    ...datas[i]._doc
                },
                images: fetchImages
            });
        }

        return res.status(200).json({
            datas: fetchData,
            message: `Uzyskanie danych udane`
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const uploadImageData = async (req, res) => {
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

        const data = await Data.findById(req.params.dataId);

        if (!data) {
            return res.status(400).json({
                message: "Dane nie znalezione"
            });
        }

        if (req.file) {
            const image = await Image.findById(req.params.imageId);

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
            catch {}

            const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

            await Image.findByIdAndUpdate(req.params.imageId, {
                imageUrl
            });

            return res.status(200).json({
                message: "Aktualizacja obraza udana"
            });
        }
        else {
            return res.status(200).json({
                message: "Aktualizacja obraza nie udana"
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

export const deleteImageData = async (req, res) => {
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

        const data = await Data.findById(req.params.dataId);

        if (!data) {
            return res.status(400).json({
                message: "Dane nie znalezione"
            });
        }

        const image = await Image.findById(req.params.imageId);

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
            return res.status(500).json({
                message: "Usuwanie obraza nie udane"
            });
        }

        await Image.findByIdAndDelete(req.params.imageId);

        return res.status(200).json({
            message: "Usuwanie obraza udane"
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}

export const updateData = async (req, res) => {
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

        const data = await Data.findById(req.params.dataId);

        if (!data) {
            return res.status(400).json({
                message: "Dane nie znalezione"
            });
        }

        const { data1, data2 } = req.body;

        await Data.findByIdAndUpdate(data._id, {
            data1,
            data2
        });

        if (!req.files || req.files.length === 0) {
            return res.status(200).json({
                images: [],
                data: {
                    ...data._doc
                },
                message: "Aktualizacja danych udana"
            });
        }
        else {
            const uploadedFiles = await Promise.all(
                req.files.map(async (file) => {
                    const imageUrl = `http://localhost:5000/uploads/${file.filename}`;
    
                    const newImage = new Image({
                        dataId: data._id,
                        imageUrl
                    });
    
                    await newImage.save();

                    return { imageUrl };
                })
            );

            const images = uploadedFiles.map(file => file.imageUrl);
        
            res.status(200).json({
                message: 'Aktualizacja danych udana',
                images,
                data: {
                    ...data._doc
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

export const deleteData = async (req, res) => {
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

        const data = await Data.findById(req.params.dataId);

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

        return res.status(200).json({
            message: "Usuwanie danych udane",
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({
            message: `Server error: ${err}`
        });
    }
}