const Camp = require('../models/Camp');

// Add a new camp
// Accepts all fields: title, organizer, date, time, units, donors, location, state, city, address, pincode, contact, status
exports.addCamp = async (req, res) => {
    try {
        const campData = req.body;
        console.log({campData});
        // Optionally generate campId here if not provided
        if (!campData.campId) {
            campData.campId = 'CAMP-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
        // All new fields (state, city, address, pincode) are supported automatically
        const camp = new Camp(campData);
        await camp.save();
        const fullCamp = await Camp.findById(camp._id);
        res.status(201).json({
            message: 'Camp created successfully',
            camp: fullCamp
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error creating camp',
            error: error.message
        });
    }
};

// Update an existing camp by ID
// Accepts all fields: title, organizer, date, time, units, donors, location, state, city, address, pincode, contact, status
exports.updateCamp = async (req, res) => {
    try {
        const camp = await Camp.findByIdAndUpdate(
            req.params.id,
            req.body, // All new fields (state, city, address, pincode) are supported automatically
            { new: true }
        );
        if (!camp) {
            return res.status(404).json({
                message: 'Camp not found'
            });
        }
        res.status(200).json({
            message: 'Camp updated successfully',
            camp
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error updating camp',
            error: error.message
        });
    }
};

// Delete a camp by ID
exports.deleteCamp = async (req, res) => {
    try {
        const camp = await Camp.findByIdAndDelete(req.params.id);
        if (!camp) {
            return res.status(404).json({
                message: 'Camp not found'
            });
        }
        res.status(200).json({
            message: 'Camp deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error deleting camp',
            error: error.message
        });
    }
};
