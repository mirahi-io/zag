import { ariaAttr, dataAttr } from "@zag-js/dom-query"
import type { NormalizeProps, PropTypes } from "@zag-js/types"
import { visuallyHiddenStyle } from "@zag-js/visually-hidden"
import { parts } from "./radio-group.anatomy"
import { dom } from "./radio-group.dom"
import type { InputProps, RadioProps, Send, State } from "./radio-group.types"

export function connect<T extends PropTypes>(state: State, send: Send, normalize: NormalizeProps<T>) {
  const isGroupDisabled = state.context.disabled
  const isGroupReadOnly = state.context.readOnly

  function getRadioState<T extends RadioProps>(props: T) {
    const radioState = {
      isReadOnly: props.readOnly || isGroupReadOnly,
      isInvalid: props.invalid,
      isDisabled: props.disabled || isGroupDisabled,
      isChecked: state.context.value === props.value,
      isFocused: state.context.focusedId === props.value,
      isHovered: state.context.hoveredId === props.value,
      isActive: state.context.activeId === props.value,
    }
    return {
      ...radioState,
      isInteractive: !(radioState.isReadOnly || radioState.isDisabled),
    }
  }

  function getRadioDataAttrs<T extends RadioProps>(props: T) {
    const radioState = getRadioState(props)
    return {
      "data-focus": dataAttr(radioState.isFocused),
      "data-disabled": dataAttr(radioState.isDisabled),
      "data-checked": dataAttr(radioState.isChecked),
      "data-hover": dataAttr(radioState.isHovered),
      "data-invalid": dataAttr(radioState.isInvalid),
      "data-readonly": dataAttr(radioState.isReadOnly),
    }
  }

  const focus = () => {
    const firstEnabledAndCheckedInput = dom.getFirstEnabledAndCheckedInputEl(state.context)

    if (firstEnabledAndCheckedInput) {
      firstEnabledAndCheckedInput.focus()
      return
    }

    const firstEnabledInput = dom.getFirstEnabledInputEl(state.context)
    firstEnabledInput?.focus()
  }

  return {
    /**
     * The current value of the radio group
     */
    value: state.context.value,
    /**
     * Function to set the value of the radio group
     */
    setValue(value: string) {
      send({ type: "SET_VALUE", value, manual: true })
    },
    /**
     * Function to clear the value of the radio group
     */
    clearValue() {
      send({ type: "SET_VALUE", value: null, manual: true })
    },
    /**
     * Function to focus the radio group
     */
    focus,
    /**
     * Function to blur the currently focused radio input in the radio group
     */
    blur() {
      const focusedElement = dom.getActiveElement(state.context)
      const inputEls = dom.getInputEls(state.context)
      const radioInputIsFocused = inputEls.some((el) => el === focusedElement)
      if (radioInputIsFocused) focusedElement?.blur()
    },
    /**
     * Returns the state details of a radio input
     */
    getRadioState,

    rootProps: normalize.element({
      ...parts.root.attrs,
      role: "radiogroup",
      id: dom.getRootId(state.context),
      "aria-labelledby": dom.getLabelId(state.context),
      "data-orientation": state.context.orientation,
      "aria-orientation": state.context.orientation,
      dir: state.context.dir,
    }),

    labelProps: normalize.element({
      ...parts.label.attrs,
      id: dom.getLabelId(state.context),
      onClick: focus,
    }),

    getRadioProps(props: RadioProps) {
      const rootState = getRadioState(props)

      return normalize.label({
        ...parts.radio.attrs,
        id: dom.getRadioId(state.context, props.value),
        htmlFor: dom.getRadioInputId(state.context, props.value),
        ...getRadioDataAttrs(props),

        onPointerMove() {
          if (!rootState.isInteractive) return
          send({ type: "SET_HOVERED", value: props.value, hovered: true })
        },
        onPointerLeave() {
          if (!rootState.isInteractive) return
          send({ type: "SET_HOVERED", value: null })
        },
        onPointerDown(event) {
          if (!rootState.isInteractive) return
          // On pointerdown, the input blurs and returns focus to the `body`,
          // we need to prevent this.
          if (rootState.isFocused && event.pointerType === "mouse") {
            event.preventDefault()
          }
          send({ type: "SET_ACTIVE", value: props.value, active: true })
        },
        onPointerUp() {
          if (!rootState.isInteractive) return
          send({ type: "SET_ACTIVE", value: null })
        },
      })
    },

    getRadioLabelProps(props: RadioProps) {
      return normalize.element({
        ...parts.radioLabel.attrs,
        id: dom.getRadioLabelId(state.context, props.value),
        ...getRadioDataAttrs(props),
      })
    },

    getRadioControlProps(props: RadioProps) {
      const controlState = getRadioState(props)

      return normalize.element({
        ...parts.radioControl.attrs,
        id: dom.getRadioControlId(state.context, props.value),
        "data-active": dataAttr(controlState.isActive),
        "aria-hidden": true,
        ...getRadioDataAttrs(props),
      })
    },

    getRadioInputProps(props: InputProps) {
      const inputState = getRadioState(props)

      const isRequired = props.required
      const trulyDisabled = inputState.isDisabled && !props.focusable

      return normalize.input({
        ...parts.radioInput.attrs,
        "data-ownedby": dom.getRootId(state.context),
        id: dom.getRadioInputId(state.context, props.value),

        type: "radio",
        name: state.context.name || state.context.id,
        form: state.context.form,
        value: props.value,
        onChange(event) {
          if (inputState.isReadOnly || inputState.isDisabled) {
            return
          }
          if (event.target.checked) {
            send({ type: "SET_VALUE", value: props.value })
          }
        },
        onBlur() {
          send({ type: "SET_FOCUSED", value: null })
        },
        onFocus() {
          send({ type: "SET_FOCUSED", value: props.value, focused: true })
        },
        onKeyDown(event) {
          if (event.key === " ") {
            send({ type: "SET_ACTIVE", value: props.value, active: true })
          }
        },
        onKeyUp(event) {
          if (event.key === " ") {
            send({ type: "SET_ACTIVE", value: null })
          }
        },
        disabled: trulyDisabled,
        required: isRequired,
        defaultChecked: inputState.isChecked,
        "data-disabled": dataAttr(inputState.isDisabled),
        "aria-required": ariaAttr(isRequired),
        "aria-invalid": ariaAttr(inputState.isInvalid),
        readOnly: inputState.isReadOnly,
        "data-readonly": dataAttr(inputState.isReadOnly),
        "aria-disabled": ariaAttr(trulyDisabled),
        "aria-checked": ariaAttr(inputState.isChecked),
        style: visuallyHiddenStyle,
      })
    },
  }
}
