import mongoose from 'mongoose';

interface VehicleAttrs {
    userId: string;
    type: string;
    carModel: string;
    capacity: number;
}

interface VehicleDoc extends mongoose.Document {
    userId: string;
    type: string;
    carModel: string;
    capacity: number;
}

interface VehicleModel extends mongoose.Model<VehicleDoc> {
    build(attrs: VehicleAttrs): VehicleDoc;
}

const vehicleSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        carModel: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);

vehicleSchema.statics.build = (attrs: VehicleAttrs) => {
    return new Vehicle(attrs);
};

const Vehicle = mongoose.model<VehicleDoc, VehicleModel>('Vehicle', vehicleSchema);

export { Vehicle };
