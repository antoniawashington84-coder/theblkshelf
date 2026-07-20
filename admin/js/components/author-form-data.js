window.AuthorFormData = {
  read(root) {
    const value = name =>
      String(
        root.querySelector(`[name="${CSS.escape(name)}"]`)?.value || ""
      ).trim();

    return {
      AUTHOR_NAME: value("AUTHOR_NAME"),
      EMAIL_ADDRESS: value("EMAIL_ADDRESS"),
      GENRES: Array.from(
  root.querySelectorAll('input[name="AUTHOR_GENRES"]:checked')
)
  .map(input => input.value)
  .join(", "),
      WEBSITE: value("WEBSITE"),
      MAILING_LIST: value("MAILING_LIST"),
      BIO: value("BIO"),
      TIKTOK: value("TIKTOK"),
      FACEBOOK: value("FACEBOOK"),
      INSTAGRAM: value("INSTAGRAM"),
      SUBSTACK: value("SUBSTACK"),
      OTHER_SOCIALS: value("OTHER_SOCIALS"),
      Reason: value("Reason")
    };
  }
};