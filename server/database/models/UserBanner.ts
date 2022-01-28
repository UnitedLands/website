import File, { FileData } from '@server/database/models/File'
import User, { UserData } from '@server/database/models/User'
import { OneToOneRelation } from '@server/includes/typeorm'
import { ChildEntity, OneToOne } from 'typeorm'

export interface UserBannerData extends FileData {
	user?: UserData
}

@ChildEntity()
export default class UserBanner extends File {
	@OneToOne(() => User, m => m.banner, {})
	declare user?: OneToOneRelation<User>
}
