import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fsLimit,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import { handleFirestoreError, OperationType } from "./firebase-errors";
import type { Category, Area, ExperienceOption, PublicProvider } from "./directory";

export const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-electric", name: "كهربائي منازل", icon: "Zap", sort_order: 1, status: "active" },
  { id: "cat-plumber", name: "سباك صحي", icon: "Wrench", sort_order: 2, status: "active" },
  { id: "cat-carpenter", name: "نجار موبيليا وباب وشباك", icon: "Hammer", sort_order: 3, status: "active" },
  { id: "cat-ac", name: "فني تكييف وتبريد", icon: "Snowflake", sort_order: 4, status: "active" },
  { id: "cat-paint", name: "نقاش ودهانات حديثة", icon: "Paintbrush", sort_order: 5, status: "active" },
  { id: "cat-smith", name: "حداد كريتال وأبواب", icon: "Shield", sort_order: 6, status: "active" },
  { id: "cat-satellite", name: "فني دش ورسيفر وشاشات", icon: "Tv", sort_order: 7, status: "active" },
  { id: "cat-tiles", name: "مبلط سيراميك ورخام", icon: "Grid", sort_order: 8, status: "active" },
  { id: "cat-appliances", name: "تصليح غسالات وبوتاجازات", icon: "Cog", sort_order: 9, status: "active" },
  { id: "cat-mechanic", name: "صيانة موتوسيكلات وتكاتك", icon: "Bike", sort_order: 10, status: "active" },
];

export const INITIAL_AREAS: Area[] = [
  { id: "area-center", name: "وسط البلد / المركز", status: "active" },
  { id: "area-kafr", name: "كفر الشيخ عطية", status: "active" },
  { id: "area-ezbet", name: "عزبة الأوقاف", status: "active" },
  { id: "area-mit", name: "ميت حلفا", status: "active" },
  { id: "area-sand", name: "سندنهور", status: "active" },
  { id: "area-tant", name: "طنط الجزيرة", status: "active" },
  { id: "area-zahraa", name: "حي الزهراء", status: "active" },
  { id: "area-gazzar", name: "كفر الجزار", status: "active" },
];

export const INITIAL_EXPERIENCE: ExperienceOption[] = [
  { id: "exp-10plus", label: "أكثر من ١٠ سنوات", sort_order: 1, status: "active" },
  { id: "exp-5to10", label: "من ٥ إلى ١٠ سنوات", sort_order: 2, status: "active" },
  { id: "exp-3to5", label: "من ٣ إلى ٥ سنوات", sort_order: 3, status: "active" },
  { id: "exp-1to3", label: "من سنة إلى ٣ سنوات", sort_order: 4, status: "active" },
];

