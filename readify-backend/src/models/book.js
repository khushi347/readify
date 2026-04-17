import mongoose from "mongoose";

const bookSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,
        },

        author:{
            type:String,
            required:true,
            trim:true,
        },

        description:{
            type:String,
            default:"",
        },

        coverImage:{
            type:String,
            default:"",
        },

        genre:{
            type:[String],
            default:[]
        },

        googleBooksId:{
            type:String,
            unique:true,
            sparse:true
        },

        totalPages:{
            type:Number,
            required:true,
            min:1,
        },

        rating:{
            total:{
                type:Number,
                default:0
            },
            count:{
                type:Number,
                default:0
            }
        }
    },
    {
        timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
    }
);

bookSchema.index({title:"text"});
bookSchema.index({googleBooksId:1});     

bookSchema.virtual("averageRating").get(function(){
    if(this.rating.count===0) return 0;
    return(this.rating.total/this.rating.count).toFixed(1);
});

const Book=mongoose.model("Book",bookSchema);

export default Book;