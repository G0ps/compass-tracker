import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    platformName : {
        type : String,
        required : true
    },
    level: {
        type : String,
        required : true
    }, 
    topics: {
        type : [String],
        required : true
    },
    problemLink:{
        type : [String],
        required : true,
        validate: {
            validator: function (links) {
                return links.every(link =>
                    /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(link)
                );
            },
            message: 'Each problemLink must be a valid URL.'
        }
    },
    problemTitle :{
        type : String,
        required : true
    },
    startTime: {
        type: Date,
        required: true, // optional if it's mandatory
    },
    endTime : {
        type: Date
    }  
});

export const bookingModel = new mongoose.model('booking_model' , bookingSchema);