export const INITIAL_PROVIDERS = [
  {
    id: "prov-1",
    name: "الأسطى محمود الشرقاوي",
    category_id: "cat-electric",
    area_id: "area-center",
    phone: "01091234567",
    secondary_phone: "01181234567",
    whatsapp: "01091234567",
    description: "كهربائي منازل معتمد، خبرة في تأسيس وتوصيل الشقق واللوحات، صيانة الأعطال والطوارئ على مدار الساعة.",
    services: "تأسيس كهرباء شقق وفلل، تركيب ليد بروفايل وأباليك، تصليح لوحات القواطع، صيانة طوارئ ٢٤ ساعة.",
    price_description: "أسعار مناسبة ومعاينة سريعة",
    working_hours: "طوارئ ٢٤ ساعة، والعمل العادي من ٩ صباحاً حتى ١٠ مساءً",
    photo_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: true,
    premium_expires_at: null,
    experience_id: "exp-10plus",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-electric", name: "كهربائي منازل" },
    areas: { id: "area-center", name: "وسط البلد / المركز" },
    experience_options: { id: "exp-10plus", label: "أكثر من ١٠ سنوات" },
  },
  {
    id: "prov-2",
    name: "المعلم صابر السباك",
    category_id: "cat-plumber",
    area_id: "area-kafr",
    phone: "01234567890",
    secondary_phone: null,
    whatsapp: "01234567890",
    description: "سباك صحي ممتاز، تركيب وصيانة شبكات المياه والصرف، تركيب الخلاطات والسخانات والفلاتر ومواتير الرفع.",
    services: "صيانة وتسليك الصرف، تركيب مواتير كالبيدا، تركيب فلاتر ٧ مراحل، تركيب أطقم حمامات وخلاطات.",
    price_description: "يومية أو بالمقاولة حسب الاتفاق",
    working_hours: "يومياً من ٨ صباحاً إلى ٩ مساءً",
    photo_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: true,
    premium_expires_at: null,
    experience_id: "exp-5to10",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-plumber", name: "سباك صحي" },
    areas: { id: "area-kafr", name: "كفر الشيخ عطية" },
    experience_options: { id: "exp-5to10", label: "من ٥ إلى ١٠ سنوات" },
  },
  {
    id: "prov-3",
    name: "عم فريد النجار",
    category_id: "cat-carpenter",
    area_id: "area-ezbet",
    phone: "01512345678",
    secondary_phone: null,
    whatsapp: "01512345678",
    description: "ورشة نجارة متكاملة لتصليح الأثاث وفك وتركيب غرف النوم والمطابخ، وتفصيل وتصليح الأبواب والشبابيك والكوالين.",
    services: "فك وتركيب موبيليا، تركيب كوالين وأقفال، تصليح دواليب وسراير، صيانة مطابخ خشب.",
    price_description: "معاينة مجانية داخل القرية",
    working_hours: "من ٩ صباحاً إلى ٨ مساءً (الجمعة بعد الصلاة)",
    photo_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: false,
    premium_expires_at: null,
    experience_id: "exp-10plus",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-carpenter", name: "نجار موبيليا وباب وشباك" },
    areas: { id: "area-ezbet", name: "عزبة الأوقاف" },
    experience_options: { id: "exp-10plus", label: "أكثر من ١٠ سنوات" },
  },
  {
    id: "prov-4",
    name: "م. كريم لتكييف الهواء",
    category_id: "cat-ac",
    area_id: "area-mit",
    phone: "01011223344",
    secondary_phone: null,
    whatsapp: "01011223344",
    description: "شحن فريون، صيانة وتنظيف مكيفات سبليت وشباك وكونسيلد، فك وتركيب وتغيير مواسير نحاس جنوب أفريقي.",
    services: "شحن فريون أصلي R410 و R22، غسيل وصيانة كيميائية بدون تكسير، فحص تسريب النحاس والكمبروسر.",
    price_description: "ضمان ٣ أشهر على الصيانة",
    working_hours: "طوال أيام الأسبوع من ١٠ صباحاً إلى ١١ مساءً",
    photo_url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: true,
    premium_expires_at: null,
    experience_id: "exp-5to10",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-ac", name: "فني تكييف وتبريد" },
    areas: { id: "area-mit", name: "ميت حلفا" },
    experience_options: { id: "exp-5to10", label: "من ٥ إلى ١٠ سنوات" },
  },
  {
    id: "prov-5",
    name: "الأسطى إبراهيم النقاش",
    category_id: "cat-paint",
    area_id: "area-sand",
    phone: "01122334455",
    secondary_phone: null,
    whatsapp: "01122334455",
    description: "تشطيبات وديكورات حديثة، دهانات جوتن وسكيب، معالجة الرطوبة والنش وتأسيس معجون وصنفرة بماكينات حديثة بدون غبار.",
    services: "دهانات بلاستيك وزيت، دهانات قطيفة وسواحلي، تركيب ورق حائط وبديل خشب ورخام، معالجة رطوبة الجدران.",
    price_description: "سعر المتر أو مقاولة الشقة بالكامل",
    working_hours: "من ٨ صباحاً إلى ٦ مساءً",
    photo_url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: false,
    premium_expires_at: null,
    experience_id: "exp-10plus",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-paint", name: "نقاش ودهانات حديثة" },
    areas: { id: "area-sand", name: "سندنهور" },
    experience_options: { id: "exp-10plus", label: "أكثر من ١٠ سنوات" },
  },
  {
    id: "prov-6",
    name: "المعلم رجب الحداد",
    category_id: "cat-smith",
    area_id: "area-gazzar",
    phone: "01033445566",
    secondary_phone: null,
    whatsapp: "01033445566",
    description: "حدادة كريتال وأبواب حديد وحمايات شبابيك، وتصنيع جمالونات وتند ومظلات متينة بأفضل الخامات.",
    services: "تصنيع أبواب مصفحة وحديد مشغول، حمايات شبابيك ليزر، تند صاج وقماش، تصليح كوالين حديد.",
    price_description: "حسب المتر والوزن والدهان",
    working_hours: "من ٨ صباحاً إلى ٧ مساءً",
    photo_url: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: false,
    premium_expires_at: null,
    experience_id: "exp-10plus",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-smith", name: "حداد كريتال وأبواب" },
    areas: { id: "area-gazzar", name: "كفر الجزار" },
    experience_options: { id: "exp-10plus", label: "أكثر من ١٠ سنوات" },
  },
  {
    id: "prov-7",
    name: "البشمهندس هيثم للدش والستالايت",
    category_id: "cat-satellite",
    area_id: "area-center",
    phone: "01288990011",
    secondary_phone: null,
    whatsapp: "01288990011",
    description: "فني دش ورسيفر وضبط جميع الأقمار، تركيب شاشات على الحوائط وتوصيل شبكات الدش المركزي للعمارات.",
    services: "ضبط قنوات وإشارات نايل سات وعرب سات، برمجة وتحديث رسيفرات، تركيب حوامل شاشات متحركة وثابتة.",
    price_description: "معاينة وتركيب بأسعار رمزية",
    working_hours: "يومياً من ١٠ صباحاً إلى ١١ مساءً",
    photo_url: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: false,
    premium_expires_at: null,
    experience_id: "exp-5to10",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-satellite", name: "فني دش ورسيفر وشاشات" },
    areas: { id: "area-center", name: "وسط البلد / المركز" },
    experience_options: { id: "exp-5to10", label: "من ٥ إلى ١٠ سنوات" },
  },
  {
    id: "prov-8",
    name: "الحاج مسعود للسيراميك والرخام",
    category_id: "cat-tiles",
    area_id: "area-tant",
    phone: "01099887766",
    secondary_phone: null,
    whatsapp: "01099887766",
    description: "مبلط سيراميك وبورسلين ورخام بخبرة طويلة في تشطيب المطابخ والحمامات والصالات بدقة ليزر متناهية.",
    services: "تركيب سيراميك أرضيات وحوائط، تركيب بورسلين بمادة لاصقة، درج سلم رخام، بلاط أسطح وميول صرف.",
    price_description: "حساب بالمتر المربع حسب نوع البلاط",
    working_hours: "من ٨ صباحاً إلى ٥ مساءً",
    photo_url: "https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: false,
    premium_expires_at: null,
    experience_id: "exp-10plus",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-tiles", name: "مبلط سيراميك ورخام" },
    areas: { id: "area-tant", name: "طنط الجزيرة" },
    experience_options: { id: "exp-10plus", label: "أكثر من ١٠ سنوات" },
  },
  {
    id: "prov-9",
    name: "الأسطى عصام لصيانة الأجهزة المنزلية",
    category_id: "cat-appliances",
    area_id: "area-zahraa",
    phone: "01155667788",
    secondary_phone: null,
    whatsapp: "01155667788",
    description: "صيانة فورية بالمنزل للغسالات الأوتوماتيك والفوق أوتوماتيك، والثلاجات، والبوتاجازات مع توفير قطع غيار أصلية.",
    services: "تغيير رولمان بلي ومساعدين للغسالات، شحن غاز فريون ثلاجات وديب فريزر، تسليك وصيانة عيون وفرن البوتاجاز.",
    price_description: "كشف وصيانة منزلية مع ضمان على قطع الغيار",
    working_hours: "طوال الأسبوع من ٩ صباحاً إلى ٩ مساءً",
    photo_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: false,
    premium_expires_at: null,
    experience_id: "exp-5to10",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-appliances", name: "تصليح غسالات وبوتاجازات" },
    areas: { id: "area-zahraa", name: "حي الزهراء" },
    experience_options: { id: "exp-5to10", label: "من ٥ إلى ١٠ سنوات" },
  },
  {
    id: "prov-10",
    name: "الأسطى حمادة لميكانيكا الموتوسيكلات",
    category_id: "cat-mechanic",
    area_id: "area-mit",
    phone: "01277665544",
    secondary_phone: null,
    whatsapp: "01277665544",
    description: "عمرة وصيانة شاملة لجميع أنواع الموتوسيكلات الصيني والدايون والتكاتك، وضبط كهرباء وكاربراتير.",
    services: "عمرة محرك، تغيير ورق دبرياج وسلندر، ضبط تاكيهات، صيانة مارش وشحن بطارية، تغيير زيت وفلاتر.",
    price_description: "أسعار مناسبة وأمانة في الشغل",
    working_hours: "من ٩ صباحاً إلى ١٠ مساءً",
    photo_url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80",
    status: "active",
    is_premium: false,
    premium_expires_at: null,
    experience_id: "exp-3to5",
    is_verified: true,
    has_whatsapp: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { id: "cat-mechanic", name: "صيانة موتوسيكلات وتكاتك" },
    areas: { id: "area-mit", name: "ميت حلفا" },
    experience_options: { id: "exp-3to5", label: "من ٣ إلى ٥ سنوات" },
  },
];

