const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Appointment = require("../models/appointment.model");
const Workshop = require("../models/workshop.model");

router.get("/income/:workshopId", async (req, res) => {
  const workshopId = req.params.workshopId;

  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).send({ error: "Taller not found." });
    }

    const incomeStats = await Appointment.aggregate([
      { $match: { Workshop: workshop.WorkshopName } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalIncome: { $sum: { $toInt: "$Bill.amount" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(incomeStats);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/total-appointments/:workshopId", async (req, res) => {
  const workshopId = req.params.workshopId;

  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).send({ error: "Taller not found." });
    }

    const totalAppointments = await Appointment.countDocuments({
      Workshop: workshop.WorkshopName,
    });

    const appointmentStats = await Appointment.aggregate([
      { $match: { Workshop: workshop.WorkshopName } },
      {
        $group: {
          _id: "$Status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      tallerName: workshop.WorkshopName,
      totalAppointments: totalAppointments,
      stats: appointmentStats,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/popular-services/:workshopId", async (req, res) => {
  const workshopId = req.params.workshopId;

  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).send({ error: "Taller not found." });
    }
    const servicesStats = await Appointment.aggregate([
      { $match: { Workshop: workshop.WorkshopName } },
      { $group: { _id: "$Service", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(servicesStats);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/appointment-trend/:workshopId", async (req, res) => {
  const workshopId = req.params.workshopId;

  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).send({ error: "Taller not found." });
    }
    const trendData = await Appointment.aggregate([
      { $match: { Workshop: workshop.WorkshopName } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(trendData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/monthly-users/:workshopId", async (req, res) => {
  const workshopId = req.params.workshopId;

  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).send({ error: "Taller not found." });
    }
    const monthlyUsers = await Appointment.aggregate([
      { $match: { Workshop: workshop.WorkshopName } },
      { $group: { _id: { $month: "$createdAt" }, userCount: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json(monthlyUsers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
