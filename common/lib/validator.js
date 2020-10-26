/**
 * @file provides the utility functions for validating
 * Vuetify forms.
 *
 * @version 1.0.0
 * @author arish <arishsultan104@gmail.com>
 */

/**
 * @param {string} value
 * @returns {boolean|string}
 */
export const required = (value) => !!value || 'Please provide some value'

/**
 * @param {string} value
 * @returns {boolean|string}
 */
export const price = (value) =>
  +value > 0 || 'You have entered an invalid price'
export const quantity = (value) =>
  +value > 0 || 'You have entered an invalid quantity'

/**
 * @param {string} value
 * @returns {boolean|string}
 */
export const priceWZ = (value) =>
  +value >= 0 || 'You have entered an invalid number'

/**
 * @param {string} value
 * @returns {boolean|string}
 */
export const priceDM = (value) =>
  +value <= 999999 || 'Price provided is too high'

/**
 * @param {string} value
 * @returns {boolean|string}
 */
export const priceRules = [required, price, priceDM]

export function emailValidator(value) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
  const matches = regex.exec(value)
  return !!matches || 'Enter valid email'
}

export function phoneValidator(value) {
  if (value !== undefined) {
    return (value.length >= 12 && value.length <= 15) || 'Enter valid phone'
  } else {
    return 'Enter valid phone'
  }
}

export function lengthValidator(value) {
  return value.length >= 8 || 'Enter at least 8 characters'
}
