"use client";

import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<any>(null);

  console.log(session);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = (await getProviders()) as any;
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/"); // redirect to home after successful login
    }
  }, [status, router]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center px-6 py-2">
      <Link href="/">
        <h1 className="text-3xl font-bold mb-8 text-center">TOP TUTOR</h1>
      </Link>

      {!session ? (
        providers &&
        Object.values(providers).map((provider, idx) => {
          const typedProvider = provider as { id: string; name: string };
          return (
            <button
              key={idx}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => signIn(typedProvider.id)}
            >
              Register or Sign In with {typedProvider.name}
            </button>
          );
        })
      ) : (
        <div className="flex items-center gap-4">
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default SignIn;
