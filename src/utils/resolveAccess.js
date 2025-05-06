const RelationModel = require('../api/models/RelationModel');
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
        pipeline.unshift(query);
        return pipeline;
    } catch (error) {
        throw new ErrorState(500, "Internal Server Error", error.message);
    }
}

/* const toFind1 = async (owner, pipeline) => {
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
    };

    try {
        const accessRelations = await RelationModel.find({
            type: "has_access",
            from: owner,
            "props.rules.find": true
        });

        console.log("Reglas de acceso encontradas:", accessRelations);

        accessRelations.forEach(item => {
            console.log("Iterando item:", item);
            console.log("scope:", item.props.scope);

            const scope = item.props instanceof Map ? item.props.get('scope') : item.props?.scope;

            if (scope === "global") {
                if (!ownerList.includes(item.to)) {
                    ownerList.push(item.to);
                }
            } else if (scope === "object") {
                console.log("scope object", item.to);

                if (!itemsList.includes(item.to)) {
                    itemsList.push(item.to);
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

        pipeline.unshift(query);
        return pipeline;
    } catch (error) {
        throw new ErrorState(500, "Internal Server Error", error.message);
    }
}; */


const toCreate = async (owner, object) => {
    if (object.owner === owner) return true;
    try {
        const filter = {
            type: "has_access",
            from: owner,
            "props.rules.create": true,
            $or: [
                { "props.scope": "global", from: owner, to: object.owner },
                { "props.scope": "objectType", from: owner, to: object.type, owner: object.owner }
            ]
        };

        const accessRelations = await RelationModel.find(filter);
        return accessRelations.length > 0;
    } catch (error) {
        throw new ErrorState(500, "Internal Server Error", error.message);
    }
}

const toMutate = async (owner, object, method) => {
    if (object.owner === owner) return true;
    try {
        const filter = {
            type: "has_access",
            from: owner,
            $or: [
                { "props.scope": "global", from: owner, to: object.owner },
                { "props.scope": "object", from: owner, to: object._id },
                { "props.scope": "objectType", from: owner, to: object.type, owner: object.owner }
            ]
        };

        filter[`props.rules.${method}`] = true;
        const accessRelations = await RelationModel.find(filter);
        return accessRelations.length > 0;
    } catch (error) {
        throw new ErrorState(500, "Internal Server Error", error.message);
    }
}

module.exports = { toFind, toCreate, toMutate };
