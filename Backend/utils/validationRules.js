const areNumbersNearlyEqual = (a, b, epsilon = 0.01) => {
  return Math.abs(Number(a) - Number(b)) <= epsilon;
};

export const validateTotalsBalance = (dataRows) => {
  let isValid = true;

  for (const row of dataRows) {
    const totalExcludingVat =
      row.total_excl_vat ?? row.totalNet ?? row.total_excl ?? row.total ?? 0;
    const vatAmount = row.vat_amount ?? row.vat ?? 0;
    const totalIncludingVat = row.total_incl_vat ?? row.grandTotal ?? 0;

    if (
      !areNumbersNearlyEqual(
        Number(totalExcludingVat) + Number(vatAmount),
        Number(totalIncludingVat)
      )
    ) {
      isValid = false;
      break;
    }
  }

  return { rule: "TOTALS_BALANCE", ok: isValid };
};

export const validateLineMath = (dataRows) => {
  let isValid = true;
  let exampleLineIndex = null;
  let expectedValue = null;
  let actualValue = null;
  let lineIndex = 0;

  for (const row of dataRows) {
    const lineItems = Array.isArray(row.lines) ? row.lines : [];

    if (lineItems.length > 0) {
      for (const lineItem of lineItems) {
        lineIndex += 1;
        const quantity = Number(lineItem.qty);
        const unitPrice = Number(lineItem.unit_price);
        const lineTotal = Number(lineItem.line_total);

        if (!areNumbersNearlyEqual(quantity * unitPrice, lineTotal)) {
          isValid = false;
          exampleLineIndex = lineIndex;
          expectedValue = quantity * unitPrice;
          actualValue = lineTotal;
          break;
        }
      }
    } else {
      const quantity = Number(row.lineQty ?? row.lineqty ?? row.qty);
      const unitPrice = Number(
        row.linePrice ?? row.lineprice ?? row.unit_price ?? row.price
      );
      const lineTotal = Number(
        row.lineTotal ?? row.linetotal ?? row.line_total ?? row.total
      );

      if (
        !Number.isNaN(quantity) &&
        !Number.isNaN(unitPrice) &&
        !Number.isNaN(lineTotal)
      ) {
        lineIndex += 1;
        if (!areNumbersNearlyEqual(quantity * unitPrice, lineTotal)) {
          isValid = false;
          exampleLineIndex = lineIndex;
          expectedValue = quantity * unitPrice;
          actualValue = lineTotal;
          break;
        }
      }
    }

    if (!isValid) break;
  }

  const result = { rule: "LINE_MATH", ok: isValid };
  if (!isValid) {
    result.exampleLine = exampleLineIndex;
    result.expected = expectedValue;
    result.got = actualValue;
  }

  return result;
};

export const validateDateFormat = (dataRows) => {
  let isValid = true;

  for (const row of dataRows) {
    const dateField =
      row["invoice.issue_date"] || row.issue_date || row.date || row.issued_on;
    if (dateField && !/^\d{4}-\d{2}-\d{2}$/.test(String(dateField))) {
      isValid = false;
      break;
    }
  }

  return { rule: "DATE_ISO", ok: isValid };
};

export const validateCurrency = (dataRows) => {
  const allowedCurrencies = new Set(["AED", "SAR", "MYR", "USD"]);
  let isValid = true;
  let invalidValue = null;

  for (const row of dataRows) {
    const currency = row["invoice.currency"] || row.currency || row.curr;
    if (currency && !allowedCurrencies.has(String(currency))) {
      isValid = false;
      invalidValue = currency;
      break;
    }
  }

  const result = { rule: "CURRENCY_ALLOWED", ok: isValid };
  if (!isValid) {
    result.value = invalidValue;
  }

  return result;
};

export const validateTaxRegistrationNumbers = (dataRows) => {
  let isValid = true;

  for (const row of dataRows) {
    const buyerTrn = row["buyer.trn"] || row.buyer_trn || row.buyerTax;
    const sellerTrn = row["seller.trn"] || row.seller_trn || row.sellerTax;

    if (!buyerTrn || !sellerTrn) {
      isValid = false;
      break;
    }
  }

  return { rule: "TRN_PRESENT", ok: isValid };
};

export const runAllValidationRules = (dataRows) => {
  return [
    validateTotalsBalance(dataRows),
    validateLineMath(dataRows),
    validateDateFormat(dataRows),
    validateCurrency(dataRows),
    validateTaxRegistrationNumbers(dataRows),
  ];
};
