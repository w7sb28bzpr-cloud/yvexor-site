"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

const number = "+33756913013";
const message = "Bonjour YVEXOR, je souhaite vous présenter mon projet et échanger sur la solution la plus adaptée à mon besoin.";

export function SmsLink({ children, message: body = message, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { message?: string }) {
  const androidHref = `sms:${number}?body=${encodeURIComponent(body)}`;
  function openSms(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const apple = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.location.href = apple ? `sms:${number}&body=${encodeURIComponent(body)}` : androidHref;
  }
  return <a {...props} href={androidHref} onClick={openSms}>{children}</a>;
}
