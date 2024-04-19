const mainDomain = "http://localhost:3030";
//const mainDomain = "http://sars.bmt.go.tz/";

const GetAccessToken = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  //console.log(user);
  if (user) return user.token;

  return null;
};

const GetUserId = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (user) return user.userId;

  return null;
};

const Config = {
  AxiosConfig: {
    headers: {
      authorization: `${GetAccessToken()}`,
      id: GetUserId(),
    },
  },
  domain: mainDomain,
  apiUrl: mainDomain,
  certificateUrl: mainDomain + "api/upload/CERTIFICATES/",
  docUrl: mainDomain + "api/upload/",
  sessionExpiredTime: 15, // in minutes
  idleTime: 15, // in mins
};

export const PaginationLimit = 10;

export const ForUs = (userId) => {
  if (userId === "e9ca6870-e80a-4df1-9b27-b6986fd6244a") {
    return true;
  }

  return false;
};

export const gDistrictsList = [
  [
    {
      id: "1",
      name: "ARUSHA",
    },
    {
      id: "2",
      name: "DAR ES SALAAM",
    },
  ],
  [
    {
      id: "1",
      name: "Arusha",
    },
    {
      id: "2",
      name: "Arumeru",
    },
    {
      id: "3",
      name: "Ngorongoro",
    },
    {
      id: "4",
      name: "Longido",
    },
    {
      id: "5",
      name: "Monduli",
    },
    {
      id: "6",
      name: "Karatu",
    },
  ],
  [
    {
      id: "1",
      name: "Kinondoni",
    },
    {
      id: "2",
      name: "Ilala",
    },
    {
      id: "3",
      name: "Temeke",
    },
    {
      id: "4",
      name: "Kigamboni",
    },
    {
      id: "5",
      name: "Ubungo",
    },
  ],
  [
    {
      id: "1",
      name: "Chamwino",
    },
    {
      id: "2",
      name: "Dodoma",
    },
    {
      id: "3",
      name: "Chemba",
    },
    {
      id: "4",
      name: "Kondoa",
    },
    {
      id: "5",
      name: "Bahi",
    },
    {
      id: "6",
      name: "Mpwapwa",
    },
    {
      id: "7",
      name: "Kongwa",
    },
  ],
  [
    {
      id: "1",
      name: "Bukombe",
    },
    {
      id: "2",
      name: "Mbogwe",
    },
    {
      id: "3",
      name: "Nyangwale",
    },
    {
      id: "4",
      name: "Geita",
    },
    {
      id: "5",
      name: "Chato",
    },
  ],
  [
    {
      id: "1",
      name: "Mufindi",
    },
    {
      id: "2",
      name: "Kilolo",
    },
    {
      id: "3",
      name: "Iringa",
    },
  ],
  [
    {
      id: "1",
      name: "Biharamulo",
    },
    {
      id: "2",
      name: "Karagwe",
    },
    {
      id: "3",
      name: "Muleba",
    },
    {
      id: "4",
      name: "Kyerwa",
    },
    {
      id: "5",
      name: "Bukoba",
    },
    {
      id: "6",
      name: "Ngara",
    },
    {
      id: "7",
      name: "Missenyi",
    },
  ],
  [
    {
      id: "1",
      name: "Mlele",
    },
    {
      id: "2",
      name: "Mpanda",
    },
    {
      id: "3",
      name: "Tanganyika",
    },
  ],
  [
    {
      id: "1",
      name: "Kigoma",
    },
    {
      id: "2",
      name: "Kasulu",
    },
    {
      id: "3",
      name: "Kakonko",
    },
    {
      id: "4",
      name: "Uvinza",
    },
    {
      id: "5",
      name: "Buhigwe",
    },
    {
      id: "6",
      name: "Kibondo",
    },
  ],
  [
    {
      id: "1",
      name: "Siha",
    },
    {
      id: "2",
      name: "Moshi",
    },
    {
      id: "3",
      name: "Mwanga",
    },
    {
      id: "4",
      name: "Rombo",
    },
    {
      id: "5",
      name: "Hai",
    },
    {
      id: "6",
      name: "Same",
    },
  ],

  [
    {
      id: "1",
      name: "Nachingwea",
    },
    {
      id: "2",
      name: "Ruangwa",
    },
    {
      id: "3",
      name: "Liwale",
    },
    {
      id: "4",
      name: "Lindi",
    },
    {
      id: "5",
      name: "Kilwa",
    },
  ],

  [
    {
      id: "1",
      name: "Babati",
    },
    {
      id: "2",
      name: "Mbulu",
    },
    {
      id: "3",
      name: "Hanang’",
    },
    {
      id: "4",
      name: "Kiteto",
    },
    {
      id: "5",
      name: "Simanjiro",
    },
  ],
  [
    {
      id: "1",
      name: "Rorya",
    },
    {
      id: "2",
      name: "Serengeti",
    },
    {
      id: "3",
      name: "Bunda",
    },
    {
      id: "4",
      name: "Butiama",
    },
    {
      id: "5",
      name: "Tarime",
    },
    {
      id: "6",
      name: "Musoma",
    },
  ],
  [
    {
      id: "1",
      name: "Chunya",
    },
    {
      id: "2",
      name: "Kyela",
    },
    {
      id: "3",
      name: "Mbeya",
    },
    {
      id: "4",
      name: "Rungwe",
    },
    {
      id: "5",
      name: "Mbarali",
    },
  ],
  [
    {
      id: "1",
      name: "Gairo",
    },
    {
      id: "2",
      name: "Kilombero",
    },
    {
      id: "3",
      name: "Mvomero",
    },
    {
      id: "4",
      name: "Morogoro",
    },
    {
      id: "5",
      name: "Ulanga",
    },
    {
      id: "6",
      name: "Kilosa",
    },
    {
      id: "7",
      name: "Malinyi",
    },
  ],
  [
    {
      id: "1",
      name: "Newala",
    },
    {
      id: "2",
      name: "Nanyumbu",
    },
    {
      id: "3",
      name: "Mtwara",
    },
    {
      id: "4",
      name: "Masasi",
    },
    {
      id: "5",
      name: "Tandahimba",
    },
  ],
  [
    {
      id: "1",
      name: "Ilemela",
    },
    {
      id: "2",
      name: "Kwimba",
    },
    {
      id: "3",
      name: "Sengerema",
    },
    {
      id: "4",
      name: "Nyamagana",
    },
    {
      id: "5",
      name: "Magu",
    },
    {
      id: "6",
      name: "Ukerewe",
    },
    {
      id: "7",
      name: "Misungwi",
    },
  ],
  [
    {
      id: "1",
      name: "Njombe",
    },
    {
      id: "2",
      name: "Ludewa",
    },
    {
      id: "3",
      name: "Wanging’ombe",
    },
    {
      id: "4",
      name: "Makete",
    },
  ],
  [
    {
      id: "1",
      name: "Bagamoyo",
    },
    {
      id: "2",
      name: "Mkuranga",
    },
    {
      id: "3",
      name: "Rufiji",
    },
    {
      id: "4",
      name: "Mafia",
    },
    {
      id: "5",
      name: "Kibaha",
    },
    {
      id: "6",
      name: "Kisarawe",
    },
    {
      id: "7",
      name: "Kibiti",
    },
  ],
  [
    {
      id: "1",
      name: "Sumbawanga",
    },
    {
      id: "2",
      name: "Nkasi",
    },
    {
      id: "3",
      name: "Kalambo",
    },
  ],
  [
    {
      id: "1",
      name: "Namtumbo",
    },
    {
      id: "2",
      name: "Mbinga",
    },
    {
      id: "3",
      name: "Nyasa",
    },
    {
      id: "4",
      name: "Tunduru",
    },
    {
      id: "5",
      name: "Songea",
    },
  ],
  [
    {
      id: "1",
      name: "Kishapu",
    },
    {
      id: "2",
      name: "Kahama",
    },
    {
      id: "3",
      name: "Shinyanga",
    },
  ],
  [
    {
      id: "1",
      name: "Busega",
    },
    {
      id: "2",
      name: "Maswa",
    },
    {
      id: "3",
      name: "Bariadi",
    },
    {
      id: "4",
      name: "Meatu",
    },
    {
      id: "5",
      name: "Itilima",
    },
  ],
  [
    {
      id: "1",
      name: "Mkalama",
    },
    {
      id: "2",
      name: "Manyoni",
    },
    {
      id: "3",
      name: "Singida",
    },
    {
      id: "4",
      name: "Ikungi",
    },
    {
      id: "5",
      name: "Iramba",
    },
  ],
  [
    {
      id: "1",
      name: "Songwe",
    },
    {
      id: "2",
      name: "Ileje",
    },
    {
      id: "3",
      name: "Mbozi",
    },
    {
      id: "4",
      name: "Momba",
    },
  ],
  [
    {
      id: "1",
      name: "Nzega",
    },
    {
      id: "2",
      name: "Kaliua",
    },
    {
      id: "3",
      name: "Igunga",
    },
    {
      id: "4",
      name: "Sikonge",
    },
    {
      id: "5",
      name: "Tabora",
    },
    {
      id: "6",
      name: "Urambo",
    },
    {
      id: "7",
      name: "Uyui",
    },
  ],
  [
    {
      id: "1",
      name: "Tanga",
    },
    {
      id: "2",
      name: "Muheza",
    },
    {
      id: "3",
      name: "Mkinga",
    },
    {
      id: "4",
      name: "Pangani",
    },
    {
      id: "5",
      name: "Handeni",
    },
    {
      id: "6",
      name: "Korogwe",
    },
    {
      id: "7",
      name: "Kilindi",
    },
    {
      id: "8",
      name: "Lushoto",
    },
  ],
];

