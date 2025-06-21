import express from "express"
import * as bookingControllers from "../controllers/bookingController.js"
const bookingRouter = new express.Router();

bookingRouter.post('/add/booking' , bookingControllers.initiateBooking)

export default bookingRouter;