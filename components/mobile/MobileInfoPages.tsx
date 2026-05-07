import React from "react";
import { MoveLeft } from "lucide-react";

const BLACK = "#111111";
const BORDER = "#e0d8d0";

export function MobileAboutView({ onTabChange }: { onTabChange: (t: string) => void }) {
  return (
    <div className="py-[10px] pb-[40px]">
      <div className="flex items-center mb-6">
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: BLACK, whiteSpace: "nowrap" }}><MoveLeft size={14} /> Back</button>
      </div>

      <h1 className="font-serif text-[2.2rem] font-normal text-[#111111] m-0 mb-[30px] leading-[1.1]">
        Learn What, Why & Who
      </h1>

      <div className="space-y-[1.2em]">
        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">
          What is <span className="font-serif font-normal">Opinionated Kalam</span>?
        </h2>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          Opinionated Kalam is an Independent Journalism platform made to cater the audience with appropriate, rational, and logic-driven perspectives on vast topics.
        </p>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          It moves forward with an approach fueled by Curiosity, which helps the platform cover the topics that are actually Important and Need to be shed light upon.
        </p>

        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">
          Why is <span className="font-serif font-normal">Opinionated Kalam</span>?
        </h2>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          The Conventional Media has created unnecessary chaos around your ears, further not letting you focus on what is more important.
        </p>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          We help you learn, grow, and understand the requisite while serving to your Curiosity with a pinch of Entertainment.
        </p>

        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">
          Why Choose Us?
        </h2>
        <h3 className="font-['Radley',_serif] italic text-[1.1rem] font-normal text-[#111111] mt-[1.5em] mb-[0.8em]">
          We Play Fair!
        </h3>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          We, at Opinionated Kalam, present opinions/perspectives that are not partial, but are Balanced, Fair, and those that are pushed by Truth.
        </p>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          Just learning what has happened might seem too basic, but doing the same with various perspectives presented would help you evaluate the nucleus better!
        </p>

        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">
          When & by Whom was<br /><span className="font-serif font-normal">Opinionated Kalam</span><br />established?
        </h2>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          Opinionated Kalam got established in 2026 by Vineet Mestry, a Journalism student with a drive and plenty of passion to make it better for the audience.
        </p>
      </div>

      <div className="text-center mt-[40px]">
        <button
          onClick={() => onTabChange("team")}
          className="bg-none border-none font-sans text-[0.85rem] text-[#111111] px-[20px] py-[10px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          Go through <span className="underline">Our Team</span> →
        </button>
      </div>
    </div>
  );
}

