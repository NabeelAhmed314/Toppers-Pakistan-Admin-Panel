import { Model } from '../*.model'

/**
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export class StockItem extends Model {
  /**
   * Name of the StockItem.
   * @type {string}
   */
  name = undefined

  /**
   * SI Unit of the StockItem.
   *
   * @values mg, ml, piece
   * @type {string}
   */
  unit = 'mg'

  /**
   * Price for people of Poor category
   * @type {number}
   */
  poor = 0

  /**
   * Price for people of YCDO category
   * @type {number}
   */
  ycdo = 0

  /**
   * Price for people of General category
   * @type {number}
   */
  general = 0

  /**
   * Price for people of Deserving category
   * @type {number}
   */
  deserving = 0

  /**
   * It is the minimum quantity of the product that
   * must be available in the stock.
   *
   * @description
   * whenever the quantity reaches below this limit
   * than the system will start generating warning
   * to refill the stock.
   *
   * @type {number}
   */
  fixLimit = 0

  /**
   * It is the market price of the stock item.
   *
   * @description
   * The price at which product is purchased
   * from the market / vendors etc.
   *
   * @type {number}
   */
  marketPrice = 0

  /**
   * It is the retail price of the stock item
   *
   * @description
   * The final price at which the product is
   * sold to the customers / consumers.
   *
   * @type {number}
   */
  retailPrice = 0
}
