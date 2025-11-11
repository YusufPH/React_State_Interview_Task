/**
 * AD DRAFT CHALLENGE - State Synchronization Problem
 *
 * THE CUSTOMER PROBLEM:
 * You're building an ad drafting tool. Customers can create ads in two modes:
 *
 * 1. GALLERY MODE: Launch 2 ads (one per media) using the SAME copy for both
 * 2. TABLE MODE: Launch 2 ads with UNIQUE copy for each media
 *
 * THE BUG:
 * When a user edits copy in Table Mode (making Row 1 and Row 2 different),
 * then switches to Gallery Mode and back to Table Mode, they lose their
 * unique edits! Both rows get reset to the Gallery copy.
 *
 * YOUR TASK:
 * Fix the state synchronization so that:
 * - Initially: Both views show the same data (synced)
 * - After editing in Table Mode: Each row maintains its unique copy
 * - Switching between views: Doesn't overwrite unique edits
 * - Gallery Mode: Still works for drafting ads with shared copy
 */

'use client';
import React, { useState, useMemo } from 'react';
import { useAdStore } from './store';
import type { ViewMode, AdCopy } from './types';

// ============= GALLERY VIEW COMPONENT =============
/**
 * Gallery View - Used when customer wants to launch ads with SAME copy
 *
 * Shows the ad copy that will be used for both media items.
 * Changes here should save to the store.
 */