export function MobileGrievanceView({ onTabChange }: { onTabChange: (t: string) => void }) {
  return (
    <div className="py-[10px] pb-[40px]">
      <div className="flex items-center mb-6">
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: BLACK, whiteSpace: "nowrap" }}><MoveLeft size={14} /> Back</button>
      </div>

      <h1 className="font-serif text-[2.2rem] font-normal text-[#111111] m-0 mb-[30px] leading-[1.1]">
        Grievance Redressal
      </h1>

      <div className="space-y-[1.2em] font-['Radley',_serif] text-[1.1rem] text-[#1a1a1a] leading-[1.6]">
        <p>We, at Opinionated Kalam, believe in providing content with utmost Honesty, Transparency, and Accuracy.</p>
        <p>We understand spreading awareness requires Trust, and trust requires Accountability.</p>
        <p>If you believe any format of our content has fallen short in terms of our principles mentioned above, we have a structured mechanism in place to address and resolve your concerns promptly.</p>

        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">What Constitutes a Grievance?</h2>
        <p>You can file a formal Grievance regarding the content published on our Website & Social Media Channels if it involves this -</p>
        <ul className="pl-[1.5em] my-[1em] space-y-4">
          <li><span className="underline">Factual Inaccuracies</span> - Demonstrable errors in data, quotes, or historical facts.</li>
          <li><span className="underline">Misleading Information</span> - Data or context presented in a way that distorts the truth.</li>
          <li><span className="underline">Ethical Violations</span> - Breaches of standard Journalistic ethics, including issues related to privacy, plagiarism, or conflict of interest.</li>
        </ul>

        <p className="text-[#D92323] italic">Note - Disagreements with opinions/perspectives do not constitute a formal grievance, unless they contain factual errors.</p>

        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">How to File a Grievance?</h2>
        <p>To ensure your concern is addressed efficiently, please submit your grievance in writing via email.</p>

        <p><span className="underline">Send your email to</span> - [Insert Grievance Email]</p>
        <p><span className="underline">Subject Line</span> - Grievance regarding [Insert Title of Article/Podcast/ Short Article]</p>

        <p>Please include the following details in your email -</p>
        <ul className="pl-[1.5em] my-[1em] space-y-4">
          <li>Your Full Name and Contact Information.</li>
          <li>The Exact Link (URL) to the specific article, podcast, short article in question.</li>
          <li><span className="underline">The Specific Concern</span> - Quote the exact text or timestamp the audio you are disputing.</li>
          <li><span className="underline">Supporting Evidence</span> - Provide verifiable data, documents, or links that demonstrate why the content is inaccurate or violates our standards.</li>
        </ul>

        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">Our Resolution Process</h2>
        <p>We treat every valid complaint with the seriousness it deserves. Here is what you can expect once you submit a grievance -</p>
        <ul className="pl-[1.5em] my-[1em] space-y-4">
          <li><span className="underline">Acknowledgement</span> - You will receive a confirmation of receipt from our team within 24 hours.</li>
          <li><span className="underline">Investigation</span> - Our editorial team, independent of the original author, will review the provided evidence against our reporting data.</li>
          <li><span className="underline">Resolution</span> - We aim to resolve all grievances within 15 days of receipt.</li>
          <li><span className="underline">Action</span> - If a factual error is found, we will immediately update the content and append a clear, transparent \"Correction\" note at the bottom of the article detailing what was changed and when.</li>
        </ul>

        <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mt-[2em] mb-[0.8em] tracking-[-0.02em] leading-[1.3]">Grievance Redressal Officer</h2>
        <p>In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the Grievance Officer are provided below -</p>
        <div className="mt-4">
          <span className="underline">Name </span>- [Insert Officer's Name]<br />
          <span className="underline">Designation </span>- Grievance Redressal Officer<br />
          <span className="underline">Email </span>- [Insert Dedicated Email]<br />
          <span className="underline">Working Hours</span> - Monday to Friday, 10:00 AM to 6:00 PM (IST)
        </div>
      </div>

      <div className="text-center mt-[40px]">
        <button
          onClick={() => onTabChange("team")}
          className="bg-none border-none font-sans text-[0.85rem] text-[#111111] px-[20px] py-[10px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          Go through <span className="underline">Our Team</span> →
        </button>
      </div>
    </div>
  );
}

export function MobileTeamView({ onTabChange }: { onTabChange: (t: string) => void }) {
  return (
    <div className="py-[10px] pb-[40px]">
      <div className="flex items-center mb-6">
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: BLACK, whiteSpace: "nowrap" }}><MoveLeft size={14} /> Back</button>
      </div>

      <h1 className="font-serif text-[2.8rem] font-normal text-[#111111] m-0 mb-[30px] text-center">
        Our Team
      </h1>

      <div className="space-y-[40px]">
        <div className="font-['Radley',_serif] text-[1.15rem] leading-[1.5] text-[#111111] mb-10">
          Opinionated Kalam is run by two lads filled with immense passion for their own respective fields →
        </div>

        <div className="mb-[50px]">
          <h2 className="font-sans text-[1.8rem] font-normal text-[#111111] m-0 mb-1 tracking-[-0.02em]">Vineet Mestry</h2>
          <span className="font-['Radley',_serif] text-[1.1rem] text-[#111111] block mb-5">Founder & Writer</span>
          <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a] ml-5 mb-3">
            Vineet is a Journalism student and the voice behind the investigations you read here. He created this space to focus on deep-dive reporting and honest analysis. His goal is simple: to stop the spread of noise and start providing factual stories that spark curiosity and solve problems.
          </p>
          <div className="font-['Radley',_serif] text-[1.1rem] text-[#111111] ml-5">
            Contact - <a href="mailto:workingvineet@gmail.com" className="text-[#111111] underline">workingvineet@gmail.com</a>
          </div>
        </div>

        <div className="mb-[50px]">
          <h2 className="font-sans text-[1.8rem] font-normal text-[#111111] m-0 mb-1 tracking-[-0.02em]">Mitesh Shetye</h2>
          <span className="font-['Radley',_serif] text-[1.1rem] text-[#111111] block mb-5">Founder & Developer</span>
          <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a] ml-5 mb-3">
            Mitesh is the developer behind the platform you interact with here. He built this space to focus on scalable full-stack solutions and production-ready engineering. His goal is simple: to stop relying on boilerplate code and start delivering custom systems that solve real problems and create seamless user experiences.
          </p>
          <div className="font-['Radley',_serif] text-[1.1rem] text-[#111111] ml-5">
            Contact - <a href="mailto:mitesh.shetye154@hgmail.com" className="text-[#111111] underline">mitesh.shetye154@hgmail.com</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-[60px] flex flex-col gap-[15px]">
        <a href="/terms" className="no-underline">
          <button className="bg-none border-none font-sans text-[0.85rem] text-[#111111] p-[5px] cursor-pointer">
            Go through <span className="underline">Terms of Service</span> →
          </button>
        </a>
        <a href="/privacy" className="no-underline">
          <button className="bg-none border-none font-sans text-[0.85rem] text-[#111111] p-[5px] cursor-pointer">
            Go through <span className="underline">Privacy Policy</span> →
          </button>
        </a>
      </div>
    </div>
  );
}

