const transporter = require('../utils/emailTransporter.js');
const localEmail = process.env.EMAIL;

const sendEmail = async (req, res) => {
    const { html, email, title } = req.body;

    if (!html || !email || !title) {
        return res.status(400).send({ error: { message: 'The values "html", "email" and "title" are required' } });
    }

    if(typeof email !== 'string' || typeof html !== 'string' || typeof title !== 'string'){
        return res.status(400).send({ error: { message: "The values must be a string" } });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send({ error: { message: "The email is not valid" } });
    }

    try {
        const info = await transporter.sendMail({
            from: `"Mi App" <${localEmail}>`,
            to: email,
            subject: title,
            html: html,
        });

        return res.status(200).send({ ok: {message: "Email sended successfully", messageId: info.messageId}});

    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: { message: "Error al enviar el correo" } });
    }
}

module.exports = sendEmail;