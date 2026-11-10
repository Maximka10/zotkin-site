(() => {
  const dialog = document.querySelector<HTMLDialogElement>('.ak-dialog');
  if (!dialog) return;
  const image = dialog.querySelector<HTMLImageElement>('.ak-dialog-image');
  const title = dialog.querySelector<HTMLElement>('.ak-dialog-title');
  const close = dialog.querySelector<HTMLButtonElement>('.ak-dialog-close');
  if (!image || !title || !close) return;
  document.querySelectorAll<HTMLButtonElement>('.ak-gallery-button').forEach(button => {
    button.addEventListener('click', () => {
      const original = button.querySelector<HTMLImageElement>('img');
      if (!original) return;
      image.src = original.src;
      image.alt = original.alt;
      title.textContent = original.alt;
      dialog.showModal();
    });
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
})();
