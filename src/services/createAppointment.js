import EventModel from "../api/models/EventModel";
import RelationModel from "../api/models/RelationModel";

const createAppointment = async (req, res) => {
    const { path, method, body, owner } = req;
    const response = { path, method };

    try {
        const requiredFields = ["datetime_local", "services", "duration", "service_unit", "email"];
        for (const field of requiredFields) {
            if (!(field in body)) throw new Error(`The attribute '${field}' is required.`);
        }

        if (body.services.length === 0) throw new Error("El carrito no puede estar vacío")

        const appointment = await EventModel.create({
            type: "spa_appointment",
            name: `Turno de ${owner}`,
            access: "public",
            tags: [`${owner}`, body.email],
            props: { service_unit: body.service_unit._id },
            duration: {
                start: new Date(`${body.datetime_local}:00-03:00`).toISOString(),
                end: new Date(new Date(`${body.datetime_local}:00-03:00`).getTime() + body.duration * 60000).toISOString()
            },
            owner: owner
        });

        await RelationModel.create({
            type: "has_appointment",
            owner: owner,
            props: {
                "custom_requests": body.custom_requests || ""
            },
            from: owner,
            to: appointment._id
        });

        const services = body.services.map(id => {
            return {
                type: "assigned_service",
                owner: owner,
                from: appointment._id,
                to: id
            }
        })

        await RelationModel.create(services);

        response.ok = { message: "Turno generado correctamente" };

        return res.status(201).json(response)

    } catch (error) {
        response.error = { message: error.message };
        return res.status(400).json(response);
    }
}

module.exports = createAppointment;


const obj = {
    "email": "joaquinpjs@gmail.com",
    "datetime-local": "2025-05-12T12:00",
    "phone_number": "",
    "custom_requests": "",
    "services": [
        "681a162abf0d1ef4fb57827b",
        "681a1c61bf0d1ef4fb578280"
    ],
    "duration": 120,
    "service_unit": {
        "_id": "6819fccf6b483e8f69f3ca15",
        "name": "Spa Sentirse Bien",
        "description": "Redescubrí tu bienestar en nuestro spa, un refugio pensado para desconectar del mundo y reconectar con vos. Sumergite en una experiencia única de relajación, belleza y armonía, donde cada detalle está diseñado para cuidar tu cuerpo, calmar tu mente y renovar tu energía. Con tratamientos personalizados, aromas envolventes y un ambiente sereno, te invitamos a regalarte ese momento que tanto merecés.",
        "image": "https://media.istockphoto.com/id/944822144/es/foto/orgulloso-propietario-y-compa%C3%B1eros-de-trabajo-de-un-spa-de-belleza.jpg?s=612x612&w=0&k=20&c=3UU5MBnmLGLna7JRVx1jCXsQyxE6cggi65U4yaipQIo=",
        "owner": "681811fde05125f00b993b0e",
        "reference": null,
        "type": "spa",
        "status": "active",
        "access": "public",
        "tags": [
            "Spa",
            "Sentirse",
            "Bien",
            "servicio",
            "spa"
        ],
        "props": {
            "location": "Resistencia, Chaco, Argentina",
            "adress": "French 414",
            "hours_operation": "Lunes a Viernes de 8:00hs a 12:00hs y 17:00 a 21:00hs ",
            "contact": "spasentirsebien@gmail.com"
        },
        "createdAt": "2025-05-06T12:13:03.882Z",
        "updatedAt": "2025-05-06T22:06:26.494Z",
        "__v": 0
    }
}