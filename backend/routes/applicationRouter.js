import express from "express";
import {adminGetAllApplications, 
        internshipseekerGetAllApplications, 
        internshipseekerdeleteAllapplication, 
        postApplication} from "../controllers/applicationcontroller.js";
import { isAuthorized } from "../middleware/auth.js";


const router = express.Router();

router.get("/admin/getall",isAuthorized, adminGetAllApplications);
router.get("/internshipseeker/getall",isAuthorized, internshipseekerGetAllApplications);
router.delete("/delete/:id", isAuthorized, internshipseekerdeleteAllapplication);
router.post("/post", isAuthorized, postApplication);

export default router;