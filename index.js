const express = require('express');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const handlebars = require('express-handlebars');
const path = require('path');

const { server, account, port, url, form } = require('./config');

let mailer;

function reportError(error) {
    console.error('Invalid email settings. Make sure to set the correct email account and server. Error:' + JSON.stringify(error));
}

function createMailer({ host, port }, { user, pass }) {
    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: false,
        auth: {
            user: user,
            pass: pass
        },
    });
}

function setupMailer() {

    const viewEngine = handlebars.create({
        partialsDir: 'partials/',
        defaultLayout: false
    });
    const hbsOptions = {
        viewEngine: viewEngine,
        viewPath: path.resolve(__dirname, './views'),
        extName: '.hbs'
    }

    mailer = createMailer(server, account);
    mailer.use('compile', hbs(hbsOptions));
    mailer.verify()
        .then(run)
        .catch(err => {
            reportError(err);
            process.exitCode(1);
        });
}

function run() {
    const app = express();
    app.use(bodyparser.urlencoded({ extended: true }));
    app.post('/forms', (req, res) => {

        res.sendStatus(200);
        mailer.sendMail({
            from: account.user,
            to: form.recipient,
            subject: form.subject,
            template: 'contact',
            context: {
                site: url,
                form: req.body
            }
        }, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('sent mail');
            }
        });
    });
    app.listen(port, () => console.log(`Server listening in port ${port}...`));

}

setupMailer();