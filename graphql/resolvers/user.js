const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const logger = require('../../config.js');
const jwt = require('jsonwebtoken');

module.exports = {
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
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });

        if (!user) {
            logger.log('error', "Login failed, user does not exist!");
            throw new Error('Invalid credentials')
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.log('error', "Login failed, password is incorrect!");
            throw new Error('Invalid credentials')
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'mysupersecrethashingkey', {
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token: token,
            tokenExp: 1,
        };
    }

}