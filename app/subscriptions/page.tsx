"use client";

import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileSideMenu from "@/components/mobile/MobileSideMenu";
import MobileFooter from "@/components/mobile/MobileFooter";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import { useMobile } from "@/hooks/useMobile";
import { useState } from "react";
import { MoveLeft, Bell, Mail, TrendingUp, Filter, Check, ChevronDown, ChevronUp, UserPlus, LogIn, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const BLACK = "#111111";
const BG = "#f5f0eb";
const MUTED = "#666666";
const TERRACOTTA = "#d38b88";

const BEATS = [
  "Automotive", "Business", "Environment", "Geo Politics", 
  "Governance", "Law & Order", "Media", "Society", "Technology"
];

type Frequency = "Daily" | "Weekly" | "Monthly";

interface SubscriptionItem {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  frequency: Frequency;
}

const FrequencySelector = ({ 
  selected, 
  onChange 
}: { 
  selected: Frequency, 
  onChange: (f: Frequency) => void 
}) => {
  const frequencies: Frequency[] = ["Daily", "Weekly", "Monthly"];
  
  return (
    <div style={{ 
      display: "flex", 
      backgroundColor: "rgba(0,0,0,0.05)", 
      padding: "3px", 
      borderRadius: "8px",
      width: "fit-content"
    }}>
      {frequencies.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: "4px 12px",
            fontSize: "0.7rem",
            fontWeight: 600,
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            backgroundColor: selected === f ? "white" : "transparent",
            color: selected === f ? BLACK : MUTED,
            boxShadow: selected === f ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s ease",
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
};

const Toggle = ({ 
  enabled, 
  onToggle 
}: { 
  enabled: boolean, 
  onToggle: () => void 
}) => (
  <button 
    onClick={onToggle}
    style={{
      width: "44px",
      height: "24px",
      borderRadius: "12px",
      backgroundColor: enabled ? TERRACOTTA : "rgba(0,0,0,0.1)",
      border: "none",
      position: "relative",
      cursor: "pointer",
      transition: "background-color 0.3s ease"
    }}
  >
    <motion.div 
      animate={{ x: enabled ? 22 : 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "10px",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        position: "absolute",
        top: "2px",
        left: 0
      }}
    />
  </button>
);

const LoginCTA = ({ isMobile }: { isMobile: boolean }) => {
  const router = useRouter();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        padding: isMobile ? "32px 20px" : "32px 24px",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        marginTop: "16px",
        maxWidth: "540px",
        margin: "16px auto 0"
      }}
    >
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "24px",
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: BLACK,
        marginBottom: "0px"
      }}>
        <Bell size={24} />
      </div>
      
      <div>
        <h2 style={{ 
          fontFamily: "'DM Serif Display', serif", 
          fontSize: isMobile ? "1.3rem" : "1.6rem",
          color: BLACK,
          marginBottom: "2px"
        }}>
          Stay in the Loop
        </h2>
        <p style={{ 
          color: MUTED, 
          fontSize: "0.9rem", 
          maxWidth: "360px",
          lineHeight: 1.4,
          margin: "0 auto"
        }}>
          Join our community to personalize your notifications and never miss an update.
        </p>
      </div>

      <div style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        gap: "10px",
        width: isMobile ? "100%" : "auto",
        marginTop: "4px"
      }}>
        <button 
          onClick={() => router.push("/login?mode=register")}
          style={{
            backgroundColor: BLACK,
            color: "white",
            padding: "10px 24px",
            borderRadius: "10px",
            border: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
          className="btn-smooth"
        >
          <UserPlus size={16} /> Create Account
        </button>
        <button 
          onClick={() => router.push("/login?mode=login")}
          style={{
            backgroundColor: "white",
            color: BLACK,
            padding: "10px 24px",
            borderRadius: "10px",
            border: `1px solid ${BLACK}`,
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease"
          }}
          className="btn-smooth"
        >
          <LogIn size={16} /> Sign In
        </button>
      </div>
      
      <p style={{ fontSize: "0.75rem", color: MUTED, marginTop: "0px" }}>
        Already have an account? Log in to manage your preferences.
      </p>
    </motion.div>
  );
};

