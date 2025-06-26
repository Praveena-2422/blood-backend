const mongoose = require('mongoose');
const Camp = require('../models/Camp');

const seedData = [
    {
        campId: "CAMP001",
        title: "Test Blood Donation Camp",
        organizer: "Test Organization",
        date: new Date(),
        time: "10:00 AM - 02:00 PM",
        units: 10,
        donors: 50,
        location: "Test Location",
        contact: "9876543210",
        status: "planned"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boss-backend');
        console.log('Connected to MongoDB for seeding');

        // Clear existing camps
        await Camp.deleteMany({});
        console.log('Existing camps cleared');

        // Insert test data
        const createdCamps = await Camp.insertMany(seedData);
        console.log(`Created ${createdCamps.length} test camps`);

        console.log('Seeding completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seeder
seedDatabase();
