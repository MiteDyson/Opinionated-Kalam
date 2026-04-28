import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#151515] text-[#F8F8F8] pt-[60px] pb-[40px] mt-[80px]">
      <div className="max-w-[1100px] mx-auto px-6">
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
                { label: "Contact Us", href: "#" },
                { label: "Grievance Redressal", href: "/?tab=grievance" },
              ],
            },
            {
              title: "Learn",
              links: [
                { label: "Our Team", href: "/?tab=team" },
                { label: "About Us", href: "/?tab=about" },
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
          <div className="font-serif text-[clamp(2.5rem,7vw,5rem)] text-white leading-none">
            Opinionated Kalam
          </div>
          <p className="text-[#555555] text-[0.75rem] mt-4 font-sans">
            © {new Date().getFullYear()} Opinionated Kalam. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}