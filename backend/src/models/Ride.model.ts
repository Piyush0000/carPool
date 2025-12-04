import mongoose, { Document, Schema } from 'mongoose';

export interface IRide extends Document {
  driver: mongoose.Types.ObjectId;
  pickup: {
    address: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  destination: {
    address: string;
    coordinates?: [number, number]; // [longitude, latitude]
  };
  date: Date;
  time: string; // HH:MM format
  seatsAvailable: number;
  pricePerSeat: number;
  carModel?: string;
  rules?: string;
  status: 'Open' | 'Closed' | 'Completed';
  riders: {
    user: mongoose.Types.ObjectId;
    status: 'Requested' | 'Accepted' | 'Rejected' | 'Paid' | 'Pending Payment' | 'Payment Verification Pending';
    requestedAt: Date;
    acceptedAt?: Date;
    paymentVerificationRequested?: boolean;
    paymentProof?: string; // URL to payment proof image
  }[];
  chatRoomId: string;
  qrCodeUrl?: string; // URL to UPI QR code image
  createdAt: Date;
  updatedAt: Date;
}

const RideSchema: Schema = new Schema({
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickup: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  pricePerSeat: {
    type: Number,
    required: true,
    min: 0
  },
  carModel: {
    type: String,
    trim: true
  },
  rules: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Completed'],
    default: 'Open'
  },
  riders: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'Rejected', 'Paid', 'Pending Payment', 'Payment Verification Pending'],
      default: 'Requested'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    acceptedAt: {
      type: Date
    },
    paymentVerificationRequested: {
      type: Boolean,
      default: false
    },
    paymentProof: {
      type: String
    }
  }],
  chatRoomId: {
    type: String,
    required: true,
    unique: true
  },
  qrCodeUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
RideSchema.index({ 'pickup.coordinates': '2dsphere' });
RideSchema.index({ 'destination.coordinates': '2dsphere' });

const Ride = mongoose.model<IRide>('Ride', RideSchema);
export default Ride;