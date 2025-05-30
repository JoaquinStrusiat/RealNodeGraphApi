const RelationModel = require('../api/models/RelationModel');
const ObjectModel = require('../api/models/ObjectModel');
const { Types } = require('mongoose');
const ErrorState = require('./ErrorState');

const toFind = async (owner, pipeline) => {
    if (!owner) {
        pipeline.unshift({ $match: { "access": { $eq: "public" } } });
        return pipeline;
    }

    const ownerList = [owner];
    const itemsList = [];
    const query = {
        $match: {
            $or: [
                { "access": { $eq: "public" } },
                { "owner": { $in: ownerList } },
                { "_id": { $in: itemsList } }
            ]
        }
    }

    try {
        const accessRelations = await RelationModel.find({ type: "has_access", from: owner, "props.rules.find": true });

        accessRelations.forEach(item => {
            const scope = item.props instanceof Map ? item.props.get('scope') : item.props?.scope;
            if (scope === "global") {
                if (!ownerList.includes(item.to)) {
                    ownerList.push(item.to);
                }
            } else if (scope === "object") {
                const objectId = new Types.ObjectId(item.to);
                if (!itemsList.some(id => id.equals(objectId))) {
                    itemsList.push(objectId);
                }
            } else if (scope === "objectType") {
                query.$match.$or.push({
                    $and: [
                        { owner: item.owner },
                        { type: item.to }
                    ]
                });
            }
        });

        const hasRoleRelations = await RelationModel.find({ type: "has_role", from: owner });

        for (const item of hasRoleRelations) {
            const roleId = new Types.ObjectId(item.to);
            const role = await ObjectModel.findById(roleId);
            if (role) {
                const accessRelations = await RelationModel.find({ type: "has_access", from: role._id, "props.rules.find": true });
                accessRelations.forEach(item => {
                    const scope = item.props instanceof Map ? item.props.get('scope') : item.props?.scope;
                    if (scope === "global") {
                        if (!ownerList.includes(item.to)) {
                            ownerList.push(item.to);
                        }
                    } else if (scope === "object") {
                        const objectId = new Types.ObjectId(item.to);
                        if (!itemsList.some(id => id.equals(objectId))) {
                            itemsList.push(objectId);
                        }
                    } else if (scope === "objectType") {
                        query.$match.$or.push({
                            $and: [
                                { owner: item.owner },
                                { type: item.to }
                            ]
                        });
                    }
                });

            }
        }

        pipeline.unshift(query);
        return pipeline;
    } catch (error) {
        throw new ErrorState(500, "Internal Server Error", error.message);
    }
}


const toCreate = async (owner, object) => {
    if (object.owner === owner) return true;

    try {
        const filter = {
            type: "has_access",
            "props.rules.create": true,
            $or: [
                { "props.scope": "global", to: object.owner },
                { "props.scope": "objectType", to: object.type, owner: object.owner }
            ]
        };

        // 🔹 Accesos directos del usuario
        const directAccess = await RelationModel.find({ ...filter, from: owner });

        if (directAccess.length > 0) return true;

        // 🔹 Buscar roles del usuario
        const hasRoleRelations = await RelationModel.find({ type: "has_role", from: owner });
        for (const rel of hasRoleRelations) {
            const roleId = new Types.ObjectId(rel.to);
            const role = await ObjectModel.findById(roleId);
            if (!role) continue; // 👈 Salteá si el rol fue borrado
            const roleAccess = await RelationModel.find({ ...filter, from: roleId });
            if (roleAccess.length > 0) return true;
        }

        // ❌ No tiene permisos directos ni por rol
        return false;

    } catch (error) {
        throw new ErrorState(500, "Internal Server Error", error.message);
    }
};

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
        throw new ErrorState(500, "Internal Server Error", error.message);
    }
}

module.exports = { toFind, toCreate, toMutate };
