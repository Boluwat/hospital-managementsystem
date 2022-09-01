const mongoose = require('mongoose');

const roleSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        },
    },
    description: {
        type: String,
        required: true,
    },
    isHospitalMgt: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
}, { strict: 'throw', timestamps: true });

const Role = mongoose.model('Role', roleSchema);
module.exports= {
    Role
}