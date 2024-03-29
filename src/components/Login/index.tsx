"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

const Login = () => {
  return (
    <div className="h-screen w-screen flex cursor-pointer flex-col items-center justify-center text-center bg-[#2bae66c2]">
      <Image src="/mapPin.png" height={120} width={120} alt="logo" />
      <div
        onClick={() => {
          signIn("google");
        }}
        className="text-white font-bold text-3xl mt-6 animate-pulse border border-solid border-white p-3 rounded-lg hover:border-solid max-md:text-sm"
      >
        Sign in to use Google Marker
      </div>
    </div>
  );
};

export default Login;
