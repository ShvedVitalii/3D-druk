import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Кешування даних на 5 хвилин
let cachedData: any = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getContentData() {
  const now = Date.now();
  if (cachedData && (now - cacheTime) < CACHE_TTL) {
    return cachedData;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('content')
      .select('key, data')
      .in('key', ['contacts', 'pricing', 'services', 'catalog', 'printers', 'custom_models']);

    if (error) throw error;

    const result: any = {};
    data?.forEach((item: any) => {
      result[item.key] = item.data;
    });

    cachedData = result;
    cacheTime = now;
    return result;
  } catch (error) {
    console.error('❌ Помилка завантаження контенту для AI:', error);
    return {
      contacts: {
        phone: '+38 098 0751707',
        email: 'komarnytskiy.yura@gmail.com',
        address: '82400, м. Стрий, вул. Народна, 8',
        socialLinks: [
          { name: 'Telegram', url: 'https://t.me/3d_print', icon: 'Telegram' },
          { name: 'WhatsApp', url: 'https://wa.me/380980751707', icon: 'WhatsApp' },
          { name: 'Instagram', url: 'https://instagram.com/3d_print_ua', icon: 'Instagram' },
        ],
      },
      pricing: [
        {
          title: 'Орієнтовні ціни',
          items: [
            { label: 'PLA', value: 'від 6 грн/г' },
            { label: 'PETG', value: 'від 7 грн/г' },
            { label: 'ABS', value: 'від 7 грн/г' },
            { label: 'ASA', value: 'від 8 грн/г' },
            { label: 'TPU', value: 'від 10 грн/г' },
            { label: 'PA (нейлон)', value: 'від 15 грн/г' },
          ],
        },
      ],
      services: [],
      catalog: { categories: [], products: [] },
      printers: [],
    };
  }
}

function extractPrices(pricingData: any): string {
  if (!pricingData || !Array.isArray(pricingData) || pricingData.length === 0) {
    return 'PLA – 6 грн/г, ABS – 7 грн/г, PETG – 7 грн/г, TPU – 10 грн/г, ASA – 8 грн/г, PA (нейлон) – 15 грн/г';
  }
  const firstBlock = pricingData[0];
  if (!firstBlock || !Array.isArray(firstBlock.items)) return '';
  return firstBlock.items
    .map((item: any) => `${item.label} – ${item.value}`)
    .join(', ');
}

function extractContacts(contactsData: any): string {
  if (!contactsData) return '';
  let result = '';
  if (contactsData.phone) result += `📞 Телефон: ${contactsData.phone}\n`;
  if (contactsData.email) result += `✉️ Email: ${contactsData.email}\n`;
  if (contactsData.address) result += `📍 Адреса: ${contactsData.address}\n`;
  if (contactsData.workHours) result += `🕒 Графік роботи: ${contactsData.workHours}\n`;
  if (contactsData.socialLinks && Array.isArray(contactsData.socialLinks)) {
    const links = contactsData.socialLinks
      .map((link: any) => `${link.name}: ${link.url}`)
      .join(', ');
    if (links) result += `🌐 Соцмережі: ${links}`;
  }
  return result || 'Контакти не вказані.';
}

function extractServicesInfo(servicesData: any[]): string {
  if (!servicesData || !Array.isArray(servicesData) || servicesData.length === 0) {
    return 'На сайті є сторінка "Послуги" з переліком доступних послуг.';
  }
  const visible = servicesData.filter((s: any) => !s.hidden);
  if (visible.length === 0) return 'Послуги тимчасово недоступні.';
  return visible
    .map((s: any) => `- ${s.title}: ${s.description || ''} (${s.price || 'Договірна'})`)
    .join('\n');
}

function extractPrintersInfo(printersData: any[]): string {
  if (!printersData || !Array.isArray(printersData) || printersData.length === 0) {
    return 'На сайті є сторінка "Принтери" з інформацією про обладнання.';
  }
  const visible = printersData.filter((p: any) => !p.hidden);
  if (visible.length === 0) return 'Принтери тимчасово недоступні.';
  return visible
    .map((p: any) => `- ${p.name}${p.tag ? ` (${p.tag})` : ''}: ${p.description || ''}`)
    .join('\n');
}

function extractCatalogInfo(catalogData: any): string {
  if (!catalogData || !catalogData.categories || catalogData.categories.length === 0) {
    return 'На сайті є сторінка "Каталог" з товарами.';
  }
  const cats = catalogData.categories.map((c: any) => c.name).join(', ');
  const productCount = catalogData.products?.filter((p: any) => !p.hidden).length || 0;
  return `У каталозі ${productCount} товарів у категоріях: ${cats}.`;
}

