// Lightweight in-memory message catalog.
// Will be replaced by paraglide-sveltekit once the locale URL structure is finalized.

import type { Locale } from '$lib/types/domain';

type Dict = {
	nav: {
		reserve: string;
	};
	menu: {
		open: string;
		close: string;
		exploreHeading: string;
		housesHeading: string;
		languageHeading: string;
	};
	meta: {
		siteName: string;
		ogLocale: string;
		defaultDescription: string;
		home: { title: string; description: string };
		about: { title: string; description: string };
		reserve: { title: string; description: string };
		results: { title: string; description: string };
		booking: { title: string; description: string };
		confirmed: { title: string; description: string };
		contact: { title: string; description: string };
		privacy: { title: string; description: string };
		terms: { title: string; description: string };
		property: {
			title: (name: string) => string;
			description: (name: string, location: string) => string;
		};
	};
	home: {
		hero: {
			ledeLine1: string;
			ledeLine2: string;
			scrollHint: string;
		};
		properties: {
			eyebrow: string;
			heading: string;
			sub: string;
			viewDetails: string;
		};
		philosophy: {
			eyebrow: string;
			heading: string;
			body: string;
			signature: string;
		};
		experience: {
			eyebrow: string;
			heading: string;
			sub: string;
			items: Array<{ index: string; title: string; description: string }>;
		};
		gallery: {
			eyebrow: string;
			heading: string;
		};
		reserveCta: {
			eyebrow: string;
			heading: string;
			sub: string;
			cta: string;
		};
	};
	reserve: {
		eyebrow: string;
		ledeLine1: string;
		ledeLine2: string;
		sub: string;
		checkIn: string;
		checkOut: string;
		guests: string;
		guestUnit: (n: number) => string;
		submit: string;
		note: string;
		contactLink: string;
	};
	results: {
		eyebrow: string;
		heading: string;
		nightsHeading: string;
		summaryNights: (n: number) => string;
		edit: string;
		empty: string;
		fromPrice: string;
		nightsLabel: (n: number) => string;
		select: string;
		bedrooms: (n: number) => string;
		guestsCap: (n: number) => string;
		taxIncluded: string;
	};
	booking: {
		eyebrow: string;
		heading: string;
		steps: { details: string; review: string };
		stayHeading: string;
		nightsHeading: string;
		priceHeading: string;
		subtotal: string;
		taxes: string;
		total: string;
		taxIncluded: string;
		guestHeading: string;
		guestIntro: string;
		lastName: string;
		firstName: string;
		email: string;
		phone: string;
		notes: string;
		notesOptional: string;
		notesPlaceholder: string;
		reviewCta: string;
		reviewHeading: string;
		reviewIntro: string;
		editCta: string;
		submit: string;
		submitting: string;
		guestName: (last: string, first: string) => string;
		mockNotice: string;
		errors: { required: string; email: string };
		backToResults: string;
	};
	confirmed: {
		eyebrow: string;
		heading: string;
		lede: string;
		refLabel: string;
		emailNote: (email: string) => string;
		detailsHeading: string;
		stayLabel: string;
		guestLabel: string;
		totalLabel: string;
		backHome: string;
		mockNotice: string;
	};
	contact: {
		eyebrow: string;
		heading: string;
		lead: string;
		emailLabel: string;
		telLabel: string;
		addressLabel: string;
		hoursLabel: string;
		email: string;
		tel: string;
		address: string;
		hours: string;
		note: string;
	};
	legal: {
		draftNotice: string;
		effectiveLabel: string;
		effective: string;
	};
	privacy: {
		eyebrow: string;
		heading: string;
		intro: string;
		sections: Array<{ heading: string; body: string }>;
	};
	terms: {
		eyebrow: string;
		heading: string;
		intro: string;
		sections: Array<{ heading: string; body: string }>;
	};
	about: {
		hero: { eyebrow: string; ledeLine1: string; ledeLine2: string; sub: string };
		origin: { eyebrow: string; heading: string; paragraphs: string[] };
		approach: {
			eyebrow: string;
			heading: string;
			intro: string;
			pillars: Array<{ index: string; title: string; description: string }>;
		};
		closing: { eyebrow: string; heading: string; cta: string };
	};
	property: {
		reserveLink: string;
		overview: { eyebrow: string; heading: string };
		factLabels: {
			bedrooms: string;
			maxGuests: string;
			minStay: string;
			checkIn: string;
			checkOut: string;
		};
		spaces: { eyebrow: string; heading: string };
		around: { eyebrow: string; heading: string };
		gallery: { eyebrow: string; heading: string };
		reserve: { eyebrow: string; heading: string; body: string; cta: string };
		rateFrom: string;
		perNight: string;
		minStayValue: (n: number) => string;
		checkInTime: string;
		checkOutTime: string;
	};
	footer: {
		tagline: string;
		navHeading: string;
		nav: {
			home: string;
			houses: string;
			about: string;
			concept: string;
			experience: string;
			reserve: string;
			contact: string;
		};
		contactHeading: string;
		contactLines: string[];
		newsletterHeading: string;
		newsletterBody: string;
		newsletterPlaceholder: string;
		newsletterSubmit: string;
		socialHeading: string;
		socialItems: Array<{ label: string; href: string }>;
		legal: { privacy: string; terms: string };
		copy: string;
	};
};

