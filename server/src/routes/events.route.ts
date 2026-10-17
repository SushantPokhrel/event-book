import express from "express";
import { prisma } from "../lib/db";
import { restrictTo, verifyToken } from "../middlewares/auth";

const router = express.Router();

const getEventData = (body: {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  totalSeats: number;
}) => {
  const { title, description, eventDate, eventTime, venue, totalSeats } = body;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof eventDate !== "string" ||
    typeof eventTime !== "string" ||
    typeof venue !== "string" ||
    typeof totalSeats !== "number" ||
    !title.trim() ||
    !description.trim() ||
    !eventDate.trim() ||
    !eventTime.trim() ||
    !venue.trim() ||
    !Number.isInteger(totalSeats) ||
    totalSeats <= 0
  ) {
    return null;
  }

  const parsedDate = new Date(eventDate);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return {
    title: title.trim(),
    description: description.trim(),
    eventDate: parsedDate,
    eventTime: eventTime.trim(),
    venue: venue.trim(),
    totalSeats,
  };
};

router.get("/", async (_req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { eventDate: "asc" },
    });
    return res.status(200).json({ events });
  } catch (error) {
    console.error("error getting events:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id } as { id: string },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const confirmedBookings = await prisma.booking.count({
      where: {
        eventId: id as string,
        status: "CONFIRMED",
      },
    });

    return res.status(200).json({
      event,
      availableSeats: event.totalSeats - confirmedBookings,
    });
  } catch (error) {
    console.error("error getting event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", verifyToken, restrictTo("ADMIN"), async (req, res) => {
  const eventData = getEventData(req.body);
  if (!eventData) {
    return res.status(400).json({
      message:
        "title, description, eventDate, eventTime, venue and a positive seats count are required.",
    });
  }

  try {
    const event = await prisma.event.create({ data: eventData });
    return res.status(201).json({ event });
  } catch (error) {
    console.error("Create event error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", verifyToken, restrictTo("ADMIN"), async (req, res) => {
  const { id } = req.params;
  const eventData = getEventData(req.body);
  if (!eventData) {
    return res.status(400).json({
      message:
        "title, description, eventDate, eventTime, venue and a positive totalSeats are required.",
    });
  }

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id } as { id: string },
    });
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const confirmedBookings = await prisma.booking.count({
      where: {
        eventId: id as string,
        status: "CONFIRMED",
      },
    });

    if (eventData.totalSeats < confirmedBookings) {
      return res.status(400).json({
        message: `Total seats cannot be less than the ${confirmedBookings} confirmed booking(s).`,
      });
    }

    const event = await prisma.event.update({
      where: { id } as { id: string },
      data: eventData,
    });
    return res.status(200).json({ event });
  } catch (error) {
    console.error("error updating an event:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, restrictTo("ADMIN"), async (req, res) => {
  const { id } = req.params;

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id } as { id: string },
    });
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    await prisma.event.delete({ where: { id } as { id: string } });
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("error deleting an event", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router };
