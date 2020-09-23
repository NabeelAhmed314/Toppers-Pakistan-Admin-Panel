import { Model } from '../*.model'

export class Purchase extends Model {
  /** @type {string} */
  type = undefined

  /** @type {Medicine | SurgicalEquipment | LabTestEquipment} */
  item = undefined

  /** @type {string} */
  batchNumber = undefined

  /** @type {boolean} */
  isExpireAble = false

  /** @type {Date} */
  expiryDate = undefined

  /**
   * Price for people of Poor category
   */
  poor = 0

  /**
   * Price for people of YCDO category
   */
  ycdo = 0

  /**
   * Price for people of General category
   */
  general = 0

  /**
   * Price for people of Deserving category
   */
  deserving = 0

  /**
   * It is the market price of the stock item.
   *
   * @description
   * The price at which product is purchased
   * from the market / vendors etc.
   */
  marketPrice = 0

  /**
   * It is the retail price of the stock item
   *
   * @description
   * The final price at which the product is
   * sold to the customers / consumers.
   */
  retailPrice = 0
}
