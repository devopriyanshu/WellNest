import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Create 5 sample experts with their central users
  const experts = [
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@wellnest.local',
      phone: '+1-555-0101',
      category: 'Clinical Psychologist',
      bio: 'Specialized in cognitive behavioral therapy with over 10 years of experience helping individuals overcome anxiety and depression.',
      experience: '10 years',
      languages: ['English', 'Spanish'],
      profile_image: 'https://i.pravatar.cc/400?img=1',
      bg_image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600',
      website: 'https://drsarahjohnson.com',
      location: 'New York, NY',
      qualifications: ['PhD in Clinical Psychology', 'Licensed Therapist', 'CBT Certified'],
      specialties: ['Anxiety', 'Depression', 'Stress Management'],
      services: [
        { name: 'Individual Therapy', format: 'Online', duration: 60, price: 150 },
        { name: 'Couples Therapy', format: 'In-Person', duration: 90, price: 200 }
      ],
      faqs: [
        { question: 'Do you accept insurance?', answer: 'Yes, I accept most major insurance plans.' },
        { question: 'What is your cancellation policy?', answer: '24-hour notice required for cancellations.' }
      ]
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@wellnest.local',
      phone: '+1-555-0102',
      category: 'Yoga Instructor',
      bio: 'Certified yoga instructor specializing in Hatha and Vinyasa yoga. Passionate about helping people find balance and inner peace.',
      experience: '7 years',
      languages: ['English', 'Mandarin'],
      profile_image: 'https://i.pravatar.cc/400?img=12',
      bg_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600',
      website: 'https://michaelchenyoga.com',
      location: 'San Francisco, CA',
      qualifications: ['RYT-500 Certified', 'Meditation Teacher', 'Ayurveda Practitioner'],
      specialties: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation'],
      services: [
        { name: 'Group Yoga Class', format: 'In-Person', duration: 60, price: 25 },
        { name: 'Private Session', format: 'Online', duration: 45, price: 80 }
      ],
      faqs: [
        { question: 'Do I need prior experience?', answer: 'No, all levels are welcome!' },
        { question: 'What should I bring?', answer: 'Just a yoga mat and comfortable clothing.' }
      ]
    },
    {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@wellnest.local',
      phone: '+1-555-0103',
      category: 'Nutritionist',
      bio: 'Registered dietitian nutritionist helping clients achieve their health goals through personalized nutrition plans and lifestyle coaching.',
      experience: '8 years',
      languages: ['English', 'Spanish', 'Portuguese'],
      profile_image: 'https://i.pravatar.cc/400?img=5',
      bg_image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600',
      website: 'https://dremilynutrition.com',
      location: 'Miami, FL',
      qualifications: ['MS in Nutrition', 'Registered Dietitian', 'Certified Diabetes Educator'],
      specialties: ['Weight Management', 'Sports Nutrition', 'Diabetes Care'],
      services: [
        { name: 'Nutrition Consultation', format: 'Online', duration: 45, price: 120 },
        { name: 'Meal Planning', format: 'Online', duration: 30, price: 75 }
      ],
      faqs: [
        { question: 'Do you create custom meal plans?', answer: 'Yes, all plans are personalized to your needs.' },
        { question: 'How often should I follow up?', answer: 'Typically every 2-4 weeks for best results.' }
      ]
    },
    {
      name: 'James Williams',
      email: 'james.williams@wellnest.local',
      phone: '+1-555-0104',
      category: 'Personal Trainer',
      bio: 'NASM certified personal trainer focused on strength training, functional fitness, and helping clients build sustainable healthy habits.',
      experience: '6 years',
      languages: ['English'],
      profile_image: 'https://i.pravatar.cc/400?img=15',
      bg_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600',
      website: 'https://jameswilliamsfitness.com',
      location: 'Austin, TX',
      qualifications: ['NASM-CPT', 'Functional Movement Specialist', 'Nutrition Coach'],
      specialties: ['Strength Training', 'Weight Loss', 'Athletic Performance'],
      services: [
        { name: 'Personal Training', format: 'In-Person', duration: 60, price: 100 },
        { name: 'Online Coaching', format: 'Online', duration: 30, price: 60 }
      ],
      faqs: [
        { question: 'Do you offer group training?', answer: 'Yes, small group sessions are available.' },
        { question: 'What equipment do I need?', answer: 'Depends on your goals - we can work with what you have.' }
      ]
    },
    {
      name: 'Dr. Priya Patel',
      email: 'priya.patel@wellnest.local',
      phone: '+1-555-0105',
      category: 'Meditation Teacher',
      bio: 'Mindfulness meditation teacher and wellness coach helping individuals reduce stress and cultivate inner peace through ancient practices.',
      experience: '12 years',
      languages: ['English', 'Hindi', 'Gujarati'],
      profile_image: 'https://i.pravatar.cc/400?img=9',
      bg_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600',
      website: 'https://priyapatelmeditation.com',
      location: 'Seattle, WA',
      qualifications: ['Certified Meditation Teacher', 'Mindfulness Coach', 'Reiki Master'],
      specialties: ['Mindfulness', 'Stress Reduction', 'Spiritual Wellness'],
      services: [
        { name: 'Meditation Session', format: 'Online', duration: 45, price: 70 },
        { name: 'Mindfulness Workshop', format: 'In-Person', duration: 120, price: 150 }
      ],
      faqs: [
        { question: 'Is meditation religious?', answer: 'No, my approach is secular and accessible to all.' },
        { question: 'How long before I see results?', answer: 'Most people notice benefits within 2-3 weeks of regular practice.' }
      ]
    }
  ];

  console.log('Creating experts...');
  for (const expertData of experts) {
    const password = await bcrypt.hash('password123', 10);
    
    const centralUser = await prisma.centralUser.create({
      data: {
        email: expertData.email,
        password: password,
        role: 'expert',
        name: expertData.name,
        isVerified: true,
        isActive: true,
        provider: 'local'
      }
    });

    const expert = await prisma.expert.create({
      data: {
        user_id: centralUser.id,
        name: expertData.name,
        email: expertData.email,
        phone: expertData.phone,
        category: expertData.category,
        bio: expertData.bio,
        experience: expertData.experience,
        languages: expertData.languages,
        profile_image: expertData.profile_image,
        bg_image: expertData.bg_image,
        website: expertData.website,
        location: expertData.location,
        status: 'approved',
        isApproved: true,
        isVerified: true,
        rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
        totalReviews: Math.floor(Math.random() * 50) + 10 // Random reviews 10-60
      }
    });

    // Add qualifications
    for (const qual of expertData.qualifications) {
      await prisma.expert_qualifications.create({
        data: {
          expert_id: expert.id,
          value: qual
        }
      });
    }

    // Add specialties
    for (const specialty of expertData.specialties) {
      await prisma.expert_specialties.create({
        data: {
          expert_id: expert.id,
          value: specialty
        }
      });
    }

    // Add services
    for (const service of expertData.services) {
      await prisma.expert_services.create({
        data: {
          expert_id: expert.id,
          ...service
        }
      });
    }

    // Add FAQs
    for (const faq of expertData.faqs) {
      await prisma.expert_faqs.create({
        data: {
          expert_id: expert.id,
          ...faq
        }
      });
    }

    // Add availability schedule (Monday-Friday 9AM-5PM)
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    for (const day of weekdays) {
      await prisma.expertAvailability.create({
        data: {
          expertId: expert.id,
          day: day,
          startTime: new Date('1970-01-01T09:00:00Z'),
          endTime: new Date('1970-01-01T17:00:00Z'),
          selected: true
        }
      });
    }
    // Add weekend as unavailable
    await prisma.expertAvailability.create({
      data: {
        expertId: expert.id,
        day: 'saturday',
        startTime: null,
        endTime: null,
        selected: false
      }
    });
    await prisma.expertAvailability.create({
      data: {
        expertId: expert.id,
        day: 'sunday',
        startTime: null,
        endTime: null,
        selected: false
      }
    });

    console.log(`✓ Created expert: ${expertData.name}`);
  }

  // Create 5 sample wellness centers
  const centers = [
    {
      name: 'Zen Wellness Studio',
      email: 'info@zenwellness.local',
      phone: '+1-555-0201',
      category: 'Yoga Studio',
      description: 'A peaceful sanctuary offering yoga, meditation, and holistic wellness programs in a serene environment.',
      address: '123 Peaceful Lane, Los Angeles, CA 90001',
      website: 'https://zenwellness.com',
      offers: 'First class free for new members',
      latitude: 34.0522,
      longitude: -118.2437,
      centerImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
      amenities: ['Yoga Mats Provided', 'Showers', 'Lockers', 'Tea Bar', 'Meditation Room'],
      services: ['Hatha Yoga', 'Vinyasa Flow', 'Meditation', 'Pranayama', 'Sound Healing'],
      equipment: ['Yoga Blocks', 'Straps', 'Bolsters', 'Meditation Cushions'],
      pricing: [
        { type: 'Single Class', price: '$25' },
        { type: 'Monthly Unlimited', price: '$150' }
      ],
      schedule: [
        { day: 'Monday', isOpen: true, openingTime: '06:00', closingTime: '21:00' },
        { day: 'Tuesday', isOpen: true, openingTime: '06:00', closingTime: '21:00' },
        { day: 'Wednesday', isOpen: true, openingTime: '06:00', closingTime: '21:00' },
        { day: 'Thursday', isOpen: true, openingTime: '06:00', closingTime: '21:00' },
        { day: 'Friday', isOpen: true, openingTime: '06:00', closingTime: '21:00' },
        { day: 'Saturday', isOpen: true, openingTime: '08:00', closingTime: '18:00' },
        { day: 'Sunday', isOpen: true, openingTime: '08:00', closingTime: '18:00' }
      ],
      images: [
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800',
        'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800'
      ]
    },
    {
      name: 'FitLife Gym & Wellness',
      email: 'contact@fitlifegym.local',
      phone: '+1-555-0202',
      category: 'Gym',
      description: 'State-of-the-art fitness facility with modern equipment, personal training, and group fitness classes.',
      address: '456 Fitness Ave, Chicago, IL 60601',
      website: 'https://fitlifegym.com',
      offers: '7-day free trial',
      latitude: 41.8781,
      longitude: -87.6298,
      centerImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      amenities: ['Free Parking', 'Sauna', 'Steam Room', 'Smoothie Bar', 'WiFi', 'Towel Service'],
      services: ['Personal Training', 'Group Classes', 'Cardio', 'Strength Training', 'Spin Classes'],
      equipment: ['Treadmills', 'Free Weights', 'Cable Machines', 'Rowing Machines', 'Bikes'],
      pricing: [
        { type: 'Monthly Membership', price: '$79' },
        { type: 'Annual Membership', price: '$799' }
      ],
      schedule: [
        { day: 'Monday', isOpen: true, openingTime: '05:00', closingTime: '23:00' },
        { day: 'Tuesday', isOpen: true, openingTime: '05:00', closingTime: '23:00' },
        { day: 'Wednesday', isOpen: true, openingTime: '05:00', closingTime: '23:00' },
        { day: 'Thursday', isOpen: true, openingTime: '05:00', closingTime: '23:00' },
        { day: 'Friday', isOpen: true, openingTime: '05:00', closingTime: '23:00' },
        { day: 'Saturday', isOpen: true, openingTime: '07:00', closingTime: '20:00' },
        { day: 'Sunday', isOpen: true, openingTime: '07:00', closingTime: '20:00' }
      ],
      images: [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800'
      ]
    },
    {
      name: 'Mindful Meditation Center',
      email: 'hello@mindfulmeditation.local',
      phone: '+1-555-0203',
      category: 'Meditation Center',
      description: 'Dedicated meditation space offering guided sessions, workshops, and retreats for all experience levels.',
      address: '789 Tranquil Road, Portland, OR 97201',
      website: 'https://mindfulmeditation.com',
      offers: 'Free intro meditation session',
      latitude: 45.5152,
      longitude: -122.6784,
      centerImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      amenities: ['Meditation Cushions', 'Quiet Rooms', 'Library', 'Tea Garden', 'Parking'],
      services: ['Guided Meditation', 'Mindfulness Training', 'Retreats', 'Workshops', 'Private Sessions'],
      equipment: ['Meditation Cushions', 'Blankets', 'Singing Bowls', 'Incense'],
      pricing: [
        { type: 'Drop-in Session', price: '$20' },
        { type: 'Monthly Pass', price: '$120' }
      ],
      schedule: [
        { day: 'Monday', isOpen: true, openingTime: '07:00', closingTime: '20:00' },
        { day: 'Tuesday', isOpen: true, openingTime: '07:00', closingTime: '20:00' },
        { day: 'Wednesday', isOpen: true, openingTime: '07:00', closingTime: '20:00' },
        { day: 'Thursday', isOpen: true, openingTime: '07:00', closingTime: '20:00' },
        { day: 'Friday', isOpen: true, openingTime: '07:00', closingTime: '20:00' },
        { day: 'Saturday', isOpen: true, openingTime: '09:00', closingTime: '17:00' },
        { day: 'Sunday', isOpen: true, openingTime: '09:00', closingTime: '17:00' }
      ],
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
        'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800'
      ]
    },
    {
      name: 'Holistic Health Clinic',
      email: 'info@holistichealth.local',
      phone: '+1-555-0204',
      category: 'Wellness Clinic',
      description: 'Comprehensive wellness clinic offering nutrition counseling, physical therapy, and integrative health services.',
      address: '321 Wellness Blvd, Denver, CO 80201',
      website: 'https://holistichealth.com',
      offers: 'Free health assessment',
      latitude: 39.7392,
      longitude: -104.9903,
      centerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
      amenities: ['Private Consultation Rooms', 'Waiting Lounge', 'Pharmacy', 'Lab Services', 'Parking'],
      services: ['Nutrition Counseling', 'Physical Therapy', 'Acupuncture', 'Massage Therapy', 'Health Coaching'],
      equipment: ['Treatment Tables', 'Exercise Equipment', 'Diagnostic Tools'],
      pricing: [
        { type: 'Initial Consultation', price: '$150' },
        { type: 'Follow-up Visit', price: '$100' }
      ],
      schedule: [
        { day: 'Monday', isOpen: true, openingTime: '08:00', closingTime: '18:00' },
        { day: 'Tuesday', isOpen: true, openingTime: '08:00', closingTime: '18:00' },
        { day: 'Wednesday', isOpen: true, openingTime: '08:00', closingTime: '18:00' },
        { day: 'Thursday', isOpen: true, openingTime: '08:00', closingTime: '18:00' },
        { day: 'Friday', isOpen: true, openingTime: '08:00', closingTime: '18:00' },
        { day: 'Saturday', isOpen: true, openingTime: '09:00', closingTime: '14:00' },
        { day: 'Sunday', isOpen: false, openingTime: null, closingTime: null }
      ],
      images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'
      ]
    },
    {
      name: 'Serenity Spa & Wellness',
      email: 'reservations@serenityspa.local',
      phone: '+1-555-0205',
      category: 'Spa',
      description: 'Luxurious spa offering massage therapy, facials, body treatments, and relaxation services in a tranquil setting.',
      address: '555 Relaxation Way, Miami, FL 33101',
      website: 'https://serenityspa.com',
      offers: '20% off first visit',
      latitude: 25.7617,
      longitude: -80.1918,
      centerImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
      amenities: ['Jacuzzi', 'Steam Room', 'Relaxation Lounge', 'Changing Rooms', 'Complimentary Refreshments'],
      services: ['Massage Therapy', 'Facials', 'Body Scrubs', 'Aromatherapy', 'Couples Packages'],
      equipment: ['Massage Tables', 'Hot Stones', 'Essential Oils', 'Facial Equipment'],
      pricing: [
        { type: '60-min Massage', price: '$120' },
        { type: 'Spa Day Package', price: '$350' }
      ],
      schedule: [
        { day: 'Monday', isOpen: true, openingTime: '09:00', closingTime: '20:00' },
        { day: 'Tuesday', isOpen: true, openingTime: '09:00', closingTime: '20:00' },
        { day: 'Wednesday', isOpen: true, openingTime: '09:00', closingTime: '20:00' },
        { day: 'Thursday', isOpen: true, openingTime: '09:00', closingTime: '20:00' },
        { day: 'Friday', isOpen: true, openingTime: '09:00', closingTime: '21:00' },
        { day: 'Saturday', isOpen: true, openingTime: '09:00', closingTime: '21:00' },
        { day: 'Sunday', isOpen: true, openingTime: '10:00', closingTime: '19:00' }
      ],
      images: [
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800',
        'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800'
      ]
    }
  ];

  console.log('\nCreating wellness centers...');
  for (const centerData of centers) {
    const password = await bcrypt.hash('password123', 10);
    
    const centralUser = await prisma.centralUser.create({
      data: {
        email: centerData.email,
        password: password,
        role: 'center',
        name: centerData.name,
        isVerified: true,
        isActive: true,
        provider: 'local'
      }
    });

    const center = await prisma.center.create({
      data: {
        user_id: centralUser.id,
        name: centerData.name,
        email: centerData.email,
        phone: centerData.phone,
        category: centerData.category,
        description: centerData.description,
        address: centerData.address,
        website: centerData.website,
        offers: centerData.offers,
        latitude: centerData.latitude,
        longitude: centerData.longitude,
        centerImage: centerData.centerImage,
        status: 'approved',
        isApproved: true,
        isVerified: true,
        rating: 4.0 + Math.random(), // Random rating between 4.0-5.0
        totalReviews: Math.floor(Math.random() * 100) + 20 // Random reviews 20-120
      }
    });

    // Add amenities
    for (const amenity of centerData.amenities) {
      await prisma.center_amenities.create({
        data: {
          center_id: center.id,
          value: amenity
        }
      });
    }

    // Add services
    for (const service of centerData.services) {
      await prisma.center_services.create({
        data: {
          center_id: center.id,
          name: service,
          description: `Professional ${service.toLowerCase()} services`
        }
      });
    }

    // Add equipment
    for (const equip of centerData.equipment) {
      await prisma.center_equipment.create({
        data: {
          center_id: center.id,
          value: equip
        }
      });
    }

    // Add pricing
    for (const price of centerData.pricing) {
      await prisma.center_pricing.create({
        data: {
          center_id: center.id,
          ...price
        }
      });
    }

    // Add schedule
    for (const sched of centerData.schedule) {
      await prisma.center_schedule.create({
        data: {
          center_id: center.id,
          day_of_week: sched.day,
          is_open: sched.isOpen,
          opening_time: sched.openingTime ? new Date(`1970-01-01T${sched.openingTime}:00Z`) : null,
          closing_time: sched.closingTime ? new Date(`1970-01-01T${sched.closingTime}:00Z`) : null
        }
      });
    }

    // Add images
    for (const image of centerData.images) {
      await prisma.center_images.create({
        data: {
          center_id: center.id,
          image_url: image
        }
      });
    }

    // Add trainers (2 trainers per center)
    const trainerNames = [
      { name: 'Alex Martinez', specialty: 'Yoga Instructor', bio: 'Certified yoga instructor with 5+ years experience' },
      { name: 'Sarah Kim', specialty: 'Personal Trainer', bio: 'NASM certified trainer specializing in strength training' },
      { name: 'David Thompson', specialty: 'Pilates Instructor', bio: 'Pilates expert with focus on core strength' },
      { name: 'Maria Garcia', specialty: 'Spin Instructor', bio: 'High-energy spin classes for all fitness levels' },
      { name: 'John Wilson', specialty: 'Nutritionist', bio: 'Registered dietitian helping clients achieve health goals' }
    ];
    
    // Add 2 random trainers to each center
    for (let i = 0; i < 2; i++) {
      const trainer = trainerNames[(centers.indexOf(centerData) * 2 + i) % trainerNames.length];
      await prisma.center_trainers.create({
        data: {
          center_id: center.id,
          name: trainer.name,
          specialty: trainer.specialty,
          bio: trainer.bio,
          image: `https://i.pravatar.cc/200?img=${(centers.indexOf(centerData) * 2 + i + 20)}`
        }
      });
    }

    console.log(`✓ Created center: ${centerData.name}`);
  }

  console.log('\n✅ Database seeding completed successfully!');
  console.log(`\nCreated:`);
  console.log(`  - 5 Experts with full profiles`);
  console.log(`  - 5 Wellness Centers with complete details`);
  console.log(`\nTest credentials for all accounts:`);
  console.log(`  Password: password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
