import React, { useState, useMemo, useRef } from 'react';
import {
  Fish,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  PlusCircle,
  Search,
  Coins,
  CheckCircle2,
  XCircle,
  Award,
  Info,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  Flag,
  ShoppingBag,
  CreditCard,
  Smartphone,
  ArrowLeft,
  Receipt,
  Check,
  Map as MapIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Gift,
  Copy,
} from 'lucide-react';

const UNLOCK_COST_PT = 350;
const MAX_POST_REWARD_PT = 25;

const POINT_PACKS = [
  { id: 'pack-350', pt: 350, yen: 350, rateLabel: '1.00円/pt', tag: '基本プラン（1回分）', highlight: false },
  { id: 'pack-750', pt: 750, yen: 700, rateLabel: '約0.93円/pt', tag: '50ptお得', highlight: false },
  { id: 'pack-1500', pt: 1500, yen: 1300, rateLabel: '約0.87円/pt', tag: '人気・200ptお得', highlight: true },
  { id: 'pack-3500', pt: 3500, yen: 2800, rateLabel: '0.80円/pt', tag: '最安・700ptお得', highlight: false },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'クレジットカード', sub: 'Visa / Mastercard / JCB / AMEX' },
  { id: 'paypay', label: 'PayPay', sub: '残高・あと払い連携' },
  { id: 'wallet_pay', label: 'Apple Pay / Google Pay', sub: 'ワンタッチ決済' },
];

const EXCHANGE_REWARDS = [
  {
    id: 'ex-amzn-300',
    brand: 'Amazonギフト券',
    denomination: '300円分',
    costPt: 300,
    badge: '定番',
    accentBg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    prefix: 'AMZN',
  },
  {
    id: 'ex-amzn-500',
    brand: 'Amazonギフト券',
    denomination: '500円分',
    costPt: 500,
    badge: '人気',
    accentBg: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
    prefix: 'AMZN',
  },
  {
    id: 'ex-amzn-1000',
    brand: 'Amazonギフト券',
    denomination: '1,000円分',
    costPt: 950,
    badge: '50ptお得',
    accentBg: 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
    prefix: 'AMZN',
  },
  {
    id: 'ex-paypay-500',
    brand: 'PayPayポイント / QUOカードPay',
    denomination: '500円分',
    costPt: 500,
    badge: '使いやすい',
    accentBg: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
    prefix: 'GIFT',
  },
];

function calcDetailRewardPt({ spot, tackle, tide, note }) {
  const fields = [spot, tackle, tide, note].map((s) => (s || '').trim());
  let score = 0;

  fields.forEach((val) => {
    if (val.length > 0) score += 3;
    if (val.length >= 12) score += 2;
    if (val.length >= 24) score += 2;
  });

  const filledCount = fields.filter((v) => v.length > 0).length;
  if (filledCount === 4) score += 1;
  if (filledCount === 4 && fields.every((v) => v.length >= 10)) score += 1;

  return Math.max(0, Math.min(MAX_POST_REWARD_PT, score));
}

