const express = require('express');
const router = express.Router();
const { addCamp, updateCamp, deleteCamp } = require('../controllers/campController');
const Camp = require('../models/Camp');

// Get all camps
router.get('/', async (req, res) => {
    try {
        const camps = await Camp.find()
            .sort({ date: -1 });
        res.status(200).json({
            message: 'Camps retrieved successfully',
            camps
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving camps',
            error: error.message
        });
    }
});

// Get camp by ID
router.get('/:id', async (req, res) => {
    try {
        const camp = await Camp.findById(req.params.id);
        if (!camp) {
            return res.status(404).json({
                message: 'Camp not found'
            });
        }
        res.status(200).json({
            camp
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving camp',
            error: error.message
        });
    }
});

// Add new camp
router.post('/addcamp', addCamp);

// Update camp
router.put('/updatecamp/:id', updateCamp);

// Delete camp
router.delete('/deletecamp/:id', deleteCamp);

// Get camp statistics
router.get('/statistics', async (req, res) => {
    try {
        // Get all camps
        const camps = await Camp.find();

        // Calculate statistics
        const stats = {
            totalCamps: camps.length,
            totalDonors: camps.reduce((sum, camp) => sum + camp.donors, 0),
            totalUnits: camps.reduce((sum, camp) => sum + camp.units, 0),
            statusStats: {
                planned: camps.filter(camp => camp.status === 'planned').length,
                completed: camps.filter(camp => camp.status === 'completed').length,
                cancelled: camps.filter(camp => camp.status === 'cancelled').length
            },
            monthlyStats: camps.reduce((stats, camp) => {
                const month = camp.date.getMonth();
                stats[month] = (stats[month] || 0) + camp.donors;
                return stats;
            }, {})
        };

        res.status(200).json({
            message: 'Camp statistics retrieved successfully',
            stats
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving camp statistics',
            error: error.message
        });
    }
});

module.exports = router;
