import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import draftData from './data/draft.json';
import fallbackGamesData from './data/fallbackGames.json';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Table, 
  Swords, 
  Play, 
  RefreshCw, 
  Search, 
  Flame, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Shield 
} from 'lucide-react';

const TEAM_FLAGS = {
  "Spain": "🇪🇸",
  "New Zealand": "🇳🇿",
  "Morocco": "🇲🇦",
  "Algeria": "🇩🇿",
  "Ghana": "🇬🇭",
  "Switzerland": "🇨🇭",
  "Egypt": "🇪🇬",
  "Senegal": "🇸🇳",
  "Austria": "🇦🇹",
  "Norway": "🇳🇴",
  "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Japan": "🇯🇵",
  "Qatar": "🇶🇦",
  "Paraguay": "🇵🇾",
  "Portugal": "🇵🇹",
  "Australia": "🇦🇺",
  "Brazil": "🇧🇷",
  "Democratic Republic of the Congo": "🇨🇩",
  "Jordan": "🇯🇴",
  "Cape Verde": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  "Turkey": "🇹🇷",
  "South Africa": "🇿🇦",
  "Uzbekistan": "🇺🇿",
  "Haiti": "🇭🇹",
  "France": "🇫🇷",
  "Tunisia": "🇹🇳",
  "Ecuador": "🇪🇨",
  "Bosnia and Herzegovina": "🇧🇦",
  "Mexico": "🇲🇽",
  "Czech Republic": "🇨🇿",
  "Curaçao": "🇨🇼",
  "Ivory Coast": "🇨🇮",
  "United States": "🇺🇸",
  "Sweden": "🇸🇪",
  "South Korea": "🇰🇷",
  "Belgium": "🇧🇪",
  "Canada": "🇨🇦",
  "Germany": "🇩🇪",
  "Croatia": "🇭🇷",
  "Iraq": "🇮🇶",
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Uruguay": "🇺🇾",
  "Iran": "🇮🇷",
  "Panama": "🇵🇦",
  "Colombia": "🇨🇴",
  "Netherlands": "🇳🇱",
  "Argentina": "🇦🇷"
};

const TEAM_MOVES = {
  "Spain": { attack: "tiki-takas {target} to absolute exhaustion", defense: "passes the ball 500 times to kill time" },
  "New Zealand": { attack: "performs a terrifying Haka, freezing {target} in fear", defense: "blocks with a flock of angry Kiwis" },
  "Morocco": { attack: "unleashes a shifting Saharan sandstorm on {target}", defense: "takes cover behind a giant plate of couscous" },
  "Algeria": { attack: "unleashes the Desert Fox bite on {target}", defense: "defends with a solid wall of Sahara stone" },
  "Ghana": { attack: "distracts {target} with a high-energy Azonto dance battle", defense: "deflects the hit with a gold shield" },
  "Switzerland": { attack: "yodels at deafening decibels at {target}", defense: "blocks with a giant impenetrable Swiss Army Knife" },
  "Uruguay": { attack: "unleashes a Suarez-style bite on {target}", defense: "intercepts the hit with a heavy cup of Yerba Mate" },
  "Iran": { attack: "carpets {target} in a heavy, smothering Persian rug", defense: "dodges with a swift Persian cheetah leap" },
  "Panama": { attack: "floods {target} by opening the Panama Canal locks", defense: "hides inside a massive shipping container" },
  "Colombia": { attack: "caffeinates to hyper-speed and double-kicks {target}", defense: "distracts the attack with a lively Cumbia dance" },
  "Netherlands": { attack: "stomps on {target} wearing heavy wooden clogs", defense: "blows the attack away with a turning windmill" },
  "Argentina": { attack: "nutmegs {target} into complete emotional despair", defense: "deflects the hit with the Hand of God" },
  "Egypt": { attack: "summons a mummy's curse upon {target}", defense: "hides behind a stone Sphinx wall" },
  "Senegal": { attack: "unleashes the Teranga Lions on {target}", defense: "dodges with drum-heavy rhythms" },
  "Austria": { attack: "sings 'The Sound of Music' off-key at {target}", defense: "retreats to the safety of the snowy Alps" },
  "Norway": { attack: "summons Thor to strike {target} with a freezing blizzard", defense: "blocks with a solid Viking shield" },
  "Scotland": { attack: "plays the bagpipes until {target}'s ears bleed", defense: "throws a massive caber to block the path" },
  "Japan": { attack: "delivers a high-speed anime-style katana slash to {target}", defense: "distracts them with a decoy sushi platter" },
  "Qatar": { attack: "blasts {target} with high-powered stadium air conditioning", defense: "buys out the opponent's contract" },
  "Paraguay": { attack: "performs a harp solo that puts {target} to sleep", defense: "hides in the dense Chaco forest" },
  "Portugal": { attack: "Siuuuu-blasts {target} with Cristiano's shockwave", defense: "blocks with a wall of salted codfish" },
  "Australia": { attack: "summons a horde of boxing kangaroos to punch {target}", defense: "throws a boomerang that intercepts the hit" },
  "Brazil": { attack: "joga-bonitos all over {target} with dizzying skill", defense: "dances a Samba that makes the attack slip by" },
  "Democratic Republic of the Congo": { attack: "unleashes a roaring jungle rumble on {target}", defense: "defends with a shield of raw copper" },
  "Jordan": { attack: "submerges {target} in the salty depths of the Dead Sea", defense: "hides behind the ancient cliffs of Petra" },
  "Cape Verde": { attack: "whips up a volcanic ash cloud on {target}", defense: "shelters in a cozy beach cove" },
  "Saudi Arabia": { attack: "subjects {target} to a scorching desert heatwave", defense: "blocks the hit with oil drums" },
  "Turkey": { attack: "whirls like a dervish and knocks {target} down", defense: "shields with a tray of boiling Turkish coffee" },
  "South Africa": { attack: "blows a deafening Vuvuzela directly into {target}'s face", defense: "dodges behind a safari jeep" },
  "Uzbekistan": { attack: "plows {target} down with a heavy Silk Road caravan", defense: "shields with a thick woven Suzani rug" },
  "Haiti": { attack: "summons mysterious voodoo spirits to haunt {target}", defense: "dodges with a carnival dance step" },
  "France": { attack: "slaps {target} with a stale, rock-hard baguette", defense: "protests the attack and refuses to participate" },
  "Tunisia": { attack: "charges {target} with Carthage war elephants", defense: "hides inside an ancient clay amphora" },
  "Ecuador": { attack: "drops {target} straight down from the Equator line", defense: "deflects using a Galapagos tortoise shell" },
  "Bosnia and Herzegovina": { attack: "drops a heavy stone bridge piece on {target}", defense: "takes cover in a cozy Sarajevo cafe" },
  "Mexico": { attack: "blasts {target} with atomic ghost pepper salsa", defense: "blocks using a giant sombrero" },
  "Czech Republic": { attack: "drowns {target} in a tidal wave of premium Pilsner beer", defense: "deflects with a heavy crystal goblet" },
  "Curaçao": { attack: "splashes {target} with burning blue curaçao liqueur", defense: "hides under a coral reef" },
  "Ivory Coast": { attack: "stampedes {target} with giant war elephants", defense: "blocks with a cocoa bean shield" },
  "United States": { attack: "hurls a 2000-calorie double cheeseburger at {target}", defense: "sues {target} for personal damages" },
  "Sweden": { attack: "forces {target} to assemble an IKEA flatpack without instructions", defense: "shields with a wooden Swedish meatball" },
  "South Korea": { attack: "blasts {target} with synchronized K-pop choreography", defense: "defends using a high-tech curved gaming monitor" },
  "Belgium": { attack: "smothers {target} under heavy waffles and dark chocolate", defense: "blocks the hit with a giant glass of Abbey beer" },
  "Canada": { attack: "pours boiling maple syrup on {target}", defense: "apologizes so profusely that {target} stops out of guilt" },
  "Germany": { attack: "runs over {target} on the Autobahn at 300 km/h", defense: "deploys a wall of hyper-efficient engineering" },
  "Croatia": { attack: "checkmates {target} with a red-and-white checkered shield", defense: "retreats to a gorgeous Adriatic yacht" },
  "Iraq": { attack: "summons ancient Babylonian spirits to strike {target}", defense: "shields with a clay tablet of Hammurabi's code" },
  "England": { attack: "complains about the weather until {target} loses the will to live", defense: "blocks the hit with an umbrella and a hot cup of tea" },
  "Uruguay": { attack: "bites {target} Suarez-style and steals the ball", defense: "blocks with a wall of intense mate gourds" },
  "Iran": { attack: "swallows {target} in a sandstorm of ancient ruins", defense: "leaps over the hit with quick reflexes" },
  "Panama": { attack: "swamps {target} with the locks of the Panama Canal", defense: "retreats into a fortress of canal brick" },
  "Colombia": { attack: "caffeinates to hyper-speed and runs around {target}", defense: "performs a spin that redirects the attack" },
  "Netherlands": { attack: "floods {target} with a bursting dike wave", defense: "blocks with a sturdy orange wooden clog" },
  "Argentina": { attack: "nutmegs {target} twice and shoots into the top corner", defense: "deflects the blow with a gold trophy shield" }
};

