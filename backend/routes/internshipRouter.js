import express from "express";
import { deleteInternship, getAllInternships, getMyInternships, getSingleInternship, postInternships, updateinternship } from "../controllers/internshipController.js";
import { isAuthorized } from "../middleware/auth.js";

const router = express.Router();

router.get("/getAll", getAllInternships);
router.post("/post", isAuthorized, postInternships);
router.get("/getmyintern", isAuthorized, getMyInternships);
router.put("/updatemyintern/:id", isAuthorized, updateinternship);
router.delete("/deleteintern/:id", isAuthorized, deleteInternship);
router.get("/:id", isAuthorized, getSingleInternship);

export default router;