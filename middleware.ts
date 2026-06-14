import { NextRequest, NextResponse } from "next/server";

async function getSessionFromServer(req: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // meneruskan cookie dari browser ke Express
  const cookieHeader = req.headers.get("cookie") || "";

  try {
    // Panggil endpoint /api/auth/get-session (Bawaan Better Auth di backend kamu)
    const response = await fetch(`${apiUrl}/api/auth/get-session`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) return null;
    return await response.json(); // Mengembalikan object { session, user }
  } catch (error) {
    return error;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ambil session dari backend
  const sessionData = await getSessionFromServer(request);
  const user = sessionData?.user;

  // 2. Proteksi Rute /owner/*
  if (pathname.startsWith("/owner")) {
    if (!user) {
      // Belum login -> Lempar ke login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "owner") {
      // Login tapi bukan owner -> Lempar ke halaman unauthorized atau dashboard masing-masing
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Proteksi Rute /karyawan/*
  if (pathname.startsWith("/karyawan")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.role !== "karyawan") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // TAMBAHAN: Logika "Waiting Room" (Kasus Karyawan belum punya cabang)
    // Jika karyawan belum di assign cabang, jangan izinkan akses halaman operasional
    // Pastikan route /karyawan/waiting-room dikecualikan agar tidak infinite loop
    // if (!user.cabangId && !pathname.startsWith("/karyawan/waiting-room")) {
    //   return NextResponse.redirect(
    //     new URL("/karyawan/waiting-room", request.url),
    //   );
    // }
  }

  // 4. Mencegah user yang sudah login mengakses halaman /login
  if (pathname === "/login" && user) {
    if (user.role === "owner")
      return NextResponse.redirect(new URL("/owner/dashboard", request.url));
    if (user.role === "karyawan")
      return NextResponse.redirect(new URL("/karyawan/dashboard", request.url));
  }

  // Loloskan request jika aman
  return NextResponse.next();
}

// Tentukan rute mana saja yang HARUS melewati middleware ini
export const config = {
  matcher: [],
};
