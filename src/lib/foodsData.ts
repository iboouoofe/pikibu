export interface FoodItem {
  id: string
  name: string
  nameTr: string
  category: 'sebze' | 'meyve' | 'protein' | 'tahıl' | 'süt'
  minMonth: number
  allergenLevel: 1 | 2 | 3 // 1: Low, 2: Medium, 3: High
  emoji: string
  servingGuide: string
  benefits: string
  blwPrep: string
}

export const COMPLETE_FOODS: FoodItem[] = [
  {
    id: 'food-havuc',
    name: 'Carrot',
    nameTr: 'Havuç',
    category: 'sebze',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🥕',
    servingGuide: 'Buharda parmaklarınızla kolayca ezilecek kıvama gelene kadar haşlayın. Püre veya kalın parmak boyutu olarak sunun.',
    benefits: 'A vitamini ve beta-karoten deposudur; göz ve cilt gelişimini destekler.',
    blwPrep: 'İki parmak kalınlığında ve 6-7 cm uzunluğunda buharda haşlanmış çubuklar şeklinde sunun.'
  },
  {
    id: 'food-tatli-patates',
    name: 'Sweet Potato',
    nameTr: 'Tatlı Patates',
    category: 'sebze',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🍠',
    servingGuide: 'Fırında veya buharda yumuşacık olana kadar pişirin. İlk günlerde anne sütü veya formül mama ile kıvamını açabilirsiniz.',
    benefits: 'Lif ve potasyum yönünden zengindir, sindirimi çok kolaydır ve kabızlığı önler.',
    blwPrep: 'Fırında hafif zeytinyağı ile yumuşatılmış kalın hilal dilimler olarak verin.'
  },
  {
    id: 'food-avokado',
    name: 'Avocado',
    nameTr: 'Avokado',
    category: 'meyve',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🥑',
    servingGuide: 'Tamamen olgunlaşmış yumuşak avokadoyu çatalla ezin veya kaymaması için yulaf ununa batırılmış dilim halinde verin.',
    benefits: 'Beyin gelişimini hızlandıran zengin sağlıklı tekli doymamış yağ asitleri içerir.',
    blwPrep: 'Tırtıklı bıçakla kesip üzerine ruşeym veya dövülmüş yulaf serpiştirerek kaymasını önleyin.'
  },
  {
    id: 'food-kabak',
    name: 'Zucchini',
    nameTr: 'Balkabağı / Yeşil Kabak',
    category: 'sebze',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🥒',
    servingGuide: 'Buharda haşlayın, çatalla hafif ezin. Sulu yapısıyla bebeğin bağırsaklarını yumuşatır.',
    benefits: 'Yüksek su oranı ve C vitamini ile bağırsak florasını rahatlatır.',
    blwPrep: 'Çekirdeksiz kısımlarını kalın uzun şeritler halinde haşlayıp kavratın.'
  },
  {
    id: 'food-elma',
    name: 'Apple',
    nameTr: 'Elma',
    category: 'meyve',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🍎',
    servingGuide: 'Çiğ elma boğulma riski taşıdığından mutlaka buharda yumuşatılmalı veya cam rendede rendelenmelidir.',
    benefits: 'Pektin lifi içerir, mide ve bağırsak hareketlerini düzenler.',
    blwPrep: 'Buharda çatalla ezilecek kadar yumuşatılmış kalın elma dilimi olarak sunun.'
  },
  {
    id: 'food-muz',
    name: 'Banana',
    nameTr: 'Muz',
    category: 'meyve',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🍌',
    servingGuide: 'Olgun muzları çatalla ezin veya kabuğunun alt yarısını soyup bebeğin tutmasını sağlayın.',
    benefits: 'Enerji, B6 vitamini ve potasyum kaynağıdır.',
    blwPrep: 'Muzun alt kabuğunu soyup bebeğin elinden kaymaması için kabuk kısmından tutmasına izin verin.'
  },
  {
    id: 'food-armut',
    name: 'Pear',
    nameTr: 'Armut',
    category: 'meyve',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🍐',
    servingGuide: 'Buharda hafif haşlayın veya cam rendede püre yapın.',
    benefits: 'Doğal lif kaynağıdır, kabızlığa karşı en etkili meyvedir.',
    blwPrep: 'Yumuşak olgun armutları uzun dilimler halinde sunun.'
  },
  {
    id: 'food-yulaf',
    name: 'Oats',
    nameTr: 'Yulaf Ezmesi',
    category: 'tahıl',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🌾',
    servingGuide: 'İnce öğütülmüş yulafı suyla pişirin, ılıyınca içine meyve püresi ekleyin.',
    benefits: 'Yavaş salınımlı enerji, demir ve çinko sağlar.',
    blwPrep: 'Muz ve yumurta sarısı ile karıştırıp tavada minik parmak pankekleri yapın.'
  },
  {
    id: 'food-yogurt',
    name: 'Homemade Yogurt',
    nameTr: 'Ev Yoğurdu',
    category: 'süt',
    minMonth: 6,
    allergenLevel: 2,
    emoji: '🥣',
    servingGuide: 'Kendi mayaladığınız taze probiyotik yoğurttan günde 2-3 tatlı kaşığı ile başlayın.',
    benefits: 'Kalsiyum ve yararlı probiyotik bakterilerle bağışıklığı güçlendirir.',
    blwPrep: 'Önceden kaşığa doldurup bebeğin eline verin (pre-loaded spoon yöntemi).'
  },
  {
    id: 'food-yumurta-sarisi',
    name: 'Egg Yolk',
    nameTr: 'Yumurta Sarısı',
    category: 'protein',
    minMonth: 6,
    allergenLevel: 2,
    emoji: '🥚',
    servingGuide: 'İyice haşlanmış yumurtanın sarısından 1/8 çay kaşığı ile 3 gün kuralına uygun başlayın.',
    benefits: 'Beyin gelişimi için hayati olan kolin ve yüksek demir içerir.',
    blwPrep: 'Avokado püresi veya yoğurtla karıştırıp küçük lokmalar halinde verin.'
  },
  {
    id: 'food-somon',
    name: 'Salmon',
    nameTr: 'Somon Balığı',
    category: 'protein',
    minMonth: 8,
    allergenLevel: 3,
    emoji: '🐟',
    servingGuide: 'Kılçıkları titizlikle ayıklanmış buharda veya fırında pişmiş somonu çatalla ezin.',
    benefits: 'Zengin Omega-3 (DHA/EPA) kaynağıdır, sinir sistemi gelişimini katlar.',
    blwPrep: 'Geniş yumuşak pullar halinde ayrılan somon parçasını parmaklarıyla almasına sunun.'
  },
  {
    id: 'food-mercimek',
    name: 'Red Lentil',
    nameTr: 'Kırmızı Mercimek',
    category: 'protein',
    minMonth: 7,
    allergenLevel: 1,
    emoji: '🫘',
    servingGuide: 'İyice yıkayıp sebzelerle birlikte pişirin. Gaz yapmaması için kimyon ekleyebilirsiniz.',
    benefits: 'Bitkisel protein, demir ve lif deposudur.',
    blwPrep: 'Sebzeli mercimek köftesi (tuzsuz ve baharatsız) şeklinde parmak gıda olarak sunun.'
  },
  {
    id: 'food-tavuk',
    name: 'Chicken Breast',
    nameTr: 'Tavuk Göğsü / But',
    category: 'protein',
    minMonth: 7,
    allergenLevel: 1,
    emoji: '🍗',
    servingGuide: 'İlikli kemik suyunda yumuşacık haşlayıp didikleyin veya sebze çorbasına katın.',
    benefits: 'Büyüme hormonu ve kas yapımı için temel protein ve çinko sağlar.',
    blwPrep: 'Büyük parça haşlanmış tavuk budunu bebeğin emmesi ve kemirmesi için tutturabilirsiniz.'
  },
  {
    id: 'food-irmik',
    name: 'Baby Semolina',
    nameTr: 'Bebek İrmiği',
    category: 'tahıl',
    minMonth: 6,
    allergenLevel: 1,
    emoji: '🌾',
    servingGuide: 'Meyve pürelerinin veya sebze çorbalarının kıvamını artırmak için 1 tatlı kaşığı pişirin.',
    benefits: 'Hafif ve doyurucu bir karbonhidrat takviyesidir.',
    blwPrep: 'Sebze püreleriyle harmanlanmış muhallebi kıvamında sunun.'
  }
]