export const gRegionsList = [
  {
    id: "1",
    name: "Arusha",
  },
  {
    id: "2",
    name: "Dar Es Salaam",
  },
  {
    id: "3",
    name: "Dodoma",
  },
  {
    id: "4",
    name: "Geita",
  },
  {
    id: "5",
    name: "Iringa",
  },
  {
    id: "6",
    name: "Kagera",
  },
  {
    id: "7",
    name: "Katavi",
  },
  {
    id: "8",
    name: "Kigoma",
  },
  {
    id: "9",
    name: "Kilimanjaro",
  },
  {
    id: "10",
    name: "Lindi",
  },
  {
    id: "11",
    name: "Manyara",
  },
  {
    id: "12",
    name: "Mara",
  },
  {
    id: "13",
    name: "Mbeya",
  },
  {
    id: "14",
    name: "Morogoro",
  },
  {
    id: "15",
    name: "Mtwara",
  },
  {
    id: "16",
    name: "Mwanza",
  },
  {
    id: "17",
    name: "Njombe",
  },
  {
    id: "18",
    name: "Pwani",
  },
  {
    id: "19",
    name: "Rukwa",
  },
  {
    id: "20",
    name: "Ruvuma",
  },
  {
    id: "21",
    name: "Shinyanga",
  },
  {
    id: "22",
    name: "Simiyu",
  },
  {
    id: "23",
    name: "Singida",
  },
  {
    id: "24",
    name: "Songwe",
  },
  {
    id: "25",
    name: "Tabora",
  },
  {
    id: "26",
    name: "Tanga",
  },
];

