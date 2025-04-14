const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const {
  User,
  News,
  Partner,
  Portfolio,
  Setting,
  Team,
  Service,
  Testimonial,
  Client,
  Faq,
  Contact
} = require('./models');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await News.deleteMany({});
    await Partner.deleteMany({});
    await Portfolio.deleteMany({});
    await Setting.deleteMany({});
    await Team.deleteMany({});
    await Service.deleteMany({});
    await Testimonial.deleteMany({});
    await Client.deleteMany({});
    await Faq.deleteMany({});
    await Contact.deleteMany({});

    console.log('Data cleared');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      bio: 'System administrator',
      isActive: true
    });

    console.log('Admin user created');

    // Create news articles
    const news = await News.create([
      {
        title: 'Pentingnya Website Responsif untuk Bisnis Modern',
        slug: 'pentingnya-website-responsif-untuk-bisnis-modern',
        content: '<p>Di era digital saat ini, memiliki website responsif bukan lagi sekadar pilihan, tetapi kebutuhan. Website responsif dapat menyesuaikan tampilan dengan berbagai ukuran layar, memberikan pengalaman pengguna yang optimal baik di desktop maupun perangkat mobile. Hal ini sangat penting mengingat lebih dari 60% traffic internet kini berasal dari perangkat mobile.</p><p>ReikiDevs menawarkan solusi pengembangan website responsif dengan teknologi terkini yang tidak hanya menarik secara visual tetapi juga dioptimalkan untuk kecepatan dan performa.</p>',
        excerpt: 'Pelajari mengapa website responsif sangat penting untuk bisnis Anda di era digital saat ini.',
        featuredImage: 'https://via.placeholder.com/800x450?text=Responsive+Web+Design',
        category: 'Web Development',
        tags: ['website', 'responsive design', 'mobile-friendly', 'digital business'],
        author: adminUser._id,
        status: 'published',
        viewCount: 120,
        isHighlighted: true
      },
      {
        title: 'Strategi SEO Terbaru untuk Meningkatkan Peringkat Website',
        slug: 'strategi-seo-terbaru-untuk-meningkatkan-peringkat-website',
        content: '<p>Search Engine Optimization (SEO) terus berkembang seiring dengan perubahan algoritma mesin pencari. Strategi yang efektif tahun lalu mungkin tidak lagi relevan saat ini. Artikel ini membahas tren SEO terbaru dan bagaimana bisnis Anda dapat beradaptasi untuk mempertahankan dan meningkatkan peringkat di hasil pencarian.</p><p>Tim SEO ReikiDevs selalu mengikuti perkembangan terbaru dalam dunia optimasi mesin pencari untuk memastikan website klien kami tetap kompetitif di pasar digital.</p>',
        excerpt: 'Temukan strategi SEO terbaru yang dapat membantu website Anda mendapatkan peringkat lebih tinggi di mesin pencari.',
        featuredImage: 'https://via.placeholder.com/800x450?text=SEO+Strategy',
        category: 'SEO',
        tags: ['SEO', 'search engine', 'digital marketing', 'website ranking'],
        author: adminUser._id,
        status: 'published',
        viewCount: 85,
        isHighlighted: false
      },
      {
        title: 'Tren Desain Grafis 2023 untuk Branding Bisnis',
        slug: 'tren-desain-grafis-2023-untuk-branding-bisnis',
        content: '<p>Desain grafis memainkan peran penting dalam membangun identitas brand yang kuat. Artikel ini mengulas tren desain grafis terbaru tahun 2023 yang dapat Anda terapkan untuk menyegarkan tampilan visual bisnis Anda dan menarik perhatian audiens target.</p><p>Tim desain ReikiDevs menggabungkan kreativitas dengan pemahaman mendalam tentang prinsip branding untuk menciptakan aset visual yang tidak hanya menarik tetapi juga efektif dalam mengkomunikasikan nilai brand Anda.</p>',
        excerpt: 'Pelajari tren desain grafis terbaru yang dapat meningkatkan branding bisnis Anda di tahun 2023.',
        featuredImage: 'https://via.placeholder.com/800x450?text=Graphic+Design+Trends',
        category: 'Design',
        tags: ['graphic design', 'branding', 'visual identity', 'design trends'],
        author: adminUser._id,
        status: 'published',
        viewCount: 65,
        isHighlighted: false
      }
    ]);

    console.log('News articles created');

    // Create partners
    const partners = await Partner.create([
      {
        name: 'Google Cloud',
        logo: 'https://via.placeholder.com/200x100?text=Google+Cloud',
        websiteUrl: 'https://cloud.google.com',
        description: 'Partner resmi Google Cloud untuk solusi hosting dan cloud computing.',
        isActive: true,
        order: 1
      },
      {
        name: 'Adobe Creative Cloud',
        logo: 'https://via.placeholder.com/200x100?text=Adobe+CC',
        websiteUrl: 'https://adobe.com',
        description: 'Partner Adobe untuk solusi desain grafis dan pengembangan konten kreatif.',
        isActive: true,
        order: 2
      },
      {
        name: 'Microsoft',
        logo: 'https://via.placeholder.com/200x100?text=Microsoft',
        websiteUrl: 'https://microsoft.com',
        description: 'Partner Microsoft untuk solusi produktivitas bisnis dan layanan cloud.',
        isActive: true,
        order: 3
      },
      {
        name: 'AWS',
        logo: 'https://via.placeholder.com/200x100?text=AWS',
        websiteUrl: 'https://aws.amazon.com',
        description: 'Partner Amazon Web Services untuk solusi cloud dan hosting.',
        isActive: true,
        order: 4
      }
    ]);

    console.log('Partners created');

    // Create portfolio items
    const portfolios = await Portfolio.create([
      {
        title: 'E-Commerce Platform untuk Fashion Brand',
        slug: 'ecommerce-platform-fashion-brand',
        description: 'Pengembangan website e-commerce lengkap dengan sistem pembayaran terintegrasi, manajemen inventori, dan dashboard admin untuk brand fashion lokal yang kini telah meningkatkan penjualan online sebesar 200%.',
        client: 'FashionID',
        projectType: 'Web Development',
        technologies: ['React.js', 'Node.js', 'MongoDB', 'Stripe API', 'AWS'],
        featuredImage: 'https://via.placeholder.com/800x600?text=Fashion+Ecommerce',
        images: [
          'https://via.placeholder.com/800x600?text=Fashion+Ecommerce+1',
          'https://via.placeholder.com/800x600?text=Fashion+Ecommerce+2',
          'https://via.placeholder.com/800x600?text=Fashion+Ecommerce+3'
        ],
        websiteUrl: 'https://fashionid.com',
        completionDate: new Date('2023-06-15'),
        isFeatured: true,
        status: 'published',
        order: 1
      },
      {
        title: 'Aplikasi Manajemen Klinik',
        slug: 'aplikasi-manajemen-klinik',
        description: 'Sistem manajemen klinik berbasis web yang memudahkan pengelolaan jadwal dokter, reservasi pasien, rekam medis, dan penagihan. Meningkatkan efisiensi operasional klinik hingga 40%.',
        client: 'Klinik Sehat Sentosa',
        projectType: 'Web Application',
        technologies: ['Vue.js', 'Laravel', 'MySQL', 'Docker', 'Digital Ocean'],
        featuredImage: 'https://via.placeholder.com/800x600?text=Clinic+Management',
        images: [
          'https://via.placeholder.com/800x600?text=Clinic+Management+1',
          'https://via.placeholder.com/800x600?text=Clinic+Management+2'
        ],
        websiteUrl: 'https://kliniksehat.id',
        completionDate: new Date('2023-04-20'),
        isFeatured: true,
        status: 'published',
        order: 2
      },
      {
        title: 'Redesign Website Perusahaan Properti',
        slug: 'redesign-website-perusahaan-properti',
        description: 'Redesign website untuk developer properti terkemuka dengan fokus pada UX/UI yang lebih modern, responsif, dan terintegrasi dengan sistem CRM. Meningkatkan lead generation sebesar 75%.',
        client: 'Prime Property',
        projectType: 'Web Design & Development',
        technologies: ['WordPress', 'Elementor Pro', 'PHP', 'MySQL', 'Google Maps API'],
        featuredImage: 'https://via.placeholder.com/800x600?text=Property+Website',
        images: [
          'https://via.placeholder.com/800x600?text=Property+Website+1',
          'https://via.placeholder.com/800x600?text=Property+Website+2'
        ],
        websiteUrl: 'https://primeproperty.co.id',
        completionDate: new Date('2023-08-10'),
        isFeatured: true,
        status: 'published',
        order: 3
      },
      {
        title: 'Kampanye Digital Marketing untuk F&B Startup',
        slug: 'kampanye-digital-marketing-fnb-startup',
        description: 'Strategi digital marketing komprehensif meliputi desain grafis, konten video, dan optimasi SEO untuk startup F&B yang baru diluncurkan. Berhasil mencapai 50,000+ followers dalam 3 bulan.',
        client: 'Healthy Bites',
        projectType: 'Digital Marketing',
        technologies: ['Adobe Creative Suite', 'Social Media Marketing', 'SEO', 'Content Strategy'],
        featuredImage: 'https://via.placeholder.com/800x600?text=FnB+Marketing',
        images: [
          'https://via.placeholder.com/800x600?text=FnB+Marketing+1',
          'https://via.placeholder.com/800x600?text=FnB+Marketing+2'
        ],
        websiteUrl: 'https://healthybites.id',
        completionDate: new Date('2023-07-25'),
        isFeatured: false,
        status: 'published',
        order: 4
      }
    ]);

    console.log('Portfolio items created');

    // Create website settings
    const settings = await Setting.create({
      siteName: 'ReikiDevs',
      siteDescription: 'Solusi IT Terbaik untuk Bisnis Anda',
      logo: 'https://via.placeholder.com/200x80?text=ReikiDevs+Logo',
      favicon: 'https://via.placeholder.com/32x32?text=R',
      contactEmail: 'info@reikidevs.com',
      contactPhone: '+6281234567890',
      address: 'Jl. Teknologi No. 123, Jakarta Selatan, DKI Jakarta 12345',
      socialMedia: {
        facebook: 'https://facebook.com/reikidevs',
        twitter: 'https://twitter.com/reikidevs',
        instagram: 'https://instagram.com/reikidevs',
        linkedin: 'https://linkedin.com/company/reikidevs',
        youtube: 'https://youtube.com/reikidevs'
      },
      metaTags: '<meta name="keywords" content="web development, web design, SEO, graphic design, IT services, digital marketing, Jakarta">',
      googleAnalyticsId: 'UA-XXXXXXXXX-X',
      customCss: '',
      customJs: ''
    });

    console.log('Website settings created');

    // Create team members
    const team = await Team.create([
      {
        name: 'Budi Santoso',
        position: 'CEO & Founder',
        photo: 'https://via.placeholder.com/300x300?text=Budi+Santoso',
        bio: 'Budi memiliki pengalaman lebih dari 15 tahun di industri IT dan telah memimpin berbagai proyek pengembangan software untuk perusahaan Fortune 500.',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/budisantoso',
          twitter: 'https://twitter.com/budisantoso',
          instagram: 'https://instagram.com/budisantoso',
          facebook: 'https://facebook.com/budisantoso'
        },
        order: 1,
        isActive: true
      },
      {
        name: 'Dewi Lestari',
        position: 'CTO',
        photo: 'https://via.placeholder.com/300x300?text=Dewi+Lestari',
        bio: 'Dewi adalah ahli teknologi dengan spesialisasi di pengembangan aplikasi web dan mobile. Sebelumnya bekerja di Google dan memiliki gelar Master di bidang Computer Science.',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/dewilestari',
          twitter: 'https://twitter.com/dewilestari',
          instagram: 'https://instagram.com/dewilestari',
          facebook: 'https://facebook.com/dewilestari'
        },
        order: 2,
        isActive: true
      },
      {
        name: 'Arief Wicaksono',
        position: 'Creative Director',
        photo: 'https://via.placeholder.com/300x300?text=Arief+Wicaksono',
        bio: 'Arief memiliki latar belakang desain grafis dan UX/UI dengan pengalaman lebih dari 10 tahun. Karyanya telah memenangkan berbagai penghargaan desain internasional.',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/ariefwicaksono',
          twitter: 'https://twitter.com/ariefwicaksono',
          instagram: 'https://instagram.com/ariefwicaksono',
          facebook: 'https://facebook.com/ariefwicaksono'
        },
        order: 3,
        isActive: true
      },
      {
        name: 'Siti Rahayu',
        position: 'Digital Marketing Manager',
        photo: 'https://via.placeholder.com/300x300?text=Siti+Rahayu',
        bio: 'Siti adalah ahli pemasaran digital dengan spesialisasi di SEO dan content marketing. Telah membantu puluhan bisnis meningkatkan visibilitas online mereka.',
        socialMedia: {
          linkedin: 'https://linkedin.com/in/sitirahayu',
          twitter: 'https://twitter.com/sitirahayu',
          instagram: 'https://instagram.com/sitirahayu',
          facebook: 'https://facebook.com/sitirahayu'
        },
        order: 4,
        isActive: true
      }
    ]);

    console.log('Team members created');

    // Create services
    const services = await Service.create([
      {
        title: 'Pengembangan Web',
        description: 'Kami mengembangkan aplikasi web responsif dengan teknologi terkini yang disesuaikan dengan kebutuhan bisnis Anda. Dari website perusahaan hingga platform e-commerce kompleks, kami memastikan solusi web Anda tidak hanya menarik secara visual tetapi juga fungsional dan user-friendly.',
        icon: 'https://via.placeholder.com/64x64?text=Web+Dev',
        image: 'https://via.placeholder.com/800x500?text=Web+Development',
        features: [
          'Website responsif untuk semua perangkat',
          'Integrasi dengan sistem pembayaran',
          'CMS yang mudah digunakan',
          'Performa dan kecepatan optimal',
          'Keamanan website terjamin'
        ],
        order: 1,
        isActive: true
      },
      {
        title: 'Desain Web',
        description: 'Tim desain kami menciptakan UI/UX menarik yang meningkatkan engagement pengunjung website Anda. Kami fokus pada desain yang tidak hanya estetis tetapi juga meningkatkan konversi dan memberikan pengalaman pengguna yang optimal.',
        icon: 'https://via.placeholder.com/64x64?text=Web+Design',
        image: 'https://via.placeholder.com/800x500?text=Web+Design',
        features: [
          'UI/UX design modern dan menarik',
          'Wireframing dan prototyping',
          'Desain responsif',
          'User experience testing',
          'Revisi desain tanpa batas'
        ],
        order: 2,
        isActive: true
      },
      {
        title: 'Optimasi Web SEO',
        description: 'Tingkatkan peringkat website Anda di mesin pencari dengan strategi SEO kami. Kami menggunakan teknik white-hat SEO terbaru untuk meningkatkan visibilitas online Anda, mendatangkan lebih banyak traffic organik, dan meningkatkan konversi.',
        icon: 'https://via.placeholder.com/64x64?text=SEO',
        image: 'https://via.placeholder.com/800x500?text=SEO',
        features: [
          'Audit SEO menyeluruh',
          'Optimasi on-page dan off-page',
          'Riset kata kunci komprehensif',
          'Analisis kompetitor',
          'Laporan performa bulanan'
        ],
        order: 3,
        isActive: true
      },
      {
        title: 'Desain Grafis',
        description: 'Kami menciptakan desain logo, banner, dan aset visual menarik untuk brand Anda. Tim desainer grafis kami menggabungkan kreativitas dengan pemahaman mendalam tentang prinsip branding untuk menghasilkan desain yang membantu bisnis Anda menonjol.',
        icon: 'https://via.placeholder.com/64x64?text=Graphic+Design',
        image: 'https://via.placeholder.com/800x500?text=Graphic+Design',
        features: [
          'Desain logo dan identitas brand',
          'Desain media sosial',
          'Desain brosur dan material marketing',
          'Ilustrasi kustom',
          'Desain packaging'
        ],
        order: 4,
        isActive: true
      },
      {
        title: 'Videografi',
        description: 'Kami menawarkan produksi video promosi dan konten visual untuk pemasaran digital Anda. Dari konsep hingga eksekusi, tim videografi kami menciptakan konten video berkualitas tinggi yang menarik audiens dan menyampaikan pesan brand Anda dengan efektif.',
        icon: 'https://via.placeholder.com/64x64?text=Videography',
        image: 'https://via.placeholder.com/800x500?text=Videography',
        features: [
          'Video company profile',
          'Iklan produk dan layanan',
          'Konten video untuk media sosial',
          'Motion graphics dan animasi',
          'Editing video profesional'
        ],
        order: 5,
        isActive: true
      },
      {
        title: 'Desain PPT',
        description: 'Kami membuat presentasi profesional yang membuat pesan bisnis Anda tersampaikan dengan baik. Presentasi yang kami desain tidak hanya informatif tetapi juga menarik secara visual, membantu Anda membuat kesan yang kuat pada audiens Anda.',
        icon: 'https://via.placeholder.com/64x64?text=PPT+Design',
        image: 'https://via.placeholder.com/800x500?text=PPT+Design',
        features: [
          'Template presentasi kustom',
          'Desain slide profesional',
          'Infografis dan visualisasi data',
          'Animasi dan transisi',
          'Kompatibel dengan PowerPoint dan Keynote'
        ],
        order: 6,
        isActive: true
      }
    ]);

    console.log('Services created');

    // Create testimonials
    const testimonials = await Testimonial.create([
      {
        name: 'Ahmad Rizal',
        position: 'CEO',
        company: 'FashionID',
        content: 'ReikiDevs telah membantu kami mengembangkan platform e-commerce yang luar biasa. Sejak peluncuran website baru, penjualan online kami meningkat 200% dan feedback dari pelanggan sangat positif tentang pengalaman berbelanja yang lebih baik.',
        rating: 5,
        photo: 'https://via.placeholder.com/100x100?text=Ahmad+Rizal',
        order: 1,
        isActive: true
      },
      {
        name: 'Dr. Sinta Wijaya',
        position: 'Direktur',
        company: 'Klinik Sehat Sentosa',
        content: 'Aplikasi manajemen klinik yang dikembangkan oleh ReikiDevs telah mengubah cara kami beroperasi. Proses yang dulunya manual kini terotomatisasi, menghemat waktu staf kami dan meningkatkan pengalaman pasien secara signifikan.',
        rating: 5,
        photo: 'https://via.placeholder.com/100x100?text=Sinta+Wijaya',
        order: 2,
        isActive: true
      },
      {
        name: 'Hendra Gunawan',
        position: 'Marketing Director',
        company: 'Prime Property',
        content: 'Redesign website kami oleh ReikiDevs tidak hanya meningkatkan tampilan visual tetapi juga menghasilkan peningkatan lead sebesar 75%. Tim mereka sangat profesional, responsif, dan benar-benar memahami kebutuhan industri properti.',
        rating: 5,
        photo: 'https://via.placeholder.com/100x100?text=Hendra+Gunawan',
        order: 3,
        isActive: true
      },
      {
        name: 'Anita Susanti',
        position: 'Founder',
        company: 'Healthy Bites',
        content: 'Sebagai startup F&B, kami sangat terkesan dengan strategi digital marketing yang dirancang oleh ReikiDevs. Dalam waktu 3 bulan, kami berhasil membangun kehadiran online yang kuat dan mencapai lebih dari 50,000 followers di media sosial.',
        rating: 5,
        photo: 'https://via.placeholder.com/100x100?text=Anita+Susanti',
        order: 4,
        isActive: true
      }
    ]);

    console.log('Testimonials created');

    // Create clients
    const clients = await Client.create([
      {
        name: 'Bank Mandiri',
        logo: 'https://via.placeholder.com/200x100?text=Bank+Mandiri',
        website: 'https://bankmandiri.co.id',
        description: 'Salah satu bank terbesar di Indonesia yang telah menggunakan jasa pengembangan web dan desain grafis kami.',
        order: 1,
        isActive: true
      },
      {
        name: 'Tokopedia',
        logo: 'https://via.placeholder.com/200x100?text=Tokopedia',
        website: 'https://tokopedia.com',
        description: 'Marketplace terkemuka di Indonesia yang telah bekerja sama dengan kami untuk kampanye digital marketing.',
        order: 2,
        isActive: true
      },
      {
        name: 'Pertamina',
        logo: 'https://via.placeholder.com/200x100?text=Pertamina',
        website: 'https://pertamina.com',
        description: 'BUMN energi yang telah menggunakan jasa desain presentasi dan videografi kami untuk kebutuhan korporat.',
        order: 3,
        isActive: true
      },
      {
        name: 'Telkomsel',
        logo: 'https://via.placeholder.com/200x100?text=Telkomsel',
        website: 'https://telkomsel.com',
        description: 'Provider telekomunikasi terbesar di Indonesia yang telah menggunakan jasa pengembangan aplikasi kami.',
        order: 4,
        isActive: true
      },
      {
        name: 'Gojek',
        logo: 'https://via.placeholder.com/200x100?text=Gojek',
        website: 'https://gojek.com',
        description: 'Super app terkemuka di Indonesia yang telah bekerja sama dengan kami untuk proyek desain UI/UX.',
        order: 5,
        isActive: true
      }
    ]);

    console.log('Clients created');

    // Create FAQs
    const faqs = await Faq.create([
      {
        question: 'Apa saja layanan IT yang ditawarkan oleh ReikiDevs?',
        answer: 'ReikiDevs menawarkan berbagai layanan IT termasuk pengembangan web, desain web, optimasi SEO, desain grafis, videografi, dan desain presentasi. Kami menyediakan solusi digital komprehensif untuk membantu bisnis Anda tumbuh di era digital.',
        category: 'Layanan',
        order: 1,
        isActive: true
      },
      {
        question: 'Berapa lama waktu yang dibutuhkan untuk mengembangkan sebuah website?',
        answer: 'Waktu pengembangan website bervariasi tergantung pada kompleksitas proyek. Website sederhana dapat selesai dalam 2-4 minggu, sementara platform e-commerce atau aplikasi web yang lebih kompleks mungkin membutuhkan 2-3 bulan. Kami akan memberikan estimasi waktu yang lebih akurat setelah berdiskusi tentang kebutuhan spesifik proyek Anda.',
        category: 'Pengembangan Web',
        order: 2,
        isActive: true
      },
      {
        question: 'Apakah ReikiDevs menyediakan layanan pemeliharaan website?',
        answer: 'Ya, kami menawarkan paket pemeliharaan website yang mencakup update rutin, backup, monitoring keamanan, dan dukungan teknis. Kami memastikan website Anda tetap aman, up-to-date, dan berfungsi optimal.',
        category: 'Layanan',
        order: 3,
        isActive: true
      },
      {
        question: 'Bagaimana proses kerja sama dengan ReikiDevs?',
        answer: 'Proses kerja sama kami dimulai dengan konsultasi awal untuk memahami kebutuhan Anda. Kemudian kami akan menyusun proposal yang mencakup ruang lingkup pekerjaan, timeline, dan anggaran. Setelah proposal disetujui, kami akan mulai bekerja dengan update progress rutin. Setelah proyek selesai, kami juga menyediakan dukungan pasca-peluncuran.',
        category: 'Kerja Sama',
        order: 4,
        isActive: true
      },
      {
        question: 'Apakah ReikiDevs dapat membantu meningkatkan peringkat website saya di Google?',
        answer: 'Ya, kami menawarkan layanan optimasi SEO komprehensif yang dirancang untuk meningkatkan peringkat website Anda di mesin pencari. Layanan ini mencakup audit SEO, riset kata kunci, optimasi on-page dan off-page, serta pembuatan konten berkualitas yang dapat membantu meningkatkan visibilitas online Anda.',
        category: 'SEO',
        order: 5,
        isActive: true
      },
      {
        question: 'Apakah ReikiDevs melayani klien di luar Jakarta?',
        answer: 'Ya, kami melayani klien dari seluruh Indonesia dan bahkan internasional. Dengan teknologi komunikasi modern, kami dapat bekerja sama secara efektif meskipun tidak berada di lokasi yang sama. Kami menggunakan berbagai tools kolaborasi online untuk memastikan komunikasi yang lancar selama pengerjaan proyek.',
        category: 'Kerja Sama',
        order: 6,
        isActive: true
      }
    ]);

    console.log('FAQs created');

    // Create sample contacts
    const contacts = await Contact.create([
      {
        name: 'Rudi Hartono',
        email: 'rudi@example.com',
        phone: '081234567890',
        subject: 'Penawaran Pengembangan Website E-commerce',
        message: 'Saya tertarik untuk mengembangkan website e-commerce untuk bisnis fashion saya. Mohon informasi lebih lanjut mengenai layanan dan biaya yang diperlukan.',
        status: 'new',
        notes: ''
      },
      {
        name: 'Lia Permata',
        email: 'lia@example.com',
        phone: '087654321098',
        subject: 'Konsultasi SEO',
        message: 'Website perusahaan kami sudah berjalan selama 1 tahun tetapi belum mendapatkan traffic yang signifikan. Kami ingin berkonsultasi mengenai strategi SEO yang tepat.',
        status: 'read',
        notes: 'Sudah dijadwalkan meeting online pada tanggal 15 Oktober 2023'
      },
      {
        name: 'Budi Prakoso',
        email: 'budi@example.com',
        phone: '089876543210',
        subject: 'Redesign Logo Perusahaan',
        message: 'Perusahaan kami berencana untuk melakukan rebranding dan membutuhkan desain logo baru yang lebih modern. Mohon informasi mengenai proses dan biaya.',
        status: 'replied',
        notes: 'Sudah dikirim proposal pada tanggal 5 Oktober 2023'
      }
    ]);

    console.log('Contacts created');

    console.log('All data seeded successfully!');
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    console.error(error.stack);
  }
};

// Run the seed function
const runSeed = async () => {
  const conn = await connectDB();
  await seedData();
  console.log('Database seeding completed!');
  process.exit(0);
};

runSeed();