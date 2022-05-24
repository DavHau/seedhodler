import React, { useState, useEffect, Dispatch, SetStateAction } from "react"
import CSS from "csstype"
import * as bip39 from "bip39"

import { slip39wordlist } from "constants/"

import classes from "./Input.module.scss"

type Props = {
  count?: number
  index: number
  value: string
  onChange: Dispatch<SetStateAction<string[]>>
  isRestore?: boolean
  className?: string
  containerStyle?: CSS.Properties
}

const Input: React.FC<Props> = ({
  count,
  index,
  value,
  onChange,
  isRestore,
  className,
  containerStyle,
}) => {
  const classNames = [classes.input, className].join(" ")
  const wordlist = isRestore ? slip39wordlist : bip39.wordlists.english
  const [focusedItemId, setFocusedItemId] = useState(0)
  const variants: string[] = []
  const isOpen = value.length !== 0 && !wordlist.some(word => word === value)
  let variantsCounter = 0

  for (let i = 0; i < wordlist.length; i++) {
    if (variantsCounter < 5) {
      if (wordlist[i].includes(value.toLowerCase())) {
        variantsCounter++
        variants.push(wordlist[i])
      }
    } else {
      break
    }
  }

  const handleChange = (newValue: string) => {
    onChange(mnemonicArr =>
      mnemonicArr.map((word, wordIndex) => (wordIndex === index ? newValue : word)),
    )
  }

  useEffect(() => {
    const onTabPress = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === "Tab" || e.key === "ArrowDown") {
          e.preventDefault()
          setFocusedItemId(prev => (focusedItemId < variants.length - 1 ? prev + 1 : 0))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setFocusedItemId(prev => (focusedItemId <= 0 ? variants.length - 1 : prev - 1))
        } else if (e.key === "Enter") {
          e.preventDefault()
          onChange(mnemonicArr =>
            mnemonicArr.map((word, wordIndex) => (wordIndex === index ? variants[focusedItemId] : word)),
          )
        }
      }
    }

    document.addEventListener("keydown", onTabPress)

    return () => document.removeEventListener("keydown", onTabPress)
  }, [focusedItemId, variants, isOpen, variants, index])

  useEffect(() => {
    setFocusedItemId(0)
  }, [value])

  return (
    <div className={classes.container} style={containerStyle}>
      {count && <span className={classes.count}>{count}.</span>}
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        className={classNames}
      />
      {isOpen && (
        <div className={classes.dropdownList}>
          {variants.map((variant, i) => (
            <button
              onClick={() => handleChange(variant)}
              key={variant}
              className={`${classes.dropdownListItem} ${i === focusedItemId ? classes.focused : ""}`}
              tabIndex={0}
            >
              {variant}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Input
