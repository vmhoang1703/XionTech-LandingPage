// Opens an app's detail dialog (rendered by ProductDetail in the showcase)
// and gives focus back to the control that opened it when it closes.
export function openAppDialog(anchor: string, opener: HTMLElement) {
  const dialog = document.getElementById(`pd-${anchor}`);
  if (!(dialog instanceof HTMLDialogElement)) return false;
  dialog.showModal();
  dialog.addEventListener("close", () => opener.focus(), { once: true });
  return true;
}
