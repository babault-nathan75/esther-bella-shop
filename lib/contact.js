export const DEPOSIT_MINIMUM = "2 000 F";
export const DEPOSIT_CHANNELS = "Wave ou Orange Money";
export const DEPOSIT_PHONE = "+225 07 87 33 58 47";
export const DEPOSIT_TEL = "tel:+2250787335847";

export const depositWhatsApp = (orderNumber) => {
  const text = orderNumber
    ? `Bonjour, voici la capture de mon dépôt pour la commande ${orderNumber}.`
    : "Bonjour, voici la capture de mon dépôt de confirmation.";
  return `https://wa.me/2250787335847?text=${encodeURIComponent(text)}`;
};
