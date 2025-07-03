const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
    campId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    organizer: {
        type: String
    },
    fromdate: {
        type: Date,
        required: true
    },
    todate: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    donors: {
        type: Number
    },
    location: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    pincode: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['planned', 'completed', 'cancelled'],
        default: 'planned'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Camp', campSchema);
