import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { storage_type, storage_typeId } from './storage_type';
import type { category, categoryId } from './category';

export interface itemAttributes {
  item_id: number;
  name?: string;
  category_id?: number;
  stor_id: number;
  size?: number;
}

export type itemPk = "item_id";
export type itemId = item[itemPk];
export type itemOptionalAttributes = "item_id" | "name" | "category_id" | "size";
export type itemCreationAttributes = Optional<itemAttributes, itemOptionalAttributes>;

export class item extends Model<itemAttributes, itemCreationAttributes> implements itemAttributes {
  item_id!: number;
  name?: string;
  category_id?: number;
  stor_id!: number;
  size?: number;

  // item belongsTo storage_type via stor_id
  stor!: storage_type;
  getStor!: Sequelize.BelongsToGetAssociationMixin<storage_type>;
  setStor!: Sequelize.BelongsToSetAssociationMixin<storage_type, storage_typeId>;
  createStor!: Sequelize.BelongsToCreateAssociationMixin<storage_type>;
  
  // item belongsTo category via category_id
  category!: category;
  getCategory!: Sequelize.BelongsToGetAssociationMixin<category>;
  setCategory!: Sequelize.BelongsToSetAssociationMixin<category, categoryId>;
  createCategory!: Sequelize.BelongsToCreateAssociationMixin<category>;


  static initModel(sequelize: Sequelize.Sequelize): typeof item {
    return item.init({
    item_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: "item_name_key"
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    stor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'storage_type',
        key: 'stor_id'
      }
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'item',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "item_name_key",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "item_pkey",
        unique: true,
        fields: [
          { name: "item_id" },
        ]
      },
    ]
  });
  }
}
