import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-[80px] px-6">
      {/* Contained card — same max-width as header, with rounded corners */}
      <div className="max-w-[1100px] mx-auto bg-[#151515] text-[#F8F8F8] rounded-t-2xl pt-[60px] pb-[40px] px-10">
        <div className="flex justify-center gap-[120px] mb-[80px]">
          {[
            {
              title: "Legal",
              links: [
                { label: "Terms of Service", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
              ],
            },
            {
              title: "Connect",
              links: [
                { label: "Grievance Redressal", href: "/grievance" },
                { label: "Contact Us", href: "/contact" },
              ],
            },
            {
              title: "Learn",
              links: [
                { label: "Our Team", href: "/team" },
                { label: "About Us", href: "/about" },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="text-center">
              <h3 className="font-sans font-bold text-base mb-5 text-white">
                {col.title}
              </h3>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#888888] text-[0.88rem] font-sans no-underline transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/" className="flex items-center justify-center gap-4 mb-6 no-underline hover:opacity-90 transition-opacity">
            <img
              src="/logo_footer.png"
              alt="OK Footer Logo"
              style={{ height: "clamp(3.5rem, 8vw, 5rem)", width: "auto" }}
            />
            <div
              className="font-serif text-white leading-none tracking-[-0.5px]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
            >
              Opinionated Kalam
            </div>
          </Link>
          <p className="text-[#555555] text-[0.75rem] font-sans">
            © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}