export const INITIAL_ADMINS = [
  {
    id: "admin-shenawyjr",
    email: "shenawyjr@gmail.com",
    is_owner: true,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "admin-ahmaad",
    email: "ahmaadelshenawy@gmail.com",
    is_owner: true,
    active: true,
    created_at: new Date().toISOString(),
  },
];

let isInitialized = false;

export async function ensureFirestoreSeeded() {
  if (isInitialized) return;
  isInitialized = true;
  try {
    const [catsSnap, provsSnap] = await Promise.all([
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "providers")),
    ]);

    if (catsSnap.empty) {
      console.log("[Firestore] Seeding initial village categories, areas, exp...");
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, "categories", cat.id), cat);
      }
      for (const area of INITIAL_AREAS) {
        await setDoc(doc(db, "areas", area.id), area);
      }
      for (const exp of INITIAL_EXPERIENCE) {
        await setDoc(doc(db, "experience_options", exp.id), exp);
      }
      for (const admin of INITIAL_ADMINS) {
        await setDoc(doc(db, "admin_users", admin.id), admin);
      }
    }

    if (provsSnap.empty || provsSnap.docs.length < INITIAL_PROVIDERS.length) {
      console.log("[Firestore] Seeding missing initial providers...");
      const existingIds = new Set(provsSnap.docs.map((d) => d.id));
      for (const prov of INITIAL_PROVIDERS) {
        if (!existingIds.has(prov.id)) {
          await setDoc(doc(db, "providers", prov.id), prov);
        }
      }
    }
  } catch (err) {
    console.warn("[Firestore] Auto-seed check finished or deferred:", err);
  }
}

