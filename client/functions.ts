export function formatBalance(balance: number) {
	const formatted = new Intl.NumberFormat('en-US', {
		style: 'decimal'
	}).format(Math.round(balance))
	return `${formatted}G`
}

export function sortByBalance(direction: 'ASC' | 'DESC' = 'DESC') {
	return (a: { balance?: number }, b: { balance?: number }) => {
		const abal = a.balance ?? 0
		const bbal = b.balance ?? 0

		if (direction === 'DESC') return bbal - abal
		else return abal - bbal
	}
}
