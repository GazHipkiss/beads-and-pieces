"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 flex flex-col">

      <section className="flex-1 flex items-center justify-center pt-10">
        <div className="border-2 border-[#D4AF37] p-12 rounded-xl text-center animate-fadeInBox shadow-gold relative backdrop-blur-sm">
          <h1 className="text-6xl font-serif mb-6 pb-4 border-b-2 border-[#D4AF37] animate-fadeInUp delay-100">
            Beads & Pieces
          </h1>
          <p className="text-gray-300 text-xl animate-fadeInUp delay-300">
            Explore handcrafted jewellery.
          </p>
          <div className="absolute inset-0 pointer-events-none shimmer-mask"></div>
        </div>
      </section>

      <div className="flex justify-center mb-2">
        <div className="w-32 h-[2px] bg-[#D4AF37] animate-fadeInUp"></div>
      </div>

      <section className="max-w-3xl mx-auto text-center px-4 pb-6 mb-10 animate-fadeInUp delay-200">
        <h2 className="text-3xl font-serif mb-2 text-[#D4AF37]">
          About Me
        </h2>

        <p className="text-gray-300 text-lg leading-relaxed">
          Hi I'm Mel, I'm a passionate jewellery maker who creates
          each piece by hand with care, intention, and a love for detail.
          My work blends simplicity with elegance, offering meaningful pieces
          designed to be worn every day.
        </p>
      </section>

    </main>
  );
}
