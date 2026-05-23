import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type credential = {
  email: string;
  password: string;
};

type register = {
  name: string;
  email: string;
  password: string;
};

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    // 1. Definisikan fungsi loginnya
    mutationFn: async ({ email, password }: credential) => {
      const { data, error } = await signIn.email({ email, password });

      // Karena React Query butuh error dilempar (throw) agar status 'isError' aktif
      if (error) {
        throw new Error(error.message || "Email atau password salah");
      }

      return data; // Mengembalikan data session & user
    },

    // 2. Tentukan aksi setelah login sukses (handling redirect)
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user-session"] });
      const userRole = data.user.role;

      if (userRole === "owner") {
        router.push("/owner/dashboard");
      } else if (userRole === "karyawan") {
        router.push("/karyawan/dashboard");
      } else {
        router.push("/");
      }
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ name, email, password }: register) => {
      const { data, error } = await signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || "Gagal mendaftarkan akun");
      }

      return data;
    },

    onSuccess: () => {
      // Setelah sukses daftar, Better Auth biasanya otomatis men-login-kan user tersebut.
      // Karena rolenya otomatis 'karyawan' dan 'cabangId'-nya masih null,
      // kita bisa langsung arahkan ke Ruang Tunggu (Waiting Room) yang kita bahas tadi.
      router.push("/login");
    },
  });
}

export function useUserSession() {
  return useQuery({
    queryKey: ["user-session"],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();
      if (error) return null;
      return data;
    },
    // set jadi 5 menit (atau bahkan 15 menit jika aplikasinya tidak terlalu sensitif)
    staleTime: 5 * 60 * 1000,

    retry: false,
  });
}