export const gTypeOfRegistration = [
  {
    id: "1",
    name: "Associations",
  },
  {
    id: "2",
    name: "Clubs",
  },
  {
    id: "3",
    name: "Sports Promoters",
  },
  {
    id: "4",
    name: "Sports Agency",
  },
  {
    id: "5",
    name: "Sports Academy",
  },
  {
    id: "6",
    name: "Sports Centre",
  },
  {
    id: "7",
    name: "Gyme Centre",
  },
  {
    id: "8",
    name: "Events",
  },
];

export const gTypeOfAssociations = [
  [],
  [
    {
      id: "1",
      name: "National Sports Associations with members in regional sports associations",
    },
    {
      id: "2",
      name: "Other National Associations",
    },
    {
      id: "3",
      name: "Regional Sports Associations",
    },
    {
      id: "4",
      name: "District Sports Association",
    },
  ],
  [
    {
      id: "1",
      name: "Public",
    },
    {
      id: "2",
      name: "Private",
    },
  ],
  [
    {
      id: "1",
      name: "Sports Promoters",
    },
  ],
  [
    {
      id: "1",
      name: "Sports Agency",
    },
  ],
  [
    {
      id: "1",
      name: "Sports Academy",
    },
  ],
  [
    {
      id: "1",
      name: "Sports Centre",
    },
  ],
  [
    {
      id: "1",
      name: "Ordinary",
    },
    {
      id: "2",
      name: "Modern",
    },
  ],
  [
    {
      id: "1",
      name: "Marathon",
    },
    {
      id: "2",
      name: "Others",
    },
  ],
];

