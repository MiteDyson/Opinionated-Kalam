import React from "react";

const BLACK  = "#111111";
const BORDER = "#e0d8d0";

export function MobileAboutView({ onTabChange }: { onTabChange: (t: string) => void }) {
  return (
    <div style={{ padding: "10px 0 40px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <button onClick={() => onTabChange("home")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: BLACK, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
      </div>

      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", fontWeight: 400, color: BLACK, margin: "0 0 30px", lineHeight: 1.1 }}>
        Learn What, Why & Who
      </h1>

      <style>{`
        .about-body p {
          font-family: 'Radley', serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0 0 1.2em;
        }
        .about-body h2 {
          font-family: 'Inter', sans-serif;
          font-size: 1.35rem;
          font-weight: 400;
          color: #111;
          margin: 2em 0 0.8em;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }
        .about-body .serif-brand {
          font-family: 'DM Serif Display', serif;
          font-weight: 400;
        }
        .about-body h3 {
          font-family: 'Radley', serif;
          font-style: italic;
          font-size: 1.1rem;
          font-weight: 400;
          color: #111;
          margin: 1.5em 0 0.8em;
        }
      `}</style>

      <div className="about-body">
        <h2>What is <span className="serif-brand">Opinionated Kalam</span>?</h2>
        <p>Opinionated Kalam is an Independent Journalistic platform made to cater the audience with appropriate, rational, and logic-driven perspectives towards vast topics.</p>
        <p>It moves forward with an approach fueled by Curiosity, which helps the platform cover the topics that are actually Important and Need to be shed light upon.</p>

        <h2>Why is <span className="serif-brand">Opinionated Kalam</span>?</h2>
        <p>The Conventional Media has created unnecessary chaos around your ears, further not letting you focus on what is more important.</p>
        <p>We help you learn, grow, and understand the requisite while serving to your Curiosity with a pinch of Entertainment.</p>

        <h2>Why Choose Us?</h2>
        <h3>We Play Fair!</h3>
        <p>We, at Opinionated Kalam, present opinions/perspectives that are not partial, but are <em>Balanced</em>, <em>Fair</em>, and those that are pushed by <em>Truth</em>.</p>
        <p>It moves forward with an approach fueled by Curiosity, which helps the platform cover the topics that are actually Important and Need to be shed light upon.</p>

        <h2>When & by Whom was<br/><span className="serif-brand">Opinionated Kalam</span><br/>established?</h2>
        <p>Opinionated Kalam got established in <em>2026</em> by <em>Vineet Mestry</em> with plenty of passion for Journalism.</p>
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button style={{ background: "none", border: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#111", padding: "10px 20px" }}>
          Go through <span style={{ textDecoration: "underline" }}>Our Team</span> →
        </button>
      </div>
    </div>
  );
}

export function MobileGrievanceView({ onTabChange }: { onTabChange: (t: string) => void }) {
  return (
    <div style={{ padding: "10px 0 40px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <button onClick={() => onTabChange("home")} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: BLACK, background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}>← Home</button>
      </div>

      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "2.2rem", fontWeight: 400, color: BLACK, margin: "0 0 30px", lineHeight: 1.1 }}>
        Grievance Redressal
      </h1>

      <style>{`
        .grievance-body p {
          font-family: 'Radley', serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #1a1a1a;
          margin: 0 0 1.2em;
        }
        .grievance-body h2 {
          font-family: 'Inter', sans-serif;
          font-size: 1.35rem;
          font-weight: 400;
          color: #111;
          margin: 2em 0 0.8em;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }
        .grievance-body ul {
          padding-left: 1.5em;
          margin: 1em 0 1.5em;
          font-family: 'Radley', serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #1a1a1a;
        }
        .grievance-body li {
          margin-bottom: 1em;
        }
        .grievance-body .note {
          color: #D92323;
          font-style: italic;
        }
        .grievance-body .ul-label {
          text-decoration: underline;
        }
      `}</style>

      <div className="grievance-body">
        <p>We, at Opinionated Kalam, believe in providing content with utmost Honesty, Transparency, and Accuracy.</p>
        <p>We understand spreading awareness requires Trust, and trust requires Accountability.</p>
        <p>If you believe any format of our content has fallen short in terms of our principles mentioned above, we have a structured mechanism in place to address and resolve your concerns promptly.</p>

        <h2>What Constitutes a Grievance?</h2>
        <p>You can file a formal Grievance regarding the content published on our Website & Social Media Channels if it involves this -</p>
        <ul>
          <li><span className="ul-label">Factual Inaccuracies</span> - Demonstrable errors in data, quotes, or historical facts.</li>
          <li><span className="ul-label">Misleading Information</span> - Data or context presented in a way that distorts the truth.</li>
          <li><span className="ul-label">Ethical Violations</span> - Breaches of standard Journalistic ethics, including issues related to privacy, plagiarism, or conflict of interest.</li>
        </ul>

        <p className="note">Note - Disagreements with opinions/perspectives do not constitute a formal grievance, unless they contain factual errors.</p>

        <h2>How to File a Grievance?</h2>
        <p>To ensure your concern is addressed efficiently, please submit your grievance in writing via email.</p>
        
        <p><span className="ul-label">Send your email to</span> - [Insert Grievance Email]</p>
        <p><span className="ul-label">Subject Line</span> - Grievance regarding [Insert Title of Article/Podcast/ Short Article]</p>
        
        <p>Please include the following details in your email -</p>
        <ul>
          <li>Your Full Name and Contact Information.</li>
          <li>The Exact Link (URL) to the specific article, podcast, short article in question.</li>
          <li><span className="ul-label">The Specific Concern</span> - Quote the exact text or timestamp the audio you are disputing.</li>
          <li><span className="ul-label">Supporting Evidence</span> - Provide verifiable data, documents, or links that demonstrate why the content is inaccurate or violates our standards.</li>
        </ul>

        <h2>Our Resolution Process</h2>
        <p>We treat every valid complaint with the seriousness it deserves. Here is what you can expect once you submit a grievance -</p>
        <ul>
          <li><span className="ul-label">Acknowledgement</span> - You will receive a confirmation of receipt from our team within 24 hours.</li>
          <li><span className="ul-label">Investigation</span> - Our editorial team, independent of the original author, will review the provided evidence against our reporting data.</li>
          <li><span className="ul-label">Resolution</span> - We aim to resolve all grievances within 15 days of receipt.</li>
          <li><span className="ul-label">Action</span> - If a factual error is found, we will immediately update the content and append a clear, transparent "Correction" note at the bottom of the article detailing what was changed and when.</li>
        </ul>

        <h2>Grievance Redressal Officer</h2>
        <p>In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of the Grievance Officer are provided below -</p>
        <p style={{ margin: "1em 0 0" }}>
          <span className="ul-label">Name </span>- [Insert Officer's Name]<br/>
          <span className="ul-label">Designation </span>- Grievance Redressal Officer<br/>
          <span className="ul-label">Email </span>- [Insert Dedicated Email]<br/>
          <span className="ul-label">Working Hours</span> - Monday to Friday, 10:00 AM to 6:00 PM (IST)
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button style={{ background: "none", border: "none", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#111", padding: "10px 20px" }}>
          Go through <span style={{ textDecoration: "underline" }}>Our Team</span> →
        </button>
      </div>
    </div>
  );
}
