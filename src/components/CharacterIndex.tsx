import React, { useState, useMemo } from 'react';
import { Card, Series } from '../types/game';
import { ALL_CARDS } from '../data/cards';
import { CardView } from './CardView';
import { audio } from '../utils/audio';
import {
  Search,
  ArrowUpDown,
  BookOpen,
  Globe,
  Swords,
  Gamepad2,
  Sparkles,
  X,
  Quote,
  Shield,
  Download,
} from 'lucide-react';

interface CharacterIndexProps {
  onBackToMenu: () => void;
  onPlayMatch?: () => void;
}

export const getCountryFlag = (country: string): string => {
  const c = country.toLowerCase();
  if (c.includes('japan')) return '🇯🇵';
  if (c.includes('united states') || c.includes('usa')) return '🇺🇸';
  if (c.includes('china')) return '🇨🇳';
  if (c.includes('russia')) return '🇷🇺';
  if (c.includes('india')) return '🇮🇳';
  if (c.includes('brazil')) return '🇧🇷';
  if (c.includes('spain')) return '🇪🇸';
  if (c.includes('thailand')) return '🇹🇭';
  if (c.includes('united kingdom') || c.includes('uk')) return '🇬🇧';
  if (c.includes('hong kong')) return '🇭🇰';
  if (c.includes('jamaica')) return '🇯🇲';
  if (c.includes('mexico')) return '🇲🇽';
  if (c.includes('italy')) return '🇮🇹';
  if (c.includes('germany')) return '🇩🇪';
  if (c.includes('kenya')) return '🇰🇪';
  if (c.includes('france')) return '🇫🇷';
  if (c.includes('south korea') || c.includes('korea')) return '🇰🇷';
  return '🌐';
};

