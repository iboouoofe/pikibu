import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Solid Foods
  const foods = [
    { name: 'Carrot', nameTr: 'Havuç', minMonth: 6, allergenLevel: 1, category: 'sebze', servingGuide: 'Buharda yumuşayana kadar pişirin, püre yapın.', allergens: [] },
    { name: 'Apple', nameTr: 'Elma', minMonth: 6, allergenLevel: 1, category: 'meyve', servingGuide: 'Cam rendeden geçirin.', allergens: [] },
    { name: 'Sweet Potato', nameTr: 'Tatlı Patates', minMonth: 6, allergenLevel: 1, category: 'sebze', servingGuide: 'Buharda haşlayın.', allergens: [] },
    { name: 'Avocado', nameTr: 'Avokado', minMonth: 6, allergenLevel: 1, category: 'meyve', servingGuide: 'Çatalla ezerek servis edin.', allergens: [] },
    { name: 'Egg', nameTr: 'Yumurta', minMonth: 6, allergenLevel: 3, category: 'protein', servingGuide: 'Tamamen pişmiş yumurta sarısı.', allergens: ['egg'] },
    { name: 'Salmon', nameTr: 'Somonbalığı', minMonth: 8, allergenLevel: 3, category: 'protein', servingGuide: 'Kılçıksız, iyice pişmiş.', allergens: ['fish'] },
  ]

  for (const f of foods) {
    await prisma.solidFood.create({ data: f })
  }

  // 2. Vaccines
  const vaccines = [
    { name: 'Hepatitis B - Dose 1', nameTr: 'Hepatit B - 1. Doz', ageMonths: 0, description: 'Doğumda uygulanır' },
    { name: 'Hepatitis B - Dose 2', nameTr: 'Hepatit B - 2. Doz', ageMonths: 1, description: '1. ayın sonunda' },
    { name: 'BCG (Tuberculosis)', nameTr: 'BCG (Verem)', ageMonths: 2, description: 'Sol omuzdan yapılır, iz bırakabilir' },
    { name: 'DaBT-IPA-Hib (5-in-1)', nameTr: '5\'li Karma Aşı - 1. Doz', ageMonths: 2, description: 'Difteri, Boğmaca, Tetanoz, Çocuk Felci, Hib' },
    { name: 'Rotavirus (Private)', nameTr: 'Rotavirüs - 1. Doz', ageMonths: 2, isPremium: true, description: 'Ağızdan damla (Özel aşı)' },
    { name: 'Meningococcal B (Private)', nameTr: 'Menenjit B - 1. Doz', ageMonths: 3, isPremium: true, description: 'Bexsero vb. (Özel aşı)' },
    { name: 'DaBT-IPA-Hib (5-in-1) - Dose 2', nameTr: '5\'li Karma Aşı - 2. Doz', ageMonths: 4, description: '' },
    { name: 'Rotavirus (Private) - Dose 2', nameTr: 'Rotavirüs - 2. Doz', ageMonths: 4, isPremium: true, description: 'Ağızdan damla (Özel aşı)' },
  ]

  for (const v of vaccines) {
    await prisma.vaccineSchedule.create({ data: v })
  }

  // 3. Leap Weeks (All 10 Wonder Weeks)
  const leaps = [
    { id: 1, title: 'Sensations', titleTr: 'Değişen Duyular', startWeek: 4, endWeek: 5, description: 'Senses integration outside womb', descriptionTr: 'Dünyayı eskisinden daha net algılamaya başlar. İç organlarındaki metabolik değişimleri hisseder.', symptoms: 'Frequent crying, cluster feeding', symptomsTr: 'Daha sık ağlama, anneye yapışma, uykuya dalmada zorluk.', soothingTips: 'Skin to skin, dark room', soothingTipsTr: 'Ten tene temas kurun, loş ortam ve beyaz gürültü sağlayın.' },
    { id: 2, title: 'Patterns', titleTr: 'Oluşumlar ve Desenler', startWeek: 7, endWeek: 9, description: 'Recognizing visual patterns and movement', descriptionTr: 'Gölgeler, desenler ve ses farklılıklarını anlar. Ellerini keşfeder.', symptoms: 'Night wakings, restlessness', symptomsTr: 'Uykusuzluk, iştahsızlık, kucaktan inmek istememe.', soothingTips: 'High contrast cards, familiar lullabies', soothingTipsTr: 'Kontrastlı kartlar gösterin, tanıdık ninniler söyleyin.' },
    { id: 3, title: 'Transitions', titleTr: 'Yumuşak Geçişler', startWeek: 11, endWeek: 12, description: 'Fluid bodily control and vocal transitions', descriptionTr: 'Hareketleri robotik olmaktan çıkıp akıcılaşır. Ses tonunu kontrol eder.', symptoms: 'Nap resistance, fussy nursing', symptomsTr: 'Gündüz uykularına direnç, memeyi bırakıp ağlama.', soothingTips: 'Gentle dancing, infant massage', soothingTipsTr: 'Kucakta ritmik sallama ve nazik bebek masajı.' },
    { id: 4, title: 'Events', titleTr: 'Olaylar Dünyası', startWeek: 14, endWeek: 19, description: 'Cause and effect and interconnected events', descriptionTr: 'Sebep sonuç ilişkilerini ve eylemlerin sonuçlarını kavramaya başlar.', symptoms: '4-month sleep regression, distraction', symptomsTr: '40 dk uykudan uyanma, gündüz beslenmeyi reddetme.', soothingTips: 'Dark feeding room, calm bedtime routine', soothingTipsTr: 'Gündüz beslenmelerini loş odada yapın, uyku rutinini koruyun.' },
    { id: 5, title: 'Relationships', titleTr: 'İlişkiler Dünyası', startWeek: 22, endWeek: 26, description: 'Understanding distance and separation', descriptionTr: 'Mesafe kavramını anlar, nesne sürekliliği ve ayrılık kaygısı gelişir.', symptoms: 'Separation anxiety, stranger wariness', symptomsTr: 'Anne odadan çıkınca ağlama, yabancı kaygısı.', soothingTips: 'Peek-a-boo games, reassuring voice', soothingTipsTr: 'Ce-e oyunları oynayın, sesinizle güven verin.' },
    { id: 6, title: 'Categories', titleTr: 'Kategoriler Dünyası', startWeek: 33, endWeek: 37, description: 'Classifying objects and animals into categories', descriptionTr: 'Nesneleri ve canlıları ortak özelliklerine göre gruplandırmayı öğrenir.', symptoms: 'Tantrums, picky eating', symptomsTr: 'Huysuzluk, ek gıdaya direnç, anneye yapışma.', soothingTips: 'Picture books, animal sounds, BLW self-feeding', soothingTipsTr: 'Resimli kitaplara bakın, hayvan sesleri taklit edin, BLW deneyin.' },
    { id: 7, title: 'Sequences', titleTr: 'Zincirleme Olaylar', startWeek: 41, endWeek: 46, description: 'Goal-oriented action sequences', descriptionTr: 'Bir amaca ulaşmak için adımların belirli bir sırayla yapılması gerektiğini anlar.', symptoms: 'Independence frustration, dressing protests', symptomsTr: 'Alt değiştirirken kaçma, bağımsızlık öfkesi.', soothingTips: 'Give simple choices, praise milestones', soothingTipsTr: 'Seçenekler sunun, başarılarını heyecanla alkışlayın.' },
    { id: 8, title: 'Programs', titleTr: 'Programlar Dünyası', startWeek: 51, endWeek: 54, description: 'Flexible thinking and 1-year daily programs', descriptionTr: 'Günlük hayatın rutin programlarını ve esnek düşünmeyi kavrar.', symptoms: '1-year appetite drop, night cries', symptomsTr: 'İştah kaybı, gece sık kabus benzeri uyanmalar.', soothingTips: 'Predictable rituals, outdoor play', soothingTipsTr: 'Öngörülebilir rutinler ve açık havada bol fiziksel hareket.' },
    { id: 9, title: 'Principles', titleTr: 'İlkeler Dünyası', startWeek: 59, endWeek: 64, description: 'Rules, boundaries, negotiation, and early humor', descriptionTr: 'Kurallar, sınırları zorlama, mizah ve pazarlık yetenekleri gelişir.', symptoms: 'Stubbornness, testing limits', symptomsTr: 'İnatlaşmalar, sınırları test etme, ağlama krizleri.', soothingTips: 'Calm consistency, validate feelings', soothingTipsTr: 'Sakin ama net sınırlar çizin, duygusunu onaylayın.' },
    { id: 10, title: 'Systems', titleTr: 'Sistemler Dünyası', startWeek: 70, endWeek: 75, description: 'Self, family conscience, and abstract systems', descriptionTr: '1.5 yaş sıçraması: aile yapısını, kendi benliğini ve vicdanı kavrar.', symptoms: '18-month sleep regression, abstract fears', symptomsTr: '18. ay uyku gerilemesi, karanlık korkusu, ayrılık kaygısı.', soothingTips: 'Loving patience, pretend play, night light', soothingTipsTr: 'Sabırlı sevgi, hayali oyunlar, gece lambası ve uyku arkadaşı.' },
  ]

  for (const l of leaps) {
    await prisma.leapWeek.upsert({
      where: { id: l.id },
      update: l,
      create: l,
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
