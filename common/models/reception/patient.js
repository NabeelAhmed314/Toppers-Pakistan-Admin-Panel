import { Model } from '../*.model'

/**
 * @extends Model
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export class Patient extends Model {
  /** @type {Date | number} */
  dob = Date.now()

  /** @type {string} */
  name = undefined

  /** @type {string} */
  cnic = undefined

  /** @type {string} */
  contact = undefined

  /** @type {string} */
  address = undefined

  /** @type {Date | number} */
  createdAt = undefined
}
