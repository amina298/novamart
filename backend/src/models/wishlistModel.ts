import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";

interface WishlistAttributes {
  id: number;
  userId: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WishlistCreationAttributes
  extends Optional<
    WishlistAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes
{
  declare id: number;
  declare userId: number;
  declare productId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Wishlist.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Wishlist",
    tableName: "wishlists",
    timestamps: true,
  }
);

export default Wishlist;