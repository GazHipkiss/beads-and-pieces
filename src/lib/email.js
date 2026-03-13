import { Resend } from "resend";

let _resend = null;

function getResend() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    _resend = new Resend(key);
  }
  return _resend;
}

export async function sendOrderConfirmation({ email, name, orderNumber, items, subtotal, shipping, total }) {
  const resend = getResend();
  if (!resend) {
    console.warn("Resend not configured, skipping order confirmation email");
    return;
  }

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">£${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Georgia, serif; color: #333;">
      <div style="background: #000; padding: 30px; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 28px; letter-spacing: 2px;">Beads & Pieces</h1>
      </div>

      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #D4AF37; margin-top: 0;">Thank you for your order${name ? `, ${name}` : ""}!</h2>

        <p style="color: #666; line-height: 1.6;">
          Your order <strong>#${orderNumber}</strong> has been received and is being prepared with care.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="border-bottom: 2px solid #D4AF37;">
              <th style="padding: 8px 0; text-align: left; color: #D4AF37;">Item</th>
              <th style="padding: 8px 0; text-align: center; color: #D4AF37;">Qty</th>
              <th style="padding: 8px 0; text-align: right; color: #D4AF37;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <div style="text-align: right; margin-top: 16px;">
          <p style="margin: 4px 0; color: #666;">Subtotal: £${subtotal.toFixed(2)}</p>
          <p style="margin: 4px 0; color: #666;">Shipping: ${shipping > 0 ? `£${shipping.toFixed(2)}` : "Free"}</p>
          <p style="margin: 8px 0 0; font-size: 18px; color: #D4AF37; font-weight: bold;">Total: £${total.toFixed(2)}</p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="color: #666; font-size: 14px; line-height: 1.6;">
          We&rsquo;ll get your beautiful pieces packed and sent out as soon as possible.
          If you have any questions, reply to this email or message us on
          <a href="https://instagram.com/beads_n_pieces_25" style="color: #D4AF37;">Instagram</a>.
        </p>
      </div>

      <div style="background: #000; padding: 20px; text-align: center;">
        <p style="color: #D4AF37; margin: 0; font-size: 12px; font-style: italic;">Made by Mel</p>
        <p style="color: #666; margin: 4px 0 0; font-size: 11px;">&copy; ${new Date().getFullYear()} Beads & Pieces. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Beads & Pieces <onboarding@resend.dev>",
      to: email,
      subject: `Order Confirmation #${orderNumber} - Beads & Pieces`,
      html,
    });
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
}

export async function sendAdminOrderNotification({ orderNumber, customerName, customerEmail, total, items }) {
  const resend = getResend();
  if (!resend) return;

  const itemList = items.map((i) => `• ${i.name} x${i.quantity}`).join("\n");

  try {
    await resend.emails.send({
      from: "Beads & Pieces <onboarding@resend.dev>",
      to: "onboarding@resend.dev",
      subject: `New Order #${orderNumber}!`,
      text: `New order received!\n\nOrder: #${orderNumber}\nCustomer: ${customerName || "N/A"}\nEmail: ${customerEmail}\nTotal: £${total.toFixed(2)}\n\nItems:\n${itemList}`,
    });
  } catch (err) {
    console.error("Failed to send admin notification:", err);
  }
}
