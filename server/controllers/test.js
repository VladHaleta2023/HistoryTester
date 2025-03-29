import User from "../models/user.js";
import Test from "../models/test.js";
import Data from "../models/data.js";
import Image from "../models/image.js";
import Stat from "../models/stat.js";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";
import streamifier from 'streamifier';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const addTest = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }

        const { name, data1Name, data2Name } = req.body;

        const test = await Test.findOne({name: name});

        if (test) {
            return res.status(400).json({
                message: "Taki test już istnieje"
            });
        }

        let imageUrl = null;

        if (req.file) {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { resource_type: 'auto', folder: 'uploads' },
                async (error, result) => {
                    if (error) {
                        console.log(`Cloudinary error: ${error}`);
                        return res.status(500).json({ message: "Błąd przesyłania obrazu" });
                    }

                    imageUrl = result.secure_url;

                    const newTest = new Test({
                        name,
                        data1Name,
                        data2Name,
                        userId: user._id,
                        imageUrl
                    });

                    await newTest.save();

                    return res.status(200).json({
                        message: "Dodawanie testa udane, jest w trakcie weryfikacji",
                        test: newTest
                    });
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            const newTest = new Test({
                name,
                data1Name,
                data2Name,
                userId: user._id
            });

            await newTest.save();

            return res.status(200).json({
                message: "Dodawanie testa udane, jest w trakcie weryfikacji",
                test: newTest
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
            return res.status(400).json({ message: "Użytkownik nie znaleziony" });
        }

        const { name, data1Name, data2Name } = req.body;
        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        let imageUrl = test.imageUrl;

        if (req.file) {
            if (test.imageUrl) {
                const publicId = test.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.v2.uploader.destroy(publicId);
            }

            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { resource_type: 'auto', folder: 'uploads' },
                async (error, result) => {
                    if (error) {
                        console.log(`Cloudinary error: ${error}`);
                        return res.status(500).json({ message: "Błąd przesyłania obrazu" });
                    }

                    imageUrl = result.secure_url;

                    await Test.findByIdAndUpdate(req.params.testId, {
                        name,
                        data1Name,
                        data2Name,
                        imageUrl
                    });

                    return res.status(200).json({ message: "Aktualizacja testa udana" });
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        } else {
            await Test.findByIdAndUpdate(req.params.testId, {
                name,
                data1Name,
                data2Name,
            });

            return res.status(200).json({ message: "Aktualizacja testa udana" });
        }
    } catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ message: `Server error: ${err}` });
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

        let tests = [];
        if (user.status === "user")
            tests = await Test.find({ verified: true }).sort({ "createdAt": -1 }).populate('userId');
        else if (user.status === "teacher") {
            tests = await Test.find({
                $or: [
                    { userId: req.userId },
                    { verified: true }
                ]
            }).sort({ createdAt: -1 }).populate('userId');
        }
        else
            tests = await Test.find().sort({ "createdAt": -1 }).populate('userId');

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

        const { verified } = req.body;

        await Test.findByIdAndUpdate(req.params.testId, {
            verified: verified
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
            return res.status(400).json({ message: "Użytkownik nie znaleziony" });
        }

        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        if (!test.imageUrl) {
            return res.status(400).json({ message: "Obraza Fonowego nie znaleziono" });
        }

        const publicId = test.imageUrl.split('/').slice(-2).join('/').split('.')[0];

        const result = await cloudinary.v2.uploader.destroy(publicId);

        if (result.result === 'ok') {
            await Test.findByIdAndUpdate(test._id, { imageUrl: null });

            return res.status(200).json({ message: "Usuwanie Obraza Fonowego udane" });
        } else {
            return res.status(500).json({ message: "Nie udało się usunąć obrazu" });
        }
    } catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ 
            message: `Server error: ${err}` 
        });
    }
};

const deleteData = async (dataId) => {
    try {
        const data = await Data.findById(dataId);
        if (!data) {
            console.log("Dane nie znalezione");
            return;
        }

        const images = await Image.find({ dataId: data._id });

        for (let image of images) {
            if (image && image.imageUrl) {
                try {
                    const publicId = image.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                    await cloudinary.v2.uploader.destroy(publicId);
                } catch (error) {
                    console.log("Błąd usuwania obraza:", error);
                }
                await Image.findByIdAndDelete(image._id);
            }
        }

        await Data.findByIdAndDelete(data._id);
    } catch (err) {
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

        for (let i = 0; i < datas.length; i++) {
            await deleteData(datas[i]._id);
        }

        if (test.imageUrl && test.imageUrl !== "null") {
            try {
                const publicId = test.imageUrl.split('/').slice(-2).join('/').split('.')[0];
                await cloudinary.uploader.destroy(publicId);
                console.log("Obraz usunięty");
            } catch (error) {
                console.log("Błąd usuwania obraza:", error);
            }
        } else {
            console.log("Obraz nie znaleziony");
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

export const setTestStat = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }
    
        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        const { userQuestionCount, percent } = req.body;
        let { result } = req.body;
        result = (result !== undefined && (result === true || result === "true")) ? true : false;

        const testStat = await Stat.findOne({ userId: user._id, testId: test._id });

        if (testStat) {
            if (testStat.userQuestionCount < userQuestionCount)
                testStat.userQuestionCount = userQuestionCount;
            if (testStat.bestPercent < percent)
                testStat.bestPercent = percent;
            if (result)
                testStat.repetitions = testStat.repetitions + 1;

            await testStat.save();

            return res.status(200).json({ 
                message: "Aktualizacja statystyki testa udana",
                testStat: testStat
            });
        }
        else {
            const newTestStat = new Stat({
               userId: user._id,
               testId: test._id,
            });

            await newTestStat.save();

            return res.status(200).json({ 
                message: "Aktualizacja statystyki testa udana",
                testStat: newTestStat
            });
        }
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
}

export const getTestStats = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: "Użytkownik nie znaleziony"
            });
        }
    
        const test = await Test.findById(req.params.testId);

        if (!test) {
            return res.status(400).json({ message: "Test nie znaleziony" });
        }

        const testStats = await Stat.find({ testId: test._id })
            .populate("userId")
            .collation({ locale: "pl", strength: 2 })
            .sort({ percent: -1, "userId.username": 1 });

        return res.status(200).json({ 
            message: "Uzyskanie wyników testa udane",
            testStats: testStats
        });
    }
    catch (err) {
        console.log(`Server error: ${err}`);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
}