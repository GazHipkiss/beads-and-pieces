import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function AdminLayout({ children }) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="p-4 border-b border-neutral-800 flex justify-between">
        <span className="font-bold">Admin Dashboard</span>
        <form action="/auth/signout" method="post">
          <button className="text-yellow-500">Logout</button>
        </form>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}
