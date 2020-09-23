import { User } from './user'

export class Doctor extends User {
  /** @type {Room | string} */
  room = undefined

  /**
   * @values working, vacation, fired (or left)
   * @type {string}
   */
  status = 'working'

  /** @type {string} */
  specializations = undefined

  /** @type {number | Date} */
  joiningDate = undefined

  /**
   * @readonly
   * @type {string[]}
   */
  static SPECIALITIES = [
    'Pediatricians',
    'Allergists',
    'Dermatologists',
    'Ophthalmologists',
    'Gynecologists',
    'Cardiologists',
    'Endocrinologists',
    'Gastroenterologists',
    'Nephrologists',
    'Urologists',
    'Pulmonologists',
    'Otolaryngologists',
    'Rheumatologists',
    'Radiologists',
    'General surgeons',
    'Orthopedic surgeons',
    'Cardiac surgeons',
    'Anesthesiologists'
  ]
}
