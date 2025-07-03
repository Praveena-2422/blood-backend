const Donor = require('../models/Donor');

exports.getBloodGroupCounts = async (req, res) => {
    try {
        // Get all existing blood groups and their counts
        const bloodGroups = await Donor.aggregate([
            {
                $group: {
                    _id: "$bloodGroup",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Map of all possible blood groups
        const allBloodGroups = {
            'A+': 0,
            'A-': 0,
            'B+': 0,
            'B-': 0,
            'AB+': 0,
            'AB-': 0,
            'O+': 0,
            'O-': 0
        };

        // Update counts for existing blood groups
        bloodGroups.forEach(group => {
            if (allBloodGroups.hasOwnProperty(group._id)) {
                allBloodGroups[group._id] = group.count;
            }
        });

        // Format the response with all blood groups
        const formattedGroups = Object.entries(allBloodGroups).map(([bloodGroup, count]) => ({
            bloodGroup,
            count
        }));

        res.status(200).json({
            statusCode: 200,
            status: 'success',
            data: formattedGroups
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            status: 'error',
            message: 'Error fetching blood group counts',
            error: error.message
        });
    }
};