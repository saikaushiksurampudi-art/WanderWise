import { CurrencyRates } from '../types';
import { CURRENCY_SYMBOLS } from '../constants/tripDefaults';

export function formatConvertedPrice(
  usdAmount: number,
  selectedCurrency: string,
  currencyRates: CurrencyRates | null
): string {
  if (!currencyRates || !currencyRates.rates[selectedCurrency]) {
    return `$${usdAmount.toLocaleString()}`;
  }
  const rate = currencyRates.rates[selectedCurrency];
  const converted = Math.round(usdAmount * rate);
  const symbol = CURRENCY_SYMBOLS[selectedCurrency] || '$';
  return `${symbol}${converted.toLocaleString()}`;
}
