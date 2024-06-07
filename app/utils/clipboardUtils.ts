export const copyToClipboard = (text: any) => {
  const textToCopy = typeof text === 'object' ? JSON.stringify(text, null,0) : text;
  console.log("cdcw"+textToCopy);

  navigator.clipboard.writeText(textToCopy).then(() => {
    showMessage('Copié dans le presse-papiers !');
  }).catch(err => {
    console.error('Échec de la copie : ', err);
  });
};


function showMessage(message: string) {
  const messageElement = document.createElement('span');
  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, 2000); // Supprimer le message après 2 secondes
}
