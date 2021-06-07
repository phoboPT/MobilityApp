import mongoose from "mongoose";

interface RouteAttrs {
    userId: string
    type: string
    location: string
    availableTime: string
    vehiculeId: string
    state: string
}

interface RouteDoc extends mongoose.Document {
    userId: string
    type: string
    location: string
    availableTime: string
    vehiculeId: string
    state: string
}


interface RouteModel extends mongoose.Model<RouteDoc> {
    build(attrs: RouteAttrs): RouteDoc
}

const routeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }, location: {
        type: String,
        required: true
    }, availableTime: {
        type: String,
        required: true
    }, vehicleId: {
        type: String,
        required: true
    }, state: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

routeSchema.statics.build = (attrs: RouteAttrs) => {
    return new Route(attrs)
}

const Route = mongoose.model<RouteDoc, RouteModel>('Route', routeSchema)


export { Route }