window.BookFormData = {
  value(name, root = document) {
    return String(root.querySelector(`[name="${CSS.escape(name)}"]`)?.value || "").trim();
  },

  checked(name, root = document) {
  const inputs = Array.from(
    root.querySelectorAll(`input[name="${CSS.escape(name)}"]`)
  );

  if (!inputs.length) return undefined;

  return inputs
    .filter(input => input.checked)
    .map(input => input.value);
},

checkedText(name, root = document) {
  const values = this.checked(name, root);

  if (values === undefined) return undefined;

  if (!values.length) return "";

  return values.join(", ");
},

  readBook(root = document) {
    return {
      Title: this.value("Title", root),
      Author_Name: this.value("Author_Name", root),
      "Release/Expected_Release_Date": this.value("Release/Expected_Release_Date", root),

      Genre: this.value("Genre", root),
      Age_Range: this.value("Age_Range", root),
      Spice_Level: this.value("Spice_Level", root),

      Series_Name: this.value("Series_Name", root),
      Series_Number: this.value("Series_Number", root) || null,

      Word_Count: this.value("Word_Count", root) || null,
      Page_Count: this.value("Page_Count", root) || null,

      Description: this.value("Description", root),

      Sub_Genres: this.checkedText("Subgenres", root),
Vibes: this.checkedText("Vibes", root),
Representation: this.checkedText("Representation", root),
Available_Formats: this.checkedText("Available_Formats", root),
Contributors: undefined,

      Website_Link: this.value("Website_Link", root),
      Amazon_Link: this.value("Amazon_Link", root),
      BN_Link: this.value("BN_Link", root),
      Bookfunnel_Link: this.value("Bookfunnel_Link", root),
      Kobo_Link: this.value("Kobo_Link", root),
      Apple_Books_Link: this.value("Apple_Books_Link", root),
      Other_Link: this.value("Other_Link", root),

      Has_Audiobook: this.value("Has_Audiobook", root) === "Yes",
      Audiobook_Narrators: this.value("Audiobook_Narrators", root),
      Audiobook_Link: this.value("Audiobook_Link", root),

      Kids_Category: this.value("Kids_Category", root),

      admin_notes: this.value("admin_notes", root),
      Contributors: window.ContributorPicker ? window.ContributorPicker.getValues() : undefined,
    };
  }
};