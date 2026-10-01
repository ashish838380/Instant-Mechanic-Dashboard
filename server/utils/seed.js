const mongoose = require("mongoose");
require("dotenv").config();

const Customer = require("../models/Customer");
const Mechanic = require("../models/Mechanic");
const Service = require("../models/Service");
const Booking = require("../models/Booking");

const services = [
  {
    name: "Full Car Service",
    category: "Periodic Maintenance",
    description: "Complete vehicle inspection and maintenance",
    basePrice: 2499,
    estimatedDuration: 180,
  },
  {
    name: "Oil Change",
    category: "Periodic Maintenance",
    description: "Engine oil and filter replacement",
    basePrice: 899,
    estimatedDuration: 60,
  },
  {
    name: "Brake Service",
    category: "Repair",
    description: "Brake inspection and servicing",
    basePrice: 1499,
    estimatedDuration: 120,
  },
  {
    name: "AC Service",
    category: "AC Service",
    description: "Complete air conditioning inspection",
    basePrice: 1299,
    estimatedDuration: 90,
  },
  {
    name: "Wheel Alignment",
    category: "Tyre & Wheel",
    description: "Computerized wheel alignment",
    basePrice: 699,
    estimatedDuration: 60,
  },
  {
    name: "Battery Replacement",
    category: "Battery",
    description: "Battery inspection and replacement",
    basePrice: 4999,
    estimatedDuration: 45,
  },
  {
    name: "Car Inspection",
    category: "Inspection",
    description: "Complete vehicle health inspection",
    basePrice: 599,
    estimatedDuration: 45,
  },
  {
    name: "Car Cleaning",
    category: "Cleaning",
    description: "Interior and exterior cleaning",
    basePrice: 799,
    estimatedDuration: 90,
  },
];

const firstNames = [
  "Rahul",
  "Amit",
  "Priya",
  "Neha",
  "Rohit",
  "Ankit",
  "Sneha",
  "Vikas",
  "Pooja",
  "Arjun",
  "Karan",
  "Riya",
  "Aditya",
  "Simran",
  "Nikhil",
];

const lastNames = [
  "Sharma",
  "Kumar",
  "Singh",
  "Yadav",
  "Verma",
  "Gupta",
  "Mehta",
  "Malhotra",
  "Joshi",
  "Patel",
];

const carBrands = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Honda",
  "Toyota",
  "Mahindra",
  "Kia",
];

const carModels = {
  "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Brezza"],
  Hyundai: ["i20", "Creta", "Venue", "Verna"],
  Tata: ["Nexon", "Punch", "Altroz", "Harrier"],
  Honda: ["City", "Amaze", "Elevate"],
  Toyota: ["Fortuner", "Innova", "Glanza"],
  Mahindra: ["XUV700", "Scorpio", "Thar"],
  Kia: ["Seltos", "Sonet", "Carens"],
};

const specializations = [
  "Engine Specialist",
  "Brake Specialist",
  "AC Specialist",
  "Electrical Specialist",
  "General Service",
];

const randomItem = (array) =>
  array[Math.floor(Math.random() * array.length)];

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = () => {
  const date = new Date();
  const daysAgo = randomNumber(0, 60);

  date.setDate(date.getDate() - daysAgo);
  date.setHours(
    randomNumber(8, 18),
    randomNumber(0, 59),
    0,
    0
  );

  return date;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("🍃 Connected to MongoDB");

    await Booking.deleteMany({});
    await Customer.deleteMany({});
    await Mechanic.deleteMany({});
    await Service.deleteMany({});

    console.log("🗑️ Old data cleared");

    // Create services
    const createdServices = await Service.insertMany(services);

    console.log(`🔧 ${createdServices.length} services created`);

    // Create customers
    const customers = [];

    for (let i = 1; i <= 60; i++) {
      const name = `${randomItem(firstNames)} ${randomItem(lastNames)}`;

      customers.push({
        name,
        email: `customer${i}@example.com`,
        phone: `98${randomNumber(10000000, 99999999)}`,
        address: `Delhi, India`,
        totalBookings: 0,
        totalSpent: 0,
      });
    }

    const createdCustomers = await Customer.insertMany(customers);

    console.log(`👥 ${createdCustomers.length} customers created`);

    // Create mechanics
    const mechanics = [];

    for (let i = 1; i <= 25; i++) {
      mechanics.push({
        name: `Mechanic ${i}`,
        phone: `97${randomNumber(10000000, 99999999)}`,
        email: `mechanic${i}@instantmechanic.com`,
        specialization: randomItem(specializations),
        status: randomItem(["Available", "Busy", "Offline"]),
        jobsCompleted: randomNumber(10, 150),
      });
    }

    const createdMechanics = await Mechanic.insertMany(mechanics);

    console.log(`👨‍🔧 ${createdMechanics.length} mechanics created`);

    // Create bookings
    const bookings = [];

    const statuses = [
      "Pending",
      "Confirmed",
      "In Progress",
      "Completed",
      "Cancelled",
    ];

    for (let i = 1; i <= 600; i++) {
      const customer = randomItem(createdCustomers);
      const service = randomItem(createdServices);
      const mechanic = randomItem(createdMechanics);

      const brand = randomItem(carBrands);
      const model = randomItem(carModels[brand]);

      const status = randomItem(statuses);

      const amount =
        service.basePrice + randomNumber(-100, 1000);

      bookings.push({
        bookingId: `IM-${String(i).padStart(5, "0")}`,

        customer: customer._id,

        vehicle: {
          type: "Car",
          brand,
          model,
          registrationNumber: `DL${randomNumber(
            1,
            99
          )}${String.fromCharCode(
            65 + randomNumber(0, 25)
          )}${randomNumber(1000, 9999)}`,
        },

        service: service._id,

        mechanic:
          status === "Pending" || status === "Cancelled"
            ? null
            : mechanic._id,

        status,

        amount: Math.max(amount, 299),

        bookingDate: randomDate(),

        notes:
          status === "Completed"
            ? "Service completed successfully"
            : "",
      });
    }

    const createdBookings = await Booking.insertMany(bookings);

    console.log(`📋 ${createdBookings.length} bookings created`);

    // Update customer statistics
    for (const customer of createdCustomers) {
      const customerBookings = createdBookings.filter(
        (booking) =>
          booking.customer.toString() === customer._id.toString()
      );

      const completedBookings = customerBookings.filter(
        (booking) => booking.status === "Completed"
      );

      const totalSpent = completedBookings.reduce(
        (sum, booking) => sum + booking.amount,
        0
      );

      await Customer.findByIdAndUpdate(customer._id, {
        totalBookings: customerBookings.length,
        totalSpent,
      });
    }

    console.log("📊 Customer statistics updated");

    console.log("");
    console.log("🎉 DATABASE SEED COMPLETED!");
    console.log("================================");
    console.log(`Services:  ${createdServices.length}`);
    console.log(`Customers: ${createdCustomers.length}`);
    console.log(`Mechanics: ${createdMechanics.length}`);
    console.log(`Bookings:  ${createdBookings.length}`);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();