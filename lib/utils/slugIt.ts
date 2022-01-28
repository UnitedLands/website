import slugify from 'slugify'

export default function slugIt(str: string) {
	return slugify(str, {
		trim: true,
		strict: true,
		lower: true,
	})
}
