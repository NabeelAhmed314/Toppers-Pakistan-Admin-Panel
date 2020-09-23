import { Model } from '../*.model'

export class User extends Model {
  /** @type {string} */
  image = undefined

  /** @type {string} */
  name = undefined

  /** @type {string} */
  email = undefined

  /** @type {number[]} */
  scope = []

  /** @type {string} */
  contact = undefined

  /** @type {string} */
  username = undefined

  /** @type {string} */
  password = undefined
}