// Fetch categories from Firestore with fallback to initial categories
export async function getFirestoreCategories(): Promise<Category[]> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDocs(collection(db, "categories"));
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as Category);
      return list.filter((c) => c.status === "active").sort((a, b) => a.sort_order - b.sort_order);
    }
  } catch (e) {
    console.warn("[Firestore] Failed to get categories from cloud, using baseline:", e);
  }
  return INITIAL_CATEGORIES;
}

// Fetch areas from Firestore with fallback
export async function getFirestoreAreas(): Promise<Area[]> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDocs(collection(db, "areas"));
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as Area);
      return list.filter((a) => a.status === "active").sort((a, b) => a.name.localeCompare(b.name, "ar"));
    }
  } catch (e) {
    console.warn("[Firestore] Failed to get areas from cloud, using baseline:", e);
  }
  return INITIAL_AREAS;
}

// Fetch experience options from Firestore
export async function getFirestoreExperience(): Promise<ExperienceOption[]> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDocs(collection(db, "experience_options"));
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as ExperienceOption);
      return list.filter((e) => e.status === "active").sort((a, b) => a.sort_order - b.sort_order);
    }
  } catch (e) {
    console.warn("[Firestore] Failed to get experience options:", e);
  }
  return INITIAL_EXPERIENCE;
}

