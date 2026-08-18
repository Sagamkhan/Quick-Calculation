import React from 'react';
import {
  Radio,
  Send,
  Zap,
  RefreshCw,
  Clock,
  Globe,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Activity,
  Terminal,
  Trash2
} from 'lucide-react';
import {
  PingLog,
  PingConfig
} from '../../utils/searchEnginePinger';

interface AdminIndexingTabProps {
  pingConfig: PingConfig;
  pingLogs: PingLog[];
  isPinging: boolean;
  pingFilter: 'all' | 'google' | 'bing' | 'indexnow';
  setPingFilter: (filter: 'all' | 'google' | 'bing' | 'indexnow') => void;
  sitemapCustomUrl: string;
  setSitemapCustomUrl: (url: string) => void;
  indexNowKeyInput: string;
  setIndexNowKeyInput: (key: string) => void;
  indexNowKeyLocInput: string;
  setIndexNowKeyLocInput: (loc: string) => void;
  pingIntervalInput: number;
  setPingIntervalInput: (val: number) => void;
  autoPingPublishToggle: boolean;
  setAutoPingPublishToggle: (val: boolean) => void;
  periodicPingToggle: boolean;
  setPeriodicPingToggle: (val: boolean) => void;
  onManualPingSitemap: () => void;
  onManualIndexNow: () => void;
  onManualBroadcastAll: () => void;
  onSavePingConfig: (e: React.FormEvent) => void;
  onClearLogs: () => void;
}

export default function AdminIndexingTab({
  pingConfig,
  pingLogs,
  isPinging,
  pingFilter,
  setPingFilter,
  sitemapCustomUrl,
  setSitemapCustomUrl,
  indexNowKeyInput,
  setIndexNowKeyInput,
  indexNowKeyLocInput,
  setIndexNowKeyLocInput,
  pingIntervalInput,
  setPingIntervalInput,
  autoPingPublishToggle,
  setAutoPingPublishToggle,
  periodicPingToggle,
  setPeriodicPingToggle,
  onManualPingSitemap,
  onManualIndexNow,
  onManualBroadcastAll,
  onSavePingConfig,
  onClearLogs
}: AdminIndexingTabProps) {
  const filteredLogs = pingLogs.filter((log) => {
    if (pingFilter === 'all') return true;
    if (pingFilter === 'indexnow') return log.engine === 'indexnow' || log.target === 'indexnow';
    if (pingFilter === 'google') return log.engine === 'google' || log.target === 'google_sitemap' || log.target === 'google';
    if (pingFilter === 'bing') return log.engine === 'bing' || log.target === 'bing_sitemap' || log.target === 'bing';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Search Engine Pinger & IndexNow Dispatcher
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Broadcast updated <code className="text-cyan-300 font-mono">/sitemap.xml</code> and latest blog post URLs to Google, Microsoft Bing, and the IndexNow protocol (Yandex, Seznam, Naver) for instant crawl signaling.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onManualPingSitemap}
            disabled={isPinging}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isPinging ? 'Pinging...' : 'Ping Google & Bing'}</span>
          </button>

          <button
            type="button"
            onClick={onManualIndexNow}
            disabled={isPinging}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isPinging ? 'Submitting...' : 'Push to IndexNow'}</span>
          </button>

          <button
            type="button"
            onClick={onManualBroadcastAll}
            disabled={isPinging}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Broadcast All</span>
          </button>
        </div>
      </div>

      {/* 4 Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>AUTO-PING ON PUBLISH</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2 pt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                pingConfig.autoPingOnPublish ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'
              }`}
            />
            <span>{pingConfig.autoPingOnPublish ? 'Enabled' : 'Disabled'}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Triggered on post save</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PERIODIC SCHEDULER</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2 pt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                pingConfig.periodicPingEnabled ? 'bg-indigo-400' : 'bg-slate-600'
              }`}
            />
            <span>Every {pingConfig.pingIntervalHours} Hours</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Browser cron worker</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>LAST TRANSMISSION</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white font-mono pt-1 truncate">
            {pingConfig.lastPingTimestamp
              ? new Date(pingConfig.lastPingTimestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })
              : 'Not triggered yet'}
          </div>
          <p className="text-[11px] text-slate-500 font-mono">HTTP signals verified</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>INDEXNOW PROTOCOL</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-white flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>v1.0 Protocol Active</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Bing, Yandex, Seznam push</p>
        </div>
      </div>

      {/* Configuration & Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-md">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Pinger & IndexNow Config</span>
          </h4>

          <form onSubmit={onSavePingConfig} className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPingPublishToggle}
                  onChange={(e) => setAutoPingPublishToggle(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500"
                />
                <div>
                  <div className="text-xs font-bold text-white">Auto-Ping on Article Publish</div>
                  <div className="text-[10px] text-slate-400">Pings immediately when saving posts</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={periodicPingToggle}
                  onChange={(e) => setPeriodicPingToggle(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500"
                />
                <div>
                  <div className="text-xs font-bold text-white">Periodic Background Scheduler</div>
                  <div className="text-[10px] text-slate-400">Runs interval check during sessions</div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                SITEMAP LOCATION URL
              </label>
              <input
                type="url"
                value={sitemapCustomUrl}
                onChange={(e) => setSitemapCustomUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                PING INTERVAL (HOURS)
              </label>
              <select
                value={pingIntervalInput}
                onChange={(e) => setPingIntervalInput(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>Every 1 Hour (High Frequency)</option>
                <option value={3}>Every 3 Hours</option>
                <option value={6}>Every 6 Hours (Recommended)</option>
                <option value={12}>Every 12 Hours</option>
                <option value={24}>Every 24 Hours (Daily)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              Save Pinger Config
            </button>
          </form>
        </div>

        {/* Live Logs Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md flex flex-col">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Search Engine Audit Logs ({filteredLogs.length})</span>
            </h4>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['all', 'google', 'bing', 'indexnow'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPingFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      pingFilter === filter
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button
                onClick={onClearLogs}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                title="Clear Logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 flex-1 max-h-[360px] custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-3">TIMESTAMP</th>
                  <th className="p-3">TARGET</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">RESPONSE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500 font-sans">
                      No logs recorded yet. Trigger a manual ping above to verify signals.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-900/40">
                      <td className="p-3 text-[11px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-mono">
                          {log.target || log.engine}
                        </span>
                      </td>
                      <td className="p-3">
                        {log.status === 'success' ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Success
                          </span>
                        ) : log.status === 'dispatched' ? (
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Radio className="w-3.5 h-3.5 animate-pulse" /> Dispatched
                          </span>
                        ) : log.status === 'pending' ? (
                          <span className="text-amber-400">Pending...</span>
                        ) : log.status === 'warning' ? (
                          <span className="text-amber-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Warning
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Error
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px] truncate max-w-xs">
                        {log.message}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
