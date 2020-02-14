const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: parseInt(process.env.PORT),
    url: process.env.URL,
    account: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    server: {
        host: process.env.EMAIL_SERVER_URL,
        port: parseInt(process.env.EMAIL_SERVER_PORT)
    },
    form: {
        recipient: process.env.FORM_RECIPIENT,
        subject: process.env.FORM_SUBJECT
    }
}