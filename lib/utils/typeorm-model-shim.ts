// this "shim" can be used on the frontend to prevent from errors on undefined
// decorators in the models, when you are sharing same models across backend and frontend.
// to use this shim simply configure your systemjs/webpack configuration to use this file instead of typeorm module.

// for system.js this resolved this way:
// System.config({
//     ...
//     packages: {
//         "typeorm": {
//             main: "typeorm-model-shim.js",
//             defaultExtension: "js"
//         }
//     }
// }

// for webpack this is resolved this way:
// resolve: { // see: https://webpack.js.org/configuration/resolve/
//     alias: {
//         typeorm: path.resolve(__dirname, "../node_modules/typeorm/typeorm-model-shim")
//     }
// }

export class BaseEntity {}

export function Column() {
	return function () {}
}

export function CreateDateColumn() {
	return function () {}
}

export function DeleteDateColumn() {
	return function () {}
}

export function PrimaryGeneratedColumn() {
	return function () {}
}

export function PrimaryColumn() {
	return function () {}
}

export function UpdateDateColumn() {
	return function () {}
}

export function VersionColumn() {
	return function () {}
}

export function ViewColumn() {
	return function () {}
}

export function ObjectIdColumn() {
	return function () {}
}

export function AfterInsert() {
	return function () {}
}

export function AfterLoad() {
	return function () {}
}

export function AfterRemove() {
	return function () {}
}

export function AfterUpdate() {
	return function () {}
}

export function BeforeInsert() {
	return function () {}
}

export function BeforeRemove() {
	return function () {}
}

export function BeforeUpdate() {
	return function () {}
}

export function EventSubscriber() {
	return function () {}
}

export function ColumnOptions() {
	return function () {}
}

export function IndexOptions() {
	return function () {}
}

export function JoinColumnOptions() {
	return function () {}
}

export function JoinTableOptions() {
	return function () {}
}

export function RelationOptions() {
	return function () {}
}

export function EntityOptions() {
	return function () {}
}

export function ValueTransformer() {
	return function () {}
}

export function JoinColumn() {
	return function () {}
}

export function JoinTable() {
	return function () {}
}

export function ManyToMany() {
	return function () {}
}

export function ManyToOne() {
	return function () {}
}

export function OneToMany() {
	return function () {}
}

export function OneToOne() {
	return function () {}
}

export function RelationCount() {
	return function () {}
}

export function RelationId() {
	return function () {}
}

export function Entity() {
	return function () {}
}

export function ChildEntity() {
	return function () {}
}

export function TableInheritance() {
	return function () {}
}

export function ViewEntity() {
	return function () {}
}

export function Transaction() {
	return function () {}
}

export function TransactionManager() {
	return function () {}
}

export function TransactionRepository() {
	return function () {}
}

export function TreeLevelColumn() {
	return function () {}
}

export function TreeParent() {
	return function () {}
}

export function TreeChildren() {
	return function () {}
}

export function Tree() {
	return function () {}
}

export function Index() {
	return function () {}
}

export function Unique() {
	return function () {}
}

export function Check() {
	return function () {}
}

export function Exclusion() {
	return function () {}
}

export function Generated() {
	return function () {}
}

export function EntityRepository() {
	return function () {}
}