export function MobileContactView({ onTabChange }: { onTabChange: (t: string) => void }) {
  return (
    <div className="py-[10px] pb-[40px]">
      <div className="flex items-center mb-6">
        <button onClick={() => onTabChange("home")} style={{ background: "none", border: "1px solid rgb(221, 221, 221)", borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", color: BLACK, whiteSpace: "nowrap" }}><MoveLeft size={14} /> Back</button>
      </div>

      <h1 className="font-serif text-[2.8rem] font-normal text-[#111111] m-0 mb-[35px] text-center">
        Contact Us
      </h1>

      <div className="space-y-[1.8em]">
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          Have a question, a news tip, or just want to talk about one of our investigations? We value direct communication and honest feedback.
        </p>
        <p className="font-['Radley',_serif] text-[1.1rem] leading-[1.6] text-[#1a1a1a]">
          Since we are a small, independent team, reaching out via email is the best way to get a timely response.
        </p>

        <div className="pt-4">
          <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mb-[0.6em] tracking-[-0.02em] flex items-center gap-2">
            General Enquiries <span className="text-[1.2rem]">→</span>
          </h2>
          <p className="font-['Radley',_serif] text-[1.05rem] leading-[1.6] text-[#1a1a1a] mb-3">
            For general questions about our platform, Partnership Ideas, or just want to say “Hello!”.
          </p>
          <div className="font-['Radley',_serif] text-[1.05rem] text-[#111111]">
            Email - <a href="mailto:hello@opinionatedkalam.com" className="text-[#111111] underline">hello@opinionatedkalam.com</a>
          </div>
        </div>

        <div className="pt-4">
          <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mb-[0.6em] tracking-[-0.02em] flex items-center gap-2">
            Report an Error <span className="text-[1.2rem]">→</span>
          </h2>
          <p className="font-['Radley',_serif] text-[1.05rem] leading-[1.6] text-[#1a1a1a] mb-3">
            Accuracy is our top priority, if you spot a factual error in any of our articles or podcasts, please let us know immediately so we can fix it.
          </p>
          <p className="font-['Radley',_serif] text-[1.05rem] leading-[1.6] text-[#1a1a1a]">
            For formal complaints, please visit our <button onClick={() => onTabChange("grievance")} className="bg-none border-none p-0 underline font-['Radley',_serif] text-[1.05rem] cursor-pointer">Grievance Redressal</button> page.
          </p>
        </div>

        <div className="pt-4">
          <h2 className="font-sans text-[1.35rem] font-normal text-[#111111] mb-[0.6em] tracking-[-0.02em] flex items-center gap-2">
            Want to Collaborate/Advertise <span className="text-[1.2rem]">→</span>
          </h2>
          <p className="font-['Radley',_serif] text-[1.05rem] leading-[1.6] text-[#1a1a1a] mb-3">
            We welcome incredible ideas with utmost honesty and respect, and if you want to advertise your brand, product, etc, you may contact us through this email.
          </p>
          <div className="font-['Radley',_serif] text-[1.05rem] text-[#111111]">
            Email - <a href="mailto:business@opinionatedkalam.com" className="text-[#111111] underline">business@opinionatedkalam.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}