export const gTypeOfGame = [
  {
    id: "1",
    name: "Acrobatic",
  },
  {
    id: "2",
    name: "Athletics",
  },
  {
    id: "3",
    name: "Badminton",
  },
  {
    id: "4",
    name: "Baseball and Softball",
  },
  {
    id: "5",
    name: "Basketball",
  },
  {
    id: "6",
    name: "Beach Soccer",
  },
  {
    id: "7",
    name: "Body Building",
  },
  {
    id: "8",
    name: "Body Building and Weight Lifting",
  },
  {
    id: "9",
    name: "Boxing",
  },

  {
    id: "10",
    name: "Canoe",
  },
  {
    id: "11",
    name: "Cards",
  },
  {
    id: "12",
    name: "Centre",
  },
  {
    id: "13",
    name: "Chess",
  },
  {
    id: "14",
    name: "Communicable Ball",
  },
  {
    id: "15",
    name: "Cricket",
  },
  {
    id: "16",
    name: "Cycling",
  },
  {
    id: "17",
    name: "Darts",
  },
  {
    id: "18",
    name: "Fitness",
  },
  {
    id: "19",
    name: "Football",
  },
  {
    id: "20",
    name: "Goal Ball",
  },
  {
    id: "21",
    name: "Golf",
  },
  {
    id: "22",
    name: "Gym",
  },

  {
    id: "23",
    name: "Handball",
  },
  {
    id: "24",
    name: "Hockey",
  },
  {
    id: "25",
    name: "Joggers",
  },

  {
    id: "26",
    name: "Kabadi",
  },
  {
    id: "27",
    name: "Karate",
  },
  {
    id: "28",
    name: "King Boxing",
  },
  {
    id: "29",
    name: "Kite Surfing",
  },
  {
    id: "30",
    name: "Kung-Fu",
  },
  {
    id: "31",
    name: "Martial Arts",
  },
  {
    id: "32",
    name: "Motor Sports",
  },
  {
    id: "33",
    name: "Netball",
  },
  {
    id: "34",
    name: "Padeli",
  },
  {
    id: "35",
    name: "Pool Table",
  },
  {
    id: "36",
    name: "Power Lifting",
  },

  {
    id: "37",
    name: "Roll Ball",
  },
  {
    id: "38",
    name: "Roller-skating",
  },
  {
    id: "39",
    name: "Rugby",
  },
  {
    id: "40",
    name: "Sailing",
  },
  {
    id: "41",
    name: "Shoaling Temp",
  },
  {
    id: "42",
    name: "Shooting",
  },
  {
    id: "43",
    name: "Skating",
  },
  {
    id: "44",
    name: "Special Needs",
  },
  {
    id: "45",
    name: "Sports Discipline",
  },
  {
    id: "46",
    name: "Sports Medicines",
  },
  {
    id: "47",
    name: "Squash Racket",
  },
  {
    id: "48",
    name: "Swimming",
  },
  {
    id: "49",
    name: "Table Tennis",
  },
  {
    id: "50",
    name: "Taekwondo",
  },
  {
    id: "51",
    name: "Tennis",
  },
  {
    id: "52",
    name: "Traditional Games",
  },
  {
    id: "53",
    name: "Volley Ball",
  },
  {
    id: "54",
    name: "Weight Lifting",
  },
  {
    id: "55",
    name: "Wood Ball",
  },
  {
    id: "56",
    name: "Wrestling",
  },
  {
    id: "57",
    name: "Wushu",
  },
  {
    id: "58",
    name: "Yoga",
  },
];

