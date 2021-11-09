import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface RouteAttrs {
    id: string;
    capacity: number;
}

export interface RouteDoc extends mongoose.Document {
    version: number;
    capacity: number;

    isReserved(): Promise<boolean>;
}

interface RouteModel extends mongoose.Model<RouteDoc> {
    build(attrs: RouteAttrs): RouteDoc;
    findByEvent(event: { id: string; version: number }): Promise<RouteDoc | null>;
}

const routeSchema = new mongoose.Schema(
    { capacity: { type: String, required: true } },

    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

routeSchema.set('versionKey', 'version');
routeSchema.plugin(updateIfCurrentPlugin);

routeSchema.statics.findByEvent = (event: { id: string; version: number; state: string; userId: string }) => {
    return Route.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};
routeSchema.statics.build = (attrs: RouteAttrs) => {
    return new Route({
        _id: attrs.id,
        capacity: attrs.capacity,
    });
};
routeSchema.methods.isReserved = async function () {
    // this === the ticket document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        route: this as any,
        status: {
            $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
        },
    });

    return !!existingOrder;
};

const Route = mongoose.model<RouteDoc, RouteModel>('Route', routeSchema);

export { Route };
