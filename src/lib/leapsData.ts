export interface LeapDetail {
  id: number
  title: string
  titleTr: string
  startWeek: number
  endWeek: number
  description: string
  descriptionTr: string
  symptoms: string[]
  skills: string[]
  tips: string
}

export const COMPLETE_LEAPS: LeapDetail[] = [
  {
    id: 1,
    title: 'Sensations',
    titleTr: 'Değişen Duyular',
    startWeek: 4,
    endWeek: 5,
    description: 'Baby begins to experience their senses as a whole outside the womb.',
    descriptionTr: 'Bebeğiniz rahmin dışındaki duyuları (ışık, ses, koku, dokunma) ilk kez bir bütün olarak fark etmeye başlar. İç organlarındaki metabolik değişimleri hisseder ve dünyaya adapte olur.',
    symptoms: [
      'Ağlama krizlerinde ve huysuzlukta belirgin artış',
      'Sürekli memede kalmak ve emerek sakinleşmek isteme',
      'Göz teması kurarken çabuk yorulup huzursuzlanma',
      'Uykuya dalmakta zorlanma ve sık uyanma'
    ],
    skills: [
      'Annesinin yüzüne 20-30 cm mesafeden dikkatle odaklanma',
      'Tanıdık seslere ve fısıltılara dönüp tepki verme',
      'İlk bilinçli sosyal tebessümlerin başlaması',
      'Işık ve gölge farklılıklarını ayırt etme'
    ],
    tips: 'Bol bol ten tene temas kurun. Odayı loş ve sessiz tutun. Yarım kundak ve anne karnı sesleri (beyaz gürültü) bebeğe güven verir.'
  },
  {
    id: 2,
    title: 'Patterns',
    titleTr: 'Oluşumlar ve Desenler',
    startWeek: 7,
    endWeek: 9,
    description: 'Baby discovers visual patterns and bodily movements.',
    descriptionTr: 'Bebeğiniz görsel dünyadaki desenleri, tavan gölgelerini ve elleri/ayakları gibi uzuvlarının kendi bedenine ait olduğunu keşfetmeye başlar.',
    symptoms: [
      'Gece uyanma sıklığında ani artış',
      'Sebepsiz huzursuzluk ve kucaktan inmek istememe',
      'Gündüz beslenmelerinde dikkat dağınıklığı',
      'Yabancı ortamlara karşı çekingenlik ve tepki'
    ],
    skills: [
      'Kendi ellerini büyülenmiş gibi inceleme ve birleştirme',
      'Kontrastlı şekillere ve çizgilere uzun süre odaklanma',
      'Yüzüstü yatarken başını kısa süreli dik tutabilme',
      'Mutlu agulama ve ses denemeleri yapma'
    ],
    tips: 'Bebeğinize siyah-beyaz yüksek kontrastlı bebek kartları gösterin. Elleriyle dokunabileceği farklı dokularda kumaşlar sunun.'
  },
  {
    id: 3,
    title: 'Transitions',
    titleTr: 'Yumuşak Geçişler',
    startWeek: 11,
    endWeek: 12,
    description: 'Jerky robotic movements become fluid transitions.',
    descriptionTr: 'Bebeğinizin kesik kesik olan hareketleri akıcılaşır. Ses tonundaki iniş çıkışları ve uzuvlarının koordinasyonunu çok daha pürüzsüz kontrol etmeyi öğrenir.',
    symptoms: [
      'Gündüz uykularına karşı yoğun direnç',
      'Memeyi emerken birdenbire bırakıp ağlama atakları',
      'Sürekli kucakta ve hareket halinde olma talebi',
      'Uykudan sıçrayarak uyanma'
    ],
    skills: [
      'Ses tonunu inceltip kalınlaştırarak ses oyunları oynama',
      'Başını her iki yöne 180 derece akıcı bir şekilde çevirebilme',
      'Ellerini ağzına götürerek kendi kendini sakinleştirebilme',
      'Ulaşabildiği nesnelere vurma ve dokunma'
    ],
    tips: 'Kucağınızda hafif müzik eşliğinde dans edin. Ilık bir banyo ve nazik bebek masajı kaslarındaki gerginliği hafifletecektir.'
  },
  {
    id: 4,
    title: 'Events',
    titleTr: 'Olaylar Dünyası',
    startWeek: 14,
    endWeek: 19,
    description: 'Understanding cause and effect, interconnected events.',
    descriptionTr: 'En uzun ve dönüştürücü ataklardan biridir (4. ay uyku gerilemesiyle çakışır). Sebep-sonuç ilişkilerini ve bir eylemin başka bir olayı tetiklediğini kavrar.',
    symptoms: [
      '40 dakikalık uyku döngüsünden sonra ağlayarak uyanma',
      'Çevredeki her şeye bakmaktan gündüz beslenmeyi reddetme',
      'Sürekli anneye yapışma ve ayrılık kaygısı başlangıcı',
      'Yoğun huzursuzluk ve uyku düzeninde altüst oluş'
    ],
    skills: [
      'Çıngırağı salladığında ses çıktığını fark etme',
      'Gözüyle takip ettiği bir nesneye iki eliyle uzanıp yakalama',
      'Kendi ismine dönüp doğrudan bakma',
      'Sesli ve neşeli kahkahalar atma'
    ],
    tips: 'Gündüz beslenmelerini dikkat dağıtıcılardan uzak, loş bir odada yapın. Uyku öncesi masaj ve ninni rutinini tavizsiz sürdürün.'
  },
  {
    id: 5,
    title: 'Relationships',
    titleTr: 'İlişkiler Dünyası',
    startWeek: 22,
    endWeek: 26,
    description: 'Understanding distance and physical/social relationships.',
    descriptionTr: 'Nesneler ve insanlar arasındaki mesafeyi kavrar. Annesi odadan çıktığında onun yok olduğunu anlar ve nesne sürekliliği bilinciyle ilk ayrılık kaygısını yaşar.',
    symptoms: [
      'Anne odadan çıktığı saniye çığlıkla ağlama',
      'Tanıdık olmayan kişilere karşı ani korku ve çekinme',
      'Diş çıkarma belirtileriyle birleşen uykusuzluk',
      'Yalnız kalmaya karşı tahammülsüzlük'
    ],
    skills: [
      'Ce-e (saklambaç) oyunlarını büyük keyifle oynama',
      'Nesneleri kutuların içine koyup çıkarma',
      'Destekle veya desteksiz dengeli oturabilme',
      'İki elinde iki farklı nesneyi aynı anda tutabilme'
    ],
    tips: 'Odadan çıkarken "Anne mutfakta, hemen geliyorum" diyerek sesinizi duymasını sağlayın. Ce-e oyunlarıyla nesnelerin kaybolmadığını pekiştirin.'
  },
  {
    id: 6,
    title: 'Categories',
    titleTr: 'Kategoriler Dünyası',
    startWeek: 33,
    endWeek: 37,
    description: 'Categorizing objects, animals, and sensations.',
    descriptionTr: 'Bebeğiniz dünyadaki nesneleri ortak özelliklerine göre gruplandırmayı öğrenir (köpekler havlar, toplar yuvarlanır, sebzeler çiğnenir).',
    symptoms: [
      'Öfke nöbetleri ve inatlaşmaların ilk sinyalleri',
      'Ek gıda öğünlerinde belirgin iştahsızlık veya seçicilik',
      'Geceleri sık sık uyanıp memede kalmak isteme',
      'Gündüz oyun sırasında aniden huysuzlanma'
    ],
    skills: [
      'Hayvan seslerini ve basit kelimeleri taklit etme',
      'Farklı dokulardaki yiyecekleri parmaklarıyla mıncıklayarak tanıma',
      'Emekleme ve ayağa kalkma denemeleri',
      'İstediği nesneleri parmağıyla işaret etme'
    ],
    tips: 'Birlikte kalın sayfalı resimli kitapları inceleyin. Ek gıda sürecinde kendi kendine elle beslenmesine (BLW) fırsat verin.'
  },
  {
    id: 7,
    title: 'Sequences',
    titleTr: 'Zincirleme Olaylar',
    startWeek: 41,
    endWeek: 46,
    description: 'Understanding sequences to achieve a goal.',
    descriptionTr: 'Bir amaca ulaşmak için adımların belirli bir sırayla yapılması gerektiğini anlar (örneğin kapağı aç, oyuncağı al, kapağı kapat).',
    symptoms: [
      'Bağımsızlık isteğiyle gelen öfke patlamaları',
      'Alt değiştirirken veya giyinirken kaçma çabaları',
      'Uykudan önce aşırı hareketlilik ve direniş',
      'Yabancılara karşı belirgin güvensizlik'
    ],
    skills: [
      'Halka geçirme ve iç içe geçen kule oyuncaklarını çözme',
      'Bilinçli el sallama ("bay bay") ve alkış yapma',
      'İlk anlamlı kelimeleri doğru bağlamda kullanma (anne, baba, su)',
      'Basit komutları anlama ve yerine getirme'
    ],
    tips: 'Ona küçük seçim hakları tanıyın ("Hangi ayakkabını giyelim?"). Başarılarını heyecanla kutlayarak özgüvenini besleyin.'
  },
  {
    id: 8,
    title: 'Programs',
    titleTr: 'Programlar Dünyası',
    startWeek: 51,
    endWeek: 54,
    description: '1-year leap: Understanding daily programs and routines.',
    descriptionTr: '1 yaş sıçramasıdır. Günlük hayatın akışını (yemek öncesi el yıkama, uyku öncesi kitap okuma) bir bütün program olarak kavrar ve esnek düşünebilir.',
    symptoms: [
      '1 yaş iştah dalgalanması ve yemek reddi',
      'Gece kabus benzeri yoğun ağlamalarla uyanma',
      'Anneye aşırı düşkünlük ve bacaklara sarılma',
      'Uykuyu ertelemek için çeşitli bahaneler üretme'
    ],
    skills: [
      'Kaşık ve çatalı ağzına doğru yönlendirmeye çalışma',
      'Giyinirken kolunu veya bacağını uzatarak yardım etme',
      'İlk bağımsız adımlarını atma veya dengede durma',
      'Basit ev aktivitelerini (silme, süpürme) taklit etme'
    ],
    tips: 'Günlük ritüelleri net ve öngörülebilir tutun. Açık havada, çimenlerde ve parkta bolca fiziksel enerji harcamasına izin verin.'
  },
  {
    id: 9,
    title: 'Principles',
    titleTr: 'İlkeler Dünyası',
    startWeek: 59,
    endWeek: 64,
    description: 'Rules, boundaries, negotiation, and early humor.',
    descriptionTr: 'Kurallar, sınırları zorlama, mizah ve pazarlık yapma yetenekleri gelişir. "Hayır" kelimesinin arkasındaki sınırları test eder.',
    symptoms: [
      'Yoğun inatlaşmalar ve "ben yapacağım" krizleri',
      'İstekleri anında karşılanmadığında kendini yere atma',
      'Gündüz tek uykuya geçiş dalgalanmaları',
      'Kural ve yasakları bilerek ihlal etme denemeleri'
    ],
    skills: [
      'Komiklikler yapıp herkesin güldüğünü görünce tekrarlama',
      'Kuralların mantığını anlama ve sınırları bilme',
      'Duygusal empati belirtileri gösterme (üzülen birine sarılma)',
      'Oyun hamuru, pastel boya gibi yaratıcı materyalleri kullanma'
    ],
    tips: 'Öfke krizlerinde sakinliğinizi koruyun. Sınırları net çizin ama duygusunu onaylayın: "Kızdığını anlıyorum, ama fırlatmak yok."'
  },
  {
    id: 10,
    title: 'Systems',
    titleTr: 'Sistemler Dünyası',
    startWeek: 70,
    endWeek: 75,
    description: '18-month leap: Understanding conscience, family, and self.',
    descriptionTr: '1.5 yaş zihinsel sıçramasıdır. Aile yapısını, kendi bireysel benliğini, vicdanın ilk tohumlarını ve çevresindeki büyük sistemleri kavrar.',
    symptoms: [
      '18. ay uyku gerilemesi: gece aniden uyanıp saatlerce oturmaları',
      'Ayrılık kaygısının son bir kez alevlenmesi',
      'Karanlık veya canavarlar gibi soyut korkuların belirmesi',
      'Yoğun kucak ve emme/biberon talebi'
    ],
    skills: [
      'İki veya üç kelimelik anlamlı cümleler kurma',
      'Zengin hayali oyunlar oynama (bebeğini uyutma, arabayı tamir etme)',
      'Kendi fikirlerini ve kararlarını kararlılıkla savunma',
      'Yardımseverlik ve paylaşma davranışlarının başlaması'
    ],
    tips: 'Sevgi dolu, güvenli ve tutarlı bir yaklaşım sergileyin. Hayali oyunlarına ortak olun, hafif bir gece lambası ve uyku arkadaşı sunun.'
  }
]
