"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Login = () => {
  const router = useRouter();
  return (
    <div className="h-screen w-screen flex cursor-pointer flex-col items-center justify-center text-center bg-[#11A37F]">
      <Image
        src="https://links.papareact.com/2i6"
        height={300}
        width={300}
        alt="logo"
      />
      <div
        onClick={() => signIn("google")}
        className="text-white font-bold text-3xl animate-pulse border border-solid border-white p-3 rounded-lg hover:border-solid max-md:text-sm"
      >
        Sign in to use Google Marker
      </div>
    </div>
  );
};

export default Login;
