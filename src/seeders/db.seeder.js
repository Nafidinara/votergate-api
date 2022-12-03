const seeder = require('mongoose-seed');
const config = require('../config/config');

seeder.connect(config.mongoose.url, () => {
  seeder.loadModels([
    './src/models/user.model.js',
    './src/models/facility.model.js',
  ]);
  seeder.clearModels(['User','Facility'], () => {
    seeder.populateModels(data, function (err, done) {
      if (err){
        return console.log(`Seed error`, err);
      }
      if (done){
        return console.log(`Seed successful`, done);
      }
      seeder.disconnect();
    });
  });
});

const data = [
  {
    'model' : 'User',
    'documents' : [
      {
        "role": "user",
        "isEmailVerified": false,
        "username": "hashira-user",
        "email": "hashirauser@example.com",
        "password" : "password123",
        "phone": "08123456789",
        "job" : "teacher",
      },
      {
        "role": "user",
        "isEmailVerified": false,
        "username": "hashira-user-2",
        "email": "hashirauser2@example.com",
        "password" : "password123",
        "phone": "08123456789",
        "job" : "teacher",

      },
      {
        "role": "user",
        "isEmailVerified": false,
        "username": "hashira-user-3",
        "email": "hashirauser3@example.com",
        "password" : "password123",
        "phone": "08123456789",
        "job" : "teacher",
      },
      {
        "role": "mentor",
        "isEmailVerified": false,
        "username": "hashira-mentor",
        "email": "hashirasmentor@example.com",
        "password" : "password123",
        "phone": "08123456789",
        "job" : "mentor accelerator",
      },
      {
        "role": "mentor",
        "isEmailVerified": false,
        "username": "hashira-mentor-2",
        "email": "hashirasmentor2@example.com",
        "password" : "password123",
        "phone": "08123456789",
        "job" : "mentor accelerator",
      },
      {
        "role": "admin",
        "isEmailVerified": false,
        "username": "hashira-admin",
        "email": "hashiraadmin@example.com",
        "password" : "password123",
        "phone": "08123456789",
        "job" : "admin",
      }
    ]
  },
  {
    'model' : 'Facility',
    'documents' : [
      {
        "title": "title1",
        "description": "6 e-modul Materi Manajemen Referensi",
        "image": "src/public/assets-dump/images/facilities/1653637653471_fasil4.png",
      },
      {
        "title": "title2",
        "description": "6 video Materi Manajemen Referensi",
        "image": "src/public/assets-dump/images/facilities/1653637980693_fasil6.png",
      },
      {
        "title": "title3",
        "description": "Post Test",
        "image": "src/public/assets-dump/images/facilities/1653638004483_fasil5.png",
      },
      {
        "title": "title4",
        "description": "Konsultasi dengan Mentor (selama 30 hari)",
        "image": "src/public/assets-dump/images/facilities/1653638039379_fasil2.png",
      },
      {
        "title": "title5",
        "description": "Akses ke Komunitas Pengajar",
        "image": "src/public/assets/images/facilities/1653638055247_fasil1.png",
      },
      {
        "title": "title6",
        "description": "E-Sertifikat",
        "image": "src/public/assets-dump/images/facilities/1653638071880_fasil3.png",
      }
    ]
  }
]
