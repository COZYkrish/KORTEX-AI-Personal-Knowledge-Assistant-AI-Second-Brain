"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Palette, Shield, Database,
  Moon, Sun, Check, ChevronRight, Sparkles,
  Globe, Mail, Smartphone, KeyRound, Download,
  Trash2, ExternalLink,
} from "lucide-react";
import { B } from "@/lib/bauhaus";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations & API", icon: Shield },
  { id: "data", label: "Data & Privacy", icon: Database },
];

function Toggle({ enabled, onChange, id }: { enabled: boolean; onChange: (v: boolean) => void; id?: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 border-2 border-[#121212] transition-colors duration-200 cursor-pointer rounded-none ${
        enabled ? "bg-[#1040C0]" : "bg-white"
      }`}
    >
      <div
        className={`absolute top-[2px] w-4 h-4 border border-[#121212] bg-white transition-all ${
          enabled ? "left-[24px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b-2 border-dashed border-[#121212] last:border-0">
      <div className="flex-1 min-w-0 mr-6">
        <p className="text-sm font-extrabold text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>{label}</p>
        {description && <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-[#121212] p-6 shadow-[4px_4px_0px_0px_#121212] rounded-none">
      <h3 className="text-lg font-black uppercase tracking-tight text-[#121212] border-b-2 border-[#121212] pb-3 mb-4" style={B.displayStyle}>{title}</h3>
      <div className="divide-y divide-[#121212]">{children}</div>
    </div>
  );
}

const INTEGRATIONS = [
  {
    name: "Google Gemini",
    description: "AI model for chat, generation, and embeddings",
    status: "connected",
    color: B.BLUE,
    icon: Sparkles,
  },
  {
    name: "Neon PostgreSQL",
    description: "Primary database with pgvector extension",
    status: "connected",
    color: B.RED,
    icon: Database,
  },
  {
    name: "Clerk Auth",
    description: "User authentication and session management",
    status: "connected",
    color: B.YELLOW,
    icon: Shield,
  },
  {
    name: "Vercel Blob Storage",
    description: "File storage for uploaded documents",
    status: "not_configured",
    color: B.BLUE,
    icon: ExternalLink,
  },
  {
    name: "Redis / BullMQ",
    description: "Background job queue for document processing",
    status: "not_configured",
    color: B.RED,
    icon: ExternalLink,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile settings
  const [displayName, setDisplayName] = useState("Explorer");
  const [language, setLanguage] = useState("en");

  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState("#1040C0");
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Notifications
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [quizReminders, setQuizReminders] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [documentProcessed, setDocumentProcessed] = useState(true);

  const [saved, setSaved] = useState(false);
  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const ACCENT_COLORS = [B.BLUE, B.RED, B.YELLOW, "#121212"];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-[#121212]" style={B.displayStyle}>
            Settings
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mt-1" style={B.labelStyle}>
            Manage your account configurations and user preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          id="save-settings-button"
          className="inline-flex items-center justify-center gap-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#121212] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none px-5 py-3 self-start sm:self-center"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {saved ? <Check className="w-4.5 h-4.5 text-[#F0C020]" /> : <Settings className="w-4.5 h-4.5 text-white" />}
          <span>{saved ? "Changes Saved!" : "Save Changes"}</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-1 space-y-3"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 border-2 text-left transition-all rounded-none cursor-pointer font-black uppercase text-xs tracking-wider shadow-[3px_3px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#121212] ${
                  isSelected
                    ? "bg-[#1040C0] text-white border-black"
                    : "bg-white text-[#121212] border-black hover:bg-gray-50"
                }`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isSelected ? "text-white" : "text-[#1040C0]"}`} />
                <span>{tab.label}</span>
                {isSelected && <ChevronRight className="w-4 h-4 ml-auto text-white" />}
              </button>
            );
          })}
        </motion.div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* PROFILE */}
          {activeTab === "profile" && (
            <>
              <SectionCard title="Personal Information">
                <SettingRow label="Display Name" description="Used for greeting and references">
                  <input
                    id="display-name-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="px-3 py-2 border-2 border-[#121212] bg-white text-[#121212] text-sm font-semibold rounded-none focus:outline-none focus:bg-gray-50 w-44 shadow-[2px_2px_0px_0px_#121212]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  />
                </SettingRow>
                <SettingRow label="Language" description="Choose interface locale">
                  <div className="relative inline-block w-44">
                    <select
                      id="language-select"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-[#121212] bg-white text-[#121212] text-sm font-semibold rounded-none focus:outline-none focus:bg-gray-50 shadow-[2px_2px_0px_0px_#121212] cursor-pointer"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </SettingRow>
              </SectionCard>

              <SectionCard title="Account Integration">
                <SettingRow label="Email Address" description="Managed via Clerk authentication">
                  <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-xs" style={B.labelStyle}>
                    <Mail className="w-4 h-4 text-[#121212]" />
                    <span>via Clerk</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#121212]" />
                  </div>
                </SettingRow>
                <SettingRow label="Password & Security" description="Verify credentials through authentication manager">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] hover:bg-gray-55 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <KeyRound className="w-4 h-4 text-[#121212]" />
                    Manage Clerk
                  </button>
                </SettingRow>
                <SettingRow label="Active Sessions" description="Devices authenticated to Kortex AI">
                  <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-wider text-xs" style={B.labelStyle}>
                    <Smartphone className="w-4 h-4 text-[#121212]" />
                    <span>1 Active Session</span>
                  </div>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* APPEARANCE */}
          {activeTab === "appearance" && (
            <>
              <SectionCard title="Styling Options">
                <SettingRow label="Dark Bauhaus Mode" description="Invert canvas background (Light canvas recommended for true print Bauhaus)">
                  <div className="flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="w-4.5 h-4.5 text-[#1040C0]" />
                    ) : (
                      <Sun className="w-4.5 h-4.5 text-[#F0C020]" />
                    )}
                    <Toggle enabled={darkMode} onChange={setDarkMode} id="dark-mode-toggle" />
                  </div>
                </SettingRow>
                <SettingRow label="Compact Padding" description="Tighter boundaries for higher density grids">
                  <Toggle enabled={compactMode} onChange={setCompactMode} id="compact-mode-toggle" />
                </SettingRow>
                <SettingRow label="Transitions & Effects" description="Enable physics micro-animations">
                  <Toggle enabled={animationsEnabled} onChange={setAnimationsEnabled} id="animations-toggle" />
                </SettingRow>
              </SectionCard>

              <SectionCard title="System Accent Color">
                <div className="flex flex-wrap gap-4 py-2">
                  {ACCENT_COLORS.map((color) => {
                    const isSelected = accentColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setAccentColor(color)}
                        className={`w-10 h-10 border-2 border-black rounded-none cursor-pointer transition-all ${
                          isSelected
                            ? "scale-105 border-4 shadow-[4px_4px_0px_0px_#121212] -translate-y-0.5"
                            : "shadow-[2px_2px_0px_0px_#121212] hover:scale-102"
                        }`}
                        style={{ background: color }}
                      />
                    );
                  })}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-3" style={B.labelStyle}>
                  Selected Hex Value: <span className="font-mono text-[#121212] font-black">{accentColor}</span>
                </p>
              </SectionCard>

              <SectionCard title="Typography">
                <SettingRow label="Base Font Size" description="Configure size scale across dashboard page text">
                  <div className="flex items-center bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_#121212] rounded-none">
                    {["S", "M", "L"].map((size, idx) => (
                      <button
                        key={size}
                        className={`w-9 h-8 font-bold text-xs rounded-none transition-all cursor-pointer border ${
                          idx === 1 ? "bg-[#1040C0] text-white border-black" : "text-[#121212] border-transparent hover:bg-gray-100"
                        }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <>
              <SectionCard title="Email Digest Options">
                <SettingRow label="Morning Digest" description="Receive progress breakdown at 8:00 AM daily">
                  <Toggle enabled={emailDigest} onChange={setEmailDigest} id="email-digest-toggle" />
                </SettingRow>
                <SettingRow label="Weekly Insights Report" description="Deeper analysis of topic mastery scores and quiz histories">
                  <Toggle enabled={weeklyReport} onChange={setWeeklyReport} id="weekly-report-toggle" />
                </SettingRow>
                <SettingRow label="File Parsing Notifications" description="Receive alert when document ingestion pipeline finishes">
                  <Toggle enabled={documentProcessed} onChange={setDocumentProcessed} id="doc-processed-toggle" />
                </SettingRow>
              </SectionCard>

              <SectionCard title="Browser Alerts">
                <SettingRow label="Push Alerts" description="Allow instant push events from workspace">
                  <Toggle enabled={pushNotifications} onChange={setPushNotifications} id="push-notifications-toggle" />
                </SettingRow>
                <SettingRow label="System Repetition Reminders" description="Remind when cards or study paths reach scheduled interval">
                  <Toggle enabled={quizReminders} onChange={setQuizReminders} id="quiz-reminders-toggle" />
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* INTEGRATIONS */}
          {activeTab === "integrations" && (
            <>
              <div className="space-y-4">
                {INTEGRATIONS.map((integration) => {
                  const Icon = integration.icon;
                  const isConnected = integration.status === "connected";
                  return (
                    <div key={integration.name} className="bg-white border-2 border-[#121212] p-5 flex items-center gap-4 shadow-[3px_3px_0px_0px_#121212] rounded-none">
                      <div
                        className="w-10 h-10 border-2 border-[#121212] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#121212] rounded-none"
                        style={{ background: integration.color, color: "#ffffff" }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-[#121212] uppercase tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{integration.name}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5" style={B.labelStyle}>{integration.description}</p>
                      </div>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 border border-[#121212] rounded-none text-white ${
                          isConnected ? "bg-[#1040C0]" : "bg-[#D02020]"
                        }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {isConnected ? "Connected" : "Missing Config"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white border-2 border-[#121212] p-5 shadow-[4px_4px_0px_0px_#121212] rounded-none">
                <div className="flex items-center gap-2 mb-3 border-b border-[#121212] pb-2">
                  <KeyRound className="w-4.5 h-4.5 text-[#1040C0]" />
                  <h3 className="text-sm font-black uppercase text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>API Keys configuration</h3>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4" style={B.labelStyle}>API keys are stored in secure server environment variables (.env) only.</p>
                <div className="space-y-3">
                  {[
                    { key: "GEMINI_API_KEY", status: "configured" },
                    { key: "DATABASE_URL", status: "configured" },
                    { key: "CLERK_SECRET_KEY", status: "configured" },
                    { key: "BLOB_READ_WRITE_TOKEN", status: "missing" },
                    { key: "REDIS_URL", status: "missing" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-3 px-3 py-2 border border-[#121212] bg-[#F0F0F0] rounded-none">
                      <code className="text-xs text-[#121212] font-black flex-1 font-mono">{item.key}</code>
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#121212] rounded-none text-white ${
                          item.status === "configured" ? "bg-[#1040C0]" : "bg-[#D02020]"
                        }`}
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {item.status === "configured" ? "✓ Conf" : "Missing"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* DATA */}
          {activeTab === "data" && (
            <>
              <SectionCard title="Your Data">
                <SettingRow label="Export Workspace Data" description="Compile and download ZIP of documents, flashcard statistics, and chats">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-[#121212] text-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <Download className="w-4 h-4" />
                    Export ZIP
                  </button>
                </SettingRow>
                <SettingRow label="Wipe Dialogue History" description="Delete all conversation data permanently">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] hover:bg-[#b01a1a] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#121212] transition-all cursor-pointer rounded-none" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    <Trash2 className="w-4 h-4 text-white" />
                    Wipe History
                  </button>
                </SettingRow>
              </SectionCard>

              {/* Danger Zone */}
              <div className="bg-white border-4 border-[#D02020] p-6 shadow-[6px_6px_0px_0px_#121212] rounded-none">
                <div className="flex items-center gap-2 mb-3 border-b-2 border-[#D02020] pb-2">
                  <Trash2 className="w-4.5 h-4.5 text-[#D02020]" />
                  <h3 className="text-sm font-black uppercase text-[#D02020]" style={{ fontFamily: "'Outfit', sans-serif" }}>Danger Zone</h3>
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5" style={B.labelStyle}>Irreversible procedures. Use with caution.</p>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-extrabold text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>Delete All Documents</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5" style={B.labelStyle}>Deletes document storage and vector indexes</p>
                    </div>
                    <button className="px-4 py-2 bg-white border-2 border-[#121212] text-[#D02020] hover:bg-[#D02020] hover:text-white font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] rounded-none cursor-pointer transition-colors">
                      Delete Files
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#121212] pt-4">
                    <div>
                      <p className="text-sm font-extrabold text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>Terminate Account</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5" style={B.labelStyle}>Wipes account membership metadata completely</p>
                    </div>
                    <button className="px-4 py-2 bg-[#D02020] text-white border-2 border-[#121212] font-black uppercase text-xs tracking-wider shadow-[2px_2px_0px_0px_#121212] active:translate-x-[1px] active:translate-y-[1px] rounded-none cursor-pointer">
                      Terminate User
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-[#121212] p-5 shadow-[4px_4px_0px_0px_#121212] rounded-none">
                <div className="flex items-center gap-2 mb-3 border-b border-[#121212] pb-2">
                  <Globe className="w-4.5 h-4.5 text-[#1040C0]" />
                  <h3 className="text-sm font-black uppercase text-[#121212]" style={{ fontFamily: "'Outfit', sans-serif" }}>Privacy Statement</h3>
                </div>
                <div className="space-y-2 text-xs font-bold text-gray-600 uppercase tracking-wider" style={B.labelStyle}>
                  <p>• Data processed in Kortex AI is stored strictly in personal postgres databases.</p>
                  <p>• Text embeddings are stored inside your private pgvector instance.</p>
                  <p>• Interface metadata is maintained locally using Clerk security headers.</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