export const messages: Record<Locale, Dict> = {
	ja: {
		nav: { reserve: 'Reservation' },
		menu: {
			open: 'Menu',
			close: 'Close',
			exploreHeading: 'Explore',
			housesHeading: 'Houses',
			languageHeading: 'Language'
		},
		meta: {
			siteName: 'MOKUSEKI Hotels',
			ogLocale: 'ja_JP',
			defaultDescription:
				'五感が、静かにほどけてゆく — 名古屋・飛騨に四棟の一棟貸しを構える、スモールホテルブランド。',
			home: {
				title: 'MOKUSEKI Hotels',
				description:
					'五感が、静かにほどけてゆく。名古屋・飛騨に四棟、身体と精神に余白をもたらすスモールホテル。'
			},
			about: {
				title: 'About — MOKUSEKI',
				description: 'MOKUSEKI の理念と、運営における五つの所作について。'
			},
			reserve: {
				title: 'Reservation — MOKUSEKI',
				description: 'ご希望の日付と人数をお選びください。お泊まりいただける棟をご案内します。'
			},
			results: {
				title: 'Available Stays — MOKUSEKI',
				description: '条件にあう棟と料金のご案内。'
			},
			booking: {
				title: 'ご予約 — MOKUSEKI',
				description: 'ご予約者さまの情報をご入力のうえ、ご予約をお進めください。'
			},
			confirmed: {
				title: 'ご予約完了 — MOKUSEKI',
				description: 'ご予約を承りました。'
			},
			contact: {
				title: 'お問い合わせ — MOKUSEKI',
				description: 'ご予約・ご滞在に関するお問い合わせ先のご案内。'
			},
			privacy: {
				title: 'プライバシーポリシー — MOKUSEKI',
				description: 'MOKUSEKI における個人情報の取り扱いについて。'
			},
			terms: {
				title: '利用規約 — MOKUSEKI',
				description: 'MOKUSEKI のご利用に関する規約。'
			},
			property: {
				title: (name) => `${name} — MOKUSEKI`,
				description: (name, location) =>
					`${location}に佇む一棟貸し「${name}」。五感が、静かにほどけてゆく滞在を。`
			}
		},
		home: {
			hero: {
				ledeLine1: '五感が、静かに',
				ledeLine2: 'ほどけてゆく。',
				scrollHint: 'Scroll'
			},
			properties: {
				eyebrow: 'Houses',
				heading: '四棟の、一棟貸し。',
				sub: '名古屋と飛騨に、それぞれの一棟。\n土地の名を冠した四棟から、お選びいただけます。',
				viewDetails: '詳細を見る'
			},
			philosophy: {
				eyebrow: 'Philosophy',
				heading: '身体と精神に、\n余白を。',
				body: 'MOKUSEKI は、「滞在のなかで、五感が静かにほどけてゆく。」というステイコンセプトのもと、身体と精神に余白をもたらすスモールホテルブランドです。\n\n日本の伝統的な素材と技法を採り入れた各客室には、日々の喧騒から離れて静かに自分と向き合う時間を、という想いから、ヨガや書道、抹茶や茶の焙煎といった体験のできる道具を設えています。',
				signature: 'MOKUSEKI'
			},
			experience: {
				eyebrow: 'Experience',
				heading: '滞在を、構成するもの。',
				sub: '夜のしじま、朝の光、土地の食材。\n五つの要素が、静かに重なります。',
				items: [
					{
						index: '01',
						title: '静寂',
						description: '夜は完全な無音のなかへ。\n谷川と、風と、ご自身の呼吸だけが残ります。'
					},
					{
						index: '02',
						title: '湯',
						description: '檜と石で組まれた湯殿。\n源泉を、ご滞在の間ずっと貸し切りで。'
					},
					{
						index: '03',
						title: '食',
						description: '土地の生産者から届く季節の素材を、\nひとつひとつ、ていねいに。'
					},
					{
						index: '04',
						title: '光と影',
						description: '朝の障子、夕の橙、夜の燭。\n光が時間そのものになります。'
					},
					{
						index: '05',
						title: '余白',
						description: '何もしないという贅沢を。\n余白は、最も上質な体験です。'
					}
				]
			},
			gallery: {
				eyebrow: 'Gallery',
				heading: '風景の、断片。'
			},
			reserveCta: {
				eyebrow: 'Reservation',
				heading: '滞在を、はじめる。',
				sub: 'ご希望の日付と人数から、\nお泊まりいただける棟をご案内いたします。',
				cta: 'Reserve a Stay'
			}
		},
		reserve: {
			eyebrow: 'Reservation',
			ledeLine1: '五感が、静かに',
			ledeLine2: 'ほどけてゆく滞在へ。',
			sub: 'ご希望の日付と人数をお選びください。\nご滞在いただける棟と、そのご料金をご案内いたします。',
			checkIn: 'Check-in',
			checkOut: 'Check-out',
			guests: 'Guests',
			guestUnit: (n) => `${n} 名様`,
			submit: 'Search Stays',
			note: '4 棟の一棟貸しから、条件にあう滞在をご案内いたします。',
			contactLink: 'お問い合わせ'
		},
		results: {
			eyebrow: 'Available Stays',
			heading: 'ご滞在いただける棟',
			nightsHeading: '泊数',
			summaryNights: (n) => `${n} 泊`,
			edit: '条件を変更',
			empty:
				'該当する棟がございませんでした。\n日付または人数をご変更のうえ、もう一度お試しください。',
			fromPrice: '滞在総額',
			nightsLabel: (n) => `（${n} 泊）`,
			select: 'この棟を選ぶ',
			bedrooms: (n) => `${n} 寝室`,
			guestsCap: (n) => `最大 ${n} 名`,
			taxIncluded: '税込'
		},
		booking: {
			eyebrow: 'Reservation',
			heading: 'ご予約のお手続き。',
			steps: { details: '01　ご入力', review: '02　ご確認' },
			stayHeading: 'ご滞在内容',
			nightsHeading: '泊数',
			priceHeading: 'ご料金',
			subtotal: '宿泊料',
			taxes: '税・サービス料',
			total: 'ご請求総額',
			taxIncluded: '税込',
			guestHeading: 'ご予約者さま',
			guestIntro: 'ご予約確認のご連絡に用いる情報をご入力ください。',
			lastName: '姓',
			firstName: '名',
			email: 'メールアドレス',
			phone: '電話番号',
			notes: 'ご要望',
			notesOptional: '（任意）',
			notesPlaceholder: 'お食事のご相談、到着時間など',
			reviewCta: '入力内容を確認する',
			reviewHeading: 'ご入力内容のご確認',
			reviewIntro: '以下の内容でご予約をお承りいたします。',
			editCta: '内容を修正する',
			submit: 'この内容で予約する',
			submitting: '送信しています…',
			guestName: (last, first) => `${last}　${first} 様`,
			mockNotice: '※ こちらはデモ環境です。お支払いは発生せず、実際のご予約は確定いたしません。',
			errors: { required: 'ご入力ください。', email: 'メールアドレスの形式をご確認ください。' },
			backToResults: '← 検索結果へ戻る'
		},
		confirmed: {
			eyebrow: 'Reservation Confirmed',
			heading: 'ご予約を承りました。',
			lede: 'この度はご予約をいただき、誠にありがとうございます。\n当日、心よりお待ち申し上げております。',
			refLabel: '予約番号',
			emailNote: (email) => `ご予約確認のご案内を ${email} 宛にお送りいたしました。`,
			detailsHeading: 'ご予約内容',
			stayLabel: 'ご滞在',
			guestLabel: 'ご予約者',
			totalLabel: 'ご請求総額',
			backHome: 'ホームへ戻る',
			mockNotice: '※ こちらはデモ環境のため、確認メールは送信されません。'
		},
		contact: {
			eyebrow: 'Contact',
			heading: 'お問い合わせ。',
			lead: 'ご予約・ご滞在に関するお問い合わせは、\n下記までお気軽にご連絡ください。',
			emailLabel: 'Email',
			telLabel: 'Tel',
			addressLabel: 'Address',
			hoursLabel: 'Hours',
			email: 'stay@mokuseki.jp',
			tel: '+81 (0)00 0000 0000',
			address: '〒○○○-○○○○\n愛知県名古屋市某所',
			hours: '10:00 – 18:00（不定休）',
			note: 'ご予約状況の確認は、ご予約番号を添えてメールにてご連絡ください。'
		},
		legal: {
			draftNotice: '※ 本ページは準備中の暫定版です。正式な内容は公開時に更新いたします。',
			effectiveLabel: '制定日',
			effective: '2026年'
		},
		privacy: {
			eyebrow: 'Privacy',
			heading: 'プライバシーポリシー。',
			intro: 'MOKUSEKI（以下「当ホテル」）は、お客様の個人情報を以下の方針に基づき取り扱います。',
			sections: [
				{
					heading: '1. 取得する情報',
					body: 'ご予約・お問い合わせに際して、氏名・メールアドレス・電話番号などの情報を取得します。'
				},
				{
					heading: '2. 利用目的',
					body: '取得した情報は、ご予約の確認・ご滞在の準備・お問い合わせへの対応の目的にのみ利用します。'
				},
				{
					heading: '3. 第三者提供',
					body: '法令に基づく場合を除き、ご本人の同意なく第三者へ個人情報を提供することはありません。'
				},
				{
					heading: '4. お問い合わせ',
					body: '個人情報の開示・訂正・削除のご請求は、stay@mokuseki.jp までご連絡ください。'
				}
			]
		},
		terms: {
			eyebrow: 'Terms',
			heading: '利用規約。',
			intro: '本規約は、MOKUSEKI のご予約およびご滞在に適用される条件を定めるものです。',
			sections: [
				{
					heading: '1. ご予約',
					body: 'ご予約は、当ホテルが予約確認をご連絡した時点で成立します。'
				},
				{
					heading: '2. キャンセル',
					body: 'キャンセルに伴う料金は、ご滞在日からの日数に応じて申し受ける場合があります。'
				},
				{
					heading: '3. ご滞在',
					body: 'チェックインは15:00以降、チェックアウトは11:00までとします。各棟の定員を超えるご利用はお断りいたします。'
				},
				{
					heading: '4. 免責',
					body: '天災その他やむを得ない事由により提供が困難となった場合の責任は、当ホテルの定める範囲に限られます。'
				}
			]
		},
		about: {
			hero: {
				eyebrow: 'About',
				ledeLine1: '何もしないことが、',
				ledeLine2: '贅沢になる。',
				sub: '一棟貸しの宿。\n名古屋と飛騨に、四棟。'
			},
			origin: {
				eyebrow: 'Origin',
				heading: 'ひとつの素材から、はじまる。',
				paragraphs: [
					'MOKUSEKI は、土地の素材に問いを立てるところから、はじまりました。',
					'木は、年月とともに色を変え、香りを残します。石は、湿りや光を吸い込み、季節の温度をたたえます。私たちは、その二つの素材が、人にもたらす感覚を信じています。',
					'宿は、たくさんのもので満たすのではなく、削り落とすことで、滞在のなかにある余白を、滞在者ご自身の体験で満たしていただく。それが、私たちの設えに対する考え方です。'
				]
			},
			approach: {
				eyebrow: 'Approach',
				heading: '五つの所作。',
				intro: '私たちが、毎日の運営のなかで大切にしているもの。',
				pillars: [
					{
						index: '01',
						title: 'もてなさない、もてなし。',
						description:
							'過剰な接客は、滞在者の余白を奪います。気配を消し、必要なときにだけ手を添えること。'
					},
					{
						index: '02',
						title: '地のものを、地のままに。',
						description: '土地の生産者から届く食材を、過度に整えず、素材の力をそのまま食卓に。'
					},
					{
						index: '03',
						title: '光は、設計する。',
						description: '昼の障子、夕の橙、夜の燭。時間ごとの光が、滞在の表情を変える。'
					},
					{
						index: '04',
						title: '音は、減らす。',
						description: '空調・水・人の声──滞在者が聴くべき音を、自然の側に残す。'
					},
					{
						index: '05',
						title: 'ひとつの宿に、ひと組。',
						description: '一棟貸しの原則を、すべての棟で守る。他者を、気にしない時間を。'
					}
				]
			},
			closing: {
				eyebrow: 'Begin',
				heading: '滞在を、はじめる。',
				cta: 'Reserve a Stay'
			}
		},
		property: {
			reserveLink: 'Reserve',
			overview: { eyebrow: 'Overview', heading: 'この棟について。' },
			factLabels: {
				bedrooms: '寝室',
				maxGuests: '最大人数',
				minStay: '最短宿泊',
				checkIn: 'チェックイン',
				checkOut: 'チェックアウト'
			},
			spaces: { eyebrow: 'Spaces', heading: '棟の構成。' },
			around: { eyebrow: 'Around', heading: '周辺の体験。' },
			gallery: { eyebrow: 'Gallery', heading: '棟の風景。' },
			reserve: {
				eyebrow: 'Reservation',
				heading: 'この棟を予約する。',
				body: 'ご希望の日付と人数をお選びください。\nそのままご予約フォームへお進みいただけます。',
				cta: 'Check Availability'
			},
			rateFrom: '料金',
			perNight: '/ 泊（税別）',
			minStayValue: (n) => `${n} 泊から`,
			checkInTime: '15:00 以降',
			checkOutTime: '11:00 まで'
		},
		footer: {
			tagline: '五感が、静かにほどけてゆく。',
			navHeading: 'Navigation',
			nav: {
				home: 'ホーム',
				houses: '棟一覧',
				about: '私たちについて',
				concept: 'コンセプト',
				experience: '滞在体験',
				reserve: 'ご予約',
				contact: 'お問い合わせ'
			},
			contactHeading: 'Contact',
			contactLines: ['〒○○○-○○○○', '愛知県某所', 'TEL  +81 (0)00 0000 0000', 'stay@mokuseki.jp'],
			newsletterHeading: 'Letter',
			newsletterBody: '新たな棟、季節の便りを、年に数回お届けいたします。',
			newsletterPlaceholder: 'メールアドレス',
			newsletterSubmit: '登録',
			socialHeading: 'Journal',
			socialItems: [
				{ label: 'Instagram', href: 'https://instagram.com/' },
				{ label: 'Note', href: 'https://note.com/' }
			],
			legal: { privacy: 'プライバシーポリシー', terms: '利用規約' },
			copy: '© MOKUSEKI'
		}
	},
	en: {
		nav: { reserve: 'Reservation' },
		menu: {
			open: 'Menu',
			close: 'Close',
			exploreHeading: 'Explore',
			housesHeading: 'Houses',
			languageHeading: 'Language'
		},
		meta: {
			siteName: 'MOKUSEKI Hotels',
			ogLocale: 'en_US',
			defaultDescription:
				'A small hotel brand of four private houses in Nagoya and Hida, where the senses quietly come undone.',
			home: {
				title: 'MOKUSEKI Hotels',
				description:
					'Four private houses in Nagoya and Hida. A stay where the senses quietly come undone.'
			},
			about: {
				title: 'About — MOKUSEKI',
				description:
					'The philosophy of MOKUSEKI, and the five gestures we hold to in everyday operation.'
			},
			reserve: {
				title: 'Reservation — MOKUSEKI',
				description: 'Choose your dates and party size to see the houses available for your stay.'
			},
			results: {
				title: 'Available Stays — MOKUSEKI',
				description: 'Houses and rates that match your selected dates.'
			},
			booking: {
				title: 'Reservation — MOKUSEKI',
				description: 'Enter your details to complete your reservation.'
			},
			confirmed: {
				title: 'Reservation Confirmed — MOKUSEKI',
				description: 'Your stay is reserved.'
			},
			contact: {
				title: 'Contact — MOKUSEKI',
				description: 'How to reach us about reservations and stays.'
			},
			privacy: {
				title: 'Privacy — MOKUSEKI',
				description: 'How MOKUSEKI handles personal information.'
			},
			terms: {
				title: 'Terms — MOKUSEKI',
				description: 'Terms for reserving and staying with MOKUSEKI.'
			},
			property: {
				title: (name) => `${name} — MOKUSEKI`,
				description: (name, location) =>
					`${name} — a private house in ${location}. A stay where the senses quietly come undone.`
			}
		},
		home: {
			hero: {
				ledeLine1: 'A stay where the senses',
				ledeLine2: 'quietly come undone.',
				scrollHint: 'Scroll'
			},
			properties: {
				eyebrow: 'Houses',
				heading: 'Four private houses.',
				sub: 'Each rooted in its corner of Nagoya and Hida.\nChoose from four, each named for the place it belongs to.',
				viewDetails: 'View details'
			},
			philosophy: {
				eyebrow: 'Philosophy',
				heading: 'Space, for body\nand mind.',
				body: 'MOKUSEKI is a small hotel brand built on a single stay concept — that within a stay, the senses quietly come undone — bringing a sense of space to both body and mind.\n\nEach room draws on traditional Japanese materials and craft, and is furnished for quiet practice — yoga and calligraphy, matcha and the roasting of tea — so that you can step away from the noise of the everyday and sit quietly with yourself.',
				signature: 'MOKUSEKI'
			},
			experience: {
				eyebrow: 'Experience',
				heading: 'What composes the stay.',
				sub: 'The hush of night, the morning light, the food of the land.\nFive elements that quietly overlap.',
				items: [
					{
						index: '01',
						title: 'Silence',
						description:
							'Nights of complete silence.\nOnly the stream, the wind, and your own breath remain.'
					},
					{
						index: '02',
						title: 'Bath',
						description:
							'A bathhouse of hinoki and stone.\nThe spring is yours alone for the length of your stay.'
					},
					{
						index: '03',
						title: 'Cuisine',
						description: 'Seasonal ingredients from local producers,\nattended to one by one.'
					},
					{
						index: '04',
						title: 'Light',
						description:
							'Morning through shoji, amber dusk, candle by night.\nLight becomes the measure of time.'
					},
					{
						index: '05',
						title: 'Space',
						description: 'The luxury of doing nothing.\nEmpty space is the finest of experiences.'
					}
				]
			},
			gallery: {
				eyebrow: 'Gallery',
				heading: 'Fragments of place.'
			},
			reserveCta: {
				eyebrow: 'Reservation',
				heading: 'Begin your stay.',
				sub: 'Choose your dates and party size,\nand we will show you the houses available.',
				cta: 'Reserve a Stay'
			}
		},
		reserve: {
			eyebrow: 'Reservation',
			ledeLine1: 'A stay where the senses',
			ledeLine2: 'quietly come undone.',
			sub: 'Please select your dates and party size.\nWe will show you the houses available, with their rates.',
			checkIn: 'Check-in',
			checkOut: 'Check-out',
			guests: 'Guests',
			guestUnit: (n) => `${n} ${n === 1 ? 'guest' : 'guests'}`,
			submit: 'Search Stays',
			note: 'Four private houses, each offered in their entirety.',
			contactLink: 'Contact us'
		},
		results: {
			eyebrow: 'Available Stays',
			heading: 'Houses available for your dates',
			nightsHeading: 'Nights',
			summaryNights: (n) => `${n} ${n === 1 ? 'night' : 'nights'}`,
			edit: 'Edit search',
			empty:
				'No houses available for the selected dates.\nPlease adjust your dates or party size and try again.',
			fromPrice: 'Stay total',
			nightsLabel: (n) => `(${n} ${n === 1 ? 'night' : 'nights'})`,
			select: 'Choose this house',
			bedrooms: (n) => `${n} ${n === 1 ? 'bedroom' : 'bedrooms'}`,
			guestsCap: (n) => `up to ${n} guests`,
			taxIncluded: 'Tax included'
		},
		booking: {
			eyebrow: 'Reservation',
			heading: 'Complete your reservation.',
			steps: { details: '01　Details', review: '02　Confirm' },
			stayHeading: 'Your stay',
			nightsHeading: 'Nights',
			priceHeading: 'Rate',
			subtotal: 'Accommodation',
			taxes: 'Tax & service',
			total: 'Total',
			taxIncluded: 'Tax included',
			guestHeading: 'Guest details',
			guestIntro: 'Used only to confirm and prepare for your stay.',
			lastName: 'Last name',
			firstName: 'First name',
			email: 'Email',
			phone: 'Phone',
			notes: 'Requests',
			notesOptional: '(optional)',
			notesPlaceholder: 'Dietary notes, arrival time, anything else',
			reviewCta: 'Review details',
			reviewHeading: 'Please confirm',
			reviewIntro: 'We will reserve your stay on the details below.',
			editCta: 'Edit details',
			submit: 'Confirm reservation',
			submitting: 'Confirming…',
			guestName: (last, first) => `${first} ${last}`,
			mockNotice:
				'This is a demo environment — no payment is taken and no reservation is actually made.',
			errors: { required: 'This field is required.', email: 'Please check the email format.' },
			backToResults: '← Back to results'
		},
		confirmed: {
			eyebrow: 'Reservation Confirmed',
			heading: 'Your stay is reserved.',
			lede: 'Thank you for your reservation.\nWe look forward to welcoming you.',
			refLabel: 'Reservation number',
			emailNote: (email) => `A confirmation has been sent to ${email}.`,
			detailsHeading: 'Reservation details',
			stayLabel: 'Stay',
			guestLabel: 'Guest',
			totalLabel: 'Total',
			backHome: 'Back to home',
			mockNotice: 'This is a demo environment — no confirmation email is actually sent.'
		},
		contact: {
			eyebrow: 'Contact',
			heading: 'Contact.',
			lead: 'For anything about reservations or your stay,\nplease feel free to reach us below.',
			emailLabel: 'Email',
			telLabel: 'Tel',
			addressLabel: 'Address',
			hoursLabel: 'Hours',
			email: 'stay@mokuseki.jp',
			tel: '+81 (0)00 0000 0000',
			address: 'Nagoya, Aichi, Japan',
			hours: '10:00 – 18:00 (irregular)',
			note: 'To check an existing reservation, please email us with your reservation number.'
		},
		legal: {
			draftNotice: 'This page is a working draft. The final text will be published before launch.',
			effectiveLabel: 'Effective',
			effective: '2026'
		},
		privacy: {
			eyebrow: 'Privacy',
			heading: 'Privacy Policy.',
			intro:
				'MOKUSEKI (“the hotel”) handles your personal information according to the policy below.',
			sections: [
				{
					heading: '1. Information we collect',
					body: 'When you reserve or contact us, we collect details such as your name, email address, and phone number.'
				},
				{
					heading: '2. How we use it',
					body: 'We use this information only to confirm reservations, prepare for your stay, and respond to enquiries.'
				},
				{
					heading: '3. Sharing with third parties',
					body: 'We do not provide personal information to third parties without your consent, except as required by law.'
				},
				{
					heading: '4. Contact',
					body: 'To request disclosure, correction, or deletion of your information, email stay@mokuseki.jp.'
				}
			]
		},
		terms: {
			eyebrow: 'Terms',
			heading: 'Terms of Use.',
			intro:
				'These terms set out the conditions that apply to reserving and staying with MOKUSEKI.',
			sections: [
				{
					heading: '1. Reservations',
					body: 'A reservation is confirmed once the hotel has sent you a confirmation.'
				},
				{
					heading: '2. Cancellation',
					body: 'Cancellation fees may apply depending on how many days remain before your stay.'
				},
				{
					heading: '3. Your stay',
					body: 'Check-in is from 15:00 and check-out is by 11:00. Occupancy beyond each house’s capacity is not permitted.'
				},
				{
					heading: '4. Liability',
					body: 'Where a stay cannot be provided due to disaster or other unavoidable cause, the hotel’s liability is limited to the extent it defines.'
				}
			]
		},
		about: {
			hero: {
				eyebrow: 'About',
				ledeLine1: 'Where doing nothing',
				ledeLine2: 'becomes the luxury.',
				sub: 'Four private houses.\nEach offered in their entirety, in Nagoya and Hida.'
			},
			origin: {
				eyebrow: 'Origin',
				heading: 'It begins with a single material.',
				paragraphs: [
					'MOKUSEKI began with a question about the materials of place.',
					'Wood shifts in colour through the years, and carries its scent. Stone draws in moisture and light, and holds the temperature of the season. We believe in what these two materials offer the body.',
					'A house is not made by filling it, but by paring it back — so the empty space that remains can be filled by the guest, in their own time and way. That is our approach to design.'
				]
			},
			approach: {
				eyebrow: 'Approach',
				heading: 'Five gestures.',
				intro: 'The things we hold to, in the everyday running of the houses.',
				pillars: [
					{
						index: '01',
						title: 'Hospitality, unimposed.',
						description:
							"Excess attention takes the guest's space away. We keep our presence quiet, and step forward only when asked."
					},
					{
						index: '02',
						title: 'Local ingredients, left as they are.',
						description:
							'Seasonal ingredients from nearby producers, brought to the table without overworking them.'
					},
					{
						index: '03',
						title: 'Light, designed.',
						description:
							'Shoji by day, amber by dusk, candle by night. The light shapes the hours of the stay.'
					},
					{
						index: '04',
						title: 'Sound, reduced.',
						description:
							'Air, water, voices — we hold these back so the sounds the guest hears come from the land.'
					},
					{
						index: '05',
						title: 'One house, one party.',
						description:
							'We hold the principle of single-party occupancy across every house. Time uninterrupted by others.'
					}
				]
			},
			closing: {
				eyebrow: 'Begin',
				heading: 'Begin your stay.',
				cta: 'Reserve a Stay'
			}
		},
		property: {
			reserveLink: 'Reserve',
			overview: { eyebrow: 'Overview', heading: 'About the house.' },
			factLabels: {
				bedrooms: 'Bedrooms',
				maxGuests: 'Capacity',
				minStay: 'Minimum stay',
				checkIn: 'Check-in',
				checkOut: 'Check-out'
			},
			spaces: { eyebrow: 'Spaces', heading: 'The composition of the house.' },
			around: { eyebrow: 'Around', heading: 'Around the house.' },
			gallery: { eyebrow: 'Gallery', heading: 'Scenes from the house.' },
			reserve: {
				eyebrow: 'Reservation',
				heading: 'Reserve this house.',
				body: 'Choose your dates and party size,\nand continue to the reservation form.',
				cta: 'Check Availability'
			},
			rateFrom: 'Rate',
			perNight: '/ night (excl. tax)',
			minStayValue: (n) => `${n} ${n === 1 ? 'night' : 'nights'} minimum`,
			checkInTime: 'from 15:00',
			checkOutTime: 'by 11:00'
		},
		footer: {
			tagline: 'A stay where the senses quietly come undone.',
			navHeading: 'Navigation',
			nav: {
				home: 'Home',
				houses: 'Houses',
				about: 'About',
				concept: 'Concept',
				experience: 'Experience',
				reserve: 'Reserve',
				contact: 'Contact'
			},
			contactHeading: 'Contact',
			contactLines: ['Aichi, Japan', 'TEL  +81 (0)00 0000 0000', 'stay@mokuseki.jp'],
			newsletterHeading: 'Letter',
			newsletterBody: 'Occasional letters on new houses and seasonal notes, a few times a year.',
			newsletterPlaceholder: 'Email address',
			newsletterSubmit: 'Subscribe',
			socialHeading: 'Journal',
			socialItems: [
				{ label: 'Instagram', href: 'https://instagram.com/' },
				{ label: 'Note', href: 'https://note.com/' }
			],
			legal: { privacy: 'Privacy', terms: 'Terms' },
			copy: '© MOKUSEKI'
		}
	}
};