function extractModelsInfo(customModelsData: any[]): string {
  if (!customModelsData || !Array.isArray(customModelsData) || customModelsData.length === 0) {
    return 'На сайті є розділ "Авторські моделі" з прикладами робіт.';
  }
  const names = customModelsData.map((m: any) => m.name).join(', ');
  return `Розділ "Авторські моделі" містить групи: ${names}.`;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ reply: 'Будь ласка, введіть питання.' });
    }

    console.log('📩 Отримано запит:', message);

    const content = await getContentData();
    const contacts = content.contacts || {};
    const pricing = content.pricing || [];
    const services = content.services || [];
    const catalog = content.catalog || { categories: [], products: [] };
    const printers = content.printers || [];
    const customModels = content.custom_models || [];

    const pricesText = extractPrices(pricing);
    const contactsText = extractContacts(contacts);
    const servicesText = extractServicesInfo(services);
    const printersText = extractPrintersInfo(printers);
    const catalogText = extractCatalogInfo(catalog);
    const modelsText = extractModelsInfo(customModels);

    const fullInfo = `
АКТУАЛЬНА ІНФОРМАЦІЯ ПРО САЙТ:

1. КОНТАКТИ:
${contactsText || 'Не вказані'}

2. ЦІНИ НА МАТЕРІАЛИ:
${pricesText}

3. ПОСЛУГИ:
${servicesText}

4. ПРИНТЕРИ:
${printersText}

5. КАТАЛОГ ТОВАРІВ:
${catalogText}

6. АВТОРСЬКІ МОДЕЛІ:
${modelsText}

ДОДАТКОВА ІНФОРМАЦІЯ:
- Максимальний розмір друку: 256×256×256 мм
- Терміни: 1-5 днів (термінові за 24 години)
- Доставка: Нова Пошта, Укрпошта, самовивіз
- Гарантія: 100%, безкоштовна заміна при браку
- Допомога ЗСУ: друк адаптерів, кріплень безкоштовно або за собівартістю
`;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ GROQ_API_KEY не знайдено! Використовуємо локальний словник.');
      return NextResponse.json({
        reply: getLocalReply(message, { pricesText, contactsText, servicesText, printersText, catalogText, modelsText, contacts }),
      });
    }

    console.log('🔑 Використовуємо Groq API');

    const systemPrompt = `Ти — експерт-консультант з 3D-друку та всього, що пов'язано з сайтом. Відповідай українською, дружелюбно, розгорнуто, але лаконічно (2-4 речення, якщо це просте питання).

ВИКОРИСТОВУЙ ТІЛЬКИ ЦЮ АКТУАЛЬНУ ІНФОРМАЦІЮ (вона з бази даних сайту). НЕ ВИГАДУЙ ТОГО, ЧОГО НЕМАЄ В ЦІЙ ІНФОРМАЦІЇ.

${fullInfo}

ВАЖЛИВО:
- Якщо питають про контакти — дай саме ті, що вказані в розділі 1.
- Якщо питають про ціни — дай саме ті, що вказані в розділі 2.
- Якщо питають про послуги — дай інформацію з розділу 3 (перелічи всі послуги з цінами).
- Якщо питають про принтери — дай інформацію з розділу 4 (перелічи всі принтери з описами).
- Якщо питають про каталог — дай інформацію з розділу 5.
- Якщо питають про авторські моделі — дай інформацію з розділу 6.
- Якщо питають про моделювання — скажи, що ми робимо 3D-моделювання на замовлення, орієнтовна вартість від 1000 грн, деталі уточнюйте за контактами.
- Якщо не знаєш відповіді — чесно скажи, що не знаєш, і запропонуй зв'язатися з нами за контактами.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Помилка Groq API:', response.status, data);
      return NextResponse.json({
        reply: getLocalReply(message, { pricesText, contactsText, servicesText, printersText, catalogText, modelsText, contacts }),
      });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'Вибачте, не вдалося отримати відповідь.';
    console.log('✅ Відповідь від Groq:', reply);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('❌ Критична помилка:', error);
    return NextResponse.json({ reply: 'Вибачте, сталася технічна помилка. Спробуйте пізніше.' });
  }
}

// ========== ЛОКАЛЬНИЙ СЛОВНИК (FALLBACK) ==========
function getLocalReply(message: string, data: any): string {
  const lower = message.toLowerCase().trim();
  const { pricesText, contactsText, servicesText, printersText, catalogText, modelsText, contacts } = data;

  // Принтери
  if (lower.includes('принтер') || lower.includes('обладнанн') || lower.includes('на чому друкуєте')) {
    if (printersText && printersText !== 'На сайті є сторінка "Принтери" з інформацією про обладнання.') {
      return `Ми використовуємо такі принтери:\n${printersText}`;
    }
    return 'На сайті є сторінка "Принтери", де ви можете побачити все наше обладнання.';
  }

  // Каталог
  if (lower.includes('каталог') || lower.includes('товар') || lower.includes('продукці')) {
    return catalogText || 'У каталозі є різні товари. Перейдіть на сторінку "Каталог" на сайті, щоб побачити всі позиції.';
  }

  // Послуги
  if (lower.includes('послуг') || lower.includes('що ви робите') || lower.includes('які послуги')) {
    if (servicesText && servicesText !== 'На сайті є сторінка "Послуги" з переліком доступних послуг.') {
      return `Ми надаємо такі послуги:\n${servicesText}`;
    }
    return 'Ми надаємо послуги 3D-друку, моделювання, постобробки. Деталі на сторінці "Послуги".';
  }

  // Моделювання
  if (lower.includes('моделюван') || lower.includes('3d моделюв') || lower.includes('розробка модел') || lower.includes('авторськ')) {
    return 'Ми займаємося 3D-моделюванням на замовлення. Вартість від 1000 грн залежно від складності. Зв\'яжіться з нами для детального розрахунку.';
  }

  // Контакти
  if (lower.includes('контакти') || lower.includes('телефон') || lower.includes('telegram') || lower.includes('звязатись') || lower.includes('зв\'язатись')) {
    return contactsText || '📞 +38 098 0751707\n✉️ komarnytskiy.yura@gmail.com\n📱 Telegram: @3d_print\n📷 Instagram: @3d_print_ua';
  }

  // Ціни
  if (lower.includes('ціна') || lower.includes('вартість') || lower.includes('скільки коштує') || lower.includes('ціни')) {
    return pricesText ? `Актуальні ціни: ${pricesText}. Точна ціна після узгодження моделі.` : 'Ціни: PLA – 6 грн/г, ABS – 7 грн/г, PETG – 7 грн/г, TPU – 10 грн/г, ASA – 8 грн/г, PA (нейлон) – 15 грн/г.';
  }

  // Терміни
  if (lower.includes('термін') || lower.includes('час') || lower.includes('довго') || lower.includes('швидко')) {
    return 'Друк займає від 1 до 5 днів. Термінові замовлення – за 24 години (за додаткову плату).';
  }

  // Матеріали
  if (lower.includes('матеріал') || lower.includes('пластик') || lower.includes('filament')) {
    return pricesText ? `Працюємо з матеріалами: ${pricesText}.` : 'Працюємо з PLA, ABS, PETG, TPU, ASA, PA (нейлон).';
  }

  // Доставка
  if (lower.includes('доставка') || lower.includes('нова пошта') || lower.includes('укрпошта') || lower.includes('відправка')) {
    return 'Доставляємо Новою Поштою (1-3 дні), Укрпоштою (2-5 днів) або самовивіз зі Стрия.';
  }

  // Гарантія
  if (lower.includes('гарантія') || lower.includes('якість') || lower.includes('брак') || lower.includes('заміна')) {
    return '100% гарантія якості. При браку – безкоштовна заміна. Повернення браку – при відеофіксації розпаковки.';
  }

  // Замовлення
  if (lower.includes('замовити') || lower.includes('як замовити') || lower.includes('оформити')) {
    return 'Заповніть форму на сторінці "Замовити друк". Завантажте файл моделі (STL, OBJ, 3MF). Ми зв\'яжемося протягом 12 годин.';
  }

  // ЗСУ / волонтерство
  if (lower.includes('зсу') || lower.includes('волонтер') || lower.includes('армія') || lower.includes('військ')) {
    return 'Допомагаємо ЗСУ: друкуємо адаптери, кріплення, тактичні аксесуари безкоштовно або за собівартістю. Зв\'яжіться з нами для узгодження.';
  }

  // Привітання
  if (lower.includes('привіт') || lower.includes('добрий день') || lower.includes('здрастуйте') || lower.includes('hello')) {
    return `Вітаю! Я AI-консультант з 3D-друку. Чим можу допомогти? ${
      pricesText ? `Актуальні ціни: ${pricesText}.` : ''
    } Запитайте про послуги, принтери, каталог, моделювання або контакти.`;
  }

  // Подяка
  if (lower.includes('дякую') || lower.includes('спасибі')) {
    return 'Будь ласка! Звертайтеся, якщо будуть питання. Гарного дня! 😊';
  }

  // За замовчуванням
  return `Дякую за запитання! Ось що я знаю про це:\n${pricesText ? `Ціни: ${pricesText}\n` : ''}${
    servicesText && servicesText !== 'На сайті є сторінка "Послуги" з переліком доступних послуг.' ? `Послуги:\n${servicesText}\n` : ''
  }${
    printersText && printersText !== 'На сайті є сторінка "Принтери" з інформацією про обладнання.' ? `Принтери:\n${printersText}\n` : ''
  }${catalogText ? `Каталог: ${catalogText}\n` : ''}${
    contactsText ? `Контакти:\n${contactsText}` : ''
  }\nЯкщо я не відповів на ваше питання, зверніться до нас за контактами вище.`;
}