/** Session storage key that carries a capture band's email to a contact form. */
export const CAPTURE_EMAIL_KEY = "xt-capture-email";

/** Keep the band's email for the next form; the email is never put in the URL. */
export function rememberCapturedEmail(email: string): void {
  try {
    sessionStorage.setItem(CAPTURE_EMAIL_KEY, email);
  } catch {
    // Storage is blocked: the visitor still reaches the form, with no prefill
    // and no error. The email is not logged.
  }
}

/** Put the band's email, once, into an empty email field. */
export function fillCapturedEmail(fieldId: string): void {
  try {
    const email = sessionStorage.getItem(CAPTURE_EMAIL_KEY);
    if (email === null) return;
    sessionStorage.removeItem(CAPTURE_EMAIL_KEY);
    const input = document.getElementById(fieldId);
    if (input instanceof HTMLInputElement && input.value === "") {
      input.value = email;
    }
  } catch {
    // Storage is blocked: the visitor still gets the form, without a prefill.
  }
}
