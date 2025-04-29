const transporter = require('../utils/emailTransporter.js');
const localEmail = process.env.EMAIL;

const sendEmail = async (req, res) => {
    const { message, email, title } = req.body;

    if (!message || !email || !title) {
        return res.status(400).send({ error: { message: 'The values "message", "email" and "title" are required' } });
    }

    if(typeof email !== 'string' || typeof message !== 'string' || typeof title !== 'string'){
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
            text: message,
        });

        return res.status(200).send({ ok: {message: "Email sended successfully", messageId: info.messageId, info: info}});

    } catch (error) {
        return res.status(500).send({ error: { message: "Error al enviar el correo" } });
    }
}

module.exports = sendEmail;