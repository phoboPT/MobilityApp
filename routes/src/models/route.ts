import mongoose from "mongoose";

interface RouteAttrs {
    userId: string
    type: string
    startLocation: string
    endLocation: string
    availableTime: string
    vehicleId: string
    state: string
    description: string
    estimatedTime: string
    startDate: string
    userImage: string
    rating: number
}

interface RouteDoc extends mongoose.Document {
    userId: string
    type: string
    startLocation: string
    endLocation: string
    availableTime: string
    vehicleId: string
    state: string
    description: string
    estimatedTime: string
    startDate: string
    userImage: string
    rating: number
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
    },
    startLocation: {
        type: String,
        required: true
    },
    endLocation: {
        type: String,
        required: true
    },
    availableTime: {
        type: String,
        required: true
    },
    vehicleId: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    estimatedTime: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    userImage: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})

routeSchema.statics.build = (attrs: RouteAttrs) => {
    return new Route(attrs)
}

const Route = mongoose.model<RouteDoc, RouteModel>('Route', routeSchema)


export { Route }