import Ticket from "../models/Ticket.js";

// POST /api/support
export const createTicket = async (req, res, next) => {
  try {
    const { subject, message, category } = req.body;
    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      message,
      category: category || "other",
    });
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

// GET /api/support
export const myTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort("-createdAt");
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

// POST /api/support/:id/reply
export const replyToTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error("Ticket not found");
    }
    const mine = ticket.user.equals(req.user._id);
    if (!mine && req.user.role !== "admin") {
      res.status(403);
      throw new Error("You cannot reply to this ticket");
    }

    ticket.replies.push({ by: req.user._id, message: req.body.message });
    ticket.status = req.user.role === "admin" ? "answered" : "open";
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    next(err);
  }
};
