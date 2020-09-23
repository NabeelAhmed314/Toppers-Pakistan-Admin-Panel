import { Model } from '../*.model'

export class Room extends Model {
  /** @type {string} */
  name = undefined

  /** @type {string} */
  type = undefined

  /** @type {string | Branch} */
  branch = undefined
}
