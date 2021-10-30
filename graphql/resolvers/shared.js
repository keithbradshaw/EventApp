const Event = require('../../models/event')
const User = require('../../models/user')
const { dateToString } = require('../../shared_helpers/date')


const transformEvent = async (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: fetchUser.bind(this, event.creator)
    };
}

const transformBooking = async (booking) => {
    return {
        ...booking._doc, _id: booking.id,
        user: fetchUser.bind(this, booking._doc.user),
        event: fetchSingleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    };
}

const fetchEvents = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return transformEvent(event)
        });
    }
    catch (err) {
        throw err;
    }
}

const fetchSingleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId)
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
}

const fetchUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        return { ...user._doc, _id: user.id, createdEvents: fetchEvents.bind(this, user._doc.createdEvents) };

    }
    catch (err) {
        throw err;
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
