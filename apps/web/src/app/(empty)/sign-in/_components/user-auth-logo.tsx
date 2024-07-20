import Image from "next/image";
import React from "react";

export const UserAuthLogo = () => {
  return (
    <Image
      src="/logo.png"
      alt="Valhalla"
      width={0}
      height={0}
      sizes="100vw"
      className="w-full h-auto invert"
    />
  );
};
