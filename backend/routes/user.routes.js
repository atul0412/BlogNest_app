import express from 'express';
import {  getAdmins, getMyprofile, login, logout, register } from '../controller/user.controller.js';
import { isAuthenticated } from '../middleware/auth.user.js';

const router = express.Router()


router.post("/register", register)
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/my-profile",isAuthenticated, getMyprofile);
router.get("/getAdmins", getAdmins);

export default router;