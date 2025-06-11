const ObjectModel = require("../api/models/ObjectModel");
const EventModel = require("../api/models/EventModel");
const RelationModel = require("../api/models/RelationModel");
const UserModel = require("../api/models/UserModel");
const transporter = require('../utils/emailTransporter');
const getLiquidTemplate = require("../utils/getLiquidTemplate");
const mongoose = require('mongoose');
const localEmail = process.env.EMAIL;

/* new object
{
    "datetime": "2025-06-11T11:00:00.000Z",
    "professional": "6817ded1a881b7d0a35e25ad",
    "service_unit": "6819fccf6b483e8f69f3ca15",
    "isPaid": true,
    "discount": [
        {
            "type": "percentage",
            "value": 10,
            "reason": "Descuento por reservar 48h antes: "
        }
    ],
    "services": [
        "681a162abf0d1ef4fb57827b",
        "681a1d17bf0d1ef4fb57828c"
    ],
    "cardData": {
        "number": "1234567890876878",
        "name": "joa",
        "expiry": "12/26",
        "cvc": "200"
    }
} 
*/

const createAppointmentNew = async (req, res) => {
    const { path, method, body, owner } = req;
    const response = { path, method };

    try {
        const requiredFields = ["datetime", "services", "service_unit", "isPaid", "professional", "discount"];
        for (const field of requiredFields) {
            if (!(field in body)) throw new Error(`The attribute '${field}' is required.`);
        }
        if (body.services.length === 0) throw new Error("El carrito no puede estar vacío");

        const servicesRes = await ObjectModel.find({ _id: { $in: body.services } }, ["name", "image", "props", "type"]).populate({ path: "type" }).lean();;
        const services = servicesRes.map(service => {
            const { type, ...allProps } = service;
            return { ...allProps, type: type.name };
        });
        console.log(services);

        const professional = await UserModel.findById(body.professional, ["name", "last_name", "email"]);
        const user = await UserModel.findById(owner, ["name", "last_name", "email"]);
        const duration = services.reduce((acc, service) => acc + service.props.duration, 0);

        // Create the appointment
        const appointment = await EventModel.create({
            type: "spa_appointment",
            name: `Turno de ${user.email}`,
            access: "public",
            tags: [user.email, owner],
            props: {
                services: services,
                professional: professional,
                is_paid: body.isPaid ?? false,
                discount: body.discount ?? []
            },
            duration: {
                start: new Date(body.datetime),
                end: new Date(new Date(body.datetime).getTime() + (duration * 60000))
            },
            owner: body.service_unit
        });

        // Create the relation whit the user
        await RelationModel.create({
            type: "has_appointment",
            owner: owner,
            props: {
                "custom_requests": body.custom_requests || ""
            },
            from: owner,
            to: appointment._id.toString()
        });
        console.log("user relation");


        //Create the relation whit the professional
        await RelationModel.create({
            type: "assigned_to",
            owner: professional._id,
            from: professional._id,
            to: appointment._id
        });

        console.log("prof relation");
        const servicesRelation = body.services.map(id => {
            return {
                type: "assigned_service",
                owner: owner,
                from: appointment._id,
                to: id
            }
        })
        console.log("pre services relation");


        //Creat the relations white the services
        await RelationModel.create(servicesRelation);
        console.log("services relation");


        //Create the html email
        const HTML = await getLiquidTemplate("src/template/index2.liquid", {
            user: `${user.name} ${user.last_name}`,
            date: formatArgentineDate(body.datetime),
            time: formatArgentineTime(body.datetime),
            professional: `${professional.name} ${professional.last_name}`,
            services: services.reduce((acc, service) => {
                acc.push({
                    name: service.name,
                    duration: service.props.duration,
                    price: service.props.price
                })
                return acc;
            }, []),
            discount: body.discount ?? []
        })

        // Send email
        //from: `Spa Sentirse Bien <${localEmail}>`,
        await transporter.sendMail({
            from: `Spa Sentirse Bien`,
            to: user.email,
            subject: "Reservación de turno",
            html: HTML,
        });

        response.ok = {
            appointment,
            message: "Gracias por tu reservación. La información de tu turno se ha enviado por correo electrónico."
        };

        return res.status(201).json(response)
    } catch (error) {
        response.error = { message: error.message };
        return res.status(400).json(response);
    }
}

// Funciones para formatear la fecha y hora
function formatArgentineDate(isoString) {
    const date = new Date(isoString);
    // Opciones para el formato de fecha
    const options = {
        timeZone: 'America/Argentina/Buenos_Aires',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('es-AR', options);
}

function formatArgentineTime(isoString) {
    const date = new Date(isoString);
    // Opciones para el formato de hora
    const options = {
        timeZone: 'America/Argentina/Buenos_Aires',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return date.toLocaleTimeString('es-AR', options) + ' hs';
}

module.exports = createAppointmentNew;