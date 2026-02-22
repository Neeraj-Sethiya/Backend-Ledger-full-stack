const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        unique : [true, "email already exsits"],
        required: [true, "email required"],
        trim : true,
        lowercase : true,
        match : [/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/, "enter a valid email"],
    },
    name : {
        type : String,
        required : [true, "name required"],
    },
    password : {
        type : String,
        required : [true, "password required"],
        minlength : [6, "password must contain 6 or more letters"],
        select : false,
    },
    systemUser :{
        type: Boolean,
        default: false,
        immutable: true,
        select: false,
    }
},{
    timestamps : true,
}
)

userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return;
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;