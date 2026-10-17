import express from "express";
import { prisma } from "../lib/db";
import { restrictTo, verifyToken } from "../middlewares/auth";
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user?.userId as string,
        status: "CONFIRMED",
      },
      include: {
        event: true,
      },
      orderBy: {
        event: {
          eventDate: "asc",
        },
      },
    });
    console.log(bookings);
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error getting user bookings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id as string;
    const userId = req.user?.userId as string;

    const booking = await prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!booking || booking.status !== "CONFIRMED") {
      return res.status(404).json({ message: "Booking not found" });
    }

    const cancelledBooking = await prisma.booking.update({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      data: {
        status: "CANCELLED",
      },
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:id", verifyToken, async (req, res) => {
  try {
    const eventId = req.params.id as string;

    const userId = req.user?.userId as string;

    //  Find the event
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check whether this user already has a booking
    const existingBooking = await prisma.booking.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    //  If the user already has a confirmed booking, reject it
    if (existingBooking?.status === "CONFIRMED") {
      return res.status(409).json({
        message: "You have already booked this event",
      });
    }

    // Count only confirmed bookings
    const confirmedBookings = await prisma.booking.count({
      where: {
        eventId,
        status: "CONFIRMED",
      },
    });

    //  Check whether all seats are occupied
    if (confirmedBookings >= event.totalSeats) {
      return res.status(400).json({
        message: "This event is full",
        totalSeats: event.totalSeats,
        confirmedBookings,
      });
    }

    let booking;

    //  If the user previously cancelled, confirm that booking again
    if (existingBooking?.status === "CANCELLED") {
      booking = await prisma.booking.update({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
        data: {
          status: "CONFIRMED",
        },
      });
    } else {
      // Or create a new booking
      booking = await prisma.booking.create({
        data: {
          userId,
          eventId,
          status: "CONFIRMED",
        },
      });
    }

    return res.status(201).json({
      message: "Booking confirmed successfully",
      booking,
      totalSeats: event.totalSeats,
      confirmedBookings: confirmedBookings + 1,
      seatsLeft: event.totalSeats - (confirmedBookings + 1),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export { router };
