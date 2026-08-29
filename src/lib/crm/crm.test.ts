import assert from "node:assert/strict";
import test from "node:test";
import { mapHeader, normalizeName, normalizePhone, parseCondition } from "./normalize.ts";
import { findDuplicates, isIncomplete } from "./duplicates.ts";
import type { ParsedRow, Prospect } from "./types.ts";

test("normalizePhone strips formatting and leading 1", () => {
  assert.equal(normalizePhone("(804) 555-1234"), "8045551234");
  assert.equal(normalizePhone("+1 804-555-1234"), "8045551234");
  assert.equal(normalizePhone(""), "");
});

test("normalizeName drops legal suffixes", () => {
  assert.equal(normalizeName("ABC Equipment LLC"), "abc equipment");
  assert.equal(normalizeName("The Smith Tractor Co."), "smith tractor");
});

test("mapHeader recognizes vendor aliases", () => {
  assert.equal(mapHeader("Company Name"), "businessName");
  assert.equal(mapHeader("Phone Number"), "phone");
  assert.equal(mapHeader("Telephone"), "phone");
  assert.equal(mapHeader("Dealer"), "businessName");
  assert.equal(mapHeader("First Name"), "contactFirst");
});

test("mapHeader recognizes tractor part requirement columns", () => {
  assert.equal(mapHeader("Part Number"), "partNumber");
  assert.equal(mapHeader("SKU"), "partNumber");
  assert.equal(mapHeader("OEM"), "condition");
  assert.equal(mapHeader("Aftermarket"), "condition");
  assert.equal(mapHeader("Brand"), "brand");
  assert.equal(mapHeader("Model"), "model");
  assert.equal(mapHeader("Price Quoted"), "priceQuoted");
});

test("parseCondition maps OEM used aftermarket aliases", () => {
  assert.equal(parseCondition("oem"), "OEM");
  assert.equal(parseCondition("genuine"), "OEM");
  assert.equal(parseCondition("Used salvage"), "Used");
  assert.equal(parseCondition("after market"), "Aftermarket");
});

function row(partial: ParsedRow["values"]): ParsedRow {
  return {
    sheet: "Sheet1",
    rowNumber: 2,
    values: partial,
    extra: {},
    raw: {},
  };
}

test("duplicate detection matches phone and name+city", () => {
  const existing = [
    {
      id: "1",
      businessName: "ABC Equipment LLC",
      phone: "804-555-1234",
      phoneNormalized: "8045551234",
      nameNormalized: "abc equipment",
      city: "Virginia Beach",
    },
  ] as Prospect[];
  const rows = [
    row({ businessName: "ABC Equipment", phone: "8045551234", city: "Virginia Beach" }),
    row({ businessName: "Other Co", phone: "7575550000" }),
  ];
  const dups = findDuplicates(rows, existing);
  assert.equal(dups.length, 1);
  assert.ok(dups[0].reasons.includes("phone"));
});

test("incomplete rows missing name and phone", () => {
  assert.ok(isIncomplete(row({ city: "Roanoke" })));
  assert.equal(isIncomplete(row({ businessName: "X" })), null);
});
