"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

const number = "+33756913013";
const message = "Bonjour YVEXOR, je souhaite vous présenter mon projet et échanger sur la solution la plus adaptée à mon besoin.";

export function SmsLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const androidHref = `sms:${number}?body=${encodeURIComponent(message)}`;
  function openSms(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const apple = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.location.href = apple ? `sms:${number}&body=${encodeURIComponent(message)}` : androidHref;
  }
  return <a {...props} href={androidHref} onClick={openSms}>{children}</a>;
}