// Query providers with filters
export async function getFirestoreProviders(opts: {
  categoryId?: string;
  areaId?: string;
  experienceId?: string;
  search?: string;
  premiumOnly?: boolean;
  limit?: number;
  includeHidden?: boolean;
}): Promise<PublicProvider[]> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDocs(collection(db, "providers"));
    let items = (
      !snap.empty
        ? snap.docs.map((d) => d.data() as PublicProvider)
        : (INITIAL_PROVIDERS as unknown as PublicProvider[])
    );

    if (!opts.includeHidden) {
      items = items.filter((p) => p.status === "active");
    }
    if (opts.categoryId) {
      items = items.filter((p) => p.category_id === opts.categoryId);
    }
    if (opts.areaId) {
      items = items.filter((p) => p.area_id === opts.areaId);
    }
    if (opts.experienceId) {
      items = items.filter((p) => p.experience_id === opts.experienceId);
    }
    if (opts.premiumOnly) {
      items = items.filter((p) => p.is_premium);
    }
    if (opts.search && opts.search.trim()) {
      const q = opts.search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.services && p.services.toLowerCase().includes(q)) ||
          (p.categories?.name && p.categories.name.toLowerCase().includes(q)) ||
          (p.areas?.name && p.areas.name.toLowerCase().includes(q))
      );
    }

    // Sort: premium first, then by created_at desc
    items.sort((a, b) => {
      if (a.is_premium !== b.is_premium) return a.is_premium ? -1 : 1;
      return (b.created_at || "").localeCompare(a.created_at || "");
    });

    if (opts.limit && opts.limit > 0) {
      items = items.slice(0, opts.limit);
    }

    return items;
  } catch (err) {
    console.warn("[Firestore] Failed to query providers:", err);
    let fallback = INITIAL_PROVIDERS as unknown as PublicProvider[];
    if (opts.categoryId) fallback = fallback.filter((p) => p.category_id === opts.categoryId);
    if (opts.areaId) fallback = fallback.filter((p) => p.area_id === opts.areaId);
    if (opts.premiumOnly) fallback = fallback.filter((p) => p.is_premium);
    return opts.limit ? fallback.slice(0, opts.limit) : fallback;
  }
}

// Get single provider by ID
export async function getFirestoreProvider(id: string): Promise<PublicProvider | null> {
  try {
    await ensureFirestoreSeeded();
    const docRef = doc(db, "providers", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PublicProvider;
    }
  } catch (err) {
    console.warn("[Firestore] Failed to get provider by id:", err);
  }
  const match = INITIAL_PROVIDERS.find((p) => p.id === id);
  return (match as unknown as PublicProvider) ?? null;
}

// Contact provider helper (logs click and returns phone numbers)
export async function getFirestoreProviderContact(providerId: string): Promise<{
  phone: string | null;
  secondary_phone: string | null;
  whatsapp: string | null;
} | null> {
  try {
    const prov = await getFirestoreProvider(providerId);
    if (prov) {
      const matchInitial = INITIAL_PROVIDERS.find((p) => p.id === providerId);
      const phone = (prov as any).phone || matchInitial?.phone || "01091234567";
      const secondary_phone = (prov as any).secondary_phone || matchInitial?.secondary_phone || null;
      const whatsapp = (prov as any).whatsapp || matchInitial?.whatsapp || phone;
      return { phone, secondary_phone, whatsapp };
    }
  } catch (err) {
    console.warn("[Firestore] Error retrieving contact info:", err);
  }
  return { phone: "01091234567", secondary_phone: null, whatsapp: "01091234567" };
}

// -------------------------------------------------------------
// Admin Management CRUD APIs (Categories, Areas, Providers)
// -------------------------------------------------------------

// Admin: Get all categories (active & hidden)
export async function getAllFirestoreCategories(): Promise<Category[]> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDocs(collection(db, "categories"));
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as Category);
      return list.sort((a, b) => a.sort_order - b.sort_order);
    }
  } catch (err) {
    console.warn("[Firestore] getAllFirestoreCategories error:", err);
  }
  return INITIAL_CATEGORIES;
}

// Admin: Save or update category
export async function saveFirestoreCategory(cat: {
  id?: string;
  name: string;
  icon?: string | null;
  sort_order?: number;
  status?: string;
}): Promise<Category> {
  const catId = cat.id || `cat-${Date.now()}`;
  const record: Category = {
    id: catId,
    name: cat.name.trim(),
    icon: cat.icon || "Wrench",
    sort_order: Number(cat.sort_order) || 0,
    status: cat.status || "active",
  };
  await setDoc(doc(db, "categories", catId), record);
  return record;
}

// Admin: Delete category
export async function deleteFirestoreCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "categories", id));
}

// Admin: Get all areas (active & hidden)
export async function getAllFirestoreAreas(): Promise<Area[]> {
  try {
    await ensureFirestoreSeeded();
    const snap = await getDocs(collection(db, "areas"));
    if (!snap.empty) {
      const list = snap.docs.map((d) => d.data() as Area);
      return list.sort((a, b) => a.name.localeCompare(b.name, "ar"));
    }
  } catch (err) {
    console.warn("[Firestore] getAllFirestoreAreas error:", err);
  }
  return INITIAL_AREAS;
}