export default function SubscriptionsPage() {
  const router = useRouter();
  const isMobile = useMobile();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [beatsOpen, setBeatsOpen] = useState(false);
  
  const [subs, setSubs] = useState<SubscriptionItem[]>([
    { 
      id: "all", 
      title: "Any Post", 
      description: "Get notified every time a new piece is published across all formats.", 
      enabled: true, 
      frequency: "Daily" 
    },
    { 
      id: "formats", 
      title: "Article / Podcast / Short Reads", 
      description: "Specific updates for our main editorial content formats.", 
      enabled: false, 
      frequency: "Weekly" 
    },
    { 
      id: "trending", 
      title: "Trending Posts", 
      description: "The most viewed and discussed posts from the last 24 hours.", 
      enabled: true, 
      frequency: "Daily" 
    },
  ]);

  const [beatSubs, setBeatSubs] = useState<Record<string, { enabled: boolean, frequency: Frequency }>>(
    BEATS.reduce((acc, beat) => ({ ...acc, [beat]: { enabled: false, frequency: "Weekly" } }), {})
  );

  const toggleSub = (id: string) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const changeFreq = (id: string, f: Frequency) => {
    setSubs(prev => prev.map(s => s.id === id ? { ...s, frequency: f } : s));
  };

  const toggleBeat = (beat: string) => {
    setBeatSubs(prev => ({
      ...prev,
      [beat]: { ...prev[beat], enabled: !prev[beat].enabled }
    }));
  };

  const changeBeatFreq = (beat: string, f: Frequency) => {
    setBeatSubs(prev => ({
      ...prev,
      [beat]: { ...prev[beat], frequency: f }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "60vh",
          color: TERRACOTTA
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2 size={40} />
          </motion.div>
        </div>
      );
    }

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          maxWidth: "900px", 
          width: "100%", 
          margin: "0 auto", 
          padding: isMobile ? "20px" : "0px 20px 60px" 
        }}
      >
        <motion.div variants={itemVariants} style={{ marginBottom: "20px" }}>
          <button 
            onClick={() => router.push("/")} 
            className="btn-smooth"
            style={{ 
              background: "none", border: "1px solid #ddd", borderRadius: "8px",
              padding: "6px 12px", cursor: "pointer", fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "6px",
              color: BLACK, fontWeight: 600, marginBottom: "16px",
              backgroundColor: "white"
            }}
          >
            <MoveLeft size={16} /> Back to Home
          </button>
          
          <h1 style={{ 
            fontFamily: "'DM Serif Display', serif", 
            fontSize: isMobile ? "2rem" : "2.5rem", 
            color: BLACK, 
            marginBottom: "8px" 
          }}>
            Email Subscriptions
          </h1>
          <p style={{ color: MUTED, fontSize: "0.95rem", maxWidth: "500px" }}>
            Manage how and when you receive updates from <span style={{ whiteSpace: "nowrap" }}>Opinionated Kalam</span>.
          </p>
        </motion.div>

        {!user ? (
          <LoginCTA isMobile={isMobile} />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {subs.map((sub) => (
                <motion.div 
                  key={sub.id}
                  variants={itemVariants}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div style={{ flex: 1, paddingRight: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        {sub.id === "trending" ? <TrendingUp size={18} color={TERRACOTTA} /> : <Mail size={18} color={TERRACOTTA} />}
                        <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{sub.title}</h3>
                      </div>
                      <p style={{ color: MUTED, fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>{sub.description}</p>
                    </div>
                    <Toggle enabled={sub.enabled} onToggle={() => toggleSub(sub.id)} />
                  </div>
                  
                  <AnimatePresence>
                    {sub.enabled && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: MUTED }}>Frequency</span>
                          <FrequencySelector selected={sub.frequency} onChange={(f) => changeFreq(sub.id, f)} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Beats Section */}
              <motion.div 
                variants={itemVariants}
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
                }}
              >
                <div 
                  onClick={() => setBeatsOpen(!beatsOpen)}
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    cursor: "pointer" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Filter size={18} color={TERRACOTTA} />
                    <div>
                      <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Beats Category-wise</h3>
                      <p style={{ color: MUTED, fontSize: "0.9rem", margin: 0 }}>Subscribe to specific topics of interest.</p>
                    </div>
                  </div>
                  {beatsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>

                <AnimatePresence>
                  {beatsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                        {BEATS.map((beat) => (
                          <div key={beat} style={{ 
                            padding: "16px", 
                            borderRadius: "12px", 
                            backgroundColor: "#f9f8f6",
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            gap: "16px",
                            justifyContent: "space-between",
                            alignItems: isMobile ? "flex-start" : "center"
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <Toggle enabled={beatSubs[beat].enabled} onToggle={() => toggleBeat(beat)} />
                              <span style={{ fontWeight: 600, fontSize: "1rem" }}>{beat}</span>
                            </div>
                            
                            {beatSubs[beat].enabled && (
                              <FrequencySelector 
                                selected={beatSubs[beat].frequency} 
                                onChange={(f) => changeBeatFreq(beat, f)} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} style={{ marginTop: "48px", textAlign: "center" }}>
              <button 
                className="btn-smooth"
                style={{
                  backgroundColor: BLACK,
                  color: "white",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: isMobile ? "100%" : "auto"
                }}
                onClick={() => {
                  // Mock save
                  alert("Preferences saved successfully!");
                }}
              >
                Save Preferences
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    );
  };

  if (isMobile) {
    return (
      <div style={{ backgroundColor: BG, minHeight: "100vh" }}>
        <MobileSideMenu 
          isOpen={menuOpen} 
          onClose={() => setMenuOpen(false)} 
          onTabChange={(t) => router.push(`/?tab=${t}`)} 
          onBeatSelect={() => router.push("/")} 
        />
        <MobileHeader 
          activeTab="" 
          onTabChange={(t) => router.push(`/?tab=${t}`)} 
          onMenuOpen={() => setMenuOpen(true)} 
        />
        {renderContent()}
        <MobileFooter />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} onTabChange={(t) => router.push(`/?tab=${t}`)} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", flex: 1, width: "100%", backgroundColor: BG }}>
        <Header
          onMenuOpen={() => setMenuOpen(true)}
          activeTab=""
          onTabChange={(tab) => router.push(`/?tab=${tab}`)}
        />
        <main style={{ animation: "fadeIn 0.25s ease forwards" }}>
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}