export const CharacterIndex: React.FC<CharacterIndexProps> = ({
  onBackToMenu,
  onPlayMatch,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'power'>('name');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const exportToCSV = () => {
    audio.playCardSelect();
    // 1. Prepare Headers
    const headers = [
      'Character Name',
      'Company / Publisher',
      'Origin Series',
      'Country',
      'Debut Year',
      'Fighting Style',
      'Stat Top',
      'Stat Right',
      'Stat Bottom',
      'Stat Left',
      'Total Power',
      'Biography'
    ];

    // 2. Map character records to rows
    const rows = ALL_CARDS.map(card => {
      const totalPower = card.values.top + card.values.right + card.values.bottom + card.values.left;
      const company = card.series.toLowerCase().includes('street fighter') ? 'Capcom' : 'SNK';
      return [
        `"${card.name.replace(/"/g, '""')}"`,
        `"${company}"`,
        `"${card.series.replace(/"/g, '""')}"`,
        `"${card.country.replace(/"/g, '""')}"`,
        card.releaseYear,
        `"${card.fightingStyle.replace(/"/g, '""')}"`,
        card.values.top,
        card.values.right,
        card.values.bottom,
        card.values.left,
        totalPower,
        `"${card.bio.replace(/"/g, '""')}"`
      ];
    });

    // 3. Assemble CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Trigger safe client-side browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `capcom_vs_snk_triad_fighters_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered & Sorted Cards
  const displayedCards = useMemo(() => {
    let result = [...ALL_CARDS];

    // Filter by Series
    if (selectedSeries !== 'all') {
      result = result.filter((card) => card.series === selectedSeries);
    }

    // Filter by Search Query (Name, Country, Fighting Style, Debut Game)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (card) =>
          card.name.toLowerCase().includes(q) ||
          card.country.toLowerCase().includes(q) ||
          card.fightingStyle.toLowerCase().includes(q) ||
          card.originalGameDebut.toLowerCase().includes(q) ||
          card.title.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'year') {
        return a.releaseYear - b.releaseYear || a.name.localeCompare(b.name);
      }
      if (sortBy === 'power') {
        const powerA = a.values.top + a.values.right + a.values.bottom + a.values.left;
        const powerB = b.values.top + b.values.right + b.values.bottom + b.values.left;
        return powerB - powerA;
      }
      return 0;
    });

    return result;
  }, [selectedSeries, searchQuery, sortBy]);

  // Series Statistics
  const seriesCountMap = useMemo(() => {
    const counts: Record<string, number> = {
      all: ALL_CARDS.length,
      'Super Street Fighter': 0,
      'Street Fighter Alpha 3': 0,
      'Street Fighter III': 0,
      "The King of Fighters '96": 0,
      "The King of Fighters '97": 0,
      'The King of Fighters 2001': 0,
      'Fatal Fury Special': 0,
      'Samurai Shodown': 0,
      'The Last Blade': 0,
      'Garou: Mark of the Wolves': 0,
    };
    ALL_CARDS.forEach((card) => {
      if (counts[card.series] !== undefined) {
        counts[card.series]++;
      }
    });
    return counts;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-arcade font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              ROSTER CODEX
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {displayedCards.length} of {ALL_CARDS.length} FIGHTERS
            </span>
          </div>
          <h1 className="font-arcade text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 tracking-wide">
            CHARACTER INDEX
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Complete fighting compendium displaying every character in the game with their country of origin, martial arts discipline, and video game debut.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Export full fighter statistics to CSV"
          >
            <Download className="w-4 h-4" />
            EXPORT SPREADSHEET
          </button>
          {onPlayMatch && (
            <button
              onClick={() => {
                audio.playCardSelect();
                onPlayMatch();
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-arcade text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-103 cursor-pointer flex items-center gap-1.5"
            >
              <Swords className="w-4 h-4" />
              ENTER ARENA
            </button>
          )}
          <button
            onClick={() => {
              audio.playCardSelect();
              onBackToMenu();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        {/* Series Filter Tabs (Two lines / Wrap instead of scroll) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs flex-1">
          {[
            { id: 'all', label: 'All Series', count: seriesCountMap.all },
            { id: 'Super Street Fighter', label: 'Super SF', count: seriesCountMap['Super Street Fighter'] },
            { id: 'Street Fighter Alpha 3', label: 'Alpha 3', count: seriesCountMap['Street Fighter Alpha 3'] },
            { id: 'Street Fighter III', label: 'SF III', count: seriesCountMap['Street Fighter III'] },
            { id: "The King of Fighters '96", label: "KOF '96", count: seriesCountMap["The King of Fighters '96"] },
            { id: "The King of Fighters '97", label: "KOF '97", count: seriesCountMap["The King of Fighters '97"] },
            { id: 'The King of Fighters 2001', label: 'KOF 2001', count: seriesCountMap['The King of Fighters 2001'] },
            { id: 'Fatal Fury Special', label: 'Fatal Fury', count: seriesCountMap['Fatal Fury Special'] },
            { id: 'Samurai Shodown', label: 'Samurai Shodown', count: seriesCountMap['Samurai Shodown'] },
            { id: 'The Last Blade', label: 'Last Blade', count: seriesCountMap['The Last Blade'] },
            { id: 'Garou: Mark of the Wolves', label: 'Mark of the Wolves', count: seriesCountMap['Garou: Mark of the Wolves'] },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                audio.playCardSelect();
                setSelectedSeries(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedSeries === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedSeries === tab.id
                    ? 'bg-slate-950/20 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fighter, country, style..."
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'year' | 'power')}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="name" className="bg-slate-900 text-slate-200">
                Name (A–Z)
              </option>
              <option value="year" className="bg-slate-900 text-slate-200">
                Debut Year
              </option>
              <option value="power" className="bg-slate-900 text-slate-200">
                Total Power
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Fighter Entries List/Grid */}
      {displayedCards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-arcade text-xl text-slate-300">NO FIGHTERS FOUND</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            No character matches "{searchQuery}". Try searching by another name, country, or martial arts discipline.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSeries('all');
            }}
            className="mt-4 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
          {displayedCards.map((card) => {
            const flag = getCountryFlag(card.country);
            const totalPower = card.values.top + card.values.right + card.values.bottom + card.values.left;

            return (
              <div
                key={card.id}
                onClick={() => {
                  audio.playCardSelect();
                  setSelectedCard(card);
                }}
                className="group relative rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 hover:border-amber-400/60 p-4 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 cursor-pointer flex items-center justify-between gap-4 overflow-hidden"
              >
                {/* Background Accent Glow */}
                <div
                  className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-15 pointer-events-none transition-opacity group-hover:opacity-30"
                  style={{ backgroundColor: card.signatureColor }}
                />

                {/* LEFT SIDE: Name, Country of Origin, Fighting Style, Original Game Debut */}
                <div className="flex-1 flex flex-col justify-between min-w-0 pr-2 z-10">
                  {/* Top: Series Tag & Total Power */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider text-slate-300 border border-slate-700/60 bg-slate-950/60"
                      style={{ borderLeftColor: card.signatureColor, borderLeftWidth: '3px' }}
                    >
                      {card.series === 'Super Street Fighter'
                        ? 'Super SF'
                        : card.series === 'Street Fighter Alpha 3'
                        ? 'Alpha 3'
                        : card.series === 'Street Fighter III'
                        ? 'SF III'
                        : card.series === "The King of Fighters '96"
                        ? "KOF '96"
                        : card.series === "The King of Fighters '97"
                        ? "KOF '97"
                        : card.series === 'The King of Fighters 2001'
                        ? 'KOF 2001'
                        : card.series === 'Fatal Fury Special'
                        ? 'Fatal Fury'
                        : card.series === 'Samurai Shodown'
                        ? 'SamSho'
                        : card.series === 'The Last Blade'
                        ? 'Last Blade'
                        : 'Garou'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-0.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      PWR {totalPower}
                    </span>
                  </div>

                  {/* Character Name (Placed to the left of image) */}
                  <h3 className="font-arcade text-xl sm:text-2xl font-black text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                    {card.name}
                  </h3>

                  {/* Character Title / Epithet */}
                  <div className="text-[11px] text-slate-400 font-medium truncate mb-2.5">
                    {card.title}
                  </div>

                  {/* Required Detailed Metadata */}
                  <div className="space-y-1.5 text-xs">
                    {/* Country of Origin */}
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="text-slate-400 text-[11px]">Country:</span>
                      <span className="font-semibold text-slate-200 flex items-center gap-1">
                        <span>{flag}</span>
                        <span>{card.country}</span>
                      </span>
                    </div>

                    {/* Fighting Style */}
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-400 text-[11px]">Style:</span>
                      <span className="font-semibold text-slate-200 truncate">
                        {card.fightingStyle || 'Unknown'}
                      </span>
                    </div>

                    {/* Game Originally Appeared */}
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-400 text-[11px]">Debut:</span>
                      <span className="font-semibold text-slate-200 truncate">
                        {card.originalGameDebut || card.earliestGame}
                      </span>
                    </div>
                  </div>

                  {/* Mini Directional Stats Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-3 text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">▲</span>
                      <span className="text-slate-200 font-bold">{card.values.top}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">▶</span>
                      <span className="text-slate-200 font-bold">{card.values.right}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">▼</span>
                      <span className="text-slate-200 font-bold">{card.values.bottom}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500">◀</span>
                      <span className="text-slate-200 font-bold">{card.values.left}</span>
                    </span>
                  </div>
                </div>

                {/* RIGHT SIDE: Character Image / Card */}
                <div className="shrink-0 z-10 flex flex-col items-center">
                  <div className="relative group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                    <CardView card={card} size="sm" />
                  </div>
                  <span className="mt-1 text-[9px] text-slate-500 font-mono tracking-wider uppercase group-hover:text-amber-400 transition-colors">
                    Click to View
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Card Inspection Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-xl w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-6 items-center">
            {/* Ambient Background Aura */}
            <div
              className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: selectedCard.signatureColor }}
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Left Side: Full Card View */}
            <div className="shrink-0">
              <CardView card={selectedCard} size="md" />
            </div>

            {/* Modal Right Side: Complete Profile Dossier */}
            <div className="flex-1 min-w-0 space-y-3 z-10 text-left">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider text-slate-300 border border-slate-700 bg-slate-950/80">
                  {selectedCard.series}
                </span>
                <span className="text-xs text-amber-400 font-mono font-bold">
                  PWR {selectedCard.values.top + selectedCard.values.right + selectedCard.values.bottom + selectedCard.values.left}
                </span>
              </div>

              <div>
                <h2 className="font-arcade text-3xl font-black text-amber-400 leading-tight">
                  {selectedCard.name}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {selectedCard.title}
                </p>
              </div>

              {/* Core Details Grid */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    Country of Origin:
                  </span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <span>{getCountryFlag(selectedCard.country)}</span>
                    <span>{selectedCard.country}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    Fighting Style:
                  </span>
                  <span className="font-semibold text-slate-200">
                    {selectedCard.fightingStyle}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
                    Original Debut:
                  </span>
                  <span className="font-semibold text-slate-200">
                    {selectedCard.originalGameDebut}
                  </span>
                </div>
              </div>

              {/* Bio & Quote */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCard.bio}
              </p>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs italic text-amber-200/90 flex items-start gap-2">
                <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>"{selectedCard.quote}"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
