const bcrypt = require('bcryptjs');
const Event = require('../../models/event')
const User = require('../../models/user')
const Booking = require('../../models/booking')

const logger = require('../../config');


//Helper functions
const fetchEvents = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: fetchUser.bind(this, event.creator)
            };
        });
    }
    catch (err) {
        throw err;
    }
}

const fetchSingleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            _id: event.id,
            creator: fetchUser.bind(this, event.creator)
        };
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



module.exports = {
    events: async () => {
        try {
            const events = await Event.find();

            logger.log('info', events);
            console.log(events);
            return events.map(event => {
                return {
                    ...event._doc, _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: fetchUser.bind(this, event._doc.creator)
                };
            });
        }
        catch (err) {
            console.log(err)
            logger.log('error', err)
            throw err;
        };
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            logger.log('info', bookings);
            console.log(bookings);
            return bookings.map(booking => {
                return {
                    ...booking._doc, _id: booking.id,
                    user: fetchUser.bind(this, booking._doc.user),
                    event: fetchSingleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                };
            });
        } catch (err) {
            console.log(err)
            logger.log('error', err)
            throw err;
        }
    },
    createEvent: async (args) => {
        logger.log('info', "Creating event");

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "61768057010d5a9817348463"
        });
        let createdEvent;
        try {
            const result = await event.save();
            logger.log('info', "Event created");

            createdEvent = {
                ...result._doc, _id: result._doc._id.toString(), date: new Date(event._doc.date).toISOString(),
                creator: fetchUser.bind(this, result._doc.creator)
            };
            // Handle relationship with user
            const creator = await User.findById('61768057010d5a9817348463');

            if (!creator) {
                throw new Error(`User not found`)
            }
            creator.createdEvents.push(event)
            await creator.save();

            return createdEvent;
        } catch (err) {
            console.log(err)
            logger.log('error', err)
            throw err;
        };

    },

    createUser: async (args) => {
        try {
            const email = args.userInput.email
            logger.log('info', "Creating a User");
            logger.log('info', `Checking if user exists for ${email}`);

            const existingUser = await User.findOne({ email: email })
            if (existingUser) {
                logger.log('error', `User exists for ${email}`);
                throw new Error(`User exists for ${email}`)
            }
            const hashedPw = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPw
            });
            const result = await user.save();

            logger.log('info', "User Created");
            console.log(result);
            return { ...result._doc, password: null, _id: result._doc._id.toString() };
        }
        catch (err) {
            console.log(err)
            logger.log('error', "Failed to Create user");
            logger.log('error', err)
            throw err;
        };

    },

    bookEvent: async (args) => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: '61768057010d5a9817348463',
            event: fetchedEvent
        });

        const result = await booking.save();
        return {
            ...result._doc, _id: result.id,
            user: fetchUser.bind(this, result._doc.user),
            event: fetchSingleEvent.bind(this, result._doc.event),
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
        };

    },
    cancelBooking: async (args) => {
        try {
            logger.log('info', `Canceling bookingId:${args.bookingId}`)
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc, _id: booking.event.id,
                creator: fetchUser.bind(this, booking.event._doc.creator)
            };
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }

}