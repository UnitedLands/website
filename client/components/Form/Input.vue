<script lang="ts">
import * as vue from 'vue'

export default vue.defineComponent({
	name: 'FormInput'
})
</script>

<script lang="ts" setup>
type Props = {
	label?: string
	name?: string
	type?: string
	disabled?: boolean
	accept?: string
	modelValue?: any
	required?: boolean
	helpText?: string
	clearable?: boolean
	autocomplete?: string
	readonly?: boolean
	pattern?: string
}

const props = withDefaults(defineProps<Props>(), {
	type: 'text',
	disabled: false
})

const emit = defineEmits<{
	(event: 'update:modelValue', value: any): void
}>()

const input = vue.ref<HTMLInputElement>()

const value = vue.computed({
	get: () => props.modelValue,
	set: v => emit('update:modelValue', v)
})

const hasValue = vue.computed(() => value.value?.length)

const classes = vue.computed(() => ({
	'has-value': hasValue.value,
	// expanded: true,
	[props.type]: true
}))

function clearInput() {
	value.value = ''
}

defineExpose({ input })
</script>

<template>
	<div class="form-input" :class="classes">
		<label
			v-if="label"
			:for="name"
			class="input-label"
			:title="props.required ? 'Required' : 'Optional'"
		>
			<span class="input-label-text">{{ label }}</span>

			<span v-if="required" class="input-required-mark">
				<i class="fad fa-comment-exclamation" style="--fa-primary-opacity: 1" title="Required" />
			</span>
		</label>
		<span v-if="helpText" class="help-text">{{ helpText }}</span>

		<span v-if="clearable && hasValue" class="input-clear" @click="clearInput">
			<i class="far fa-times-circle" />
		</span>

		<slot name="before:input-area" />

		<div class="input-area" :style="type === 'color' && value ? `--selected-color: ${value};` : ''">
			<slot name="before:input" />
			<span v-if="type === 'color'" class="color-select-text"> Select Color </span>

			<slot v-if="$slots.input" name="input" />
			<input
				v-else
				ref="input"
				v-model="value"
				v-bind="$attrs"
				:name="name"
				:type="type"
				:required="required"
				:autocomplete="autocomplete"
				:readonly="readonly"
				:disabled="props.disabled"
				:pattern="pattern"
			/>

			<slot name="after:input" />
		</div>

		<slot name="after:input-area" />
	</div>
</template>

<style lang="scss">
.form-input {
	@include flex(column);
	min-width: 150px;
	box-sizing: border-box;
	padding: 0.5em;
	padding-top: 0px;
	border: 2px solid var(--input-background, white);
	border-radius: var(--border-radius, 10px);

	position: relative;
	transition: padding-top 0.25s, padding-bottom 0.25s, border 0.25s;

	background-color: var(--input-background, white);
	font-weight: bold;

	overflow: hidden;
	box-shadow: 0px 2px 3px rgba(#000, 0.23);

	* {
		box-sizing: border-box;
	}

	.input-label,
	.input-clear {
		@include flex(row, flex-start, center);
		box-sizing: border-box;

		position: absolute;
		left: 0.65em;
		top: 50%;
		z-index: 2;

		transform: translateY(-50%);

		font-size: var(--input-font-size, 1em);
		color: var(--input-label-text, black);
		font-weight: 300;
		// text-transform: capitalize;

		transition: transform 0.25s, left 0.25s, top 0.25s, font-size 0.25s;
		letter-spacing: 0.05em;

		.input-label-text {
			width: 100%;
		}

		.input-required-mark {
			color: red;
		}
	}

	.input-label {
		pointer-events: none;
	}

	.input-clear {
		font-size: 1em;
		color: #ef9a9a;

		transition: color 0.25s;

		&:hover {
			color: #e57373;
		}
	}

	.input-area {
		@include flex(row, center, center);
		width: 100%;
		height: 100%;

		position: relative;
		z-index: 1;

		background-color: var(--input-area-background, lightgray);

		overflow: hidden;
		opacity: 0;
		border-radius: var(--border-radius, 10px);
		transition: opacity 0.25s, padding-top 0.25s, border-radius 0.25s, background-color 0.25s;

		input,
		textarea,
		select {
			padding: 0px;
			border: none;
			outline: none;
			background-color: transparent;
			width: 100%;
			height: 100%;
			padding: var(--input-padding, 1em);

			color: #424242;
			// font-weight: bold;
			letter-spacing: 0.05em;
		}
	}

	&:focus,
	&:focus-within,
	&.has-value {
		&:not(.no-label) {
			padding-top: 1.75em;

			.input-label,
			.input-clear {
				left: 0.65em;
				top: 0.45em;
				transform: none;
			}

			.input-clear {
				width: auto;
				left: auto;
				top: 0.35em;
				right: 0.35em;
				z-index: 3;
				pointer-events: all;
				cursor: pointer;
			}
		}

		.input-area {
			background-color: var(--input-area-background, lightgray);

			border-radius: var(--border-radius, 10px);
			opacity: 1;
		}
	}
}

.form-input.expanded {
	&:not(.no-label) {
		padding-top: 0.5em;

		.input-label,
		.input-clear {
			left: 0.65em;
			top: 0.45em;
			transform: none;
		}

		.input-label {
			position: relative;
			left: 0px;
			top: 0px;
			margin-bottom: 0.5em;
		}

		.input-clear {
			width: auto;
			left: auto;
			top: 0.35em;
			right: 0.35em;
			z-index: 3;
			pointer-events: all;
			cursor: pointer;
		}
	}

	.input-area {
		background-color: var(--input-area-background, lightgray);

		opacity: 1;
	}
}

.form-input.flat {
	box-shadow: none;
}

.form-input.box-it {
	border-radius: 0px;

	.input-area {
		border-radius: 0px;
	}
}

.form-input:not(.text):not(.number):not(.password) {
	.input-area,
	.input-area * {
		cursor: pointer;
	}
}

.form-input.color {
	.input-area {
		height: 40px;
		padding: 0px;

		position: relative;

		background-color: var(--selected-color, black);

		.color-select-text {
			@include flex(column, center, center);
			width: 100%;
			height: 100%;

			position: absolute;
			left: 0px;
			top: 0px;
			z-index: 1;

			color: var(--selected-color, black);
			filter: invert(1) brightness(10000%);
		}

		input {
			position: relative;
			z-index: 2;

			opacity: 0;
		}
	}
}

.form-input.range {
	.input-area {
		background-color: var(--input-background, white);

		input {
			padding-left: 0px;
			padding-right: 0px;
		}
	}
}

.form-input.no-label {
	padding-top: 0.5em;

	.input-label {
		display: none;
	}

	.input-area {
		background-color: var(--input-area-background, lightgray);

		opacity: 1;
	}
}

.form-input.no-padding {
	padding: 0px;
}
</style>
