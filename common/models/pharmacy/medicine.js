import { StockItem } from './stock-item'

/**
 * @extends {StockItem}
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export class Medicine extends StockItem {
  /**
   * Stands for 'One Dose'
   *
   * these Medicines that consumed once per day.
   */
  isOd = false

  /**
   * Determines if the consumer / customer has to pay
   * for the Medicines or not
   *
   * @description
   * if a Medicines is parked as [paid] than each
   * Patient have to pay for it but if it is not
   * the case than the Patient might get the Medicines
   * for free. mostly poor category persons get the
   * Medicines for free.
   */
  isPaid = false

  /**
   * It is the category of Medicines.
   *
   * Some of the common categories of Medicines
   * are. Tablet, Syrup, Bandage, Ointment etc...
   */
  category = 'Tablet'

  /**
   * @readonly
   * @type {string[]}
   */
  static categories = ['Tablet', 'Syrup', 'Bandage', 'Ointment']
}
