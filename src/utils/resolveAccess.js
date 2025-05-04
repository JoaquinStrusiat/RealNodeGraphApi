const RelationModel = require('../api/models/RelationModel');
const { Types } = require('mongoose');
const ErrorState = require('./ErrorState');

/*
Relación esperada
{
    type: "has_access",
    owner: "quien crea la relación"
    from: "a quien se le da acceso"
    to: "si es global el _id owner del que da el acceso, id del objeto al que se le da acceso o al typo de dato que se le da acceso"
    props:{
        scope: "object" || "objectType" || "global"
        rules:{
            find: true
            creae: true
            update: true
            delete: true
        }
    }
}

*/

const toFind = async (owner, pipeline) => {
    const ownerList = [owner];
    const itemsList = [];
    const query = {
        $match: {
            $or: [
                { "access.type": { $eq: "public" } },
                { "owner": { $in: ownerList } },
                { "_id": { $in: itemsList } }
            ]
        }
    }

    try {
        const accessRelations = await RelationModel.find({ type: "has_access", from: owner, "props.rules.find": true });

        accessRelations.forEach(item => {
            const scope = item.props?.scope;

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

const toCreate = async (owner, object) => {

    if (object.owner === owner) return true;

    try {
        const filter = {
            type: "has_access",
            from: owner,
            $or: [
                { "props.scope": "global", to: object.owner },
                { "props.scope": "objectType", to: object.type, owner: object.owner }
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
                { "props.scope": "global", to: object.owner },
                { "props.scope": "object", to: object._id },
                { "props.scope": "objectType", to: object.type, owner: object.owner }
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
