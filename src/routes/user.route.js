import express from "express";
import { getUserProfile,updateProfile,syncUser ,getCurrentUser,followUser} from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//public route
router.get('/profile/:username', getUserProfile)

//protected routex`
router.post('/sync',protectedRoute,syncUser)
router.get('/me',protectedRoute,getCurrentUser)
router.put('/update-profile', protectedRoute, updateProfile)
router.post('/follow/:targetUserId',protectedRoute,followUser)



export default router;