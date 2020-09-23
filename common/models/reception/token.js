import { Model } from '../*.model'
import { Transaction } from './transaction'

export class PrescribedMedicine extends Model {
  /** @type {string} */
  name = undefined

  /** @type {string} */
  dose = undefined
}

export class AssignedDiagnostics extends Model {
  /** @type {string} */
  name = undefined

  /** @type {string} */
  result = undefined

  /** @type {Date | number} */
  performedAt = undefined
}

/**
 * @extends Transaction
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export class Token extends Transaction {
  /** @type {string} */
  number = undefined

  /** @type {Patient} */
  patient = undefined

  medicines = []
  diagnostics = []

  type = 'poor'

  /**
   * @type {string}
   * @values running, pending, done
   */
  state = 'running'

  /** @type {boolean} */
  isPrinted = false

  /** @type {Date | number} */
  createdAt = undefined

  /** @type {User | string} */
  createdBy = undefined

  /** @type {string} */
  checkedBy = undefined

  branch = '5ea2dc33a652564b665e2a6a'
}
