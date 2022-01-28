import TownyResident from '@server/database/models/Towny/Resident'
import TownyTown from '@server/database/models/Towny/Town'
import Xconomy, { XconomyNon } from '@server/database/models/Xconomy'
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm'

@EventSubscriber()
export class TownyResidentBalanceLoader implements EntitySubscriberInterface<TownyResident> {
	listenTo() {
		return TownyResident
	}

	async afterLoad(resident: TownyResident) {
		try {
			const xcon = await Xconomy.findOne({
				where: {
					resident: TownyResident.getId(resident)
				},
				relations: ['player']
			})

			if (xcon) resident.balance = xcon.balance
		} catch {
			console.log('failed loading balance for resident', resident.name)
		}
	}
}

// @EventSubscriber()
// export class TownyTownBalanceLoader implements EntitySubscriberInterface<TownyTown> {
// 	listenTo() {
// 		return TownyTown
// 	}

// 	async afterLoad(town: TownyTown) {
// 		try {
// 			const xcon = await XconomyNon.findOne({
// 				where: {
// 					account: `town-${town.name}`
// 				}
// 			})

// 			if (xcon) town.balance = xcon.balance
// 		} catch {
// 			console.log('failed loading balance for town', town.name)
// 		}
// 	}
// }
