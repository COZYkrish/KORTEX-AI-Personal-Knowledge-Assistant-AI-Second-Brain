"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Bell, Palette, Shield, Database,
  Moon, Sun, Check, ChevronRight, Sparkles,
  Globe, Mail, Smartphone, KeyRound, Download,
  Trash2, ExternalLink,
} from "lucide-react";

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
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${enabled ? "bg-[#7c3aed]" : "bg-[rgba(100,116,139,0.3)]"}`}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-[rgba(124,58,237,0.08)] last:border-0">
      <div className="flex-1 min-w-0 mr-6">
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-bright rounded-2xl p-6">
      <h3 className="text-base font-semibold text-white mb-4">{title}</h3>
      <div className="divide-y divide-[rgba(124,58,237,0.08)]">{children}</div>
    </div>
  );
}

const INTEGRATIONS = [
  {
    name: "Google Gemini",
    description: "AI model for chat, generation, and embeddings",
    status: "connected",
    color: "#10b981",
    icon: Sparkles,
  },
  {
    name: "Neon PostgreSQL",
    description: "Primary database with pgvector extension",
    status: "connected",
    color: "#10b981",
    icon: Database,
  },
  {
    name: "Clerk Auth",
    description: "User authentication and session management",
    status: "connected",
    color: "#10b981",
    icon: Shield,
  },
  {
    name: "Vercel Blob Storage",
    description: "File storage for uploaded documents",
    status: "not_configured",
    color: "#f59e0b",
    icon: ExternalLink,
  },
  {
    name: "Redis / BullMQ",
    description: "Background job queue for document processing",
    status: "not_configured",
    color: "#f59e0b",
    icon: ExternalLink,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  // Profile settings
  const [displayName, setDisplayName] = useState("Explorer");
  const [language, setLanguage] = useState("en");

  // Appearance
  const [darkMode] = useState(true);
  const [accentColor, setAccentColor] = useState("#7c3aed");
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

  const ACCENT_COLORS = ["#7c3aed", "#00d4ff", "#10b981", "#f59e0b", "#ef4444", "#ec4899"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
          <p className="text-[#a8b2d8] text-sm mt-0.5">Manage your account and preferences</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          id="save-settings-button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] text-white text-sm font-medium"
        >
          {saved ? <Check className="w-4 h-4 text-[#10b981]" /> : <Settings className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-1"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-[rgba(124,58,237,0.2)] text-white border border-[rgba(124,58,237,0.3)]"
                    : "text-[#64748b] hover:text-[#a8b2d8] hover:bg-[rgba(124,58,237,0.05)]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? "text-[#7c3aed]" : ""}`} />
                <span className="text-sm font-medium">{tab.label}</span>
                {activeTab === tab.id && <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#7c3aed]" />}
              </button>
            );
          })}
        </motion.div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* PROFILE */}
          {activeTab === "profile" && (
            <>
              <SectionCard title="Personal Information">
                <SettingRow label="Display Name" description="How you appear in the dashboard">
                  <input
                    id="display-name-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[rgba(13,20,64,0.6)] border border-[rgba(124,58,237,0.3)] text-white text-sm w-40 focus:outline-none focus:border-[rgba(124,58,237,0.6)] transition-colors"
                  />
                </SettingRow>
                <SettingRow label="Language" description="Interface language preference">
                  <select
                    id="language-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[rgba(13,20,64,0.6)] border border-[rgba(124,58,237,0.3)] text-white text-sm focus:outline-none appearance-none cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="zh">中文</option>
                  </select>
                </SettingRow>
              </SectionCard>

              <SectionCard title="Account">
                <SettingRow label="Email address" description="Managed by Clerk authentication">
                  <div className="flex items-center gap-2 text-[#64748b] text-sm">
                    <Mail className="w-4 h-4" />
                    <span>via Clerk</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </SettingRow>
                <SettingRow label="Password & Security" description="Manage your login credentials">
                  <button className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-sm text-[#a8b2d8] hover:text-white transition-colors">
                    <KeyRound className="w-4 h-4" />
                    Manage in Clerk
                  </button>
                </SettingRow>
                <SettingRow label="Connected devices" description="Devices where you are signed in">
                  <div className="flex items-center gap-2 text-[#64748b] text-sm">
                    <Smartphone className="w-4 h-4" />
                    <span>1 device</span>
                  </div>
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* APPEARANCE */}
          {activeTab === "appearance" && (
            <>
              <SectionCard title="Theme">
                <SettingRow label="Dark Mode" description="Kortex AI is optimized for dark mode">
                  <div className="flex items-center gap-2">
                    {darkMode ? (
                      <Moon className="w-4 h-4 text-[#7c3aed]" />
                    ) : (
                      <Sun className="w-4 h-4 text-[#f59e0b]" />
                    )}
                    <Toggle enabled={darkMode} onChange={() => {}} id="dark-mode-toggle" />
                  </div>
                </SettingRow>
                <SettingRow label="Compact Mode" description="Reduce padding and spacing in the dashboard">
                  <Toggle enabled={compactMode} onChange={setCompactMode} id="compact-mode-toggle" />
                </SettingRow>
                <SettingRow label="Animations" description="Enable smooth transitions and micro-animations">
                  <Toggle enabled={animationsEnabled} onChange={setAnimationsEnabled} id="animations-toggle" />
                </SettingRow>
              </SectionCard>

              <SectionCard title="Accent Color">
                <div className="flex items-center gap-3 py-2">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className="w-8 h-8 rounded-xl transition-all hover:scale-110"
                      style={{
                        background: color,
                        boxShadow: accentColor === color ? `0 0 0 2px #050816, 0 0 0 4px ${color}` : "none",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#64748b] mt-2">Current: <span className="font-mono" style={{ color: accentColor }}>{accentColor}</span></p>
              </SectionCard>

              <SectionCard title="Typography">
                <SettingRow label="Font Size" description="Base text size across the application">
                  <div className="flex items-center gap-1 glass rounded-xl p-1">
                    {["S", "M", "L"].map((size, i) => (
                      <button
                        key={size}
                        className={`w-8 h-7 rounded-lg text-xs font-medium transition-all ${i === 1 ? "bg-[rgba(124,58,237,0.3)] text-white" : "text-[#64748b] hover:text-white"}`}
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
              <SectionCard title="Email Notifications">
                <SettingRow label="Daily Digest" description="Receive a summary of your learning activity each morning">
                  <Toggle enabled={emailDigest} onChange={setEmailDigest} id="email-digest-toggle" />
                </SettingRow>
                <SettingRow label="Weekly Report" description="Detailed weekly learning report with insights and recommendations">
                  <Toggle enabled={weeklyReport} onChange={setWeeklyReport} id="weekly-report-toggle" />
                </SettingRow>
                <SettingRow label="Document Processed" description="Notify when a document finishes processing and is ready">
                  <Toggle enabled={documentProcessed} onChange={setDocumentProcessed} id="doc-processed-toggle" />
                </SettingRow>
              </SectionCard>

              <SectionCard title="Push Notifications">
                <SettingRow label="Browser Notifications" description="Receive push notifications in the browser">
                  <Toggle enabled={pushNotifications} onChange={setPushNotifications} id="push-notifications-toggle" />
                </SettingRow>
                <SettingRow label="Quiz Reminders" description="Remind you when flashcards or quizzes are due for review">
                  <Toggle enabled={quizReminders} onChange={setQuizReminders} id="quiz-reminders-toggle" />
                </SettingRow>
              </SectionCard>
            </>
          )}

          {/* INTEGRATIONS */}
          {activeTab === "integrations" && (
            <>
              <div className="space-y-3">
                {INTEGRATIONS.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <div key={integration.name} className="glass rounded-2xl p-5 flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${integration.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: integration.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{integration.name}</p>
                        <p className="text-xs text-[#64748b] mt-0.5">{integration.description}</p>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                        style={{
                          background: integration.status === "connected" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                          color: integration.status === "connected" ? "#10b981" : "#f59e0b",
                        }}
                      >
                        {integration.status === "connected" ? "Connected" : "Not Configured"}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-[#7c3aed]" />
                  <h3 className="text-sm font-semibold text-white">API Keys</h3>
                </div>
                <p className="text-xs text-[#64748b] mb-4">API keys are stored in your .env file and never exposed to the client.</p>
                <div className="space-y-2">
                  {[
                    { key: "GEMINI_API_KEY", status: "configured" },
                    { key: "DATABASE_URL", status: "configured" },
                    { key: "CLERK_SECRET_KEY", status: "configured" },
                    { key: "BLOB_READ_WRITE_TOKEN", status: "missing" },
                    { key: "REDIS_URL", status: "missing" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[rgba(13,20,64,0.4)]">
                      <code className="text-xs text-[#a78bfa] flex-1 font-mono">{item.key}</code>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.status === "configured" ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]" : "bg-[rgba(245,158,11,0.15)] text-[#f59e0b]"}`}>
                        {item.status === "configured" ? "✓ Set" : "Missing"}
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
                <SettingRow label="Export All Data" description="Download all your documents, chats, flashcards, and analytics as a ZIP file">
                  <button className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl text-sm text-[#a8b2d8] hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </SettingRow>
                <SettingRow label="Clear Chat History" description="Delete all AI conversations — this cannot be undone">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[rgba(245,158,11,0.3)] text-[#f59e0b] text-sm hover:bg-[rgba(245,158,11,0.1)] transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </SettingRow>
              </SectionCard>

              <div className="glass-bright rounded-2xl p-5 border border-[rgba(239,68,68,0.2)]" style={{ background: "rgba(239,68,68,0.05)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Trash2 className="w-4 h-4 text-[#ef4444]" />
                  <h3 className="text-sm font-semibold text-[#ef4444]">Danger Zone</h3>
                </div>
                <p className="text-xs text-[#64748b] mb-4">These actions are permanent and cannot be reversed. Please be certain before proceeding.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">Delete all documents</p>
                      <p className="text-xs text-[#64748b]">Remove all uploaded files and their embeddings</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl border border-[rgba(239,68,68,0.4)] text-[#ef4444] text-sm hover:bg-[rgba(239,68,68,0.1)] transition-colors">
                      Delete All
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">Delete account</p>
                      <p className="text-xs text-[#64748b]">Permanently remove your account and all data</p>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.4)] text-[#ef4444] text-sm hover:bg-[rgba(239,68,68,0.25)] transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-[#7c3aed]" />
                  <h3 className="text-sm font-semibold text-white">Privacy</h3>
                </div>
                <div className="space-y-3 text-xs text-[#64748b]">
                  <p>• Your documents are processed server-side using Gemini AI and stored securely in your Neon PostgreSQL database.</p>
                  <p>• Embeddings are stored as 768-dimensional vectors in your private pgvector database.</p>
                  <p>• Kortex AI does not share your data with third parties.</p>
                  <p>• All API keys are stored in environment variables and never exposed to the client.</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
