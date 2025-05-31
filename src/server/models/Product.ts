import mongoose, { Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  toJSON(): any;
}

const productSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { 
    type: String, 
    required: [true, 'Le nom du produit est obligatoire'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour la date de modification
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour formater le produit avant envoi au client
productSchema.methods.toJSON = function() {
  const product = this.toObject();
  product.id = product._id;
  delete product._id;
  delete product.__v;
  return product;
};

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product; 