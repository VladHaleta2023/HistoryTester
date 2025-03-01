import User from "../models/user.js";
import Data from "../models/data.js";
import Test from "../models/test.js";
import Image from "../models/image.js";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import streamifier from 'streamifier';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const addData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({ message: "Użytkownik nie znaleziony" });
        }

        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
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
                data: { ...newData._doc },
                message: "Dodawanie danych udane. Dodawanie obrazów nie udane"
            });
        }

        const uploadedFiles = await Promise.all(
            req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.v2.uploader.upload_stream(
                        { folder: 'uploads' },
                        async (error, result) => {
                            if (error) {
                                console.error(`Cloudinary error: ${error.message}`);
                                reject(error);
                            } else {
                                const newImage = new Image({
                                    dataId: newData._id,
                                    imageUrl: result.secure_url
                                });

                                await newImage.save();
                                resolve({ imageUrl: result.secure_url });
                            }
                        }
                    );

                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                });
            })
        );

        const images = uploadedFiles.map(file => file.imageUrl);

        res.status(200).json({
            message: "Dodawanie danych udane",
            images,
            data: { ...newData._doc }
        });

    } catch (err) {
        console.error(`Server error: ${err}`);
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
};

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

        const datas = await Data.find({ testId: test._id })
            .collation({ locale: "pl", strength: 2 })
            .sort({ data1: 1, data2: 1 });
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
            return res.status(400).json({ message: "Użytkownik nie znaleziony" });
        }

        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        const data = await Data.findById(req.params.dataId);
        if (!data) {
            return res.status(400).json({ message: "Dane nie znalezione" });
        }

        if (req.file) {
            const image = await Image.findById(req.params.imageId);
            if (image && image.imageUrl) {
                try {
                    const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.v2.uploader.destroy(publicId);
                } catch (error) {
                    console.log("Błąd usuwania obrazu z Cloudinary:", error);
                }
            }

            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { resource_type: 'auto', folder: 'uploads' },
                async (error, result) => {
                    if (error) {
                        console.log(`Cloudinary error: ${error}`);
                        return res.status(500).json({ message: "Błąd przesyłania obrazu" });
                    }

                    const imageUrl = result.secure_url;
                    await Image.findByIdAndUpdate(req.params.imageId, { imageUrl });

                    return res.status(200).json({ message: "Aktualizacja obraza udana" });
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            return res.status(400).json({ message: "Brak pliku do przesłania" });
        }
    } catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
}

export const deleteImageData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ message: "Użytkownik nie znaleziony" });
        }

        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        const data = await Data.findById(req.params.dataId);
        if (!data) {
            return res.status(400).json({ message: "Dane nie znalezione" });
        }

        const image = await Image.findById(req.params.imageId);
        if (!image || !image.imageUrl) {
            return res.status(400).json({ message: "Obraz nie znaleziony" });
        }

        try {
            const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.v2.uploader.destroy(publicId);
        } catch (error) {
            console.log("Błąd usuwania obrazu z Cloudinary:", error);
            return res.status(500).json({ message: "Błąd usuwania obrazu" });
        }

        await Image.findByIdAndDelete(req.params.imageId);

        return res.status(200).json({ message: "Usuwanie obraza udane" });
    } catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
}

export const updateData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ message: "Użytkownik nie znaleziony" });
        }

        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        const data = await Data.findById(req.params.dataId);
        if (!data) {
            return res.status(400).json({ message: "Dane nie znalezione" });
        }

        const { data1, data2 } = req.body;
        await Data.findByIdAndUpdate(data._id, { data1, data2 });

        if (!req.files || req.files.length === 0) {
            return res.status(200).json({
                images: [],
                data: { ...data._doc },
                message: "Aktualizacja danych udana"
            });
        } else {
            const uploadedFiles = await Promise.all(
                req.files.map(async (file) => {
                    return new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.v2.uploader.upload_stream(
                            { resource_type: 'auto', folder: 'uploads' },
                            async (error, result) => {
                                if (error) {
                                    console.log(`Cloudinary error: ${error}`);
                                    return reject(error);
                                }
                                
                                const newImage = new Image({
                                    dataId: data._id,
                                    imageUrl: result.secure_url
                                });
                                await newImage.save();
                                resolve(result.secure_url);
                            }
                        );
                        streamifier.createReadStream(file.buffer).pipe(uploadStream);
                    });
                })
            );

            res.status(200).json({
                message: 'Aktualizacja danych udana',
                images: uploadedFiles,
                data: { ...data._doc }
            });
        }
    } catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
}

export const deleteData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ message: "Użytkownik nie znaleziony" });
        }

        const test = await Test.findById(req.params.testId);
        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        const data = await Data.findById(req.params.dataId);
        if (!data) {
            return res.status(400).json({ message: "Dane nie znalezione" });
        }

        const images = await Image.find({ dataId: data._id });

        for (let image of images) {
            if (image && image.imageUrl) {
                try {
                    const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.v2.uploader.destroy(publicId);
                } catch (error) {
                    console.log("Błąd usuwania obrazu z Cloudinary:", error);
                }

                await Image.findByIdAndDelete(image._id);
            }
        }

        await Data.findByIdAndDelete(data._id);

        return res.status(200).json({ message: "Usuwanie danych udane" });
    } catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
}