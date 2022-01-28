import { ChildEntity, OneToOne } from 'typeorm'
import File, { FileData } from '@server/database/models/File'
import User, { UserData } from '@server/database/models/User'
import { OneToOneRelation } from '@server/includes/typeorm'

export interface UserAvatarData extends FileData {
	user?: UserData
}

@ChildEntity()
export default class UserAvatar extends File {
	@OneToOne(() => User, m => m.avatar, { onDelete: 'CASCADE' })
	declare user?: OneToOneRelation<User>
}
