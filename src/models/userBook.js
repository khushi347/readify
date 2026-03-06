import mongoose from "mongoose";

const userBookSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },

        book:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Book",
            required:true,
        },

        status:{
            type:String,
            enum:["want","reading","completed"],
            default:"want",
        },

        currentPage:{
            type:Number,
            default:0,
        },

        progress:{
            type:Number,
            min:0,
            max:100,
            default:0,
        },

        isFavorite:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true}
);

userBookSchema.index({user:1,book:1},{unique:true});

const UserBook=mongoose.model("UserBook",userBookSchema);

export default UserBook;