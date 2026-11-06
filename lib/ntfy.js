import { formatPrice, orderNumber } from "@/lib/shop";

// Prévient l'admin via ntfy. Une panne de notification ne doit jamais bloquer une commande.
export async function notifyNewOrder(order, siteUrl) {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    console.warn("[ntfy] NTFY_TOPIC absent : notification ignorée");
    return false;
  }

  const items = order.cartProducts
    .map((item) => {
      const size = item.selectedSize ? ` (${item.selectedSize})` : "";
      const tag = item.kind === "confection" ? " [à confectionner]" : "";
      return `• ${item.title}${size}${tag} : ${formatPrice(item.price)}`;
    })
    .join("\n");
  const shipping = order.shippingPending ? "à confirmer" : formatPrice(order.shippingCost);

  const headers = { "Content-Type": "application/json" };
  if (process.env.NTFY_TOKEN) headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`;

  try {
    const response = await fetch(process.env.NTFY_URL || "https://ntfy.sh", {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        topic,
        title: `Nouvelle commande ${orderNumber(order._id)} : ${formatPrice(order.total)}`,
        message: [
          `${order.name} • ${order.phone}`,
          `${order.city} • ${order.address}`,
          `Paiement : ${order.paymentMethod}`,
          "",
          items,
          `Livraison : ${shipping}`,
        ].join("\n"),
        tags: ["shopping_bags"],
        priority: 4,
        click: `${siteUrl}/admin/orders`,
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error("[ntfy] Échec de la notification :", error.message);
    return false;
  }
}
