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
        const id = await newBooking._id;
        await newBooking.save();
        console.log("booking approved");
        return res.json({success : true , data : id});
    }catch(error) {
        console.log(error.message)
        return res.status(500).json({success : false , error:error.message})
    }
}

//resolve booking
export const resolveBooking = async(req , res) => {
    const {bookingId , endTime , solvedStatus} = req.body;

    if(!bookingId || !endTime)
    {
        return res.json({success : false , message : "booking Id || end time missing missing"});
    }

    try{
        const booking = await bookingModel.findOne({_id : bookingId});
        booking.endTime = endTime;
        booking.solvedStatus = solvedStatus;
        console.log(solvedStatus , "solved")
        await booking.save();
        return res.json({success : true , message :"booking resolved"})
    }catch(er)
    {
        return res.json({success : false , message : er.message});
    }
}