const GalleryView = () => {
  const storeData = useAdStore(state => state.adCopy);
  const updateField = useAdStore(state => state.updateField);

  // Use store data directly instead of local state to avoid sync issues
  // This eliminates the need for useEffect synchronisation
  const handleChange = (field: keyof AdCopy, value: string) => {
    // Save to store immediately - this will cause re-render with new values
    updateField(field, value);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* LEFT COLUMN - Ad Setup (Copy) */}
      <div className="col-span-5 border rounded-lg bg-white shadow-sm p-4">
        <h2 className="text-base font-semibold mb-3">Ad Setup</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Primary Text</label>
            <textarea
              value={storeData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter primary text..."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={storeData.headline}
              onChange={(e) => handleChange('headline', e.target.value)}
              placeholder="Enter headline..."
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Call to Action</label>
            <select
              value={storeData.callToAction}
              onChange={(e) => handleChange('callToAction', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Download">Download</option>
              <option value="Get Quote">Get Quote</option>
            </select>
          </div>

          <div className="pt-2 border-t">
            <label className="block text-xs font-medium text-gray-700 mb-1">Launch ads as</label>
            <select
              value={storeData.launchAs}
              onChange={(e) => handleChange('launchAs', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
          <strong>📢 Same copy will be used for both ads</strong>
        </div>
      </div>

      {/* RIGHT COLUMN - Media Preview */}
      <div className="col-span-7 border rounded-lg bg-white shadow-sm p-4">
        <h2 className="text-base font-semibold mb-3">Ads (2)</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* Media Card 1 */}
          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors">
            <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
              ✕
            </div>
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <div className="text-4xl">🖼️</div>
            </div>
            <div className="absolute bottom-1.5 right-1.5 flex gap-1">
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                👁️
              </button>
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                🎨
              </button>
            </div>
            <div className="p-2 bg-white border-t">
              <div className="text-xs font-medium text-gray-700">Media 1</div>
            </div>
          </div>

          {/* Media Card 2 */}
          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition-colors">
            <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
              ✕
            </div>
            <div className="aspect-square bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-4xl">🖼️</div>
            </div>
            <div className="absolute bottom-1.5 right-1.5 flex gap-1">
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                👁️
              </button>
              <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center hover:bg-white text-xs">
                🎨
              </button>
            </div>
            <div className="p-2 bg-white border-t">
              <div className="text-xs font-medium text-gray-700">Media 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= TABLE VIEW COMPONENT =============
/**
 * Table View - Used when customer wants UNIQUE copy for each media
 *
 * Shows 2 rows (one per media item).
 * Initially both rows show the same data, but user can edit each row independently.
 *
 * BUG: When switching views, all unique edits are lost!
 * FIXED: Unique edits are now preserved when switching views!
 */
const TableView = ({
  row1Data,
  row2Data,
  setRow1Data,
  setRow2Data }: {
    row1Data: AdCopy;
    row2Data: AdCopy;
    row1Customised: boolean;
    row2Customised: boolean;
    setRow1Data: (data: AdCopy) => void;
    setRow2Data: (data: AdCopy) => void;
    setRow1Customised: (value: boolean) => void;
    setRow2Customised: (value: boolean) => void;
  }) => {
  const updateField = useAdStore(state => state.updateField);

  // Note: Syncing from store is handled by the parent component's useEffect
  // This ensures row data persists across view switches

  // Rows are already marked as customised when entering Table Mode, so they're independent
  const handleRow1Change = (field: keyof AdCopy, value: string) => {
    setRow1Data({ ...row1Data, [field]: value });

    // Update store so Gallery mode can sync
    // NOTE: Remove this line to prevent Row 1 updating the global store directly on change
    updateField(field, value);
  };

  // When Row 2 changes, just update local state (don't update store)
  const handleRow2Change = (field: keyof AdCopy, value: string) => {
    // Update row data (don't update store)
    setRow2Data({ ...row2Data, [field]: value });
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left font-semibold text-gray-700 w-32">CREATIVE</th>
              <th className="p-3 text-left font-semibold text-gray-700">PRIMARY TEXT</th>
              <th className="p-3 text-left font-semibold text-gray-700">HEADLINE</th>
              <th className="p-3 text-left font-semibold text-gray-700 w-32">CALL TO ACTION</th>
              <th className="p-3 text-left font-semibold text-gray-700 w-32">LAUNCH AS</th>
            </tr>
          </thead>
          <tbody>
            {/* Row 1 - Media 1 */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                      SINGLE
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-2">
                <textarea
                  value={row1Data.description}
                  onChange={(e) => handleRow1Change('description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter primary text..."
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={row1Data.headline}
                  onChange={(e) => handleRow1Change('headline', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter headline..."
                />
              </td>
              <td className="p-2">
                <select
                  value={row1Data.callToAction}
                  onChange={(e) => handleRow1Change('callToAction', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Shop Now">Shop Now</option>
                  <option value="Sign Up">Sign Up</option>
                  <option value="Download">Download</option>
                </select>
              </td>
              <td className="p-2">
                <select
                  value={row1Data.launchAs}
                  onChange={(e) => handleRow1Change('launchAs', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </td>
            </tr>

            {/* Row 2 - Media 2 */}
            <tr className="border-b hover:bg-gray-50">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                    <span className="text-2xl">🖼️</span>
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                      SINGLE
                    </div>
                  </div>
                </div>
              </td>
              <td className="p-2">
                <textarea
                  value={row2Data.description}
                  onChange={(e) => handleRow2Change('description', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter primary text..."
                />
              </td>
              <td className="p-2">
                <input
                  type="text"
                  value={row2Data.headline}
                  onChange={(e) => handleRow2Change('headline', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter headline..."
                />
              </td>
              <td className="p-2">
                <select
                  value={row2Data.callToAction}
                  onChange={(e) => handleRow2Change('callToAction', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="Learn More">Learn More</option>
                  <option value="Shop Now">Shop Now</option>
                  <option value="Sign Up">Sign Up</option>
                  <option value="Download">Download</option>
                </select>
              </td>
              <td className="p-2">
                <select
                  value={row2Data.launchAs}
                  onChange={(e) => handleRow2Change('launchAs', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-gray-50 p-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          2 rows selected
        </div>
        <div className="text-xs text-yellow-600 bg-yellow-50 px-3 py-2 rounded">
          <strong>⚠️ Try this:</strong> Make any row unique, then switch to Gallery Mode and back. Your unique edits will be lost!
        </div>
      </div>
    </div>
  );
};

// ============= VIEW TOGGLE =============
const ViewToggle = ({ mode, onChange }: { mode: ViewMode; onChange: (mode: ViewMode) => void }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => onChange('gallery')}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${mode === 'gallery'
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        🖼️ Gallery Mode
      </button>
      <button
        onClick={() => onChange('table')}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${mode === 'table'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        📊 Table Mode
      </button>
    </div>
  );
};

// ============= MAIN APP =============
export default function AdDraftApp() {
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const storeData = useAdStore(state => state.adCopy);

  // Track table row data and customisation state (lifted to persist across view switches)
  const [row1Data, setRow1Data] = useState<AdCopy>(storeData);
  const [row2Data, setRow2Data] = useState<AdCopy>(storeData);
  const [row1Customised, setRow1Customised] = useState(false);
  const [row2Customised, setRow2Customised] = useState(false);

  // Handle view mode changes - mark rows as customised when entering table mode
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);

    // When entering Table Mode, mark both rows as customised to make them independent from the start
    if (mode === 'table') {
      if (!row1Customised) {
        //NOTE: Uncommenting these lines causes Row 1 to be marked as customised when entering Table Mode. This is required if you want to make Row 1 independent from the global store.
        //setRow1Customised(true);
        //console.log('[Table] 🔀 Row 1 marked as customised (independent from start)');
      }
      if (!row2Customised) {
        setRow2Customised(true);
        console.log('[Table] 🔀 Row 2 marked as customised (independent from start)');
      }
    }
  };

  // Sync row data from store for non-customised rows using useMemo to avoid unnecessary re-renders and potential infinite loops
  const syncedRow1Data = useMemo(() => {
    return row1Customised ? row1Data : storeData;
  }, [row1Customised, row1Data, storeData]);

  const syncedRow2Data = useMemo(() => {
    return row2Customised ? row2Data : storeData;
  }, [row2Customised, row2Data, storeData]);

  const handleLaunchAds = () => {
    alert('🚀 Launching 2 ads!\n\nThis is a demo - in real life, these would be submitted to the ad platform.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">
            Ad Draft Challenge: State Sync Problem
          </h1>
          <p className="text-sm text-gray-600">
            Fix the state synchronisation bug between Gallery and Table modes
          </p>
        </div>

        {/* Customer Problem - At the top */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
          <h3 className="font-bold text-lg mb-2 text-blue-900">
            🎯 The Customer Problem
          </h3>
          <p className="text-sm mb-3 text-gray-700">
            You&apos;re building an ad drafting tool. Customers have <strong>2 media files</strong> and want to create ads:
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-semibold text-blue-700 mb-1">Option 1: Gallery Mode</p>
              <p className="text-gray-700 text-xs">
                Launch 2 ads (one per media) using the <strong>SAME copy</strong> for both.
              </p>
            </div>

            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="font-semibold text-blue-700 mb-1">Option 2: Table Mode</p>
              <p className="text-gray-700 text-xs">
                Launch 2 ads with <strong>UNIQUE copy</strong> for each media.
              </p>
            </div>
          </div>
        </div>

        <ViewToggle mode={viewMode} onChange={handleViewModeChange} />

        <div className="mb-4">
          {viewMode === 'gallery' ? (
            <GalleryView />
          ) : (
            <TableView
              row1Data={syncedRow1Data}
              row2Data={syncedRow2Data}
              row1Customised={row1Customised}
              row2Customised={row2Customised}
              setRow1Data={setRow1Data}
              setRow2Data={setRow2Data}
              setRow1Customised={setRow1Customised}
              setRow2Customised={setRow2Customised}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex items-center justify-end gap-4 bg-white border rounded-lg p-3 shadow-sm">
          <button
            onClick={handleLaunchAds}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2 shadow-md"
          >
            <span>🚀</span> Launch Ads
          </button>
        </div>

        {/* Global Store State with Fork Visualisation */}
        <div className="p-4 bg-white border rounded-lg shadow-sm">
          <h3 className="font-bold text-base mb-1 text-gray-900">📦 Global Store (Shared State)</h3>
          <p className="text-xs text-gray-600 mb-3">
            This is the source of truth that Gallery mode reads/writes to
          </p>

          {/* Store Data */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-700">Store State:</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Source of Truth</span>
            </div>
            <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto font-mono">
              {JSON.stringify(storeData, null, 2)}
            </pre>
          </div>

          {/* Fork Visualisation */}
          <div className="space-y-3 border-t pt-3">
            <div className="text-xs font-semibold text-gray-700 mb-2">Table Mode Row States:</div>

            {/* Row 1 Visualisation */}
            <div className={`p-3 rounded border-2 ${row1Customised ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold">Row 1 (Media 1):</span>
                {row1Customised ? (
                  <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded font-medium flex items-center gap-1">
                    🔀 Forked (Independent)
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded font-medium">
                    ✓ Synced
                  </span>
                )}
              </div>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto font-mono">
                {JSON.stringify(syncedRow1Data, null, 2)}
              </pre>
            </div>

            {/* Row 2 Visualisation */}
            <div className={`p-3 rounded border-2 ${row2Customised ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold">Row 2 (Media 2):</span>
                {row2Customised ? (
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded font-medium flex items-center gap-1">
                    🔀 Forked (Independent)
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded font-medium">
                    ✓ Synced
                  </span>
                )}
              </div>
              <pre className="text-xs bg-white p-2 rounded border overflow-x-auto font-mono">
                {JSON.stringify(syncedRow2Data, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Challenge Instructions */}
        <div className="space-y-3 mt-4">
          <div className="p-4 bg-red-50 rounded-lg border-2 border-red-300">
            <h3 className="font-bold text-lg mb-2 text-red-900">
              🐛 The Bug
            </h3>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-700 mb-1.5 text-xs">How to Reproduce:</p>
                <ol className="list-decimal ml-5 space-y-1 text-gray-700 text-xs">
                  <li>Go to <strong>Table Mode</strong></li>
                  <li>Make any row unique (e.g., change Row 2 headline to &quot;Audiobooks Made Easy!&quot;)</li>
                  <li>Switch to <strong>Gallery Mode</strong></li>
                  <li>Switch back to <strong>Table Mode</strong></li>
                  <li>❌ <strong>BUG</strong>: Your unique edits are gone! All rows are identical again.</li>
                </ol>
              </div>

              <div className="bg-white p-3 rounded border border-red-200">
                <p className="font-semibold text-red-700 mb-1.5 text-xs">Why This Is a Problem:</p>
                <p className="text-gray-700 text-xs">
                  The customer spent time crafting unique copy for each ad, but switching between
                  views causes them to <strong>lose their unique edits</strong>. This is frustrating and
                  makes the tool unreliable.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border-2 border-green-300">
            <h3 className="font-bold text-lg mb-2 text-green-900">
              ✅ Your Task
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                Fix the state synchronisation so that:
              </p>

              <ul className="list-disc ml-5 space-y-1 text-gray-700 text-xs">
                <li>
                  <strong>Initially:</strong> Both Gallery and Table modes sync from the store
                  (they start with the same data)
                </li>
                <li>
                  <strong>When editing in Table Mode:</strong> Each row can &quot;fork&quot; from the store
                  and maintain its own unique state
                </li>
                <li>
                  <strong>When switching views:</strong> Unique edits in any Table Mode row are preserved
                </li>
                <li>
                  <strong>Gallery Mode behavior:</strong> Should still update the store and any rows that haven&apos;t been customised
                </li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
            <h3 className="font-bold text-lg mb-2">
              🎓 Success Criteria
            </h3>
            <ul className="list-disc ml-5 space-y-1 text-xs text-gray-700">
              <li>Edit in Gallery Mode → All table rows update ✅</li>
              <li>Edit in Table Mode any row → It stays unique ✅</li>
              <li>Switching back and forth → Unique states are remembered ✅</li>
              <li>Customer doesn&apos;t lose their work when switching views ✅</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}