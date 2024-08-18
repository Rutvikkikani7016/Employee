import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  addemp,
  deleteemp,
  editemp,
  getallemp,
  searchemployee,
} from "../controller/emp.controller.js"

const router = express.Router()

router.post("/add", verifyToken, addemp)
router.post("/edit/:empId", verifyToken, editemp)
router.get("/all", verifyToken, getallemp)
router.delete("/delete/:empId", verifyToken, deleteemp)
router.get("/search", verifyToken, searchemployee)

export default router
