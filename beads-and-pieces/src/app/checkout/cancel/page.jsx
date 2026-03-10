export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-serif mb-4 text-red-400">
          Payment Cancelled
        </h1>
        <p className="text-gray-300">
          Your payment was cancelled. You can return to your cart and try again.
        </p>
      </div>
    </main>
  );
}
