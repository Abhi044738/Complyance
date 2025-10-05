export const normalizeFieldName = (fieldName) => {
  return String(fieldName || "")
    .toLowerCase()
    .replace(/[^_a-z0-9\.\[\]]/g, "");
};

export const isTypeCompatible = (targetPath, sampleValue) => {
  if (sampleValue === null || sampleValue === undefined || sampleValue === "") {
    return true;
  }

  if (targetPath.includes("date")) {
    return /^\d{4}[-\/]\d{2}[-\/]\d{2}$/.test(String(sampleValue));
  }

  if (
    targetPath.includes("qty") ||
    targetPath.includes("total") ||
    targetPath.includes("price")
  ) {
    const numericValue = Number(sampleValue);
    return !Number.isNaN(numericValue);
  }

  return true;
};

export const FIELD_ALIASES = new Map([
  [
    "invoice.id",
    [
      "invoiceid",
      "invoice_no",
      "invoiceno",
      "invoice_number",
      "invoicenumber",
      "inv_no",
      "inv_id",
      "invid",
      "invno",
      "invnumber",
    ],
  ],
  [
    "invoice.issue_date",
    ["invoicedate", "issue_date", "issuedate", "date", "issued_on", "issuedon"],
  ],
  [
    "invoice.currency",
    ["currency", "curr", "invoice_currency", "invoicecurrency"],
  ],
  [
    "invoice.total_excl_vat",
    [
      "total_excl_vat",
      "totalexclvat",
      "total_excl",
      "totalexcl",
      "subtotal",
      "totalnet",
      "nettotal",
    ],
  ],
  [
    "invoice.vat_amount",
    ["vat", "vatamount", "taxamount", "invoice_vat_amount", "invoicevatamount"],
  ],
  [
    "invoice.total_incl_vat",
    [
      "total_incl_vat",
      "totalinclvat",
      "total_incl",
      "totalincl",
      "grandtotal",
      "grandTotal",
      "total",
    ],
  ],
  ["seller.country", ["seller_country", "sellercountry"]],
  ["seller.name", ["sellername", "suppliername", "vendorname", "seller_name"]],
  ["seller.city", ["seller_city", "sellercity"]],
  ["seller.trn", ["sellertrn", "seller_tax", "sellertax", "vatid", "trn"]],
  ["buyer.name", ["buyername", "customername", "clientname", "buyer_name"]],
  ["buyer.trn", ["buyertrn", "buyer_tax", "buyertax", "trn"]],
  ["buyer.country", ["buyercountry", "buyer_country", "country"]],
  ["lines.sku", ["linesku", "sku", "itemcode", "productcode"]],
  [
    "lines.description",
    ["linedescription", "description", "itemdesc", "productdesc"],
  ],
  ["lines.qty", ["lineqty", "qty", "quantity"]],
  [
    "lines.unit_price",
    ["lineprice", "linePrice", "unitprice", "unitPrice", "price", "rate"],
  ],
  ["lines.line_total", ["linetotal", "lineamount", "amount", "total"]],
]);

export const getNormalizedTargetKey = (targetPath) => {
  return normalizeFieldName(targetPath.replace(/\[\]/g, ""));
};

export const isAliasMatch = (normalizedSourceKey, targetPath) => {
  const targetKey = getNormalizedTargetKey(targetPath);
  const aliases = FIELD_ALIASES.get(targetKey) || [];

  return aliases.some((aliasRaw) => {
    const normalizedAlias = normalizeFieldName(aliasRaw);
    return (
      normalizedSourceKey === normalizedAlias ||
      normalizedSourceKey.startsWith(normalizedAlias) ||
      normalizedAlias.startsWith(normalizedSourceKey) ||
      normalizedSourceKey.includes(normalizedAlias) ||
      normalizedAlias.includes(normalizedSourceKey)
    );
  });
};
