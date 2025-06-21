import { bookingModel } from "../db/bookingModel.js";

export const initiateBooking = async(req , res) => {
    const {
        platformName,
        level, 
        topics,
        problemLink,
        problemTitle,
        startTime
    } = req.body;
    // console.log("booking initialisisation kicked off" , req.body);
    if(!(platformName||level||topics||problemLink||problemTitle||startTime))
    {
        return res.json({success : false , message :"Must have all the atributes for the models"})
    }

    try{
        const newBooking = new bookingModel({
            platformName,
            level, 
            topics,
            problemLink,
            problemTitle,
            startTime
        })
        const id = newBooking._id;
        await newBooking.save();
        console.log("booking approved");
        return res.json({success : true , data : {bookingId : id}});
    }catch(error) {
        console.log(error.message)
        return res.status(500).json({success : false , error:error.message})
    }
}