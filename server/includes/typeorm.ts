import type { BaseModel } from '@server/database/Model'

export * from 'typeorm'

export type ManyToOneRelation<T extends BaseModel<any>> = T | T['$data'] | T['$pk'] | null
export type OneToManyRelation<T extends BaseModel<any>> = T[] & T['$data'][] & T['$pk'][]
export type ManyToManyRelation<T extends BaseModel<any>> = T[] & T['$data'][] & T['$pk'][]
export type OneToOneRelation<T extends BaseModel<any>> = T | T['$data'] | T['$pk'] | null
