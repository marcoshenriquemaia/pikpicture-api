"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../../errors/AppError"));
class Repository {
    constructor({ model }) {
        this._model = model;
        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
        this.getById = this.getById.bind(this);
        this.delete = this.delete.bind(this);
        this.exists = this.exists.bind(this);
        this.count = this.count.bind(this);
    }
    async create(obj) {
        try {
            return await this._model.create(obj);
        }
        catch (err) {
            throw new AppError_1.default(err.message);
        }
    }
    async list(criteria, populate) {
        try {
            return await this._model.find(criteria).populate(populate);
        }
        catch (err) {
            throw new AppError_1.default(err.message);
        }
    }
    async get(criteria, select, populate) {
        try {
            return await this._model
                .findOne(criteria)
                .select(select)
                .populate(populate);
        }
        catch (err) {
            throw new AppError_1.default(err.message);
        }
    }
    async update(criteria, newObject, settings, populate) {
        try {
            return await this._model
                .findOneAndUpdate(criteria, newObject, settings)
                .populate(populate);
        }
        catch (error) {
            throw new AppError_1.default(error.message);
        }
    }
    async getById(id, populate) {
        try {
            return await this._model.findById(id).populate(populate);
        }
        catch (error) {
            throw new AppError_1.default(error.message);
        }
    }
    async delete(id) {
        try {
            return await this._model.findByIdAndDelete(id);
        }
        catch (error) {
            throw new AppError_1.default(error.message);
        }
    }
    async aggregate(criteriaList) {
        try {
            return await this._model.aggregate(criteriaList);
        }
        catch (error) {
            throw new AppError_1.default(error.message);
        }
    }
    async count(criteria) {
        try {
            return await this._model.count(criteria);
        }
        catch (error) {
            throw new AppError_1.default(error.message);
        }
    }
    async exists(id) {
        try {
            return await this._model.exists({ _id: id });
        }
        catch (error) {
            return false;
            // throw new Error(error.message)
        }
    }
    async insertMany(array) {
        try {
            return await this._model.insertMany(array);
        }
        catch (error) {
            throw new AppError_1.default(error.message);
        }
    }
    async pullFromField(id, query) {
        try {
            return await this._model.findByIdAndUpdate({ _id: id }, { $pull: query });
        }
        catch (error) {
            throw new AppError_1.default(error.message);
        }
    }
}
exports.default = Repository;
