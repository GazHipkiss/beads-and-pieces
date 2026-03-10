export default function StripeSuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-serif mb-4 text-[#D4AF37]">
          Payment Successful
        </h1>
        <p className="text-gray-300">
          Thank you for your order. You’ll receive a confirmation email shortly.
        </p>
      </div>
    </main>
  );
}
