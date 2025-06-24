import express from "express"
import * as bookingControllers from "../controllers/bookingController.js"
const bookingRouter = new express.Router();

bookingRouter.post('/add/booking' , bookingControllers.initiateBooking)
bookingRouter.post('/resolve/booking' , bookingControllers.resolveBooking)

export default bookingRouter;