function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('loading'); // 'live', 'fallback', 'loading'
  
  // Leaderboard state
  const [selectedParticipantName, setSelectedParticipantName] = useState(draftData.participants[0].name);
  
  // Matches state
  const [stageFilter, setStageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Derby state
  const [playerAName, setPlayerAName] = useState(draftData.participants[0].name);
  const [playerBName, setPlayerBName] = useState(draftData.participants[1].name);
  
  // Fight Simulator state
  const [fightActive, setFightActive] = useState(false);
  const [fightLogs, setFightLogs] = useState([]);
  const [healthA, setHealthA] = useState(100);
  const [healthB, setHealthB] = useState(100);
  const fightIntervalRef = useRef(null);
  const arenaEndRef = useRef(null);

  // Fetch games on load
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://worldcup26.ir/get/games');
      if (!response.ok) throw new Error('API response not OK');
      const data = await response.json();
      if (data && data.games && data.games.length > 0) {
        setGames(data.games);
        setDataSource('live');
      } else {
        throw new Error('Empty games data');
      }
    } catch (error) {
      console.warn('Failed to fetch live games, using fallback cache:', error);
      setGames(fallbackGamesData.games);
      setDataSource('fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Scroll to bottom of fight arena
  useEffect(() => {
    if (arenaEndRef.current) {
      arenaEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [fightLogs]);

  // Derived datasets
  // 1. Team stats (points, wins, draws, losses, goals, progression)
  const teamStats = useMemo(() => {
    const stats = {};
    
    // Initialize stats for all drafted teams
    draftData.participants.forEach(p => {
      p.teams.forEach(team => {
        stats[team] = {
          name: team,
          group: '',
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          groupPoints: 0,
          stages: new Set(),
          bonusPoints: 0,
          totalPoints: 0,
          matchOutcomes: [], // Array of 'W', 'D', 'L' for recent matches
          eliminated: false
        };
      });
    });

    if (games.length === 0) return stats;

    const getWinner = (match) => {
      const hs = parseInt(match.home_score) || 0;
      const as = parseInt(match.away_score) || 0;
      if (hs > as) return 'home';
      if (as > hs) return 'away';
      
      // Check penalty shootouts
      const hps = parseInt(match.home_penalty_score) || 0;
      const aps = parseInt(match.away_penalty_score) || 0;
      if (hps > aps) return 'home';
      if (aps > hps) return 'away';
      
      return null;
    };

    // First scan to determine groups and basic group match stats
    games.forEach(g => {
      const isFinished = g.finished === 'TRUE';
      const home = g.home_team_name_en;
      const away = g.away_team_name_en;

      // Map group info
      if (g.type === 'group') {
        if (stats[home]) stats[home].group = g.group;
        if (stats[away]) stats[away].group = g.group;

        if (isFinished) {
          const hs = parseInt(g.home_score) || 0;
          const as = parseInt(g.away_score) || 0;

          if (stats[home]) {
            stats[home].played += 1;
            stats[home].gf += hs;
            stats[home].ga += as;
            stats[home].gd = stats[home].gf - stats[home].ga;
            if (hs > as) {
              stats[home].wins += 1;
              stats[home].groupPoints += 3;
              stats[home].matchOutcomes.push('W');
            } else if (hs === as) {
              stats[home].draws += 1;
              stats[home].groupPoints += 1;
              stats[home].matchOutcomes.push('D');
            } else {
              stats[home].losses += 1;
              stats[home].matchOutcomes.push('L');
            }
          }

          if (stats[away]) {
            stats[away].played += 1;
            stats[away].gf += as;
            stats[away].ga += hs;
            stats[away].gd = stats[away].gf - stats[away].ga;
            if (as > hs) {
              stats[away].wins += 1;
              stats[away].groupPoints += 3;
              stats[away].matchOutcomes.push('W');
            } else if (hs === as) {
              stats[away].draws += 1;
              stats[away].groupPoints += 1;
              stats[away].matchOutcomes.push('D');
            } else {
              stats[away].losses += 1;
              stats[away].matchOutcomes.push('L');
            }
          }
        }
      }

      // Check progression and knockout attendance
      const isKnockout = g.type !== 'group';
      if (isKnockout) {
        // If team is in a knockout match, it reached that stage
        const stage = g.type; // 'r32', 'r16', 'qf', 'sf', 'final', 'third'
        if (stats[home]) stats[home].stages.add(stage);
        if (stats[away]) stats[away].stages.add(stage);

        // Check if winner of the final
        if (isFinished && stage === 'final') {
          const winner = getWinner(g);
          if (winner === 'home' && stats[home]) {
            stats[home].stages.add('winner');
          } else if (winner === 'away' && stats[away]) {
            stats[away].stages.add('winner');
          }
        }
        
        // Winner of 3rd place gets 3rd place bonus
        if (isFinished && stage === 'third') {
          const winner = getWinner(g);
          if (winner === 'home' && stats[home]) {
            stats[home].stages.add('third_winner');
          } else if (winner === 'away' && stats[away]) {
            stats[away].stages.add('third_winner');
          }
        }
      }
    });

    // Calculate progression bonus points
    // Cumulative logic: R32 (+5), R16 (+8), QF (+12), SF (+18), Final (+25), Winner (+35), 3rd Winner (+5)
    Object.keys(stats).forEach(name => {
      const team = stats[name];
      let bonus = 0;
      if (team.stages.has('r32')) bonus += 5;
      if (team.stages.has('r16')) bonus += 8;
      if (team.stages.has('qf')) bonus += 12;
      if (team.stages.has('sf')) bonus += 18;
      if (team.stages.has('final')) bonus += 25;
      if (team.stages.has('winner')) bonus += 35;
      if (team.stages.has('third_winner')) bonus += 5;

      team.bonusPoints = bonus;
      team.totalPoints = team.groupPoints + team.bonusPoints;
    });

    // Determine elimination
    // A team is eliminated if it didn't make it to R32 (once R32 started/determined) or lost a knockout match
    const groupStageFinished = games.filter(g => g.type === 'group').every(g => g.finished === 'TRUE');
    const r32Started = games.some(g => g.type === 'r32' && g.time_elapsed !== 'notstarted');
    const r32Determined = games.some(g => g.type === 'r32' && g.home_team_name_en);
    const knockoutsDetermined = groupStageFinished || r32Started || r32Determined;
    
    Object.keys(stats).forEach(name => {
      const team = stats[name];
      
      // If R32 started/determined and this team didn't qualify, it's eliminated
      if (knockoutsDetermined && !team.stages.has('r32')) {
        team.eliminated = true;
        return;
      }

      // Check if they lost in a finished knockout match
      games.forEach(g => {
        if (g.finished === 'TRUE' && g.type !== 'group') {
          const home = g.home_team_name_en;
          const away = g.away_team_name_en;
          const winner = getWinner(g);
          
          if (winner === 'home' && away === name) {
            team.eliminated = true;
          } else if (winner === 'away' && home === name) {
            team.eliminated = true;
          }
        }
      });
    });

    return stats;
  }, [games]);

  // 2. Participant Standings
  const participants = useMemo(() => {
    return draftData.participants.map(p => {
      let groupPts = 0;
      let bonusPts = 0;
      let activeCount = 0;
      let winsCount = 0;

      const detailedTeams = p.teams.map(tName => {
        const stats = teamStats[tName] || { groupPoints: 0, bonusPoints: 0, totalPoints: 0, eliminated: false, wins: 0 };
        groupPts += stats.groupPoints;
        bonusPts += stats.bonusPoints;
        if (!stats.eliminated) activeCount += 1;
        winsCount += stats.wins;
        return {
          name: tName,
          flag: TEAM_FLAGS[tName] || "🏳️",
          stats
        };
      });

      const totalPts = groupPts + bonusPts;

      return {
        name: p.name,
        teams: detailedTeams,
        groupPts,
        bonusPts,
        totalPts,
        activeCount,
        winsCount
      };
    }).sort((a, b) => b.totalPts - a.totalPts || b.activeCount - a.activeCount || b.winsCount - a.winsCount);
  }, [teamStats]);

  // Selected participant details
  const selectedParticipant = useMemo(() => {
    return participants.find(p => p.name === selectedParticipantName);
  }, [participants, selectedParticipantName]);

  // Overall statistics for dashboard cards
  const statsSummary = useMemo(() => {
    let totalGoals = 0;
    let playedGamesCount = 0;
    let liveGamesCount = 0;

    games.forEach(g => {
      if (g.finished === 'TRUE') {
        playedGamesCount++;
        totalGoals += (parseInt(g.home_score) || 0) + (parseInt(g.away_score) || 0);
      } else if (g.time_elapsed !== 'notstarted') {
        liveGamesCount++;
        totalGoals += (parseInt(g.home_score) || 0) + (parseInt(g.away_score) || 0);
      }
    });

    return {
      totalGoals,
      playedGamesCount,
      liveGamesCount,
      leaderName: participants[0]?.name || 'N/A',
      leaderScore: participants[0]?.totalPts || 0
    };
  }, [games, participants]);

  // Group Standings dynamic calculation
  const groupsData = useMemo(() => {
    const groups = {};
    // Map of group letters to teams
    games.forEach(g => {
      if (g.type === 'group') {
        const home = g.home_team_name_en;
        const away = g.away_team_name_en;
        const groupLetter = g.group;

        if (!groups[groupLetter]) {
          groups[groupLetter] = {};
        }

        if (home && home !== '0') {
          if (!groups[groupLetter][home]) {
            groups[groupLetter][home] = { name: home, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
          }
        }
        if (away && away !== '0') {
          if (!groups[groupLetter][away]) {
            groups[groupLetter][away] = { name: away, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
          }
        }

        if (g.finished === 'TRUE') {
          const hs = parseInt(g.home_score) || 0;
          const as = parseInt(g.away_score) || 0;

          const hTeam = groups[groupLetter][home];
          const aTeam = groups[groupLetter][away];

          if (hTeam) {
            hTeam.p += 1;
            hTeam.gf += hs;
            hTeam.ga += as;
            hTeam.gd = hTeam.gf - hTeam.ga;
            if (hs > as) { hTeam.w += 1; hTeam.pts += 3; }
            else if (hs === as) { hTeam.d += 1; hTeam.pts += 1; }
            else { hTeam.l += 1; }
          }

          if (aTeam) {
            aTeam.p += 1;
            aTeam.gf += as;
            aTeam.ga += hs;
            aTeam.gd = aTeam.gf - aTeam.ga;
            if (as > hs) { aTeam.w += 1; aTeam.pts += 3; }
            else if (hs === as) { aTeam.d += 1; aTeam.pts += 1; }
            else { aTeam.l += 1; }
          }
        }
      }
    });

    // Convert to sorted lists
    const formattedGroups = {};
    Object.keys(groups).sort().forEach(groupLetter => {
      formattedGroups[groupLetter] = Object.values(groups[groupLetter]).sort((a, b) => {
        return b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name);
      });
    });

    return formattedGroups;
  }, [games]);

  // Which participant drafted which team helper
  const teamDraftOwner = useMemo(() => {
    const mapping = {};
    draftData.participants.forEach(p => {
      p.teams.forEach(t => {
        mapping[t] = p.name;
      });
    });
    return mapping;
  }, []);

  // Filtered games list
  const filteredGames = useMemo(() => {
    return games.filter(g => {
      // 1. Stage filter
      if (stageFilter !== 'all') {
        if (stageFilter === 'groups' && g.type !== 'group') return false;
        if (stageFilter === 'knockouts' && g.type === 'group') return false;
        if (stageFilter === 'r32' && g.type !== 'r32') return false;
        if (stageFilter === 'r16' && g.type !== 'r16') return false;
        if (stageFilter === 'qf' && g.type !== 'qf') return false;
        if (stageFilter === 'sf' && g.type !== 'sf') return false;
        if (stageFilter === 'final' && g.type !== 'final' && g.type !== 'third') return false;
      }

      // 2. Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const homeName = (g.home_team_name_en || '').toLowerCase();
        const awayName = (g.away_team_name_en || '').toLowerCase();
        const homeOwner = (teamDraftOwner[g.home_team_name_en] || '').toLowerCase();
        const awayOwner = (teamDraftOwner[g.away_team_name_en] || '').toLowerCase();
        const stageLabel = (g.group || g.type || '').toLowerCase();

        return (
          homeName.includes(query) ||
          awayName.includes(query) ||
          homeOwner.includes(query) ||
          awayOwner.includes(query) ||
          stageLabel.includes(query)
        );
      }

      return true;
    }).sort((a, b) => {
      // Sort: live first, then by match number/date
      const aLive = a.finished !== 'TRUE' && a.time_elapsed !== 'notstarted';
      const bLive = b.finished !== 'TRUE' && b.time_elapsed !== 'notstarted';
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      return parseInt(a.id) - parseInt(b.id);
    });
  }, [games, stageFilter, searchQuery, teamDraftOwner]);

  // Grouped filtered games by date
  const groupedGames = useMemo(() => {
    const groups = {};
    filteredGames.forEach(g => {
      // Extract date string (MM/DD/YYYY)
      const datePart = g.local_date.split(' ')[0] || 'Unknown Date';
      if (!groups[datePart]) {
        groups[datePart] = [];
      }
      groups[datePart].push(g);
    });
    return groups;
  }, [filteredGames]);

  // Derby / Head-to-Head details
  const playerA = useMemo(() => participants.find(p => p.name === playerAName), [participants, playerAName]);
  const playerB = useMemo(() => participants.find(p => p.name === playerBName), [participants, playerBName]);

  const derbyStats = useMemo(() => {
    if (!playerA || !playerB) return null;
    
    // Direct matches where playerA's team plays playerB's team
    const directMatches = games.filter(g => {
      const home = g.home_team_name_en;
      const away = g.away_team_name_en;
      const ownerH = teamDraftOwner[home];
      const ownerA = teamDraftOwner[away];

      return (
        (ownerH === playerAName && ownerA === playerBName) ||
        (ownerH === playerBName && ownerA === playerAName)
      );
    });

    // Calculate rivalry index (out of 100) based on points difference, match overlap, and active team counts
    const scoreDiff = Math.abs(playerA.totalPts - playerB.totalPts);
    const overlapWeight = directMatches.length * 15;
    const rivalryScore = Math.min(100, Math.max(10, 30 + scoreDiff * 3 + overlapWeight));

    let ratingLabel = 'Friendly Competitors';
    if (rivalryScore > 75) ratingLabel = 'Blood Feud / Bitter Rivals';
    else if (rivalryScore > 50) ratingLabel = 'Trash Talk Central';
    else if (rivalryScore > 30) ratingLabel = 'Healthy Rivalry';

    return {
      directMatches,
      rivalryScore,
      ratingLabel
    };
  }, [playerA, playerB, games, teamDraftOwner, playerAName, playerBName]);

  // Fight Simulation Logic
  const startFight = () => {
    if (fightActive) return;
    
    setFightActive(true);
    setHealthA(100);
    setHealthB(100);
    
    const logs = [
      `🔔 DERBY BRAWL: ${playerA.name} VS ${playerB.name}!`,
      `⚔️ Arena is packed. Let's see whose drafted teams can kick some butt!`,
    ];
    setFightLogs(logs);

    let curHealthA = 100;
    let curHealthB = 100;
    let turn = Math.random() > 0.5 ? 'A' : 'B';

    fightIntervalRef.current = setInterval(() => {
      if (turn === 'A') {
        // Player A attacks Player B
        const randomTeam = playerA.teams[Math.floor(Math.random() * playerA.teams.length)];
        const moveDetails = TEAM_MOVES[randomTeam.name] || { attack: "attacks {target} with their squad", defense: "defends" };
        const attackTxt = moveDetails.attack.replace('{target}', playerB.name);
        
        // Random damage
        let dmg = Math.floor(Math.random() * 14) + 8; // 8 to 21
        let isSpecial = Math.random() > 0.75;
        if (isSpecial) dmg += 6;

        // Opponent defends
        const defTeam = playerB.teams[Math.floor(Math.random() * playerB.teams.length)];
        const defMoveDetails = TEAM_MOVES[defTeam.name] || { attack: "attacks", defense: "defends" };
        const defTxt = defMoveDetails.defense;
        const block = Math.floor(Math.random() * 5) + 2; // 2 to 6 blocked
        
        dmg = Math.max(2, dmg - block);
        curHealthB = Math.max(0, curHealthB - dmg);
        
        const emoji = randomTeam.flag;
        const defEmoji = defTeam.flag;

        setFightLogs(prev => [
          ...prev,
          `🔥 [${emoji} ${randomTeam.name}] ${playerA.name} ${attackTxt}!${isSpecial ? " (CRITICAL STRIKE!)" : ""}`,
          `🛡️ [${defEmoji} ${defTeam.name}] ${playerB.name} ${defTxt}, absorbing ${block} damage.`,
          `💥 Dealt ${dmg} damage to ${playerB.name}! (${playerB.name} Health: ${curHealthB}%)`
        ]);
        setHealthB(curHealthB);

        if (curHealthB <= 0) {
          clearInterval(fightIntervalRef.current);
          setFightActive(false);
          setFightLogs(prev => [
            ...prev,
            `🏆 VICTORY! ${playerA.name} has knocked out ${playerB.name} in the derby!`,
            `🎉 Standings point supremacy confirmed! ${playerA.name} takes the bragging rights!`
          ]);
          return;
        }
        turn = 'B';
      } else {
        // Player B attacks Player A
        const randomTeam = playerB.teams[Math.floor(Math.random() * playerB.teams.length)];
        const moveDetails = TEAM_MOVES[randomTeam.name] || { attack: "attacks {target} with their squad", defense: "defends" };
        const attackTxt = moveDetails.attack.replace('{target}', playerA.name);
        
        let dmg = Math.floor(Math.random() * 14) + 8;
        let isSpecial = Math.random() > 0.75;
        if (isSpecial) dmg += 6;

        // Opponent defends
        const defTeam = playerA.teams[Math.floor(Math.random() * playerA.teams.length)];
        const defMoveDetails = TEAM_MOVES[defTeam.name] || { attack: "attacks", defense: "defends" };
        const defTxt = defMoveDetails.defense;
        const block = Math.floor(Math.random() * 5) + 2;
        
        dmg = Math.max(2, dmg - block);
        curHealthA = Math.max(0, curHealthA - dmg);

        const emoji = randomTeam.flag;
        const defEmoji = defTeam.flag;

        setFightLogs(prev => [
          ...prev,
          `🔥 [${emoji} ${randomTeam.name}] ${playerB.name} ${attackTxt}!${isSpecial ? " (CRITICAL STRIKE!)" : ""}`,
          `🛡️ [${defEmoji} ${defTeam.name}] ${playerA.name} ${defTxt}, absorbing ${block} damage.`,
          `💥 Dealt ${dmg} damage to ${playerA.name}! (${playerA.name} Health: ${curHealthA}%)`
        ]);
        setHealthA(curHealthA);

        if (curHealthA <= 0) {
          clearInterval(fightIntervalRef.current);
          setFightActive(false);
          setFightLogs(prev => [
            ...prev,
            `🏆 VICTORY! ${playerB.name} has knocked out ${playerA.name} in the derby!`,
            `🎉 Standings point supremacy confirmed! ${playerB.name} takes the bragging rights!`
          ]);
          return;
        }
        turn = 'A';
      }
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (fightIntervalRef.current) clearInterval(fightIntervalRef.current);
    };
  }, []);

  return (
    <div className="app-container fade-in">
      <header>
        <div className="header-title-container">
          <div className="header-logo">
            <Trophy size={28} />
          </div>
          <div>
            <h1>World Cup 2026</h1>
            <div className="header-subtitle">Research Group Sweeps</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {dataSource === 'live' && (
            <span className="badge badge-live">
              <span className="live-dot"></span> Live API
            </span>
          )}
          {dataSource === 'fallback' && (
            <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              Offline Cache
            </span>
          )}
          
          <button onClick={fetchGames} className="badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: '6px 12px' }} disabled={loading}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>

          <nav>
            <button 
              className={`nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              <Trophy size={16} /> Leaderboard
            </button>
            <button 
              className={`nav-btn ${activeTab === 'derby' ? 'active' : ''}`}
              onClick={() => setActiveTab('derby')}
            >
              <Swords size={16} /> Derby
            </button>
            <button 
              className={`nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              <Calendar size={16} /> Matches
            </button>
            <button 
              className={`nav-btn ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              <Table size={16} /> Groups
            </button>
          </nav>
        </div>
      </header>

      {/* Dashboard Summary Cards */}
      <div className="summary-bar">
        <div className="stat-card">
          <div className="stat-icon primary">
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Current Leader</span>
            <span className="stat-value">{statsSummary.leaderName} ({statsSummary.leaderScore} pts)</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Goals Scored</span>
            <span className="stat-value">{statsSummary.totalGoals}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Matches Played</span>
            <span className="stat-value">{statsSummary.playedGamesCount} / 104</span>
          </div>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '16px' }}>
          <RefreshCw size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Fetching the latest match details from API...</p>
        </div>
      )}

      {!loading && (
        <main className="slide-up">
          {/* LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <>
            <div className="grid-container">
              {/* Leaderboard Table Card */}
              <div className="dashboard-card">
                <div className="card-header">
                  <h2 className="card-title">Group Leaderboard</h2>
                  <span className="badge">{participants.length} Contenders</span>
                </div>
                <div className="leaderboard-table-container">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th style={{ width: '60px', textAlign: 'center' }}>Pos</th>
                        <th>Participant</th>
                        <th style={{ textAlign: 'center' }}>Wins</th>
                        <th style={{ textAlign: 'center' }}>Active Teams</th>
                        <th style={{ textAlign: 'right' }}>Total Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((p, idx) => {
                        const isSelected = p.name === selectedParticipantName;
                        let rankClass = 'rank-other';
                        if (idx === 0) rankClass = 'rank-1';
                        else if (idx === 1) rankClass = 'rank-2';
                        else if (idx === 2) rankClass = 'rank-3';

                        return (
                          <tr 
                            key={p.name}
                            className={`leaderboard-row ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedParticipantName(p.name)}
                          >
                            <td>
                              <div className={`rank-cell ${rankClass}`}>
                                {idx + 1}
                              </div>
                            </td>
                            <td>
                              <div className="name-cell">
                                <span>{p.name}</span>
                                <div className="drafted-teams-preview">
                                  {p.teams.map(t => (
                                    <span 
                                      key={t.name}
                                      className={`mini-flag-badge ${t.stats.eliminated ? 'eliminated' : 'active'}`}
                                      title={`${t.name} (${t.stats.eliminated ? 'Eliminated' : 'Active'})`}
                                    >
                                      {t.flag} {t.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="stat-cell-num" style={{ textAlign: 'center' }}>{p.winsCount}</td>
                            <td className="stat-cell-num" style={{ textAlign: 'center' }}>
                              <span style={{ color: p.activeCount > 0 ? 'var(--primary)' : 'var(--danger)' }}>
                                {p.activeCount} / 6
                              </span>
                            </td>
                            <td className="points-cell" style={{ textAlign: 'right' }}>{p.totalPts}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detail Panel Card */}
              {selectedParticipant && (
                <div className="detail-panel">
                  <div className="detail-header">
                    <h3>{selectedParticipant.name}'s Squad</h3>
                    <p>
                      Standing in position #{participants.findIndex(p => p.name === selectedParticipant.name) + 1} • {selectedParticipant.activeCount} teams still in play.
                    </p>
                  </div>

                  <div className="detail-teams-grid">
                    {selectedParticipant.teams.map(t => (
                      <div key={t.name} className="team-row-card">
                        <div className="team-name-group">
                          <div className="team-avatar-flag">{t.flag}</div>
                          <div className="team-title">
                            <span>{t.name}</span>
                            <span className="team-subtitle">Group {t.stats.group || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="team-scores">
                          {t.stats.matchOutcomes.length > 0 && (
                            <div className="team-outcome-dots">
                              {t.stats.matchOutcomes.map((outcome, oIdx) => (
                                <span 
                                  key={oIdx} 
                                  className={`outcome-dot ${outcome}`} 
                                  title={outcome === 'W' ? 'Win' : outcome === 'D' ? 'Draw' : 'Loss'}
                                ></span>
                              ))}
                            </div>
                          )}
                          <div>
                            {t.stats.eliminated ? (
                              <span className="eliminated-tag">Eliminated</span>
                            ) : (
                              <span className="active-tag">Active</span>
                            )}
                          </div>
                          <div className="team-contrib-pts">
                            <div className="pts-num">+{t.stats.totalPoints}</div>
                            <div className="pts-lbl">pts</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Group Stage Points:</span>
                      <span style={{ fontWeight: '600' }}>{selectedParticipant.groupPts} pts</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Knockout Progression Bonus:</span>
                      <span style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>+{selectedParticipant.bonusPts} pts</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '700', borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                      <span>Total Contribution:</span>
                      <span style={{ color: 'var(--primary)' }}>{selectedParticipant.totalPts} pts</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="dashboard-card" style={{ marginTop: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 className="card-title" style={{ fontSize: '18px', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={18} /> Points & Rules Legend
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', fontSize: '14px' }}>
                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', fontWeight: '600' }}>Match Outcomes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <span>Win (Group Stage)</span>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>3 pts</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <span>Draw (Group Stage)</span>
                      <span style={{ fontWeight: '700', color: 'var(--warning)' }}>1 pt</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <span>Loss (Group Stage)</span>
                      <span style={{ fontWeight: '700', color: 'var(--danger)' }}>0 pts</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', fontWeight: '600' }}>Knockout Progression (Cumulative Bonus)</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>R32</span>
                      <span style={{ color: 'var(--text-main)' }}>+5 pts</span>
                    </div>
                    <div style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>R16</span>
                      <span style={{ color: 'var(--text-main)' }}>+8 pts</span>
                    </div>
                    <div style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>QF</span>
                      <span style={{ color: 'var(--text-main)' }}>+12 pts</span>
                    </div>
                    <div style={{ background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>SF</span>
                      <span style={{ color: 'var(--text-main)' }}>+18 pts</span>
                    </div>
                    <div style={{ background: 'rgba(255, 215, 0, 0.08)', border: '1px solid rgba(255, 215, 0, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>Final</span>
                      <span style={{ color: 'var(--text-main)' }}>+25 pts</span>
                    </div>
                    <div style={{ background: 'rgba(0, 255, 135, 0.08)', border: '1px solid rgba(0, 255, 135, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: '700' }}>🏆 Champion</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>+35 pts</span>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ color: 'var(--warning)', fontWeight: '600' }}>🥉 3rd Place</span>
                      <span style={{ color: 'var(--text-main)' }}>+5 pts</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', fontStyle: 'italic' }}>
                    * Progression bonuses are cumulative. Reaching a stage earns its respective points, building up as a team advances.
                  </p>
                </div>
              </div>
            </div>
            </>
          )}

          {/* DERBY / HEAD TO HEAD TAB */}
          {activeTab === 'derby' && playerA && playerB && (
            <div className="derby-container">
              {/* Selectors */}
              <div className="derby-selectors">
                <div className="player-select-box">
                  <label>Contender A</label>
                  <div className="select-wrapper">
                    <select value={playerAName} onChange={e => setPlayerAName(e.target.value)}>
                      {draftData.participants.map(p => (
                        <option key={p.name} value={p.name} disabled={p.name === playerBName}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="vs-divider">VS</div>

                <div className="player-select-box">
                  <label>Contender B</label>
                  <div className="select-wrapper">
                    <select value={playerBName} onChange={e => setPlayerBName(e.target.value)}>
                      {draftData.participants.map(p => (
                        <option key={p.name} value={p.name} disabled={p.name === playerAName}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Comparison Stats & Rivalry Indicator */}
              <div className="derby-dashboard">
                <div className="derby-comparison-grid">
                  {/* Player A Stats */}
                  <div className={`derby-side-card ${playerA.totalPts > playerB.totalPts ? 'winner-glow' : ''}`}>
                    <div className="derby-side-header">
                      <span className="derby-side-name">{playerA.name}</span>
                      <span className="derby-side-score">{playerA.totalPts} pts</span>
                    </div>
                    <div className="derby-side-list">
                      {playerA.teams.map(t => (
                        <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '4px' }}>
                          <span style={{ textDecoration: t.stats.eliminated ? 'line-through' : 'none', opacity: t.stats.eliminated ? 0.5 : 1 }}>
                            {t.flag} {t.name}
                          </span>
                          <span style={{ fontWeight: '700', color: t.stats.eliminated ? 'var(--text-dark)' : 'var(--accent-blue)' }}>
                            +{t.stats.totalPoints} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Player B Stats */}
                  <div className={`derby-side-card ${playerB.totalPts > playerA.totalPts ? 'winner-glow' : ''}`}>
                    <div className="derby-side-header">
                      <span className="derby-side-name">{playerB.name}</span>
                      <span className="derby-side-score">{playerB.totalPts} pts</span>
                    </div>
                    <div className="derby-side-list">
                      {playerB.teams.map(t => (
                        <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', background: 'rgba(255,255,255,0.01)', padding: '8px 12px', borderRadius: '4px' }}>
                          <span style={{ textDecoration: t.stats.eliminated ? 'line-through' : 'none', opacity: t.stats.eliminated ? 0.5 : 1 }}>
                            {t.flag} {t.name}
                          </span>
                          <span style={{ fontWeight: '700', color: t.stats.eliminated ? 'var(--text-dark)' : 'var(--accent-blue)' }}>
                            +{t.stats.totalPoints} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rivalry Index meter */}
                {derbyStats && (
                  <div className="rivalry-stats-card">
                    <span className="rivalry-rating-label">Rivalry Intensity Index</span>
                    <span className="rivalry-rating-text" style={{ color: derbyStats.rivalryScore > 75 ? 'var(--danger)' : derbyStats.rivalryScore > 50 ? 'var(--warning)' : 'var(--primary)' }}>
                      {derbyStats.rivalryScore}% — {derbyStats.ratingLabel}
                    </span>
                    <div className="rivalry-meter-container">
                      <div className="rivalry-meter-fill" style={{ width: `${derbyStats.rivalryScore}%` }}></div>
                      <div className="rivalry-meter-marker" style={{ left: `${derbyStats.rivalryScore}%` }}></div>
                    </div>

                    <table className="stats-table">
                      <tbody>
                        <tr className="stats-table-row">
                          <td className="stats-table-val left">{playerA.activeCount}</td>
                          <td className="stats-table-lbl">Active Teams</td>
                          <td className="stats-table-val right">{playerB.activeCount}</td>
                        </tr>
                        <tr className="stats-table-row">
                          <td className="stats-table-val left">{playerA.winsCount}</td>
                          <td className="stats-table-lbl">Total Wins</td>
                          <td className="stats-table-val right">{playerB.winsCount}</td>
                        </tr>
                        <tr className="stats-table-row">
                          <td className="stats-table-val left">{playerA.groupPts}</td>
                          <td className="stats-table-lbl">Group Stage Pts</td>
                          <td className="stats-table-val right">{playerB.groupPts}</td>
                        </tr>
                        <tr className="stats-table-row">
                          <td className="stats-table-val left">{playerA.bonusPts}</td>
                          <td className="stats-table-lbl">Progress Bonus Pts</td>
                          <td className="stats-table-val right">{playerB.bonusPts}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Direct Matchups list */}
                {derbyStats && derbyStats.directMatches.length > 0 && (
                  <div className="dashboard-card">
                    <h3 className="card-title"><Calendar size={18} /> Direct Head-to-Head Matches ({derbyStats.directMatches.length})</h3>
                    <div className="matches-grid">
                      {derbyStats.directMatches.map(g => {
                        const hs = g.home_score;
                        const as = g.away_score;
                        const isFinished = g.finished === 'TRUE';
                        const isLive = g.finished !== 'TRUE' && g.time_elapsed !== 'notstarted';

                        return (
                          <div key={g.id} className={`match-card ${isLive ? 'live' : ''}`}>
                            <div className="match-card-meta">
                              <span>Match #{g.id}</span>
                              <span className="match-stage-badge">{g.group ? `Group ${g.group}` : g.type}</span>
                            </div>
                            <div className="match-card-main">
                              <div className="match-team home">
                                <div>
                                  <span>{TEAM_FLAGS[g.home_team_name_en] || "🏳️"} {g.home_team_name_en}</span>
                                  <div className="drafted-by-tag">{teamDraftOwner[g.home_team_name_en]}</div>
                                </div>
                              </div>
                              <div className="match-score-section">
                                <span className="score-box">{isFinished || isLive ? hs : '-'}</span>
                                <span className="score-divider">:</span>
                                <span className="score-box">{isFinished || isLive ? as : '-'}</span>
                              </div>
                              <div className="match-team away">
                                <div>
                                  <span>{TEAM_FLAGS[g.away_team_name_en] || "🏳️"} {g.away_team_name_en}</span>
                                  <div className="drafted-by-tag other-player">{teamDraftOwner[g.away_team_name_en]}</div>
                                </div>
                              </div>
                            </div>
                            <div className="match-time-label">
                              {g.local_date}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Funny Brawl Simulator Arena */}
                <div className="brawl-card">
                  <div className="brawl-header">
                    <span className="brawl-title"><Swords size={20} /> Staff Brawl Arena (Derby Fight Simulator)</span>
                    <span className="badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Beta Brawl Mode</span>
                  </div>

                  <div className="brawl-healthbar-container">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                        <span>{playerA.name}</span>
                        <span>{healthA}%</span>
                      </div>
                      <div className="health-track">
                        <div className="health-fill left" style={{ width: `${healthA}%` }}></div>
                      </div>
                    </div>
                    <div className="brawl-versus-text">VS</div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
                        <span>{playerB.name}</span>
                        <span>{healthB}%</span>
                      </div>
                      <div className="health-track">
                        <div className="health-fill" style={{ width: `${healthB}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="brawl-arena">
                    {fightLogs.length === 0 ? (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dark)', fontSize: '14px', fontStyle: 'italic' }}>
                        Press the Simulate Fight button to begin the clash...
                      </div>
                    ) : (
                      fightLogs.map((log, lIdx) => {
                        let logClass = 'brawl-log-entry';
                        if (log.startsWith('🔥')) logClass += ' damage';
                        else if (log.startsWith('🛡️')) logClass += ' defense';
                        else if (log.startsWith('🔔') || log.startsWith('⚔️') || log.startsWith('💥')) logClass += ' system';
                        else if (log.startsWith('🏆') || log.startsWith('🎉')) logClass += ' victory';

                        return (
                          <div key={lIdx} className={logClass}>
                            {log}
                          </div>
                        );
                      })
                    )}
                    <div ref={arenaEndRef} />
                  </div>

                  <button 
                    className="brawl-btn" 
                    onClick={startFight}
                    disabled={fightActive}
                  >
                    <Play size={16} /> {fightActive ? 'Brawling...' : 'Simulate Fight'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MATCHES LIST TAB */}
          {activeTab === 'matches' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="matches-controls">
                <div className="stage-filters">
                  <button className={`filter-btn ${stageFilter === 'all' ? 'active' : ''}`} onClick={() => setStageFilter('all')}>All</button>
                  <button className={`filter-btn ${stageFilter === 'groups' ? 'active' : ''}`} onClick={() => setStageFilter('groups')}>Groups</button>
                  <button className={`filter-btn ${stageFilter === 'r32' ? 'active' : ''}`} onClick={() => setStageFilter('r32')}>R32</button>
                  <button className={`filter-btn ${stageFilter === 'r16' ? 'active' : ''}`} onClick={() => setStageFilter('r16')}>R16</button>
                  <button className={`filter-btn ${stageFilter === 'qf' ? 'active' : ''}`} onClick={() => setStageFilter('qf')}>QF</button>
                  <button className={`filter-btn ${stageFilter === 'sf' ? 'active' : ''}`} onClick={() => setStageFilter('sf')}>SF</button>
                  <button className={`filter-btn ${stageFilter === 'final' ? 'active' : ''}`} onClick={() => setStageFilter('final')}>Final / 3rd</button>
                </div>

                <div className="search-input-wrapper">
                  <Search size={16} className="search-icon-pos" />
                  <input 
                    type="text" 
                    placeholder="Search country or owner..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredGames.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                  No matches match your filter or search query.
                </div>
              ) : (
                <div className="matches-list">
                  {Object.keys(groupedGames).sort((a,b) => new Date(a) - new Date(b)).map(date => (
                    <div key={date} className="match-date-group">
                      <div className="match-date-header">{date}</div>
                      <div className="matches-grid">
                        {groupedGames[date].map(g => {
                          const hs = g.home_score;
                          const as = g.away_score;
                          const isFinished = g.finished === 'TRUE';
                          const isLive = g.finished !== 'TRUE' && g.time_elapsed !== 'notstarted';

                          // Highlight owners
                          const homeOwner = teamDraftOwner[g.home_team_name_en];
                          const awayOwner = teamDraftOwner[g.away_team_name_en];

                          return (
                            <div key={g.id} className={`match-card ${isLive ? 'live' : ''}`}>
                              <div className="match-card-meta">
                                <span>Match #{g.id}</span>
                                <span className="match-stage-badge">{g.group ? `Group ${g.group}` : g.type.toUpperCase()}</span>
                              </div>
                              <div className="match-card-main">
                                <div className="match-team home">
                                  <div>
                                    <span>{TEAM_FLAGS[g.home_team_name_en] || "🏳️"} {g.home_team_name_en || g.home_team_label}</span>
                                    {homeOwner && <div className="drafted-by-tag">{homeOwner}</div>}
                                  </div>
                                </div>
                                <div className="match-score-section">
                                  <span className="score-box">{isFinished || isLive ? hs : '-'}</span>
                                  <span className="score-divider">:</span>
                                  <span className="score-box">{isFinished || isLive ? as : '-'}</span>
                                </div>
                                <div className="match-team away">
                                  <div>
                                    <span>{TEAM_FLAGS[g.away_team_name_en] || "🏳️"} {g.away_team_name_en || g.away_team_label}</span>
                                    {awayOwner && <div className="drafted-by-tag other-player">{awayOwner}</div>}
                                  </div>
                                </div>
                              </div>
                              <div className="match-time-label">
                                {g.local_date.split(' ')[1] || ''} Local Time
                                {isLive && <span style={{ color: 'var(--danger)', marginLeft: '8px', fontWeight: 'bold' }}>• LIVE ({g.time_elapsed}')</span>}
                                {isFinished && <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>• FT</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GROUPS VIEW TAB */}
          {activeTab === 'groups' && (
            <div className="groups-grid">
              {Object.keys(groupsData).sort().map(groupLetter => (
                <div key={groupLetter} className="group-card">
                  <div className="group-title">Group {groupLetter}</div>
                  <table className="group-table">
                    <thead>
                      <tr>
                        <th>Team</th>
                        <th className="num">P</th>
                        <th className="num">GD</th>
                        <th className="num" style={{ textAlign: 'right' }}>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupsData[groupLetter].map(team => {
                        const owner = teamDraftOwner[team.name];
                        const flag = TEAM_FLAGS[team.name] || "🏳️";

                        return (
                          <tr key={team.name} className="group-table-row">
                            <td>
                              <div className={`group-team-name ${owner ? 'drafted' : ''}`}>
                                <span>{flag} {team.name}</span>
                                {owner && <span className="draft-owner-indicator" title={`Drafted by ${owner}`}>{owner[0]}</span>}
                              </div>
                            </td>
                            <td className="num">{team.p}</td>
                            <td className="num" style={{ color: team.gd > 0 ? 'var(--primary)' : team.gd < 0 ? 'var(--danger)' : 'inherit' }}>
                              {team.gd > 0 ? `+${team.gd}` : team.gd}
                            </td>
                            <td className="num pts" style={{ textAlign: 'right' }}>{team.pts}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
