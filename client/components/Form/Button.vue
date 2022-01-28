<script lang="ts">
import * as vue from 'vue'

export default vue.defineComponent({
	name: 'FormButton'
})
</script>

<script lang="ts" setup>
type FormButtonProps = {
	type?: 'button' | 'submit' | 'reset'
	label?: string
	disabled?: boolean
}

type FormButtonEmits = {
	(event: 'click'): void
}

const emit = defineEmits<FormButtonEmits>()
const props = withDefaults(defineProps<FormButtonProps>(), {
	type: 'button'
})

const container = vue.ref<HTMLButtonElement>()

const ripple = vue.reactive({
	active: false,
	clicked: false,
	animationInterval: 0,
	size: {
		width: 0,
		height: 0
	},
	position: {
		left: 0,
		top: 0
	},
	mouse: {
		x: 0,
		y: 0
	}
})

const classes = vue.computed(() => ({
	clicked: ripple.clicked,
	disabled: props.disabled
}))

const styles = vue.computed(() => ({
	'--mouse-x': `${ripple.mouse.x - ripple.size.width / 2}px`,
	'--mouse-y': `${ripple.mouse.y - ripple.size.height / 2}px`,
	'--size-width': `${ripple.size.width}px`,
	'--size-height': `${ripple.size.height}px`
}))

function onMouseMove(event: MouseEvent) {
	if (props.disabled || ripple.clicked) return
	window.requestAnimationFrame(() => {
		ripple.active = true
		const { offsetX: x, offsetY: y } = event
		ripple.mouse = { x, y }
	})
}

function onMouseLeave() {
	window.requestAnimationFrame(() => {
		ripple.active = false
	})
}

function onClick() {
	if (ripple.clicked && ripple.animationInterval) return
	ripple.clicked = true

	let sizeIncrement = 50
	if (container.value)
		if (container.value.offsetWidth > container.value.offsetHeight)
			sizeIncrement = container.value.offsetWidth / 10
		else sizeIncrement = container.value.offsetHeight / 10

	ripple.animationInterval = setInterval(() => {
		ripple.size.width += sizeIncrement
		ripple.size.height += sizeIncrement
	}, 10) as any

	setTimeout(() => {
		clearInterval(ripple.animationInterval)

		ripple.clicked = false
		ripple.animationInterval = 0
		ripple.size = { width: 0, height: 0 }
	}, 300)

	return emit('click')
}
</script>

<template>
	<button
		ref="container"
		class="form-button"
		:class="classes"
		:disabled="disabled"
		:type="props.type"
		:style="styles"
		@mousemove.self.passive="onMouseMove"
		@mouseleave.self.passive="onMouseLeave"
		@click="onClick"
	>
		<div class="button-inner">
			<slot>{{ label }}</slot>
		</div>
	</button>
</template>

<style lang="scss">
.form-button {
	padding: 0.75em 2em;
	border: 0em solid var(--button-background, green);

	position: relative;

	background-color: var(--button-background, green);
	color: var(--button-text, white);
	font-weight: 500;

	border-radius: var(--border-radius, 10px);
	transform: scale(1);
	transition: transform 0.1s;
	cursor: pointer;

	overflow: hidden;
	box-shadow: 0px 2px 3px rgba(#000, 0.23);
	font-size: 0.7em;

	* {
		pointer-events: none;
	}

	&:before {
		content: ' ';

		width: var(--size-width, 0px);
		height: var(--size-height, 0px);

		position: absolute;
		left: var(--mouse-x);
		top: var(--mouse-y);
		z-index: -1;

		background-color: var(--button-ripple, green);
		opacity: 1;
		border-radius: 100%;
		box-shadow: 0px 0px 0px 0px var(--button-ripple, green);

		pointer-events: none;
		transition: opacity 0s, box-shadow 0.25s;
	}

	.button-inner {
		font-size: 1.15em;

		i:first-child {
			margin-right: 0.5em;
		}

		i:last-child {
			margin-left: 0.5em;
		}

		i:only-child {
			margin: 0px;
		}
	}

	&:hover:not(.clicked):not(:disabled) {
		&:before {
			box-shadow: 0px 0px 60px 30px var(--button-ripple, green);
		}
	}

	&:active:not(:disabled):not(.no-shrink) {
		transform: scale(0.85);
	}

	&.clicked {
		&:before {
			opacity: 0;
			transition: opacity 0.75s;
		}
	}
}

.form-button.ghost {
	background-color: transparent;
	box-shadow: none;
	border: 1px solid white;
}

.form-button.compact {
	padding: 0.75em 1em;
}

.form-button.flat {
	box-shadow: none;
}

.form-button.outline {
	// padding: 0.85em 1.35em;
	border: 0.15em solid var(--button-background, green);

	background-color: transparent;
	color: var(--button-background, green);

	&:before {
		background-color: var(--color-primary-lighten, green);
		box-shadow: 0px 0px 0px 0px rgba(green, 0.23);
	}

	&:hover:not(.clicked):not(:disabled) {
		&:before {
			box-shadow: 0px 0px 60px 30px rgba(white, 1);
		}
	}
}

.form-button.float {
	background-color: var(--button-text, white);
	border-color: var(--button-text, white);
	color: var(--button-background, green);

	&:before {
		background-color: var(--button-background, green);
	}
}

.form-button.no-effect {
	&:before {
		display: none;
	}
}

.form-button.no-border {
	border: none;
}

.form-button.icon {
	width: var(--button-icon-size, 40px);
	height: var(--button-icon-size, 40px);
	padding: 0px;
	border-radius: 100%;

	.button-inner {
		@include flex(row, center, center);
		width: 100%;
		height: 100%;

		i {
			// results in 16px at 40x40
			font-size: calc(calc(var(--button-icon-size, 40px) / 2) - 4px);
		}
	}

	&:hover:not(.clicked):not(:disabled) {
		&:before {
			box-shadow: 0px 0px 30px 10px var(--button-ripple, green);
		}
	}

	&.boxish {
		border-radius: var(--border-radius, 10px);
	}
}

.form-button.disabled {
	opacity: 0.43;
	cursor: not-allowed;
}

.form-button.accent-color {
	background-color: var(--color-accent, lightgreen);
	color: var(--color-primary, green);

	&:before {
		background-color: var(--color-accent-darken, darkgreen);
		box-shadow: 0px 0px 0px 0px var(--color-accent-darken, darkgreen);
	}

	&:hover:not(.clicked):not(:disabled) {
		&:before {
			box-shadow: 0px 0px 30px 10px var(--color-accent-darken, darkgreen);
		}
	}
}

.form-button.secondary {
	background-color: var(--color-secondary, darkgreen);
	color: var(--color-secondary-text, darkgreen);

	&:before {
		background-color: var(--color-secondary-darken, darkgreen);
		box-shadow: 0px 0px 0px 0px var(--color-secondary-darken, darkgreen);
	}

	&:hover:not(.clicked):not(:disabled) {
		&:before {
			box-shadow: 0px 0px 30px 10px var(--color-secondary-darken, darkgreen);
		}
	}
}

.form-button.link-like {
	background-color: transparent;
	box-shadow: none;

	text-decoration: underline;

	&.accent-color {
		color: var(--color-accent, lightgreen);
	}
}
</style>
