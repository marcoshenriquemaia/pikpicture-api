import { Model } from "mongoose"
import AppError from "../../../errors/AppError"

export default class Repository {
  private _model: Model<any>
  
  constructor({ model }: any) {
    this._model = model

    this.create = this.create.bind(this)
    this.list = this.list.bind(this)
    this.get = this.get.bind(this)
    this.getById = this.getById.bind(this)
    this.delete = this.delete.bind(this)
    this.exists = this.exists.bind(this)
    this.count = this.count.bind(this)
  }

  async create(obj: any) {
    try {
      return await this._model.create(obj)
    } catch (err: any) {
      throw new AppError(err.message)
    }
  }

  async list(criteria?: any, populate?: string) {
    try {
      return await this._model.find(criteria).populate(populate)
    } catch (err: any) {
      throw new AppError(err.message)
    }
  }

  async get(criteria: any, select?: any, populate?: string) {
    try {
      return await this._model
        .findOne(criteria)
        .select(select)
        .populate(populate)
    } catch (err: any) {
      throw new AppError(err.message)
    }
  }

  async update(criteria: any, newObject: any, settings?: any, populate?: string) {
    try {
      return await this._model
        .findOneAndUpdate(criteria, newObject, settings)
        .populate(populate)
    } catch (error: any) {
      throw new AppError(error.message)
    }
  }

  async getById(id: string, populate?: string) {
    try {
      return await this._model.findById(id).populate(populate)
    } catch (error: any) {
      throw new AppError(error.message)
    }
  }

  async delete(id: string) {
    try {
      return await this._model.findByIdAndDelete(id)
    } catch (error: any) {
      throw new AppError(error.message)
    }
  }

  async aggregate(criteriaList: any[]) {
    try {
      return await this._model.aggregate(criteriaList)
    } catch (error: any) {
      throw new AppError(error.message)
    }
  }

  async count(criteria: any) {
    try {
      return await this._model.count(criteria)
    } catch (error: any) {
      throw new AppError(error.message)
    }
  }

  async exists(id: string) {
    try {
      return await this._model.exists({ _id: id })
    } catch (error: any) {
      return false
      // throw new Error(error.message)
    }
  }

  async insertMany(array: any[]) {
    try {
      return await this._model.insertMany(array)
    } catch (error: any) {
      throw new AppError(error.message)
    }
  }

  async pullFromField(id: string, query: any) {
    try {
      return await this._model.findByIdAndUpdate({ _id: id }, { $pull: query })
    } catch (error: any) {
      throw new AppError(error.message)
    }
  }
}
