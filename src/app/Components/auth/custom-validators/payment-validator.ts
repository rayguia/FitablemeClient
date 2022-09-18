import { AbstractControl } from '@angular/forms';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const $: any;

export function ccNumberValidator(control: AbstractControl) {
  const cardNumber = control.value;
  if (!['visa', 'mastercard', 'amex', 'discover'].includes($.payform.parseCardType(cardNumber)) ||
      !$.payform.validateCardNumber(cardNumber)) {
    return { ccNumberInvalid: true };
  }
  return null;
}

export function ccExpValidator(control: AbstractControl) {
  const ccExp = control.value.split(' / ');
  try {
    if (Number(ccExp[0]) <= 12 && Number(ccExp[0]) >= 1) {
      if (ccExp[1].length === 1 || ccExp[1].length === 3) {
        return { ccExpInvalid: true };
      }
      if (ccExp[1].length === 2) {
        if (ccExp[1] === new Date().getFullYear().toString().substr(2, 2)) {
          if (Number(ccExp[0]) < (new Date().getMonth() + 1)) {
            return { ccExpInvalid: true };
          }
        }
      }
      if (ccExp[1].length === 4) {
        if (ccExp[1] === new Date().getFullYear().toString()) {
          if (Number(ccExp[0]) < (new Date().getMonth() + 1)) {
            return { ccExpInvalid: true };
          }
        }
      }
    } else {
      return { ccExpInvalid: true };
    }
  } catch {
    return { ccExpInvalid: true };
  }
  return null;
}

