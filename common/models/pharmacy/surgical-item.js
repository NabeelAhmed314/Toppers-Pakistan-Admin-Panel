import { StockItem } from './stock-item'

/**
 * Typescript translated Schema for SurgicalItems collection.
 * @extends StockItem
 *
 * @description
 * It is one of the sub categories of the StockItem, it
 * represents the equipments that are used to perform,
 * surgeries / operations in YCDO HCC.
 *
 * @author arish <arishsultan104@gmail.com>
 */
export class SurgicalItem extends StockItem {
  /**
   * Determines if the consumer / customer has to pay
   * for the medicine or not
   *
   * @description
   * if a medicine is parked as [paid] than each
   * Patient have to pay for it but if it is not
   * the case than the Patient might get the medicine
   * for free. mostly poor category persons get the
   * Medicines for free.
   *
   * @type {boolean}
   */
  isPaid = false
}