export const gTypeOfRoles = [
  { value: "1", label: "Registrar" },
  { value: "2", label: "Customers" },
  { value: "3", label: "Subadmins" },
  { value: "4", label: "Reports" },
];

export const gCouncilList = [
  [], //0
  [
    //1
    [],
    [
      {
        id: "1",
        name: "Arusha Jiji",
      },
    ],
    [
      {
        id: "1",
        name: "Arusha DC",
      },
      {
        id: "2",
        name: "Meru DC",
      },
    ],
    [
      {
        id: "1",
        name: "Ngorongoro DC",
      },
    ],
    [
      {
        id: "1",
        name: "Longido DC",
      },
    ],
    [
      {
        id: "1",
        name: "Monduli DC",
      },
    ],
    [
      {
        id: "1",
        name: "Karatu DC",
      },
    ],
  ],
  [
    //2
    [],
    [
      {
        id: "1",
        name: "Kinondoni MC",
      },
    ],
    [
      {
        id: "1",
        name: "Dar es Salaam Jiji",
      },
      {
        id: "2",
        name: "Ilala MC",
      },
    ],
    [
      {
        id: "1",
        name: "Temeke MC",
      },
    ],
    [
      {
        id: "1",
        name: "Kigamboni MC",
      },
    ],
    [
      {
        id: "1",
        name: "Ubungo MC",
      },
    ],
  ],

  [
    //3
    [],
    [
      {
        id: "1",
        name: "Chamwino DC",
      },
    ],
    [
      {
        id: "1",
        name: "Dodoma Jiji",
      },
    ],
    [
      {
        id: "1",
        name: "Chemba DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kondoa DC",
      },
      {
        id: "2",
        name: "Kondoa Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Bahi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mpwapwa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kongwa DC",
      },
    ],
  ],

  [
    //4
    [],
    [
      {
        id: "1",
        name: "Bukombe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mbogwe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Nyang’wale DC",
      },
    ],
    [
      {
        id: "1",
        name: "Geita DC",
      },
      {
        id: "2",
        name: "Geita Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Chato DC",
      },
    ],
  ],

  [
    //5
    [],
    [
      {
        id: "1",
        name: "Mufindi DC",
      },
      {
        id: "2",
        name: "Mafinga Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Kilolo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Iringa DC",
      },
      {
        id: "2",
        name: "Iringa MC",
      },
    ],
  ],

  [
    //6
    [],
    [
      {
        id: "1",
        name: "Biharamulo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Karagwe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Muleba DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kyerwa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Bukoba DC",
      },
      {
        id: "2",
        name: "Bukoba MC",
      },
    ],
    [
      {
        id: "1",
        name: "Ngara DC",
      },
    ],
    [
      {
        id: "1",
        name: "Missenyi DC",
      },
    ],
  ],

  [
    //7
    [],
    [
      {
        id: "1",
        name: "Mlele DC",
      },
      {
        id: "2",
        name: "Mpimbwe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mpanda MC",
      },
      {
        id: "2",
        name: "Nsimbo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mpanda DC",
      },
    ],
  ],

  [
    //8
    [],
    [
      {
        id: "1",
        name: "Kigoma DC",
      },
      {
        id: "2",
        name: "Kigoma/Ujiji MC",
      },
    ],
    [
      {
        id: "1",
        name: "Kasulu DC",
      },
      {
        id: "2",
        name: "Kasulu TC",
      },
    ],
    [
      {
        id: "1",
        name: "Kakonko DC",
      },
    ],
    [
      {
        id: "1",
        name: "Uvinza DC",
      },
    ],
    [
      {
        id: "1",
        name: "Buhigwe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kibondo DC",
      },
    ],
  ],

  [
    //9
    [],
    [
      {
        id: "1",
        name: "Siha DC",
      },
    ],
    [
      {
        id: "1",
        name: "Moshi MC",
      },
      {
        id: "2",
        name: "Moshi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mwanga DC",
      },
    ],
    [
      {
        id: "1",
        name: "Rombo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Hai DC",
      },
    ],
    [
      {
        id: "1",
        name: "Same DC",
      },
    ],
  ],

  [
    //10
    [],
    [
      {
        id: "1",
        name: "Nachingwea DC",
      },
    ],
    [
      {
        id: "1",
        name: "Ruangwa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Liwale DC",
      },
    ],
    [
      {
        id: "1",
        name: "Lindi MC",
      },
      {
        id: "2",
        name: "Lindi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kilwa DC",
      },
    ],
  ],

  [
    //11
    [],
    [
      {
        id: "1",
        name: "Babati TC",
      },
      {
        id: "2",
        name: "Babati  DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mbulu DC",
      },
      {
        id: "2",
        name: "Mbulu Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Hanang DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kiteto DC",
      },
    ],
    [
      {
        id: "1",
        name: "Simanjiro DC",
      },
    ],
  ],

  [
    //12
    [],
    [
      {
        id: "1",
        name: "Rorya DC",
      },
    ],
    [
      {
        id: "1",
        name: "Serengeti DC",
      },
    ],
    [
      {
        id: "1",
        name: "Bunda DC",
      },
      {
        id: "2",
        name: "Bunda Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Butiama DC",
      },
    ],
    [
      {
        id: "1",
        name: "Tarime DC",
      },
      {
        id: "2",
        name: "Tarime Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Musoma MC",
      },
      {
        id: "2",
        name: "Musoma DC",
      },
    ],
  ],

  [
    //13
    [],
    [
      {
        id: "1",
        name: "Chunya DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kyela DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mbeya DC",
      },
      {
        id: "2",
        name: "Mbeya Jiji",
      },
    ],
    [
      {
        id: "1",
        name: "Rungwe DC",
      },
      {
        id: "2",
        name: "Busokelo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mbarali DC",
      },
    ],
  ],

  [
    //14
    [],
    [
      {
        id: "1",
        name: "Gairo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kilombero DC",
      },
      {
        id: "2",
        name: "Ifakara Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Mvomero DC",
      },
    ],
    [
      {
        id: "1",
        name: "Morogoro DC",
      },
      {
        id: "2",
        name: "Morogoro MC",
      },
    ],
    [
      {
        id: "1",
        name: "Ulanga DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kilosa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Malinyi DC",
      },
    ],
  ],

  [
    //15
    [],
    [
      {
        id: "1",
        name: "Newala DC",
      },
      {
        id: "2",
        name: "Newala TC",
      },
    ],
    [
      {
        id: "1",
        name: "Nanyumbu DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mtwara MC",
      },
      {
        id: "2",
        name: "Mtwara DC",
      },
      {
        id: "3",
        name: "Nanyamba Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Masasi DC",
      },
      {
        id: "2",
        name: "Masasi Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Tandahimba DC",
      },
    ],
  ],

  [
    //16
    [],
    [
      {
        id: "1",
        name: "Ilemela MC",
      },
    ],
    [
      {
        id: "1",
        name: "Kwimba DC",
      },
    ],
    [
      {
        id: "1",
        name: "Sengerema DC",
      },
      {
        id: "2",
        name: "Buchosa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mwanza Jiji",
      },
    ],
    [
      {
        id: "1",
        name: "Magu DC",
      },
    ],
    [
      {
        id: "1",
        name: "Ukerewe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Misungwi DC",
      },
    ],
  ],

  [
    //17
    [],
    [
      {
        id: "1",
        name: "Njombe DC",
      },
      {
        id: "2",
        name: "Njombe Mji",
      },
      {
        id: "3",
        name: "Makambako Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Ludewa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Wanging’ombe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Makete DC",
      },
    ],
  ],

  [
    //18
    [],
    [
      {
        id: "1",
        name: "Bagamoyo DC",
      },
      {
        id: "2",
        name: "Chalinze DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mkuranga DC",
      },
    ],
    [
      {
        id: "1",
        name: "Rufiji DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mafia DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kibaha DC",
      },
      {
        id: "2",
        name: "Kibaha Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Kisarawe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kibiti DC",
      },
    ],
  ],

  [
    //19
    [],
    [
      {
        id: "1",
        name: "Sumbawanga DC",
      },
      {
        id: "2",
        name: "Sumbawanga MC",
      },
    ],
    [
      {
        id: "1",
        name: "Nkasi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kalambo DC",
      },
    ],
  ],

  [
    //20
    [],
    [
      {
        id: "1",
        name: "Namtumbo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mbinga DC",
      },
      {
        id: "2",
        name: "Mbinga Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Nyasa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Tunduru DC",
      },
    ],
    [
      {
        id: "1",
        name: "Songea MC",
      },
      {
        id: "2",
        name: "Madaba DC",
      },
      {
        id: "3",
        name: "Songea DC",
      },
    ],
  ],

  [
    //21
    [],
    [
      {
        id: "1",
        name: "Kishapu DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kahama Mji",
      },
      {
        id: "2",
        name: "Ushetu DC",
      },
      {
        id: "3",
        name: "Msalala DC",
      },
    ],
    [
      {
        id: "1",
        name: "Shinyanga MC",
      },
      {
        id: "2",
        name: "Shinyanga DC",
      },
    ],
  ],

  [
    //22
    [],
    [
      {
        id: "1",
        name: "Busega DC",
      },
    ],
    [
      {
        id: "1",
        name: "Maswa DC",
      },
    ],
    [
      {
        id: "1",
        name: "Bariadi Mji",
      },
      {
        id: "2",
        name: "Bariadi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Meatu DC",
      },
    ],
    [
      {
        id: "1",
        name: "Itilima DC",
      },
    ],
  ],

  [
    //23
    [],
    [
      {
        id: "1",
        name: "Mkalama DC",
      },
    ],
    [
      {
        id: "1",
        name: "Manyoni DC",
      },
      {
        id: "2",
        name: "Itigi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Singida MC",
      },
      {
        id: "2",
        name: "Singida DC",
      },
    ],
    [
      {
        id: "1",
        name: "Ikungi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Iramba DC",
      },
    ],
  ],

  [
    //24
    [],
    [
      {
        id: "1",
        name: "Songwe DC",
      },
    ],
    [
      {
        id: "2",
        name: "Ileje DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mbozi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Tunduma Mji",
      },
      {
        id: "2",
        name: "Momba DC",
      },
    ],
  ],

  [
    //25
    [],
    [
      {
        id: "1",
        name: "Nzega DC",
      },
      {
        id: "2",
        name: "Nzega Mji",
      },
    ],
    [
      {
        id: "1",
        name: "Kaliua DC",
      },
    ],
    [
      {
        id: "1",
        name: "Igunga DC",
      },
    ],
    [
      {
        id: "1",
        name: "Sikonge DC",
      },
    ],
    [
      {
        id: "1",
        name: "Tabora MC",
      },
    ],
    [
      {
        id: "1",
        name: "Urambo DC",
      },
    ],
    [
      {
        id: "1",
        name: "Tabora/Uyui DC",
      },
    ],
  ],

  [
    //26
    [],
    [
      {
        id: "1",
        name: "Tanga Jiji",
      },
    ],
    [
      {
        id: "1",
        name: "Muheza DC",
      },
    ],
    [
      {
        id: "1",
        name: "Mkinga DC",
      },
    ],
    [
      {
        id: "1",
        name: "Pangani DC",
      },
    ],
    [
      {
        id: "1",
        name: "Handeni Mji",
      },
      {
        id: "2",
        name: "Handeni DC",
      },
    ],
    [
      {
        id: "1",
        name: "Korogwe Mji",
      },
      {
        id: "2",
        name: "Korogwe DC",
      },
    ],
    [
      {
        id: "1",
        name: "Kilindi DC",
      },
    ],
    [
      {
        id: "1",
        name: "Lushoto DC",
      },
      {
        id: "2",
        name: "Bumbuli DC",
      },
    ],
  ],
];

export default Config;
