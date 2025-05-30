const EventModel = require("../api/models/EventModel");
const RelationModel = require("../api/models/RelationModel");

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
            name: `Turno de ${body.email}`,
            access: "public",
            tags: [`${owner}`, body.email, owner],
            props: { service_unit: body.service_unit._id },
            duration: {
                start: new Date(`${body.datetime_local}:00-03:00`).toISOString(),
                end: new Date(new Date(`${body.datetime_local}:00-03:00`).getTime() + body.duration * 60000).toISOString()
            },
            owner: body.service_unit._id
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

        if (body.professional) {
            await RelationModel.create({
                type: "assigned_to",
                owner: professional,
                from: professional,
                to: appointment._id
            });
        }

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