function generateDemoCode(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const block = (len) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}-${block(4)}-${block(4)}`;
}

// 日本地図SVG (viewBox: 0 0 800 620) 上のおおよその座標
const INITIAL_CATCHES = [
  {
    id: 'catch-1',
    anglerName: '高知の潮読み',
    anglerHandle: '@tosashio',
    trustScore: 94,
    verifiedCount: 38,
    fishSpecies: 'マダイ',
    sizeCm: 54,
    approxArea: '高知県・浦戸湾〜桂浜周辺エリア',
    mapPos: { x: 356, y: 446 },
    caughtAt: '2026-11-25 06:15',
    pricePt: UNLOCK_COST_PT,
    photoUrl: '',
    bannerBg: 'linear-gradient(135deg, #be123c 0%, #e11d48 45%, #fb7185 100%)',
    badgeColor: '#fef08a',
    verified: true,
    checks: { liveCam: true, gps: true, weather: true },
    verifyNote: 'ライブカメラ署名・指定エリアGPS圏内・当日の潮位と風向データに整合。',
    locked: {
      spot: '東側テトラ帯の潮目ヨレ（水深約6〜8m・岸から約25mのブレイクライン）',
      tackle: 'TGベイト 40g（赤金）＋ケイムラアシストフック・PE0.8号＋リーダー3号',
      tide: '中潮・上げ五分 / 水温 19.8℃ / 北西風 4m / 晴れ',
      note: '夜明け直後の表層〜中層ただ巻きで反応集中。着底後はすぐ巻き上げを開始し、潮が効く層をキープ。',
    },
    helpful: 14,
    disputed: 0,
  },
  {
    id: 'catch-2',
    anglerName: '瀬戸内アジンガーK',
    anglerHandle: '@setouchi_aji',
    trustScore: 88,
    verifiedCount: 21,
    fishSpecies: 'アオリイカ',
    sizeCm: 31,
    approxArea: '香川県・庵治〜志度周辺エリア',
    mapPos: { x: 374, y: 406 },
    caughtAt: '2026-11-24 21:40',
    pricePt: UNLOCK_COST_PT,
    photoUrl: '',
    bannerBg: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #c026d3 100%)',
    badgeColor: '#fbcfe8',
    verified: true,
    checks: { liveCam: true, gps: true, weather: true },
    verifyNote: '現場撮影タイムスタンプ一致・エリア内確認・夜間気温と潮位データに整合。',
    locked: {
      spot: '常夜灯の明暗が落ちるスロープ脇（敷石と砂地の境目）',
      tackle: 'エギ王 K 3.5号（ムラムラチェリー）・PE0.6号＋リーダー2号',
      tide: '小潮・下げ三分 / 水温 18.5℃ / 微風 / 曇り',
      note: 'ボトムを取ってから2段シャクリ＋3秒ステイ。明暗の境目を通すコースで抱きが集中。',
    },
    helpful: 9,
    disputed: 0,
  },
  {
    id: 'catch-3',
    anglerName: 'サーフハンター',
    anglerHandle: '@surf_runner',
    trustScore: 52,
    verifiedCount: 4,
    fishSpecies: 'ヒラメ',
    sizeCm: 62,
    approxArea: '宮崎県・一ツ瀬川河口周辺エリア',
    mapPos: { x: 252, y: 492 },
    caughtAt: '2026-11-23 05:50',
    pricePt: UNLOCK_COST_PT,
    photoUrl: '',
    bannerBg: 'linear-gradient(135deg, #0369a1 0%, #0d9488 50%, #2dd4bf 100%)',
    badgeColor: '#fef08a',
    verified: false,
    checks: { liveCam: false, gps: true, weather: false },
    verifyNote: 'カメラロール選択画像・該当時刻に波浪注意報（波高3.2m）が出ている一方、背景海面が凪のため要確認。',
    locked: {
      spot: '離岸流が作るカケアガリ手前（波が割れるラインの外側）',
      tackle: 'シンキングペンシル 120mm（イワシ）・PE1.0号＋リーダー5号',
      tide: '大潮・満潮前後 / 水温 21.0℃ / 東風 5m',
      note: '朝マズメの払い出し狙い。スローリトリーブで流れの変化を感じた瞬間にヒット。',
    },
    helpful: 2,
    disputed: 3,
  },
];

function JapanMapSvg({ onCanvasClick }) {
  return (
    <g onClick={onCanvasClick} style={{ cursor: 'inherit' }}>
      <g stroke="rgba(125, 211, 252, 0.14)" strokeWidth="1" strokeDasharray="4 4">
        <line x1="0" y1="120" x2="800" y2="120" />
        <line x1="0" y1="240" x2="800" y2="240" />
        <line x1="0" y1="360" x2="800" y2="360" />
        <line x1="0" y1="480" x2="800" y2="480" />
        <line x1="200" y1="0" x2="200" y2="620" />
        <line x1="400" y1="0" x2="400" y2="620" />
        <line x1="600" y1="0" x2="600" y2="620" />
      </g>

      <path
        d="M520 75 L610 55 L685 88 L715 135 L665 172 L595 168 L535 142 L505 110 Z"
        fill="#1e3a5f"
        stroke="#7dd3fc"
        strokeWidth="2"
      />
      <text x="605" y="118" fill="#bae6fd" fontSize="14" fontWeight="800" textAnchor="middle">
        北海道
      </text>

      <path
        d="M530 185 L575 215 L555 275 L515 335 L465 372 L405 395 L325 402 L278 415 L295 375 L355 352 L425 322 L472 268 L502 215 Z"
        fill="#1e3a5f"
        stroke="#7dd3fc"
        strokeWidth="2"
      />
      <text x="515" y="255" fill="#bae6fd" fontSize="13" fontWeight="800">
        東北
      </text>
      <text x="492" y="348" fill="#bae6fd" fontSize="13" fontWeight="800">
        関東・中部
      </text>
      <text x="368" y="384" fill="#bae6fd" fontSize="13" fontWeight="800" textAnchor="middle">
        関西・中国
      </text>

      <path
        d="M312 428 L385 415 L396 446 L342 464 L305 452 Z"
        fill="#1e40af"
        stroke="#93c5fd"
        strokeWidth="2"
      />
      <text x="352" y="443" fill="#eff6ff" fontSize="12" fontWeight="800" textAnchor="middle">
        四国
      </text>

      <path
        d="M210 432 L268 426 L282 478 L254 532 L212 522 L198 475 Z"
        fill="#1e3a5f"
        stroke="#7dd3fc"
        strokeWidth="2"
      />
      <text x="242" y="476" fill="#bae6fd" fontSize="13" fontWeight="800" textAnchor="middle">
        九州
      </text>

      <text x="155" y="320" fill="rgba(125,211,252,0.45)" fontSize="16" fontWeight="900">
        日本海
      </text>
      <text x="520" y="485" fill="rgba(125,211,252,0.45)" fontSize="18" fontWeight="900">
        太平洋
      </text>
    </g>
  );
}

function FishArtwork({ species }) {
  if (species.includes('アオリイカ') || species.includes('イカ')) {
    return (
      <svg viewBox="0 0 260 120" style={{ width: 210, height: 96 }} fill="none">
        <ellipse cx="130" cy="104" rx="88" ry="9" fill="rgba(255,255,255,0.16)" />
        <path
          d="M62 42 C42 26, 44 10, 66 16 L84 26 C108 14, 148 16, 174 36 C184 44, 184 54, 172 60 C146 72, 108 70, 84 54 L62 66 C42 70, 42 54, 62 42 Z"
          fill="#f5d0fe"
          stroke="#fdf4ff"
          strokeWidth="2.5"
        />
        <circle cx="115" cy="34" r="3" fill="#c026d3" opacity="0.65" />
        <circle cx="132" cy="44" r="3.5" fill="#9333ea" opacity="0.65" />
        <circle cx="148" cy="36" r="2.5" fill="#c026d3" opacity="0.65" />
        <circle cx="122" cy="52" r="2.5" fill="#a21caf" opacity="0.6" />
        <path d="M176 38 Q208 26 232 34" stroke="#fae8ff" strokeWidth="3" strokeLinecap="round" />
        <path d="M178 44 Q212 40 236 48" stroke="#f5d0fe" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M178 50 Q210 56 232 64" stroke="#f5d0fe" strokeWidth="3" strokeLinecap="round" />
        <path d="M174 56 Q200 68 220 76" stroke="#e879f9" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="164" cy="46" r="6.5" fill="#1e1b4b" />
        <circle cx="166" cy="44" r="2.2" fill="#ffffff" />
      </svg>
    );
  }

  if (species.includes('ヒラメ') || species.includes('カレイ')) {
    return (
      <svg viewBox="0 0 260 120" style={{ width: 220, height: 100 }} fill="none">
        <ellipse cx="130" cy="105" rx="95" ry="9" fill="rgba(255,255,255,0.16)" />
        <path
          d="M36 58 C64 24, 146 22, 198 54 L228 34 L220 58 L228 82 L198 62 C146 94, 64 92, 36 58 Z"
          fill="#bae6fd"
          stroke="#f0f9ff"
          strokeWidth="2.5"
        />
        <circle cx="105" cy="46" r="4" fill="#0284c7" opacity="0.55" />
        <circle cx="132" cy="64" r="4.5" fill="#0f766e" opacity="0.55" />
        <circle cx="156" cy="48" r="3.5" fill="#0284c7" opacity="0.55" />
        <circle cx="118" cy="68" r="3" fill="#0369a1" opacity="0.5" />
        <path d="M74 58 Q130 50 192 58" stroke="#0284c7" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
        <circle cx="66" cy="46" r="5" fill="#0f172a" />
        <circle cx="67.5" cy="44.5" r="1.8" fill="#ffffff" />
        <circle cx="80" cy="45" r="4.5" fill="#0f172a" />
        <circle cx="81.5" cy="43.5" r="1.6" fill="#ffffff" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 120" style={{ width: 220, height: 100 }} fill="none">
      <ellipse cx="130" cy="105" rx="92" ry="9" fill="rgba(255,255,255,0.16)" />
      <path d="M84 36 L112 16 L136 24 L158 18 L174 40 Z" fill="#fda4af" stroke="#fff1f2" strokeWidth="2" />
      <path
        d="M36 56 C66 24, 144 24, 192 54 L228 32 L218 56 L228 80 L192 58 C144 88, 66 88, 36 56 Z"
        fill="#fecdd3"
        stroke="#fff1f2"
        strokeWidth="2.5"
      />
      <circle cx="112" cy="44" r="2.5" fill="#38bdf8" />
      <circle cx="128" cy="40" r="2.5" fill="#38bdf8" />
      <circle cx="144" cy="45" r="2.5" fill="#38bdf8" />
      <circle cx="122" cy="54" r="2.5" fill="#38bdf8" />
      <polygon points="102,60 126,72 114,80" fill="#fb7185" opacity="0.85" />
      <circle cx="66" cy="50" r="6" fill="#0f172a" />
      <circle cx="68" cy="48" r="2" fill="#ffffff" />
    </svg>
  );
}

function CatchBanner({ item }) {
  return (
    <div
      style={{
        background: item.bannerBg,
        padding: '16px 16px 18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#ffffff',
      }}
    >
      {item.photoUrl ? (
        <img
          src={item.photoUrl}
          alt={`${item.fishSpecies} ${item.sizeCm}cm`}
          style={{
            width: '100%',
            height: 150,
            objectFit: 'cover',
            borderRadius: 14,
            marginBottom: 10,
            border: '2px solid rgba(255,255,255,0.35)',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.25)',
            borderRadius: 14,
            padding: '8px 12px',
            marginBottom: 10,
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.06em',
              padding: '2px 8px',
              borderRadius: 999,
              backgroundColor: 'rgba(255,255,255,0.2)',
              marginBottom: 2,
            }}
          >
            CATCH PHOTO
          </span>
          <FishArtwork species={item.fishSpecies} />
        </div>
      )}

      <div style={{ color: item.badgeColor, fontSize: 12, fontWeight: 800 }}>
        {item.verified ? '現場データ整合済み' : '検証アラートあり'}
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>
        {item.fishSpecies} <span style={{ fontSize: 18 }}>{item.sizeCm}cm</span>
      </div>
      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          padding: '3px 12px',
          borderRadius: 999,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
        }}
      >
        {item.caughtAt}
      </div>
    </div>
  );
}

export default function App() {
  const [catches, setCatches] = useState(INITIAL_CATCHES);
  const [walletPt, setWalletPt] = useState(650);
  const [earnedPt, setEarnedPt] = useState(125);
  const [totalSpentYen, setTotalSpentYen] = useState(350);
  const [unlocked, setUnlocked] = useState(['catch-1']);
  const [rated, setRated] = useState({});
  const [speciesFilter, setSpeciesFilter] = useState('すべて');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('feed');
  const [highlightedCatchId, setHighlightedCatchId] = useState(null);
  const [toast, setToast] = useState(null);

  // ポイント交換ステート
  const [exchangeHistory, setExchangeHistory] = useState([
    {
      id: 'EX-20261124-01',
      exchangedAt: '2026-11-24 22:10',
      brand: 'Amazonギフト券',
      denomination: '300円分',
      costPt: 300,
      code: 'AMZN-7K3P-9M2X',
    },
  ]);
  const [latestIssuedVoucher, setLatestIssuedVoucher] = useState(null);

  // 日本地図ステート
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedPinId, setSelectedPinId] = useState('catch-1');
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const movedDuringDragRef = useRef(false);
  const svgRef = useRef(null);
  const cardRefs = useRef({});

  // 決済画面ステート
  const [selectedPackId, setSelectedPackId] = useState('pack-1500');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState('TOSA ANGLER');
  const [payPayId, setPayPayId] = useState('090-xxxx-1234');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [lastReceipt, setLastReceipt] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([
    {
      id: 'RC-20261125-001',
      paidAt: '2026-11-25 05:30',
      packLabel: '350 pt プラン',
      pt: 350,
      yen: 350,
      methodLabel: 'クレジットカード',
    },
  ]);

  // 投稿フォームステート
  const [species, setSpecies] = useState('マダイ');
  const [size, setSize] = useState('58');
  const [area, setArea] = useState('高知県・浦戸湾〜桂浜周辺エリア');
  const [time, setTime] = useState('2026-11-25 18:20');
  const [postMapPos, setPostMapPos] = useState({ x: 362, y: 448 });
  const [spot, setSpot] = useState('橋脚の明暗ヨレ・流れがぶつかるポイント（水深約5m）');
  const [tackle, setTackle] = useState('ミノー 95F（チャートバック）・PE0.8号＋リーダー3号');
  const [tide, setTide] = useState('中潮・下げ五分 / 水温 19.2℃ / 北西風 3m');
  const [note, setNote] = useState('流れに乗せてドリフトさせると反転流の境目でヒット。');
  const [mode, setMode] = useState('legit');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3400);
  };

  const selectedPack = useMemo(
    () => POINT_PACKS.find((p) => p.id === selectedPackId) || POINT_PACKS[2],
    [selectedPackId]
  );

  const selectedPinCatch = useMemo(
    () => catches.find((c) => c.id === selectedPinId) || catches[0] || null,
    [catches, selectedPinId]
  );

  const liveDetailRewardPt = useMemo(
    () => calcDetailRewardPt({ spot, tackle, tide, note }),
    [spot, tackle, tide, note]
  );

  const speciesOptions = useMemo(
    () => ['すべて', ...Array.from(new Set(catches.map((c) => c.fishSpecies)))],
    [catches]
  );

  const visibleCatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catches.filter((c) => {
      if (speciesFilter !== 'すべて' && c.fishSpecies !== speciesFilter) return false;
      if (verifiedOnly && !c.verified) return false;
      if (!q) return true;
      return (
        c.fishSpecies.toLowerCase().includes(q) ||
        c.approxArea.toLowerCase().includes(q) ||
        c.anglerName.toLowerCase().includes(q)
      );
    });
  }, [catches, speciesFilter, verifiedOnly, query]);

  const handleExchangeReward = (reward) => {
    if (walletPt < reward.costPt) {
      notify(`ポイントが不足しています（必要: ${reward.costPt.toLocaleString()} pt）。`);
      return;
    }
    const now = new Date();
    const exchangedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const issued = {
      id: `EX-${Date.now().toString().slice(-6)}`,
      exchangedAt,
      brand: reward.brand,
      denomination: reward.denomination,
      costPt: reward.costPt,
      code: generateDemoCode(reward.prefix),
    };

    setWalletPt((p) => p - reward.costPt);
    setExchangeHistory((prev) => [issued, ...prev]);
    setLatestIssuedVoucher(issued);
    notify(`${reward.brand}（${reward.denomination}）に交換しました！`);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      notify(`ギフトコード「${code}」をコピーしました。`);
    } catch {
      notify(`コード：${code}`);
    }
  };

  const jumpToCatchDetail = (catchId) => {
    setSpeciesFilter('すべて');
    setVerifiedOnly(false);
    setQuery('');
    setHighlightedCatchId(catchId);
    setTab('feed');
    setTimeout(() => {
      const el = cardRefs.current[catchId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleMapPointerDown = (e) => {
    isDraggingRef.current = true;
    movedDuringDragRef.current = false;
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMapPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const nextX = e.clientX - dragStartRef.current.x;
    const nextY = e.clientY - dragStartRef.current.y;
    if (Math.hypot(nextX - pan.x, nextY - pan.y) > 4) {
      movedDuringDragRef.current = true;
    }
    setPan({
      x: Math.max(-260, Math.min(260, nextX)),
      y: Math.max(-220, Math.min(220, nextY)),
    });
  };

  const handleMapPointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleMapWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoom((z) => Math.max(0.8, Math.min(2.6, Number((z + delta).toFixed(2)))));
  };

  const resetMapView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePostMapPick = (e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const svgP = pt.matrixTransform(ctm.inverse());
    setPostMapPos({
      x: Math.max(60, Math.min(740, Math.round(svgP.x))),
      y: Math.max(40, Math.min(580, Math.round(svgP.y))),
    });
  };

  const openCheckout = (packId) => {
    if (packId) setSelectedPackId(packId);
    setPaymentError('');
    setLastReceipt(null);
    setTab('checkout');
  };

  const handleCompletePayment = (e) => {
    e.preventDefault();
    setPaymentError('');

    if (paymentMethod === 'card') {
      const digitsOnly = cardNumber.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 12) {
        setPaymentError('カード番号は12〜16桁で入力してください（デモ用は4242424242424242など）。');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry.trim())) {
        setPaymentError('有効期限は MM/YY 形式（例：12/28）で入力してください。');
        return;
      }
      if (cardCvc.trim().length < 3) {
        setPaymentError('セキュリティコードを3桁以上で入力してください。');
        return;
      }
      if (!cardHolder.trim()) {
        setPaymentError('カード名義を入力してください。');
        return;
      }
    } else if (paymentMethod === 'paypay' && !payPayId.trim()) {
      setPaymentError('PayPay連携用の携帯番号またはIDを入力してください。');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      const methodObj = PAYMENT_METHODS.find((m) => m.id === paymentMethod) || PAYMENT_METHODS[0];
      const now = new Date();
      const formattedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate()
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const receipt = {
        id: `RC-${Date.now().toString().slice(-6)}`,
        paidAt: formattedTime,
        packLabel: `${selectedPack.pt.toLocaleString()} pt プラン`,
        pt: selectedPack.pt,
        yen: selectedPack.yen,
        rateLabel: selectedPack.rateLabel,
        methodLabel: methodObj.label,
      };

      setWalletPt((p) => p + selectedPack.pt);
      setTotalSpentYen((y) => y + selectedPack.yen);
      setPaymentHistory((prev) => [receipt, ...prev]);
      setLastReceipt(receipt);
      setIsProcessingPayment(false);
      notify(`${selectedPack.yen.toLocaleString()}円の決済が完了！+${selectedPack.pt.toLocaleString()} pt を付与しました。`);
    }, 600);
  };

  const unlockItem = (item) => {
    if (unlocked.includes(item.id)) return;
    if (walletPt < UNLOCK_COST_PT) {
      openCheckout('pack-350');
      notify(`残高が不足しています（必要: ${UNLOCK_COST_PT} pt）。決済画面に移動しました。`);
      return;
    }
    setWalletPt((p) => p - UNLOCK_COST_PT);
    setUnlocked((u) => [...u, item.id]);
    notify(`${UNLOCK_COST_PT} pt で「${item.fishSpecies}」の詳細をアンロックしました！`);
  };

  const rateItem = (id, kind) => {
    if (rated[id]) return;
    setRated((r) => ({ ...r, [id]: kind }));
    setCatches((list) =>
      list.map((c) => {
        if (c.id !== id) return c;
        if (kind === 'helpful') {
          return { ...c, trustScore: Math.min(99, c.trustScore + 2), helpful: c.helpful + 1 };
        }
        return {
          ...c,
          trustScore: Math.max(10, c.trustScore - 15),
          verified: false,
          verifyNote: '通報により報酬エスクローを保留中。矛盾点の再検証を実施します。',
          disputed: c.disputed + 1,
        };
      })
    );
    notify(kind === 'helpful' ? '「正確」として評価しました。' : '虚偽通報を記録し報酬を保留しました。');
  };

  const submitPost = (e) => {
    e.preventDefault();
    const ok = mode === 'legit';
    const reward = ok ? liveDetailRewardPt : 0;
    const newId = `catch-${Date.now()}`;
    const created = {
      id: newId,
      anglerName: 'あなた（テスト投稿）',
      anglerHandle: '@you_angler',
      trustScore: ok ? 82 : 45,
      verifiedCount: ok ? 7 : 1,
      fishSpecies: species.trim() || '魚種未入力',
      sizeCm: Math.max(5, Number(size) || 40),
      approxArea: area.trim() || 'エリア未指定',
      mapPos: postMapPos,
      caughtAt: time.trim() || '2026-11-25 18:20',
      pricePt: UNLOCK_COST_PT,
      photoUrl: '',
      bannerBg: ok
        ? 'linear-gradient(135deg, #059669 0%, #0d9488 55%, #0284c7 100%)'
        : 'linear-gradient(135deg, #e11d48 0%, #be123c 55%, #9f1239 100%)',
      badgeColor: ok ? '#a7f3d0' : '#fecdd3',
      verified: ok,
      checks: { liveCam: ok, gps: ok, weather: ok },
      verifyNote: ok
        ? `ライブカメラ署名・GPS・気象データ整合。詳細充実度により +${reward} pt 付与！`
        : '過去画像またはGPS/気象データの矛盾を検知。検証NGのため報酬（最大25pt）は保留されます。',
      locked: {
        spot: spot.trim() || '詳細ポイントメモなし',
        tackle: tackle.trim() || '仕掛け未入力',
        tide: tide.trim() || '潮汐・水温未入力',
        note: note.trim() || '攻略メモなし',
      },
      helpful: 0,
      disputed: 0,
    };
    setCatches((prev) => [created, ...prev]);
    setSelectedPinId(newId);
    setUnlocked((prev) => [...prev, newId]);
    if (ok && reward > 0) {
      setEarnedPt((p) => p + reward);
      notify(`検証クリア！詳細度に応じて +${reward} pt（最大${MAX_POST_REWARD_PT}pt）を獲得しました！`);
    } else if (ok) {
      notify('検証クリア！詳細項目を追加すると最大25ptまで報酬が増えます。');
    } else {
      notify('矛盾を検知し「要確認（報酬保留）」で投稿しました。');
    }
    setTab('feed');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #082f49 0%, #0f172a 45%, #020617 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            background: 'linear-gradient(90deg, #0284c7, #0d9488)',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: 16,
            fontWeight: 800,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            maxWidth: '92vw',
          }}
        >
          <Sparkles style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span>{toast}</span>
        </div>
      )}

      <header
        style={{
          background: 'linear-gradient(90deg, #0369a1 0%, #0f766e 50%, #1d4ed8 100%)',
          padding: '18px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.18)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: '#fcd34d',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Fish style={{ width: 22, height: 22 }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: 22, color: '#ffffff' }}>REAL CATCH</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 999,
                backgroundColor: '#fcd34d',
                color: '#0f172a',
              }}
            >
              検証型 釣果マーケット
            </span>
          </div>

          <p style={{ fontSize: 12, color: '#e0f2fe', marginTop: 6 }}>
            投稿は詳しいほど最大{MAX_POST_REWARD_PT}pt獲得｜詳細閲覧は{UNLOCK_COST_PT}pt（350pt=350円〜まとめ買いお得）
          </p>

          <div
            style={{
              marginTop: 12,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={() => setTab(tab === 'map' ? 'feed' : 'map')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 999,
                border: tab === 'map' ? '2px solid #fcd34d' : '1px solid rgba(255,255,255,0.28)',
                background: tab === 'map' ? '#0f172a' : 'rgba(2, 6, 23, 0.55)',
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <MapIcon style={{ width: 15, height: 15, color: '#38bdf8' }} />
              <span>{tab === 'map' ? '釣果一覧へ戻る' : '日本地図で探す'}</span>
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 999,
                backgroundColor: 'rgba(2, 6, 23, 0.65)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: 13,
              }}
            >
              <Coins style={{ width: 15, height: 15, color: '#fcd34d' }} />
              <span>残高</span>
              <strong style={{ color: '#fcd34d' }}>{walletPt.toLocaleString()} pt</strong>
              <button
                type="button"
                onClick={() => openCheckout()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                  color: '#0f172a',
                  border: 'none',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                <ShoppingBag style={{ width: 12, height: 12 }} />
                <span>ポイント購入</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLatestIssuedVoucher(null);
                  setTab(tab === 'exchange' ? 'feed' : 'exchange');
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background:
                    tab === 'exchange'
                      ? '#0f172a'
                      : 'linear-gradient(90deg, #fb7185, #f59e0b)',
                  color: tab === 'exchange' ? '#fcd34d' : '#ffffff',
                  border: tab === 'exchange' ? '1px solid #fcd34d' : 'none',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 12,
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                <Gift style={{ width: 12, height: 12 }} />
                <span>{tab === 'exchange' ? '一覧へ戻る' : 'ギフト交換'}</span>
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 999,
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                border: '1px solid rgba(110, 231, 183, 0.45)',
                color: '#a7f3d0',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <Award style={{ width: 15, height: 15 }} />
              <span>投稿報酬 {earnedPt.toLocaleString()} pt</span>
            </div>

            <button
              type="button"
              onClick={() => setTab(tab === 'post' ? 'feed' : 'post')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 999,
                border: 'none',
                background:
                  tab === 'post' ? '#1e293b' : 'linear-gradient(90deg, #34d399, #2dd4bf)',
                color: tab === 'post' ? '#ffffff' : '#0f172a',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <PlusCircle style={{ width: 16, height: 16 }} />
              <span>{tab === 'post' ? '一覧へ戻る' : '釣果を投稿する'}</span>
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 16px' }}>
        {tab === 'exchange' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                borderRadius: 24,
                padding: 20,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#fcd34d' }}>
                  ポイントギフト交換（Amazonギフト券・電子マネー）
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                  保有ポイントをギフト券コードに交換できます（デモ発行）。
                </p>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>
                現在の利用可能残高：<strong style={{ color: '#fcd34d', fontSize: 18 }}>{walletPt.toLocaleString()} pt</strong>
              </div>
            </div>

            {latestIssuedVoucher && (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.14)',
                  border: '2px solid #34d399',
                  borderRadius: 22,
                  padding: 18,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#6ee7b7' }}>
                    交換完了・発行コード（デモ）
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
                    {latestIssuedVoucher.brand}（{latestIssuedVoucher.denomination}）
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fcd34d', marginTop: 6, letterSpacing: '0.06em' }}>
                    {latestIssuedVoucher.code}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(latestIssuedVoucher.code)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '10px 16px',
                    borderRadius: 999,
                    border: 'none',
                    background: 'linear-gradient(90deg, #34d399, #2dd4bf)',
                    color: '#0f172a',
                    fontWeight: 900,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <Copy style={{ width: 14, height: 14 }} /> コードをコピー
                </button>
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              {EXCHANGE_REWARDS.map((rew) => {
                const canAfford = walletPt >= rew.costPt;
                return (
                  <div
                    key={rew.id}
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.14)',
                      borderRadius: 22,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        background: rew.accentBg,
                        padding: '16px 14px',
                        textAlign: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 999,
                          backgroundColor: 'rgba(15, 23, 42, 0.35)',
                        }}
                      >
                        {rew.badge}
                      </span>
                      <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6 }}>{rew.brand}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 2 }}>{rew.denomination}</div>
                    </div>

                    <div style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#fcd34d' }}>
                        {rew.costPt.toLocaleString()} pt
                      </div>
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => handleExchangeReward(rew)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 999,
                          border: 'none',
                          background: canAfford
                            ? 'linear-gradient(90deg, #fbbf24, #f97316)'
                            : '#334155',
                          color: canAfford ? '#0f172a' : '#94a3b8',
                          fontWeight: 900,
                          fontSize: 13,
                          cursor: canAfford ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {canAfford ? 'このギフトに交換する' : 'ポイント不足'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
                <Gift style={{ width: 16, height: 16, color: '#fcd34d' }} />
                <span>交換履歴・発行コード</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                {exchangeHistory.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 14px',
                      borderRadius: 12,
                      backgroundColor: '#020617',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#fcd34d' }}>{h.brand}（{h.denomination}）</strong> ・{' '}
                      <span>{h.exchangedAt}</span> ・{' '}
                      <span style={{ color: '#94a3b8' }}>-{h.costPt.toLocaleString()} pt</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyCode(h.code)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 8,
                        border: '1px solid #334155',
                        backgroundColor: '#0f172a',
                        color: '#7dd3fc',
                        fontWeight: 800,
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      <span>{h.code}</span>
                      <Copy style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : tab === 'map' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 24,
                padding: 18,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#ffffff' }}>
                  日本地図 釣果ピンマップ
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#cbd5e1' }}>
                  地図をドラッグして移動、＋/−やホイールでズーム。ピン（点）を押すと情報が見られ、釣果詳細へジャンプできます。
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.25).toFixed(2))))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: '1px solid #334155',
                    backgroundColor: '#020617',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <ZoomOut style={{ width: 14, height: 14 }} /> 縮小
                </button>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fcd34d', minWidth: 52, textAlign: 'center' }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(2.6, Number((z + 0.25).toFixed(2))))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: '1px solid #334155',
                    backgroundColor: '#020617',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <ZoomIn style={{ width: 14, height: 14 }} /> 拡大
                </button>
                <button
                  type="button"
                  onClick={resetMapView}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '8px 12px',
                    borderRadius: 12,
                    border: '1px solid #334155',
                    backgroundColor: '#1e293b',
                    color: '#7dd3fc',
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw style={{ width: 14, height: 14 }} /> リセット
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 20,
                alignItems: 'start',
              }}
            >
              <div
                onPointerDown={handleMapPointerDown}
                onPointerMove={handleMapPointerMove}
                onPointerUp={handleMapPointerUp}
                onPointerLeave={handleMapPointerUp}
                onWheel={handleMapWheel}
                style={{
                  gridColumn: 'span 2',
                  minHeight: 440,
                  background: 'radial-gradient(circle at 50% 35%, #0c4a6e 0%, #082f49 60%, #020617 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: 24,
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'grab',
                  userSelect: 'none',
                  touchAction: 'none',
                }}
              >
                <svg
                  viewBox="0 0 800 620"
                  style={{
                    width: '100%',
                    height: 460,
                    display: 'block',
                  }}
                >
                  <g
                    transform={`translate(${pan.x}, ${pan.y}) translate(400, 310) scale(${zoom}) translate(-400, -310)`}
                  >
                    <JapanMapSvg />

                    {catches.map((item) => {
                      const pos = item.mapPos || { x: 400, y: 350 };
                      const isSelected = selectedPinId === item.id;
                      const pinFill = item.verified ? '#34d399' : '#fbbf24';
                      return (
                        <g
                          key={item.id}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!movedDuringDragRef.current) {
                              setSelectedPinId(item.id);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          {isSelected && (
                            <circle
                              r="22"
                              fill="rgba(251, 191, 36, 0.25)"
                              stroke="#fcd34d"
                              strokeWidth="2"
                            />
                          )}
                          <circle
                            r={isSelected ? 10 : 8}
                            fill={pinFill}
                            stroke="#0f172a"
                            strokeWidth="2.5"
                          />
                          <g transform="translate(0, -28)">
                            <rect
                              x="-52"
                              y="-12"
                              width="104"
                              height="22"
                              rx="11"
                              fill={isSelected ? '#fcd34d' : 'rgba(15, 23, 42, 0.9)'}
                              stroke={isSelected ? '#0f172a' : '#7dd3fc'}
                              strokeWidth="1.5"
                            />
                            <text
                              y="3"
                              textAnchor="middle"
                              fontSize="11"
                              fontWeight="800"
                              fill={isSelected ? '#0f172a' : '#ffffff'}
                            >
                              {item.fishSpecies} {item.sizeCm}cm
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 14,
                    backgroundColor: 'rgba(2, 6, 23, 0.78)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 12,
                    padding: '6px 12px',
                    fontSize: 11,
                    color: '#cbd5e1',
                    display: 'flex',
                    gap: 12,
                  }}
                >
                  <span>● 緑ピン：検証クリア</span>
                  <span>● 黄ピン：要確認</span>
                  <span>登録ピン：{catches.length}件</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  borderRadius: 24,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fcd34d' }}>
                  選択中のスポット情報
                </div>

                {selectedPinCatch ? (
                  <>
                    <div
                      style={{
                        background: selectedPinCatch.bannerBg,
                        borderRadius: 18,
                        padding: 16,
                        color: '#fff',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 800, color: selectedPinCatch.badgeColor }}>
                        {selectedPinCatch.verified ? '検証クリア' : '要確認（報酬保留）'}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 2 }}>
                        {selectedPinCatch.fishSpecies}{' '}
                        <span style={{ fontSize: 16 }}>{selectedPinCatch.sizeCm}cm</span>
                      </div>
                      <div style={{ fontSize: 12, marginTop: 6, opacity: 0.95 }}>
                        {selectedPinCatch.approxArea}
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#020617',
                        borderRadius: 14,
                        padding: 12,
                        fontSize: 12,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div>
                        <span style={{ color: '#94a3b8' }}>投稿者：</span>
                        <strong>{selectedPinCatch.anglerName}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8' }}>日時：</span>
                        <strong>{selectedPinCatch.caughtAt}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#94a3b8' }}>詳細状態：</span>
                        <strong style={{ color: unlocked.includes(selectedPinCatch.id) ? '#6ee7b7' : '#fcd34d' }}>
                          {unlocked.includes(selectedPinCatch.id)
                            ? 'アンロック済み'
                            : `未解除（解放 ${UNLOCK_COST_PT} pt）`}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => jumpToCatchDetail(selectedPinCatch.id)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 999,
                        border: 'none',
                        background: 'linear-gradient(90deg, #38bdf8, #34d399)',
                        color: '#0f172a',
                        fontWeight: 900,
                        fontSize: 13,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <ExternalLink style={{ width: 15, height: 15 }} />
                      <span>この釣果情報へ移動する</span>
                    </button>

                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>
                        他のピン一覧（タップでフォーカス）
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {catches.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedPinId(c.id)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: 12,
                              border: selectedPinId === c.id ? '1px solid #fcd34d' : '1px solid #1e293b',
                              backgroundColor: selectedPinId === c.id ? 'rgba(251, 191, 36, 0.14)' : '#020617',
                              color: '#fff',
                              fontSize: 12,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            <span>
                              <strong>{c.fishSpecies}</strong>（{c.sizeCm}cm） - {c.approxArea}
                            </span>
                            <ChevronRight style={{ width: 14, height: 14, color: '#7dd3fc' }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ) : tab === 'checkout' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <button
                type="button"
                onClick={() => setTab('feed')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '1px solid #334155',
                  backgroundColor: '#0f172a',
                  color: '#e2e8f0',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft style={{ width: 15, height: 15 }} />
                <span>釣果一覧に戻る</span>
              </button>

              <div style={{ fontSize: 13, color: '#cbd5e1' }}>
                現在の残高：<strong style={{ color: '#fcd34d', fontSize: 15 }}>{walletPt.toLocaleString()} pt</strong> ／ 累計課金：
                <strong style={{ color: '#6ee7b7' }}>{totalSpentYen.toLocaleString()}円</strong>
              </div>
            </div>

            {lastReceipt ? (
              <div
                style={{
                  backgroundColor: '#0f172a',
                  border: '2px solid #34d399',
                  borderRadius: 24,
                  padding: 28,
                  textAlign: 'center',
                  maxWidth: 620,
                  width: '100%',
                  margin: '0 auto',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 999,
                    backgroundColor: 'rgba(52, 211, 153, 0.2)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <Check style={{ width: 28, height: 28 }} />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: '#ffffff' }}>決済が完了しました</h2>
                <p style={{ fontSize: 13, color: '#cbd5e1', marginTop: 6 }}>
                  ポイント残高に <strong style={{ color: '#fcd34d' }}>+{lastReceipt.pt.toLocaleString()} pt</strong> が反映されました。
                </p>

                <div
                  style={{
                    marginTop: 18,
                    backgroundColor: '#020617',
                    borderRadius: 16,
                    padding: 16,
                    textAlign: 'left',
                    fontSize: 13,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>決済番号</span>
                    <strong style={{ color: '#7dd3fc' }}>{lastReceipt.id}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>購入プラン</span>
                    <strong>{lastReceipt.packLabel}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>お支払い方法</span>
                    <strong>{lastReceipt.methodLabel}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>決済金額</span>
                    <strong style={{ color: '#fcd34d' }}>{lastReceipt.yen.toLocaleString()}円</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>決済後残高</span>
                    <strong style={{ color: '#6ee7b7' }}>{walletPt.toLocaleString()} pt</strong>
                  </div>
                </div>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setLastReceipt(null)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 999,
                      border: '1px solid #334155',
                      backgroundColor: '#1e293b',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    続けて購入する
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('feed')}
                    style={{
                      padding: '10px 22px',
                      borderRadius: 999,
                      border: 'none',
                      background: 'linear-gradient(90deg, #38bdf8, #34d399)',
                      color: '#0f172a',
                      fontWeight: 900,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    釣果詳細をアンロックしに行く
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleCompletePayment}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: 24,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <h2 style={{ fontSize: 17, fontWeight: 900, color: '#ffffff', textAlign: 'center' }}>
                    1. ポイントプランを選択
                  </h2>
                  <p style={{ fontSize: 12, color: '#cbd5e1', textAlign: 'center', margin: 0 }}>
                    基準は <strong>350pt = 350円</strong>。多く買うほど1pt単価がお得になります。
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                    {POINT_PACKS.map((pack) => {
                      const active = selectedPackId === pack.id;
                      return (
                        <button
                          key={pack.id}
                          type="button"
                          onClick={() => setSelectedPackId(pack.id)}
                          style={{
                            padding: 14,
                            borderRadius: 18,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: active ? 'rgba(14, 116, 144, 0.4)' : '#020617',
                            border: active ? '2px solid #fcd34d' : '1px solid #334155',
                            color: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 999,
                              backgroundColor: active ? '#fcd34d' : 'rgba(52, 211, 153, 0.2)',
                              color: active ? '#0f172a' : '#6ee7b7',
                            }}
                          >
                            {pack.tag}
                          </span>
                          <span style={{ fontSize: 19, fontWeight: 900, marginTop: 2 }}>
                            {pack.pt.toLocaleString()} pt
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#fcd34d' }}>
                            {pack.yen.toLocaleString()}円
                          </span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{pack.rateLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(251, 191, 36, 0.35)',
                    borderRadius: 24,
                    padding: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 900, color: '#fcd34d', textAlign: 'center', margin: 0 }}>
                      2. お支払い方法・決済確定
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                      {PAYMENT_METHODS.map((m) => {
                        const selected = paymentMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setPaymentMethod(m.id);
                              setPaymentError('');
                            }}
                            style={{
                              padding: 10,
                              borderRadius: 14,
                              border: selected ? '2px solid #38bdf8' : '1px solid #334155',
                              backgroundColor: selected ? 'rgba(56, 189, 248, 0.16)' : '#020617',
                              color: '#ffffff',
                              cursor: 'pointer',
                              textAlign: 'center',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12, fontWeight: 800 }}>
                              {m.id === 'card' ? (
                                <CreditCard style={{ width: 14, height: 14, color: '#38bdf8' }} />
                              ) : (
                                <Smartphone style={{ width: 14, height: 14, color: '#34d399' }} />
                              )}
                              <span>{m.label}</span>
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>{m.sub}</div>
                          </button>
                        );
                      })}
                    </div>

                    {paymentMethod === 'card' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                        <label style={{ color: '#7dd3fc', fontWeight: 700 }}>
                          カード番号
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            style={{
                              width: '100%',
                              marginTop: 4,
                              padding: '10px 12px',
                              borderRadius: 12,
                              border: '1px solid #334155',
                              backgroundColor: '#020617',
                              color: '#fff',
                              boxSizing: 'border-box',
                            }}
                          />
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <label style={{ color: '#7dd3fc', fontWeight: 700 }}>
                            有効期限 (MM/YY)
                            <input
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="12/28"
                              style={{
                                width: '100%',
                                marginTop: 4,
                                padding: '10px 12px',
                                borderRadius: 12,
                                border: '1px solid #334155',
                                backgroundColor: '#020617',
                                color: '#fff',
                                boxSizing: 'border-box',
                              }}
                            />
                          </label>
                          <label style={{ color: '#7dd3fc', fontWeight: 700 }}>
                            セキュリティコード
                            <input
                              value={cardCvc}
                              onChange={(e) => setCardCvc(e.target.value)}
                              placeholder="123"
                              style={{
                                width: '100%',
                                marginTop: 4,
                                padding: '10px 12px',
                                borderRadius: 12,
                                border: '1px solid #334155',
                                backgroundColor: '#020617',
                                color: '#fff',
                                boxSizing: 'border-box',
                              }}
                            />
                          </label>
                        </div>
                        <label style={{ color: '#7dd3fc', fontWeight: 700 }}>
                          カード名義人
                          <input
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="TOSA ANGLER"
                            style={{
                              width: '100%',
                              marginTop: 4,
                              padding: '10px 12px',
                              borderRadius: 12,
                              border: '1px solid #334155',
                              backgroundColor: '#020617',
                              color: '#fff',
                              boxSizing: 'border-box',
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {paymentMethod === 'paypay' && (
                      <div style={{ fontSize: 12 }}>
                        <label style={{ color: '#fda4af', fontWeight: 700 }}>
                          PayPay登録電話番号またはID
                          <input
                            value={payPayId}
                            onChange={(e) => setPayPayId(e.target.value)}
                            style={{
                              width: '100%',
                              marginTop: 4,
                              padding: '10px 12px',
                              borderRadius: 12,
                              border: '1px solid #334155',
                              backgroundColor: '#020617',
                              color: '#fff',
                              boxSizing: 'border-box',
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {paymentMethod === 'wallet_pay' && (
                      <div
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          backgroundColor: '#020617',
                          border: '1px solid #334155',
                          fontSize: 12,
                          color: '#cbd5e1',
                          textAlign: 'center',
                        }}
                      >
                        端末に登録されたウォレット決済で <strong>{selectedPack.yen.toLocaleString()}円</strong> を支払います。
                      </div>
                    )}

                    <div
                      style={{
                        backgroundColor: '#020617',
                        borderRadius: 14,
                        padding: 12,
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: 13,
                      }}
                    >
                      <div>
                        <div style={{ color: '#94a3b8', fontSize: 11 }}>お支払い合計</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#fcd34d' }}>
                          {selectedPack.yen.toLocaleString()}円
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#94a3b8', fontSize: 11 }}>付与ポイント</div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#6ee7b7' }}>
                          +{selectedPack.pt.toLocaleString()} pt
                        </div>
                      </div>
                    </div>

                    {paymentError && (
                      <div
                        style={{
                          padding: 10,
                          borderRadius: 12,
                          backgroundColor: 'rgba(244, 63, 94, 0.2)',
                          border: '1px solid rgba(251, 113, 133, 0.5)',
                          color: '#fecdd3',
                          fontSize: 12,
                          fontWeight: 700,
                          textAlign: 'center',
                        }}
                      >
                        {paymentError}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    style={{
                      width: '100%',
                      padding: '13px 18px',
                      borderRadius: 999,
                      border: 'none',
                      background: 'linear-gradient(90deg, #fbbf24, #f97316)',
                      color: '#0f172a',
                      fontWeight: 900,
                      fontSize: 15,
                      cursor: isProcessingPayment ? 'not-allowed' : 'pointer',
                      opacity: isProcessingPayment ? 0.7 : 1,
                    }}
                  >
                    {isProcessingPayment
                      ? '決済処理中...'
                      : `${selectedPack.yen.toLocaleString()}円で決済して +${selectedPack.pt.toLocaleString()}pt を受け取る`}
                  </button>
                </div>
              </form>
            )}

            <div
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: 18,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 14, marginBottom: 12 }}>
                <Receipt style={{ width: 16, height: 16, color: '#38bdf8' }} />
                <span>決済履歴（デモ）</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                {paymentHistory.map((h) => (
                  <div
                    key={h.id}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 14px',
                      borderRadius: 12,
                      backgroundColor: '#020617',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#7dd3fc' }}>{h.id}</strong> ・ <span>{h.paidAt}</span> ・{' '}
                      <span style={{ color: '#cbd5e1' }}>{h.methodLabel}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#fcd34d' }}>{h.yen.toLocaleString()}円</strong> →{' '}
                      <strong style={{ color: '#6ee7b7' }}>+{h.pt.toLocaleString()} pt</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 14,
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  backgroundColor: 'rgba(12, 74, 110, 0.55)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: '#7dd3fc' }}>投稿インセンティブ</div>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>詳しいほど最大 {MAX_POST_REWARD_PT} pt</div>
                <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 6, lineHeight: 1.5 }}>
                  釣り座・仕掛け・潮汐・攻略メモを詳しく書くほど付与ポイントが増加（上限{MAX_POST_REWARD_PT}pt）。
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  backgroundColor: 'rgba(17, 94, 89, 0.55)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: '#5eead4' }}>詳細閲覧＆課金</div>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>解放 {UNLOCK_COST_PT} pt / 350pt＝350円〜</div>
                <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 6, lineHeight: 1.5 }}>
                  詳細閲覧は{UNLOCK_COST_PT}pt。350pt=350円を基準に、まとめて買うほど実質単価がお得。
                </p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  backgroundColor: 'rgba(120, 53, 15, 0.55)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: '#fcd34d' }}>真偽検証＆ギフト交換</div>
                <div style={{ fontWeight: 800, fontSize: 14, marginTop: 4 }}>多層チェック＋アマギフ交換</div>
                <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 6, lineHeight: 1.5 }}>
                  撮影・GPS・気象の整合性を検証。貯めたポイントはAmazonギフト券などに交換可能。
                </p>
              </div>
            </div>

            {tab === 'post' ? (
              <form
                onSubmit={submitPost}
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 24,
                  padding: 24,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 24,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontWeight: 900, fontSize: 18 }}>釣果投稿＆詳細度ポイント算出</h2>
                    <div style={{ marginTop: 8, display: 'inline-flex', gap: 6, backgroundColor: '#020617', padding: 4, borderRadius: 999 }}>
                      <button
                        type="button"
                        onClick={() => setMode('legit')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 999,
                          border: 'none',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          backgroundColor: mode === 'legit' ? '#34d399' : 'transparent',
                          color: mode === 'legit' ? '#0f172a' : '#94a3b8',
                        }}
                      >
                        正当投稿
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('fake')}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 999,
                          border: 'none',
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: 'pointer',
                          backgroundColor: mode === 'fake' ? '#f43f5e' : 'transparent',
                          color: mode === 'fake' ? '#ffffff' : '#94a3b8',
                        }}
                      >
                        詐称再現
                      </button>
                    </div>
                  </div>

                  <label style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 700 }}>
                    魚種（マダイ / アオリイカ / ヒラメ など）
                    <input
                      value={species}
                      onChange={(e) => setSpecies(e.target.value)}
                      style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </label>

                  <label style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 700 }}>
                    サイズ (cm)
                    <input
                      type="number"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </label>

                  <label style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 700 }}>
                    おおよそのエリア（無料公開）
                    <input
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </label>

                  <label style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 700 }}>
                    日時（無料公開）
                    <input
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={{ width: '100%', marginTop: 4, padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </label>

                  <div style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 700 }}>
                    地図上のピン位置をクリック指定（現在: X {postMapPos.x} / Y {postMapPos.y}）
                    <div
                      style={{
                        marginTop: 6,
                        backgroundColor: '#082f49',
                        border: '1px solid #334155',
                        borderRadius: 14,
                        overflow: 'hidden',
                        cursor: 'crosshair',
                      }}
                    >
                      <svg
                        ref={svgRef}
                        viewBox="0 0 800 620"
                        onClick={handlePostMapPick}
                        style={{ width: '100%', height: 180, display: 'block' }}
                      >
                        <JapanMapSvg />
                        <circle
                          cx={postMapPos.x}
                          cy={postMapPos.y}
                          r="14"
                          fill="rgba(251, 191, 36, 0.35)"
                          stroke="#fcd34d"
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      backgroundColor: 'rgba(16, 185, 129, 0.14)',
                      border: '1px solid rgba(52, 211, 153, 0.45)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#6ee7b7' }}>
                      現在の詳細充実度による獲得予定ポイント
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#fcd34d', marginTop: 2 }}>
                      +{mode === 'legit' ? liveDetailRewardPt : 0} pt{' '}
                      <span style={{ fontSize: 12, color: '#cbd5e1' }}>/ 最大 {MAX_POST_REWARD_PT} pt</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 15, color: '#fcd34d', textAlign: 'center' }}>
                      詳細情報（書くほどポイントUP・閲覧料{UNLOCK_COST_PT}pt）
                    </h3>
                    <input
                      value={spot}
                      onChange={(e) => setSpot(e.target.value)}
                      placeholder="釣り座・地形（例：テトラ帯の潮目ヨレ、水深約6m）"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                    <input
                      value={tackle}
                      onChange={(e) => setTackle(e.target.value)}
                      placeholder="ルアー・仕掛け・ライン号数"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                    <input
                      value={tide}
                      onChange={(e) => setTide(e.target.value)}
                      placeholder="潮汐・水温・風向コンディション"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="アクション・巻くレンジ・ヒットの経緯など詳しい攻略メモ"
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '1px solid #334155', backgroundColor: '#020617', color: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setTab('feed')}
                      style={{ padding: '10px 18px', borderRadius: 999, border: 'none', backgroundColor: '#334155', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                    >
                      戻る
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '10px 22px', borderRadius: 999, border: 'none', background: 'linear-gradient(90deg, #38bdf8, #34d399)', color: '#0f172a', fontWeight: 900, cursor: 'pointer' }}
                    >
                      投稿してポイント獲得
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 20,
                    padding: 16,
                    marginBottom: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                    {speciesOptions.map((sp) => {
                      const active = speciesFilter === sp;
                      return (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => setSpeciesFilter(sp)}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 999,
                            border: active ? 'none' : '1px solid #334155',
                            background: active ? 'linear-gradient(90deg, #38bdf8, #2dd4bf)' : '#020617',
                            color: active ? '#0f172a' : '#e2e8f0',
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          {sp}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setVerifiedOnly((v) => !v)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 999,
                        border: '1px solid rgba(52, 211, 153, 0.5)',
                        backgroundColor: verifiedOnly ? '#34d399' : '#020617',
                        color: verifiedOnly ? '#0f172a' : '#6ee7b7',
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      検証済みのみ
                    </button>
                  </div>

                  <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
                    <Search
                      style={{
                        width: 16,
                        height: 16,
                        color: '#38bdf8',
                        position: 'absolute',
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="魚種・エリア・投稿者で検索"
                      style={{
                        width: '100%',
                        padding: '9px 16px 9px 38px',
                        borderRadius: 999,
                        border: '1px solid #334155',
                        backgroundColor: '#020617',
                        color: '#ffffff',
                        fontSize: 13,
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: 20,
                  }}
                >
                  {visibleCatches.map((item) => {
                    const isOpen = unlocked.includes(item.id);
                    const myVote = rated[item.id];
                    const isHighlighted = highlightedCatchId === item.id;
                    return (
                      <article
                        key={item.id}
                        ref={(el) => {
                          cardRefs.current[item.id] = el;
                        }}
                        style={{
                          backgroundColor: '#0f172a',
                          border: isHighlighted
                            ? '2px solid #fcd34d'
                            : '1px solid rgba(255,255,255,0.14)',
                          borderRadius: 24,
                          overflow: 'hidden',
                          boxShadow: isHighlighted
                            ? '0 0 0 4px rgba(251, 191, 36, 0.25), 0 12px 30px rgba(0,0,0,0.45)'
                            : '0 12px 30px rgba(0,0,0,0.35)',
                        }}
                      >
                        <CatchBanner item={item} />

                        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 15 }}>
                              {item.anglerName} <span style={{ fontSize: 12, color: '#7dd3fc' }}>{item.anglerHandle}</span>
                            </div>
                            <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 3 }}>
                              信頼スコア <strong style={{ color: '#fcd34d' }}>{item.trustScore}</strong> ・ 検証実績{' '}
                              <strong style={{ color: '#6ee7b7' }}>{item.verifiedCount}件</strong>
                            </div>
                            <div style={{ marginTop: 8 }}>
                              {item.verified ? (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    padding: '4px 12px',
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                    color: '#6ee7b7',
                                    border: '1px solid rgba(52, 211, 153, 0.45)',
                                  }}
                                >
                                  <ShieldCheck style={{ width: 14, height: 14 }} /> 検証クリア
                                </span>
                              ) : (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    padding: '4px 12px',
                                    borderRadius: 999,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    backgroundColor: 'rgba(244, 63, 94, 0.2)',
                                    color: '#fda4af',
                                    border: '1px solid rgba(251, 113, 133, 0.45)',
                                  }}
                                >
                                  <AlertTriangle style={{ width: 14, height: 14 }} /> 要確認（報酬保留）
                                </span>
                              )}
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              justifyContent: 'center',
                              gap: 12,
                              fontSize: 12,
                              color: '#e0f2fe',
                              backgroundColor: 'rgba(12, 74, 110, 0.55)',
                              padding: 10,
                              borderRadius: 14,
                            }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <MapPin style={{ width: 14, height: 14, color: '#67e8f9' }} /> {item.approxArea}
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <Clock style={{ width: 14, height: 14, color: '#fcd34d' }} /> {item.caughtAt}
                            </span>
                          </div>

                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, fontSize: 11, fontWeight: 700 }}>
                            {[
                              ['ライブ撮影', item.checks.liveCam],
                              ['GPS整合', item.checks.gps],
                              ['気象整合', item.checks.weather],
                            ].map(([label, ok]) => (
                              <span
                                key={label}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: '4px 10px',
                                  borderRadius: 999,
                                  backgroundColor: ok ? 'rgba(16, 185, 129, 0.16)' : 'rgba(244, 63, 94, 0.16)',
                                  color: ok ? '#a7f3d0' : '#fecdd3',
                                  border: `1px solid ${ok ? 'rgba(52, 211, 153, 0.4)' : 'rgba(251, 113, 133, 0.4)'}`,
                                }}
                              >
                                {ok ? (
                                  <CheckCircle2 style={{ width: 12, height: 12 }} />
                                ) : (
                                  <XCircle style={{ width: 12, height: 12 }} />
                                )}
                                {label}
                              </span>
                            ))}
                          </div>

                          <div
                            style={{
                              fontSize: 12,
                              color: '#e2e8f0',
                              backgroundColor: '#020617',
                              padding: 10,
                              borderRadius: 12,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                            }}
                          >
                            <Info style={{ width: 15, height: 15, color: '#38bdf8', flexShrink: 0 }} />
                            <span>{item.verifyNote}</span>
                          </div>

                          {isOpen ? (
                            <div
                              style={{
                                backgroundColor: 'rgba(12, 74, 110, 0.45)',
                                border: '1px solid rgba(56, 189, 248, 0.4)',
                                borderRadius: 16,
                                padding: 14,
                                fontSize: 12,
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: 800,
                                  color: '#7dd3fc',
                                  marginBottom: 10,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 5,
                                }}
                              >
                                <Unlock style={{ width: 14, height: 14, color: '#6ee7b7' }} /> アンロック済み詳細情報
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                <div style={{ backgroundColor: '#020617', padding: 10, borderRadius: 10 }}>
                                  <div style={{ color: '#7dd3fc', fontWeight: 700 }}>釣り座・地形</div>
                                  <div style={{ fontWeight: 700, marginTop: 3 }}>{item.locked.spot}</div>
                                </div>
                                <div style={{ backgroundColor: '#020617', padding: 10, borderRadius: 10 }}>
                                  <div style={{ color: '#67e8f9', fontWeight: 700 }}>ルアー・仕掛け</div>
                                  <div style={{ fontWeight: 700, marginTop: 3 }}>{item.locked.tackle}</div>
                                </div>
                                <div style={{ backgroundColor: '#020617', padding: 10, borderRadius: 10 }}>
                                  <div style={{ color: '#6ee7b7', fontWeight: 700 }}>潮汐・条件</div>
                                  <div style={{ fontWeight: 700, marginTop: 3 }}>{item.locked.tide}</div>
                                </div>
                                <div style={{ backgroundColor: '#020617', padding: 10, borderRadius: 10 }}>
                                  <div style={{ color: '#fcd34d', fontWeight: 700 }}>攻略メモ</div>
                                  <div style={{ fontWeight: 700, marginTop: 3 }}>{item.locked.note}</div>
                                </div>
                              </div>

                              <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', justifyContent: 'center', gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={() => rateItem(item.id, 'helpful')}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '6px 12px',
                                    borderRadius: 999,
                                    border: '1px solid rgba(52, 211, 153, 0.5)',
                                    backgroundColor: myVote === 'helpful' ? '#34d399' : '#020617',
                                    color: myVote === 'helpful' ? '#0f172a' : '#6ee7b7',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <ThumbsUp style={{ width: 13, height: 13 }} /> 正確 ({item.helpful})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => rateItem(item.id, 'disputed')}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '6px 12px',
                                    borderRadius: 999,
                                    border: '1px solid rgba(251, 113, 133, 0.5)',
                                    backgroundColor: myVote === 'disputed' ? '#f43f5e' : '#020617',
                                    color: myVote === 'disputed' ? '#ffffff' : '#fda4af',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Flag style={{ width: 13, height: 13 }} /> 通報 ({item.disputed})
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                                border: '1px dashed rgba(251, 191, 36, 0.55)',
                                borderRadius: 16,
                                padding: 14,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 10,
                              }}
                            >
                              <div style={{ fontSize: 12 }}>
                                <div style={{ fontWeight: 800, color: '#fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                  <Lock style={{ width: 14, height: 14 }} /> 現場詳細・ルアー・攻略メモはロック中
                                </div>
                                <div style={{ color: '#cbd5e1', marginTop: 3 }}>
                                  {UNLOCK_COST_PT} pt で具体的な条件を確認できます
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => unlockItem(item)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: '10px 18px',
                                  borderRadius: 999,
                                  border: 'none',
                                  background: 'linear-gradient(90deg, #fbbf24, #f97316)',
                                  color: '#0f172a',
                                  fontWeight: 900,
                                  fontSize: 13,
                                  cursor: 'pointer',
                                }}
                              >
                                <span>{UNLOCK_COST_PT} pt で詳細を見る</span>
                                <ChevronRight style={{ width: 16, height: 16 }} />
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}