// Admin: Save or update area
export async function saveFirestoreArea(area: {
  id?: string;
  name: string;
  status?: string;
}): Promise<Area> {
  const areaId = area.id || `area-${Date.now()}`;
  const record: Area = {
    id: areaId,
    name: area.name.trim(),
    status: area.status || "active",
  };
  await setDoc(doc(db, "areas", areaId), record);
  return record;
}

// Admin: Delete area
export async function deleteFirestoreArea(id: string): Promise<void> {
  await deleteDoc(doc(db, "areas", id));
}

// Admin: Get all providers with full details and refs
export async function getAllFirestoreProviders(): Promise<any[]> {
  try {
    await ensureFirestoreSeeded();
    const [provsSnap, cats, areas, exps] = await Promise.all([
      getDocs(collection(db, "providers")),
      getAllFirestoreCategories(),
      getAllFirestoreAreas(),
      getFirestoreExperience(),
    ]);

    let rawList: any[] = [];
    if (!provsSnap.empty) {
      rawList = provsSnap.docs.map((d) => d.data());
    } else {
      rawList = INITIAL_PROVIDERS;
    }

    const catMap = new Map(cats.map((c) => [c.id, c]));
    const areaMap = new Map(areas.map((a) => [a.id, a]));
    const expMap = new Map(exps.map((e) => [e.id, e]));

    const populated = rawList.map((p) => {
      const c = catMap.get(p.category_id);
      const a = areaMap.get(p.area_id);
      const e = expMap.get(p.experience_id);
      return {
        ...p,
        categories: c ? { id: c.id, name: c.name } : p.categories ?? null,
        areas: a ? { id: a.id, name: a.name } : p.areas ?? null,
        experience_options: e ? { id: e.id, label: e.label } : p.experience_options ?? null,
      };
    });

    return populated.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  } catch (err) {
    console.warn("[Firestore] getAllFirestoreProviders error:", err);
    return INITIAL_PROVIDERS;
  }
}

// Admin: Save or update single provider
export async function saveFirestoreProvider(prov: any): Promise<any> {
  const provId = prov.id || `prov-${Date.now()}`;
  const [cats, areas, exps] = await Promise.all([
    getAllFirestoreCategories(),
    getAllFirestoreAreas(),
    getFirestoreExperience(),
  ]);

  const c = cats.find((x) => x.id === prov.category_id);
  const a = areas.find((x) => x.id === prov.area_id);
  const e = exps.find((x) => x.id === prov.experience_id);

  const now = new Date().toISOString();
  const record = {
    id: provId,
    name: prov.name.trim(),
    category_id: prov.category_id,
    area_id: prov.area_id,
    phone: prov.phone.trim(),
    secondary_phone: prov.secondary_phone?.trim() || null,
    whatsapp: prov.whatsapp?.trim() || prov.phone.trim(),
    description: prov.description?.trim() || null,
    services: prov.services?.trim() || null,
    price_description: prov.price_description?.trim() || null,
    working_hours: prov.working_hours?.trim() || null,
    photo_url: prov.photo_url || null,
    status: prov.status || "active",
    is_premium: Boolean(prov.is_premium),
    premium_expires_at: prov.premium_expires_at || null,
    experience_id: prov.experience_id || null,
    is_verified: Boolean(prov.is_verified),
    has_whatsapp: Boolean(prov.whatsapp?.trim() || prov.phone.trim()),
    created_at: prov.created_at || now,
    updated_at: now,
    categories: c ? { id: c.id, name: c.name } : null,
    areas: a ? { id: a.id, name: a.name } : null,
    experience_options: e ? { id: e.id, label: e.label } : null,
  };

  await setDoc(doc(db, "providers", provId), record);
  return record;
}

// Admin: Patch multiple providers
export async function updateFirestoreProvidersPatch(
  ids: string[],
  patch: Partial<any>
): Promise<void> {
  const now = new Date().toISOString();
  await Promise.all(
    ids.map((id) =>
      updateDoc(doc(db, "providers", id), {
        ...patch,
        updated_at: now,
      })
    )
  );
}

// Admin: Delete multiple providers
export async function deleteFirestoreProviders(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteDoc(doc(db, "providers", id))));
}

