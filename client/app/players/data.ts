export type Player = {
  id: string
  name: string
  dob: string
  age: number
  team: string
  trainerName: string
  status: "active" | "injured" | "concussion" | "recovery"
  height: string
  weight: string
  medicalHistory: {
    date: string
    incident: string
    severity: "mild" | "moderate" | "severe"
    notes: string
    returnToPlay?: string
  }[]
  mentalHealthReferrals: string[]
  surgicalHistory: { date: string; procedure: string; notes?: string }[]
  allergies: string[]
  bloodwork: { date: string; test: string; result: string }[]
  medication: { name: string; dosage: string; frequency: string }[]
  contactInfo: {
    email: string
    phone: string
    emergency: string
  }
}

export const playerData: Player[] = [
  {
    id: "p1",
    name: "Michael Johnson",
    dob: "2004-05-10",
    age: 20,
    team: "Football",
    trainerName: "Brianna",
    status: "active",
    height: "6'2\"",
    weight: "195 lbs",
    medicalHistory: [
      {
        date: "2024-01-15",
        incident: "Ankle Sprain",
        severity: "mild",
        notes: "Grade 1 ankle sprain during practice. Ice and rest recommended.",
        returnToPlay: "2024-01-22",
      },
    ],
    mentalHealthReferrals: ["2023-09-10: Stress Management Counseling"],
    surgicalHistory: [{ date: "2022-06-12", procedure: "ACL Reconstruction" }],
    allergies: ["Peanuts", "Shellfish"],
    bloodwork: [{ date: "2024-03-01", test: "Iron Levels", result: "Normal" }],
    medication: [{ name: "Ibuprofen", dosage: "200mg", frequency: "As needed" }],
    contactInfo: {
      email: "michael.johnson@email.com",
      phone: "(555) 123-4567",
      emergency: "Sarah Johnson (Mother) - (555) 987-6543",
    },
  },
  {
    id: "p2",
    name: "Emma Rodriguez",
    dob: "2004-02-26",
    age: 19,
    team: "Field Hockey",
    trainerName: "Jake",
    status: "concussion",
    height: "5'8\"",
    weight: "145 lbs",
    medicalHistory: [
      {
        date: "2024-03-02",
        incident: "Concussion",
        severity: "moderate",
        notes: "Collision during game. Showing symptoms of headache, dizziness, and sensitivity to light.",
      },
      {
        date: "2023-11-10",
        incident: "Wrist Sprain",
        severity: "mild",
        notes: "Minor sprain during practice. Taped and continued play with monitoring.",
        returnToPlay: "2023-11-17",
      },
    ],
    contactInfo: {
      email: "emma.rodriguez@email.com",
      phone: "(555) 234-5678",
      emergency: "Carlos Rodriguez (Father) - (555) 876-5432",
    },
    mentalHealthReferrals: [],
    surgicalHistory: [{ date: "2010-08-12", procedure: "Tonsil Removal" }],
    allergies: ["Peanuts", "Shellfish"],
    bloodwork: [],
    medication: [{ name: "Zoloft", dosage: "25mg", frequency: "Per day" }],
  },
  {
    id: "p3",
    name: "Jamal Williams",
    dob: "2003-08-19",
    age: 21,
    team: "Men's Basketball",
    trainerName: "Brianna",
    status: "recovery",
    height: "6'5\"",
    weight: "210 lbs",
    medicalHistory: [
      {
        date: "2024-02-18",
        incident: "Concussion",
        severity: "moderate",
        notes: "Hit to the head during game. Initial symptoms included confusion and headache.",
      },
      {
        date: "2024-02-25",
        incident: "Concussion Follow-up",
        severity: "mild",
        notes: "Symptoms improving. Cleared for light non-contact activities.",
      },
      {
        date: "2023-10-05",
        incident: "Knee Strain",
        severity: "moderate",
        notes: "MCL strain. Physical therapy and rest recommended.",
        returnToPlay: "2023-11-01",
      },
    ],
    contactInfo: {
      email: "jamal.williams@email.com",
      phone: "(555) 345-6789",
      emergency: "Denise Williams (Mother) - (555) 765-4321",
    },
    mentalHealthReferrals: [],
    surgicalHistory: [],
    allergies: [],
    bloodwork: [],
    medication: []
  },
  {
    id: "p4",
    name: "Sophia Chen",
    dob: "2004-05-03",
    age: 20,
    team: "Women's Soccer",
    trainerName: "Ibby",
    status: "injured",
    height: "5'7\"",
    weight: "140 lbs",
    medicalHistory: [
      {
        date: "2024-02-28",
        incident: "Hamstring Strain",
        severity: "moderate",
        notes: "Grade 2 hamstring strain during sprint. Physical therapy initiated.",
      },
      {
        date: "2023-09-15",
        incident: "Concussion",
        severity: "mild",
        notes: "Minor concussion during practice. All symptoms resolved within 7 days.",
        returnToPlay: "2023-09-25",
      },
    ],
    contactInfo: {
      email: "sophia.chen@email.com",
      phone: "(555) 456-7890",
      emergency: "Wei Chen (Father) - (555) 654-3210",
    },
    mentalHealthReferrals: ["2022-10-10: Care Referral"],
    surgicalHistory: [],
    allergies: ["Milk"],
    bloodwork: [{ date: "2024-03-01", test: "Blood Sugar", result: "Normal" }],
    medication: [],
  },
  {
    id: "p5",
    name: "Tyler Martinez",
    dob: "2003-02-26",
    age: 22,
    team: "Wrestling",
    trainerName: "Jesse",
    status: "active",
    height: "6'0\"",
    weight: "185 lbs",
    medicalHistory: [
      {
        date: "2023-11-20",
        incident: "Shoulder Contusion",
        severity: "mild",
        notes: "Bruised shoulder from tackle. Ice and anti-inflammatory medication prescribed.",
        returnToPlay: "2023-11-27",
      },
    ],
    contactInfo: {
      email: "tyler.martinez@email.com",
      phone: "(555) 567-8901",
      emergency: "Maria Martinez (Mother) - (555) 543-2109",
    },
    mentalHealthReferrals: [],
    surgicalHistory: [],
    allergies: [],
    bloodwork: [],
    medication: []
  },
]

