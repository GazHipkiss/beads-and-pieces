import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, items, total } = await req.json();

    await resend.emails.send({
      from: "Beads & Pieces <orders@beadsandpieces.com>",
      to: email,
      subject: "Your Order Confirmation",
      html: `
        <h2>Thank you for your order!</h2>
        <p>Here is your order summary:</p>
        <ul>
          ${items
            .map(
              (i) =>
                `<li>${i.quantity} × ${i.name} — £${i.price.toFixed(2)}</li>`
            )
            .join("")}
        </ul>
        <p><strong>Total: £${total.toFixed(2)}</strong></p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Email failed" }), {
      status: 500,
    });
  }
}
