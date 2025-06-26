const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
    campId: {
        type: String,
        // unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    organizer: {
        type: String
    },
    date: {
        type: Date
    },
    time: {
        type: String
    },
    units: {
        type: Number
    },
    donors: {
        type: Number
    },
    location: {
        type: String,
        required: true
    },
    contact: {
        type: String
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
