// Mock data used during scaffolding.
// Will be replaced by the Hostex service layer (`src/lib/server/hostex/*`) in Phase 1.
//
// NOTE: property prose below is a working draft (placeholder photography +
// copy). Names / locations / rates are set; the descriptions are for review.

import type { Property } from '$lib/types/domain';

// Temporary photography — two brand images reused across slots until real
// per-house photography is delivered. galleryTones stay as the fallback.
const TEMP_IMAGES = ['/images/highlight.jpg', '/images/hero.jpg'];

// Cool neutral fallback tones shown behind photography.
const COOL_TONES = ['#e4e4e4', '#d4d4d4', '#bdbdbd', '#ececec', '#c8c8c8'];

export const mockProperties: Property[] = [
	{
		id: 'prop_nagoya_castle',
		slug: 'nagoya-castle',
		name: { ja: '名古屋城', en: 'Nagoya Castle' },
		location: { ja: '愛知県名古屋市', en: 'Nagoya, Aichi' },
		description: {
			ja: '名古屋城の濠を望む町家。 石垣の影と、城下の静けさに包まれて。',
			en: 'A machiya overlooking the castle moat. Held in the shadow of the stone ramparts, and the calm of the old castle town.'
		},
		maxGuests: 4,
		bedrooms: 2,
		minNights: 1,
		nightlyRate: 34000,
		spaces: {
			ja: '城の濠に面した二層の町家。一階は土間と檜の浴室、二階に寝室二間。窓辺からは石垣と空が見える。',
			en: 'A two-story machiya facing the castle moat. A doma and hinoki bath below, two bedrooms above, the stone walls and sky framed at the window.'
		},
		features: [
			{ ja: '檜風呂', en: 'Hinoki bath' },
			{ ja: '濠を望む二階', en: 'Upper floor over the moat' },
			{ ja: '専用の坪庭', en: 'Private courtyard garden' },
			{ ja: '自家焙煎の珈琲', en: 'House-roasted coffee' }
		],
		around: [
			{ ja: '名古屋城 本丸御殿', en: 'Honmaru Palace at Nagoya Castle' },
			{ ja: '徳川園を歩く', en: 'A walk through Tokugawa Garden' },
			{ ja: '那古野の町並みを辿る', en: 'Trace the lanes of old Nagono' }
		],
		galleryTones: COOL_TONES,
		images: TEMP_IMAGES
	},
	{
		id: 'prop_kamejima',
		slug: 'kamejima',
		name: { ja: '亀島', en: 'Kamejima' },
		location: { ja: '愛知県名古屋市', en: 'Nagoya, Aichi' },
		description: {
			ja: '問屋街の記憶を残す、低層の一室。 朝は珈琲の香り、夜は街の灯が遠く。',
			en: 'A low-rise room that keeps the memory of the wholesale quarter. Coffee in the morning, distant city light at night.'
		},
		maxGuests: 3,
		bedrooms: 1,
		minNights: 1,
		nightlyRate: 24000,
		spaces: {
			ja: '古い倉庫を改めた一室。コンクリートと無垢材、大きな窓に街の光。寝室は一間、水回りは土間に納める。',
			en: 'A single room reworked from an old warehouse. Concrete and solid timber, city light through a large window; one bedroom, the bath set into a doma.'
		},
		features: [
			{ ja: 'シャワールーム', en: 'Shower room' },
			{ ja: '大窓のリビング', en: 'Living room with a large window' },
			{ ja: 'レコードプレーヤー', en: 'Record player' },
			{ ja: '自転車の貸出', en: 'Bicycle to borrow' }
		],
		around: [
			{ ja: 'ノリタケの森', en: 'Noritake Garden' },
			{ ja: '円頓寺商店街を歩く', en: 'Endoji shopping street' },
			{ ja: '四間道の蔵めぐり', en: 'The storehouses of Shikemichi' }
		],
		galleryTones: COOL_TONES,
		images: TEMP_IMAGES
	},
	{
		id: 'prop_osu',
		slug: 'osu',
		name: { ja: '大須', en: 'Osu' },
		location: { ja: '愛知県名古屋市', en: 'Nagoya, Aichi' },
		description: {
			ja: '大須の喧騒を一歩抜けた路地裏。 古い寺と、新しい店のあいだに。',
			en: 'A back lane a step away from the bustle of Osu — between old temples and new shops.'
		},
		maxGuests: 2,
		bedrooms: 1,
		minNights: 1,
		nightlyRate: 21000,
		spaces: {
			ja: '路地奥の小さな一棟。一階に土間と浴室、中二階に寝室。窓を開ければ路地の気配が届く。',
			en: 'A small house at the end of a lane. A doma and bath below, a bedroom on the mezzanine; open the window and the lane drifts in.'
		},
		features: [
			{ ja: '檜の小浴室', en: 'Small hinoki bath' },
			{ ja: '中二階の寝室', en: 'Mezzanine bedroom' },
			{ ja: '路地のベンチ', en: 'A bench on the lane' },
			{ ja: '朝の甘味', en: 'Morning sweets' }
		],
		around: [
			{ ja: '大須観音に参る', en: 'Osu Kannon temple' },
			{ ja: '商店街の食べ歩き', en: 'Eat through the arcades' },
			{ ja: '万松寺の界隈', en: 'Around Banshoji temple' }
		],
		galleryTones: COOL_TONES,
		images: TEMP_IMAGES
	},
	{
		id: 'prop_hida',
		slug: 'hida',
		name: { ja: '飛騨', en: 'Hida' },
		location: { ja: '岐阜県', en: 'Gifu' },
		description: {
			ja: '古い梁を残した蔵を改修した一棟。 暖炉の火と、石の冷たさが共にある。',
			en: 'A converted storehouse with original beams. Firewood warmth, and stone cool, coexist.'
		},
		maxGuests: 6,
		bedrooms: 3,
		minNights: 2,
		nightlyRate: 38000,
		spaces: {
			ja: '築百二十年の蔵を改修した二層構造。一階は土間と石床のラウンジ、二階に寝室三間。窓は古ガラス、梁は黒漆塗りを残す。',
			en: 'A 120-year-old storehouse restored across two levels. A doma lounge on stone below, three bedrooms above. Original glass at the windows, lacquered black beams above.'
		},
		features: [
			{ ja: '石風呂（源泉）', en: 'Stone bath, natural spring' },
			{ ja: '土間ラウンジ', en: 'Earthen-floor lounge' },
			{ ja: '蔵カウンターでの夕食', en: 'Dinner at the storehouse counter' },
			{ ja: '中庭（苔と石）', en: 'Inner garden of moss and stone' }
		],
		around: [
			{ ja: '飛騨高山の朝市', en: 'Hida-Takayama morning market' },
			{ ja: '白川郷の合掌造集落', en: 'Shirakawa-go gassho village' },
			{ ja: '飛騨の木地師の工房を訪ねる', en: "Visit a Hida woodturner's atelier" }
		],
		galleryTones: COOL_TONES,
		images: TEMP_IMAGES
	}
];

// Crude availability mock — we treat all properties as available
// except for arbitrary date pockets to simulate "no availability" UX.
export function isMockAvailable(propertyId: string, checkIn: string, _checkOut: string): boolean {
	const day = new Date(checkIn).getDate();
	// Pretend Osu is fully booked on the 1st–7th of any month.
	if (propertyId === 'prop_osu' && day >= 1 && day <= 7) return false;
	return true;
}
