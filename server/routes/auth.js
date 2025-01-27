import { Router } from "express";
import { register, login, logOut, getMe, getUsers, updateUserStatus } from "../controllers/auth.js";
import { checkAuth } from "../middleware/checkAuth.js";

const router = new Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logOut);

router.get('/getMe', checkAuth, getMe);

router.get('/', checkAuth, getUsers);

router.put('/:userId', checkAuth, updateUserStatus);

export default router;