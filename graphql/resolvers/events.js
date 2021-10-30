const Event = require('../../models/event');
const User = require('../../models/user')

const logger = require('../../config.js');

const { transformEvent } = require("./shared");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();

            logger.log('info', events);
            console.log(events);
            return events.map(event => {
                return transformEvent(event);
            });
        }
        catch (err) {
            console.log(err)
            logger.log('error', err)
            throw err;
        };
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Must be authenticated for this request')
        }
        logger.log('info', "Creating event");

        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try {
            const result = await event.save();
            logger.log('info', "Event created");

            createdEvent = transformEvent(result);

            // Handle relationship with user
            const creator = await User.findById(req.userId);

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

    }




}