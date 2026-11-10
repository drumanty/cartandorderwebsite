/* ==========================================================================
   CART AND ORDER - GOOGLE APPS SCRIPT
   ========================================================================== */

const SHEET_NAME = "Business Inquiries";

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const data = (e && e.parameter) ? e.parameter : {};

    const fullName = String(data.fullName || "").trim();
    const contactInfo = String(data.contactInfo || data.contactinfo || "").trim();
    const role = String(data.role || "").trim();
    const businessName = String(data.businessName || "").trim();
    const inquiry = String(data.inquiry || "").trim();

    if (
      fullName.length < 2 ||
      contactInfo.length < 7 ||
      inquiry.length < 10 ||
      inquiry.length > 500 ||
      !["Buyer", "Seller"].includes(role)
    ) {
      return jsonResponse({ success: false, message: "Invalid form data." });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s().-]{7,20}$/;
    if (!emailPattern.test(contactInfo) && !phonePattern.test(contactInfo)) {
      return jsonResponse({ success: false, message: "Invalid contact info format." });
    }

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Contact Info",
        "Role",
        "Business Name",
        "Inquiry"
      ]);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      safeCell(fullName),
      safeCell(contactInfo),
      safeCell(role),
      safeCell(businessName),
      safeCell(inquiry)
    ]);

    return jsonResponse({ success: true, message: "Inquiry saved successfully." });

  } catch (error) {
    return jsonResponse({ success: false, message: error.toString() });
  } finally {
    try {
      lock.releaseLock();
    } catch (e) {}
  }
}

function safeCell(value) {
  const text = String(value || "").trim();
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}