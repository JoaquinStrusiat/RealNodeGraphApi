const RelationModel = require('../api/models/RelationModel');
const ObjectModel = require('../api/models/ObjectModel');
const { Types } = require('mongoose');

const toMutate = async (owner, object, method) => {
    if (object.owner === owner) return true;

    try {
        const ruleField = `props.rules.${method}`;
        const filter = {
            type: "has_access",
            [ruleField]: true,
            $or: [
                { "props.scope": "global", to: object.owner },
                { "props.scope": "object", to: object._id },
                { "props.scope": "objectType", to: object.type, owner: object.owner }
            ]
        };

        // 🔹 Accesos directos del usuario
        const directAccess = await RelationModel.find({ ...filter, from: owner });
        if (directAccess.length > 0) return true;

        // 🔹 Accesos a través de roles
        const hasRoleRelations = await RelationModel.find({ type: "has_role", from: owner });
        for (const rel of hasRoleRelations) {
            const roleId = new Types.ObjectId(rel.to);
            const role = await ObjectModel.findById(roleId);
            if (!role) continue; // 👈 Salteá si el rol fue borrado
            const roleAccess = await RelationModel.find({ ...filter, from: roleId });
            if (roleAccess.length > 0) return true;
        }

        return false;
    } catch (error) {
        throw error;
    }
}


const hasAccess = async (req, res) => {
    const { body: { object, method: action }, owner } = req;

    try {
        if (!object && typeof object !== 'object') return res.status(400).send({ error: { message: "No se ha proporcionado un objeto" } });
        if (!action) return res.status(400).send({ error: { message: "No se ha proporcionado un method" } });

        const access = await toMutate(owner, object, action);

        return res.status(200).send({ access: access });

    } catch (error) {
        return res.status(500).send({ error: { message: error.message } });
    }
}

module.exports = hasAccess;