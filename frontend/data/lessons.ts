/**
 * Lesson data for TVEnglish
 * Contains all lesson content with exercises
 */

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  media?: {
    type: 'image' | 'video';
    url?: string;
    placeholder: string;
    caption?: string;
  }[];
  examples: {
    sentence: string;
    explanation: string;
  }[];
  exercises: Exercise[];
}

// A1 LESSONS - Beginner Level
export const a1_greetings_lessons: Lesson[] = [
  {
    id: "greetings-basic",
    title: "Basic Greetings",
    description: "Learn how to greet people in different situations - formal and informal contexts.",
    // Added media property here
    media: [
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=a5uQMwRMHcs&list=RDa5uQMwRMHcs&start_radio=1',
        placeholder: 'Watch the lesson video',
        caption: 'Greetings in English and answering "How are you?"'
      }
    ],
    keyPoints: [
      "Use 'Hello' and 'Hi' for general greetings",
      "'Good morning/afternoon/evening' are time-specific greetings",
      "'How are you?' is a common follow-up question",
      "Informal greetings include 'Hey', 'What's up?', 'How's it going?'"
    ],
    examples: [
      {
        sentence: "Hello! How are you today?",
        explanation: "A friendly, neutral greeting suitable for most situations"
      },
      {
        sentence: "Good morning, Mr. Smith. Nice to see you.",
        explanation: "A formal greeting using time of day and title"
      },
      {
        sentence: "Hey! What's up?",
        explanation: "An informal greeting used between friends"
      }
    ],
    exercises: [
      {
        id: "ex-greetings-1",
        question: "Complete the conversation: 'Good morning, ___________.'",
        options: ["dude", "Professor Johnson", "buddy", "mate"],
        correctAnswer: 1,
        explanation: "The correct answer is 'Professor Johnson'. Since the greeting is 'Good morning' (formal), we should use a formal title and last name."
      }
    ]
  },
  {
    id: "introductions-self",
    title: "Introducing Yourself",
    description: "Learn how to introduce yourself in English, including sharing your name, occupation, and where you're from.",
    // Added media property here as well
    media: [
      {
        type: 'video',
        url: 'https://youtu.be/dmOKZLeFKCM',
        placeholder: 'Watch the lesson video',
        caption: 'Learn common greetings for introductions'
      }
    ],
    keyPoints: [
      "Start with 'My name is...' or 'I'm...' to give your name",
      "Use 'I'm from...' to say where you're from",
      "Say 'I work as...' or 'I'm a...' to describe your job",
      "Add 'Nice to meet you' at the end"
    ],
    examples: [
      {
        sentence: "Hi, my name is Sarah. I'm from Canada.",
        explanation: "Basic self-introduction with name and country"
      },
      {
        sentence: "Hello, I'm John Smith. I work as a software engineer.",
        explanation: "Professional introduction including full name and occupation"
      }
    ],
    exercises: [
      {
        id: "ex-intro-1",
        question: "Fill in the blanks: 'Hello, my name ___ David. I ___ from Australia.'",
        options: ["is / am", "am / am", "is / come", "was / am"],
        correctAnswer: 0,
        explanation: "The correct answer is 'is / am'. We use 'is' after 'my name', 'am' with 'I'."
      }
    ]
  },
  {
    id: "greetings-farewell",
    title: "Saying Goodbye",
    description: "Learn different ways to say goodbye in formal and informal situations.",
    keyPoints: [
      "Basic farewells: Goodbye, Bye, See you later",
      "Formal: Have a good day, Take care, It was nice meeting you",
      "Informal: See ya, Catch you later, Talk to you soon",
      "Time-specific: Good night (only when leaving in the evening)"
    ],
    examples: [
      {
        sentence: "Goodbye! Have a great day!",
        explanation: "Polite farewell suitable for most situations"
      },
      {
        sentence: "It was nice meeting you. Hope to see you again soon.",
        explanation: "Formal farewell after first meeting"
      }
    ],
    exercises: [
      {
        id: "ex-farewell-1",
        question: "When should you say 'Good night' as a farewell?",
        options: [
          "Only when leaving in the evening or before bed",
          "Anytime you want to say goodbye",
          "Only to your family members",
          "Only when it's already dark outside"
        ],
        correctAnswer: 0,
        explanation: "The correct answer is 'Only when leaving in the evening or before bed'. 'Good night' is specifically used when parting in the evening or before going to sleep."
      }
    ]
  }
];

export const a1_numbers_lessons: Lesson[] = [
  {
    id: "numbers-basic",
    title: "Basic Numbers 1-100",
    description: "Learn to count and use numbers in everyday situations.",
    keyPoints: [
      "Numbers 1-10: one, two, three, four, five, six, seven, eight, nine, ten",
      "Teens: eleven, twelve, thirteen, fourteen, fifteen...",
      "Tens: twenty, thirty, forty, fifty...",
      "Use 'and' between hundreds and tens: 'one hundred and twenty'"
    ],
    examples: [
      {
        sentence: "I have three apples.",
        explanation: "Using numbers to count objects"
      },
      {
        sentence: "She is twenty-five years old.",
        explanation: "Using numbers for age"
      }
    ],
    exercises: [
      {
        id: "ex-numbers-1",
        question: "How do you say 47 in English?",
        options: ["Forty-seven", "Four-seven", "Fourty-seven", "Seven-four"],
        correctAnswer: 0,
        explanation: "The correct answer is 'Forty-seven'. Note the spelling of 'forty' (not 'fourty')."
      }
    ]
  },
  {
    id: "numbers-prices",
    title: "Money & Prices",
    description: "Learn how to talk about prices and handle money in English.",
    keyPoints: [
      "Currency: dollars, euros, pounds, cents",
      "Ask: 'How much is this?', 'What's the price?'",
      "Say prices: '$5.50' = 'five dollars and fifty cents'",
      "Round numbers: 'about ten dollars', 'around $20'"
    ],
    examples: [
      {
        sentence: "This shirt costs twenty-five dollars.",
        explanation: "Stating a price"
      },
      {
        sentence: "How much is this coffee?",
        explanation: "Asking for the price"
      }
    ],
    exercises: [
      {
        id: "ex-money-1",
        question: "How do you say $3.75?",
        options: [
          "Three dollars and seventy-five cents",
          "Three point seventy-five dollars",
          "Three dollars seventy-five",
          "All of the above are correct"
        ],
        correctAnswer: 3,
        explanation: "All options are correct! There are multiple ways to say prices in English."
      }
    ]
  },
  {
    id: "numbers-time",
    title: "Telling Time",
    description: "Learn how to ask for and tell the time in English.",
    keyPoints: [
      "Ask 'What time is it?' or 'Do you have the time?'",
      "Use 'o'clock' for exact hours: 'It's 3 o'clock'",
      "For minutes after: 'It's ten past three' or 'It's 3:10'",
      "For minutes before: 'It's ten to four' or 'It's 3:50'"
    ],
    examples: [
      {
        sentence: "What time is it? - It's 9 o'clock.",
        explanation: "Asking and telling time on the hour"
      },
      {
        sentence: "The meeting starts at 10:15 AM.",
        explanation: "Using specific time with AM designation"
      }
    ],
    exercises: [
      {
        id: "ex-time-1",
        question: "What does 'half past two' mean?",
        options: ["2:30", "2:15", "1:30", "2:50"],
        correctAnswer: 0,
        explanation: "'Half past two' means 2:30 - 30 minutes past 2 o'clock."
      }
    ]
  }
];

export const a1_family_lessons: Lesson[] = [
  {
    id: "family-members",
    title: "Family Members",
    description: "Learn the names of family members and how to talk about your family.",
    keyPoints: [
      "Immediate family: mother, father, sister, brother",
      "Extended family: grandparents, aunt, uncle, cousin",
      "In-laws: mother-in-law, brother-in-law, etc.",
      "Use possessive: 'my mother', 'his sister', 'her brother'"
    ],
    examples: [
      {
        sentence: "I have two sisters and one brother.",
        explanation: "Talking about siblings"
      },
      {
        sentence: "My grandmother lives with us.",
        explanation: "Describing family living arrangements"
      }
    ],
    exercises: [
      {
        id: "ex-family-1",
        question: "What is your mother's mother called?",
        options: ["Grandmother", "Aunt", "Mother-in-law", "Cousin"],
        correctAnswer: 0,
        explanation: "Your mother's mother is your grandmother."
      }
    ]
  },
  {
    id: "family-describing",
    title: "Describing People",
    description: "Learn adjectives and phrases to describe people's appearance and personality.",
    keyPoints: [
      "Physical: tall, short, young, old, beautiful, handsome",
      "Personality: kind, friendly, smart, funny, serious",
      "Use 'be' verb: 'He is tall', 'She is friendly'",
      "Use 'have/has' for features: 'She has blue eyes'"
    ],
    examples: [
      {
        sentence: "My father is tall and has brown hair.",
        explanation: "Describing physical appearance"
      },
      {
        sentence: "My sister is very kind and friendly.",
        explanation: "Describing personality"
      }
    ],
    exercises: [
      {
        id: "ex-describing-1",
        question: "Complete: 'My brother ___ very funny.'",
        options: ["is", "has", "are", "have"],
        correctAnswer: 0,
        explanation: "The correct answer is 'is'. We use 'be' verb for personality traits."
      }
    ]
  },
  {
    id: "family-activities",
    title: "Family Activities",
    description: "Learn how to talk about activities you do with your family.",
    keyPoints: [
      "Common activities: have dinner together, watch TV, play games",
      "Weekend activities: go to the park, visit relatives, have picnics",
      "Use present simple for regular activities",
      "Use present continuous for current activities"
    ],
    examples: [
      {
        sentence: "We have dinner together every evening.",
        explanation: "Describing a regular family routine"
      },
      {
        sentence: "We're visiting my grandparents this weekend.",
        explanation: "Talking about a planned family activity"
      }
    ],
    exercises: [
      {
        id: "ex-activities-1",
        question: "Which is correct: 'My family ___ dinner at 6 PM every day.'",
        options: ["has", "have", "is having", "are having"],
        correctAnswer: 0,
        explanation: "'Has' is correct. 'Family' is treated as a singular noun in this context."
      }
    ]
  }
];

// A2 LESSONS - Elementary Level
export const a2_daily_life_lessons: Lesson[] = [
  {
    id: "daily-routines",
    title: "Daily Routines",
    description: "Learn vocabulary and phrases to describe your daily activities and routines.",
    keyPoints: [
      "Use present simple tense to describe regular activities",
      "Common routine verbs: wake up, get up, have breakfast, go to work",
      "Time expressions: in the morning, at noon, in the afternoon",
      "Frequency adverbs: always, usually, often, sometimes, rarely, never"
    ],
    examples: [
      {
        sentence: "I wake up at 7:00 AM every morning.",
        explanation: "Describing a regular morning activity with specific time"
      },
      {
        sentence: "She usually has breakfast before going to work.",
        explanation: "Using frequency adverb 'usually' to describe a routine"
      }
    ],
    exercises: [
      {
        id: "ex-routines-1",
        question: "Put the words in the correct order: 'usually / I / breakfast / have / 8 AM / at'",
        options: [
          "I usually have breakfast at 8 AM",
          "Usually I have at breakfast 8 AM",
          "I have usually breakfast at 8 AM",
          "At 8 AM I have usually breakfast"
        ],
        correctAnswer: 0,
        explanation: "The correct order is: Subject + Frequency adverb + Verb + Object + Time."
      }
    ]
  },
  {
    id: "daily-housework",
    title: "Housework & Chores",
    description: "Learn vocabulary for household tasks and how to talk about daily chores.",
    keyPoints: [
      "Common chores: do the dishes, vacuum, sweep, mop, dust",
      "Laundry: wash clothes, hang laundry, iron, fold clothes",
      "Kitchen: cook, prepare meals, wash dishes, clean the counter",
      "Expressing duty: 'I need to...', 'I have to...'"
    ],
    examples: [
      {
        sentence: "I need to vacuum the living room before guests arrive.",
        explanation: "Expressing a necessary chore"
      },
      {
        sentence: "My brother does the dishes every night after dinner.",
        explanation: "Describing regular household responsibilities"
      }
    ],
    exercises: [
      {
        id: "ex-housework-1",
        question: "What does 'do the laundry' mean?",
        options: [
          "Wash and care for clothes",
          "Clean the floors",
          "Wash the dishes",
          "Organize the closet"
        ],
        correctAnswer: 0,
        explanation: "'Do the laundry' means to wash, dry, and sometimes iron and fold clothes."
      }
    ]
  },
  {
    id: "daily-habits",
    title: "Healthy Habits",
    description: "Learn to talk about healthy habits and lifestyle choices.",
    keyPoints: [
      "Exercise vocabulary: go jogging, work out, do yoga, swim",
      "Healthy eating: eat vegetables, drink water, avoid junk food",
      "Sleep: get enough sleep, go to bed early, wake up refreshed",
      "Use 'should' for advice: 'You should exercise regularly'"
    ],
    examples: [
      {
        sentence: "I try to exercise three times a week.",
        explanation: "Describing exercise routine"
      },
      {
        sentence: "You should drink at least 8 glasses of water daily.",
        explanation: "Giving health advice"
      }
    ],
    exercises: [
      {
        id: "ex-habits-1",
        question: "Complete: 'You ___ eat more vegetables for better health.'",
        options: ["should", "must", "can", "will"],
        correctAnswer: 0,
        explanation: "'Should' is used to give advice or recommendations."
      }
    ]
  }
];

export const a2_shopping_food_lessons: Lesson[] = [
  {
    id: "shopping-basics",
    title: "Shopping Basics",
    description: "Essential phrases and vocabulary for shopping in English-speaking countries.",
    keyPoints: [
      "Use 'How much is this?' to ask about price",
      "'I'm looking for...' to say what you want to buy",
      "'Can I try this on?' when shopping for clothes",
      "'I'll take it' when you decide to buy something"
    ],
    examples: [
      {
        sentence: "Excuse me, how much is this shirt?",
        explanation: "Politely asking for the price of an item"
      },
      {
        sentence: "I'm looking for a birthday gift for my friend.",
        explanation: "Telling the salesperson what you need"
      }
    ],
    exercises: [
      {
        id: "ex-shopping-1",
        question: "Complete the shopping dialogue: 'Excuse me, _____ is this jacket?'",
        options: ["how much", "what price", "how many", "which cost"],
        correctAnswer: 0,
        explanation: "'How much' is the standard way to ask about price."
      }
    ]
  },
  {
    id: "restaurant-ordering",
    title: "Ordering at a Restaurant",
    description: "Learn how to order food and drinks at restaurants, cafes, and other dining establishments.",
    keyPoints: [
      "Use 'I'd like...' or 'Can I have...' to order",
      "Ask 'What do you recommend?' for suggestions",
      "'Could I get the bill/check, please?' to ask for the bill",
      "Say 'This is delicious' to compliment the food"
    ],
    examples: [
      {
        sentence: "I'd like the grilled salmon, please.",
        explanation: "Politely ordering a main course"
      },
      {
        sentence: "Can I have a coffee and a piece of chocolate cake?",
        explanation: "Ordering drinks and dessert"
      }
    ],
    exercises: [
      {
        id: "ex-restaurant-1",
        question: "What would a waiter typically say after taking your order?",
        options: [
          "The bill, please",
          "And for dessert?",
          "Enjoy your meal!",
          "What's your name?"
        ],
        correctAnswer: 2,
        explanation: "After taking your order, the waiter would typically say 'Enjoy your meal!'"
      }
    ]
  },
  {
    id: "shopping-grocery",
    title: "Grocery Shopping",
    description: "Learn essential vocabulary and phrases for shopping at supermarkets and grocery stores.",
    keyPoints: [
      "Items: fresh produce, dairy products, frozen foods, canned goods",
      "Quantities: a carton of milk, a loaf of bread, a bunch of bananas",
      "Ask: 'Where can I find...?', 'Do you have...?'",
      "At checkout: 'Do you need a bag?', 'Cash or card?'"
    ],
    examples: [
      {
        sentence: "Excuse me, where can I find the fresh vegetables?",
        explanation: "Asking for location in a supermarket"
      },
      {
        sentence: "I need to buy a loaf of bread and a carton of milk.",
        explanation: "Using quantity expressions for groceries"
      }
    ],
    exercises: [
      {
        id: "ex-grocery-1",
        question: "What is the correct quantity expression: '___ of milk'?",
        options: ["a carton", "a loaf", "a bunch", "a slice"],
        correctAnswer: 0,
        explanation: "We say 'a carton of milk'. Different items use different quantity words."
      }
    ]
  }
];

export const a2_weather_lessons: Lesson[] = [
  {
    id: "weather-talk",
    title: "Talking About the Weather",
    description: "Learn how to discuss the weather - a common topic for small talk in English.",
    keyPoints: [
      "Common phrases: 'What's the weather like?', 'It's sunny/rainy/cloudy'",
      "Temperature: 'It's hot/warm/cool/cold'",
      "Use 'There is/are' for weather: 'There's a storm coming'",
      "Future weather: 'It's going to rain', 'It will be sunny tomorrow'"
    ],
    examples: [
      {
        sentence: "What a beautiful day! It's so sunny and warm.",
        explanation: "Making a positive comment about nice weather"
      },
      {
        sentence: "It's raining heavily today. Don't forget your umbrella!",
        explanation: "Describing current weather and giving advice"
      }
    ],
    exercises: [
      {
        id: "ex-weather-1",
        question: "What does 'It's pouring' mean?",
        options: [
          "Raining very heavily",
          "Very cold",
          "Extremely hot",
          "Windy"
        ],
        correctAnswer: 0,
        explanation: "'It's pouring' means it's raining very heavily."
      }
    ]
  },
  {
    id: "weather-seasons",
    title: "Seasons & Climate",
    description: "Learn how to talk about seasons, climate, and weather patterns throughout the year.",
    keyPoints: [
      "Four seasons: spring, summer, fall/autumn, winter",
      "Season characteristics: warm, hot, cool, cold, rainy, snowy",
      "Climate: tropical, temperate, dry, humid, mild",
      "Preferences: 'I love/hate...', 'My favorite season is...'"
    ],
    examples: [
      {
        sentence: "Spring is my favorite season because flowers bloom everywhere.",
        explanation: "Expressing preference with reason"
      },
      {
        sentence: "It gets very hot in summer, often over 35 degrees.",
        explanation: "Describing seasonal temperature"
      }
    ],
    exercises: [
      {
        id: "ex-seasons-1",
        question: "Complete: 'In _____ the leaves change color and fall from the trees.'",
        options: ["autumn/fall", "spring", "summer", "winter"],
        correctAnswer: 0,
        explanation: "In autumn (or fall in American English), leaves change color and fall."
      }
    ]
  },
  {
    id: "weather-activities",
    title: "Weather-Related Activities",
    description: "Learn how different weather affects activities and plans.",
    keyPoints: [
      "Sunny day activities: go to the beach, have a picnic, go hiking",
      "Rainy day activities: stay indoors, watch movies, read books",
      "Winter activities: skiing, ice skating, building snowmen",
      "Canceling plans: 'Due to the weather...', 'Because of the rain...'"
    ],
    examples: [
      {
        sentence: "Let's go to the beach - it's a perfect sunny day!",
        explanation: "Suggesting an activity based on good weather"
      },
      {
        sentence: "The picnic was canceled due to heavy rain.",
        explanation: "Explaining a cancellation because of weather"
      }
    ],
    exercises: [
      {
        id: "ex-activities-1",
        question: "Which activity is best for a rainy day?",
        options: [
          "Go swimming outdoors",
          "Have a picnic in the park",
          "Watch a movie at home",
          "Play tennis"
        ],
        correctAnswer: 2,
        explanation: "Watching a movie at home is a typical indoor activity for rainy days."
      }
    ]
  }
];

// B1 LESSONS - Intermediate Level
export const b1_travel_lessons: Lesson[] = [
  {
    id: "asking-directions",
    title: "Asking for Directions",
    description: "Learn how to ask for and understand directions when traveling or exploring a new place.",
    keyPoints: [
      "Start with 'Excuse me, how do I get to...?'",
      "Common directions: turn left/right, go straight, it's on your left/right",
      "Distance phrases: 'It's about 5 minutes away', 'It's two blocks from here'",
      "Landmarks: 'next to', 'opposite', 'between', 'near'"
    ],
    examples: [
      {
        sentence: "Excuse me, how do I get to the train station?",
        explanation: "Politely asking for directions to a location"
      },
      {
        sentence: "Go straight for two blocks, then turn left at the traffic lights.",
        explanation: "Giving clear step-by-step directions"
      }
    ],
    exercises: [
      {
        id: "ex-directions-1",
        question: "What does 'opposite' mean in giving directions?",
        options: [
          "On the other side of the street",
          "Next to something",
          "Behind something",
          "Far away"
        ],
        correctAnswer: 0,
        explanation: "'Opposite' means on the other side of the street or facing something."
      }
    ]
  },
  {
    id: "travel-hotel",
    title: "Hotel & Accommodation",
    description: "Learn essential phrases for booking hotels and communicating at accommodations.",
    keyPoints: [
      "Booking: 'I'd like to book a room', 'Do you have any vacancies?'",
      "Check-in/out: 'I have a reservation under...', 'What time is checkout?'",
      "Requests: 'Could I have an extra towel?', 'Is breakfast included?'",
      "Problems: 'The AC isn't working', 'Could you send someone to fix...?'"
    ],
    examples: [
      {
        sentence: "I'd like to book a double room for three nights, please.",
        explanation: "Making a hotel reservation"
      },
      {
        sentence: "Hello, I have a reservation under the name Johnson.",
        explanation: "Checking in at the hotel"
      }
    ],
    exercises: [
      {
        id: "ex-hotel-1",
        question: "What should you say when you arrive at a hotel with a booking?",
        options: [
          "I have a reservation under [your name]",
          "I want to book a room",
          "Give me a room please",
          "Where's my room?"
        ],
        correctAnswer: 0,
        explanation: "'I have a reservation under [your name]' is the polite standard way to check in."
      }
    ]
  },
  {
    id: "travel-airport",
    title: "At the Airport",
    description: "Master essential airport vocabulary and phrases for international travel.",
    keyPoints: [
      "Check-in: boarding pass, passport control, baggage allowance",
      "Security: take off shoes, liquids in carry-on, metal detector",
      "Boarding: gate number, boarding time, seat assignment",
      "Arrivals: baggage claim, customs, nothing to declare"
    ],
    examples: [
      {
        sentence: "May I see your boarding pass and passport, please?",
        explanation: "Security checkpoint question"
      },
      {
        sentence: "Flight BA204 to London is now boarding at Gate 12.",
        explanation: "Boarding announcement"
      }
    ],
    exercises: [
      {
        id: "ex-airport-1",
        question: "What is 'baggage claim'?",
        options: [
          "The area where you pick up your checked luggage",
          "The place to check in",
          "Where you buy tickets",
          "The security checkpoint"
        ],
        correctAnswer: 0,
        explanation: "Baggage claim is where you collect your checked luggage after arriving."
      }
    ]
  }
];

export const b1_culture_lessons: Lesson[] = [
  {
    id: "visiting-museums",
    title: "Visiting Museums & Cultural Sites",
    description: "Learn vocabulary for visiting museums, galleries, and cultural attractions.",
    keyPoints: [
      "Museum vocabulary: exhibit, gallery, curator, artifact, collection",
      "Asking questions: 'When was this made?', 'Who is the artist?'",
      "Tickets: 'Two adult tickets, please', 'Is there a student discount?'",
      "Rules: 'No photography', 'Please don't touch the exhibits'"
    ],
    examples: [
      {
        sentence: "This museum has an amazing collection of ancient artifacts.",
        explanation: "Describing a museum visit"
      },
      {
        sentence: "Are we allowed to take photos in the gallery?",
        explanation: "Asking about photography rules"
      }
    ],
    exercises: [
      {
        id: "ex-museum-1",
        question: "What is an 'artifact'?",
        options: [
          "A historical object made by humans",
          "A painting",
          "A museum guide",
          "An entrance ticket"
        ],
        correctAnswer: 0,
        explanation: "An artifact is a historical object, typically made by humans."
      }
    ]
  },
  {
    id: "festivals-celebrations",
    title: "Festivals & Celebrations",
    description: "Learn about different festivals and how to talk about celebrations.",
    keyPoints: [
      "Common festivals: Christmas, New Year, Easter, Halloween",
      "Activities: celebrate, decorate, exchange gifts, have a party",
      "Traditional foods: turkey, cake, candy, special dishes",
      "Greetings: 'Merry Christmas', 'Happy New Year', 'Happy Birthday'"
    ],
    examples: [
      {
        sentence: "We always celebrate Christmas with our extended family.",
        explanation: "Talking about family traditions"
      },
      {
        sentence: "On New Year's Eve, we watch fireworks at midnight.",
        explanation: "Describing celebration activities"
      }
    ],
    exercises: [
      {
        id: "ex-festivals-1",
        question: "What do people typically do on New Year's Eve?",
        options: [
          "Watch fireworks at midnight",
          "Go trick-or-treating",
          "Hunt for eggs",
          "Decorate a tree"
        ],
        correctAnswer: 0,
        explanation: "Watching fireworks at midnight is a common New Year's Eve tradition."
      }
    ]
  },
  {
    id: "cultural-etiquette",
    title: "Cultural Etiquette",
    description: "Learn about cultural customs and appropriate behavior in different situations.",
    keyPoints: [
      "Greetings: handshake, bow, kiss on cheek (varies by culture)",
      "Dining: table manners, tipping customs, how to use utensils",
      "Communication: personal space, eye contact, gestures",
      "Gift-giving: when appropriate, how to wrap, what to bring"
    ],
    examples: [
      {
        sentence: "In many Western countries, tipping 15-20% is customary at restaurants.",
        explanation: "Explaining a cultural custom"
      },
      {
        sentence: "It's polite to bring a small gift when invited to someone's home.",
        explanation: "Describing gift-giving etiquette"
      }
    ],
    exercises: [
      {
        id: "ex-etiquette-1",
        question: "In Western business culture, what is the standard greeting?",
        options: [
          "A firm handshake",
          "A bow",
          "A hug",
          "Waving from distance"
        ],
        correctAnswer: 0,
        explanation: "A firm handshake is the standard business greeting in Western culture."
      }
    ]
  }
];

export const b1_health_lessons: Lesson[] = [
  {
    id: "health-problems",
    title: "Common Health Problems",
    description: "Learn vocabulary for describing common illnesses and health issues.",
    keyPoints: [
      "Common illnesses: cold, flu, headache, stomachache, fever",
      "Symptoms: cough, sore throat, runny nose, pain, dizziness",
      "Describing pain: 'I have a...', 'My ... hurts', 'I feel...'",
      "Severity: mild, moderate, severe, acute, chronic"
    ],
    examples: [
      {
        sentence: "I have a terrible headache and feel dizzy.",
        explanation: "Describing symptoms"
      },
      {
        sentence: "My throat hurts and I have a fever.",
        explanation: "Explaining health problems"
      }
    ],
    exercises: [
      {
        id: "ex-health-1",
        question: "What does 'I have a sore throat' mean?",
        options: [
          "Your throat hurts or feels painful",
          "You have a headache",
          "You have a stomachache",
          "You feel tired"
        ],
        correctAnswer: 0,
        explanation: "A sore throat means your throat hurts, often when swallowing."
      }
    ]
  },
  {
    id: "doctor-visit",
    title: "Visiting the Doctor",
    description: "Learn essential phrases for medical appointments and talking to healthcare professionals.",
    keyPoints: [
      "Making appointments: 'I'd like to schedule an appointment'",
      "Describing symptoms: 'I've been feeling...', 'It started...'",
      "Understanding prescriptions: medication, dosage, side effects",
      "Follow-up: 'When should I come back?', 'What if it doesn't improve?'"
    ],
    examples: [
      {
        sentence: "I'd like to make an appointment with Dr. Smith, please.",
        explanation: "Scheduling a doctor's appointment"
      },
      {
        sentence: "I've been feeling unwell for three days.",
        explanation: "Describing how long you've been sick"
      }
    ],
    exercises: [
      {
        id: "ex-doctor-1",
        question: "Complete: 'I've been feeling ___ for two days.'",
        options: ["sick", "sickness", "sickly", "sicked"],
        correctAnswer: 0,
        explanation: "'Sick' is the correct adjective to use after 'feeling'."
      }
    ]
  },
  {
    id: "health-fitness",
    title: "Fitness & Exercise",
    description: "Learn vocabulary for talking about exercise, fitness, and staying healthy.",
    keyPoints: [
      "Types of exercise: cardio, strength training, yoga, pilates",
      "Activities: running, swimming, cycling, walking, gym workout",
      "Frequency: daily, weekly, three times a week, regularly",
      "Benefits: stay fit, lose weight, build muscle, improve health"
    ],
    examples: [
      {
        sentence: "I go to the gym three times a week for strength training.",
        explanation: "Describing your exercise routine"
      },
      {
        sentence: "Regular exercise helps you stay fit and healthy.",
        explanation: "Talking about benefits of exercise"
      }
    ],
    exercises: [
      {
        id: "ex-fitness-1",
        question: "What is 'cardio'?",
        options: [
          "Exercise that increases heart rate",
          "Lifting weights",
          "Stretching exercises",
          "A type of diet"
        ],
        correctAnswer: 0,
        explanation: "Cardio (cardiovascular) exercise increases your heart rate, like running or cycling."
      }
    ]
  }
];

// B2 LESSONS - Upper-Intermediate Level
export const b2_work_lessons: Lesson[] = [
  {
    id: "job-interview",
    title: "Job Interview Phrases",
    description: "Essential English phrases and expressions for job interviews.",
    keyPoints: [
      "Introduce yourself professionally: 'Thank you for this opportunity'",
      "Talk about strengths: 'I'm good at...', 'My strength is...'",
      "Discuss experience: 'I have X years of experience in...'",
      "Ask questions: 'What are the main responsibilities?'"
    ],
    examples: [
      {
        sentence: "Thank you for inviting me to interview. I'm excited about this opportunity.",
        explanation: "Professional opening statement showing enthusiasm"
      },
      {
        sentence: "I have five years of experience in project management.",
        explanation: "Clearly stating your relevant experience"
      }
    ],
    exercises: [
      {
        id: "ex-interview-1",
        question: "What is a good way to start a job interview?",
        options: [
          "Thank the interviewer and express enthusiasm",
          "Ask about salary immediately",
          "Complain about your previous job",
          "Talk about the weather"
        ],
        correctAnswer: 0,
        explanation: "Starting with thanks and enthusiasm shows professionalism and interest."
      }
    ]
  },
  {
    id: "email-writing",
    title: "Professional Email Writing",
    description: "Learn how to write clear, professional emails in English for business communication.",
    keyPoints: [
      "Start with appropriate greeting: 'Dear Mr./Ms. [Name]'",
      "State purpose clearly: 'I am writing to...'",
      "Be concise and use professional language",
      "End with: 'Best regards', 'Kind regards', or 'Sincerely'"
    ],
    examples: [
      {
        sentence: "Dear Ms. Johnson, I am writing to inquire about the position advertised.",
        explanation: "Formal email opening stating the purpose"
      },
      {
        sentence: "Please find the attached document for your review.",
        explanation: "Professional way to mention an email attachment"
      }
    ],
    exercises: [
      {
        id: "ex-email-1",
        question: "Which is the most professional email closing?",
        options: [
          "Best regards, [Your name]",
          "See ya!",
          "Bye",
          "Later"
        ],
        correctAnswer: 0,
        explanation: "'Best regards' is a professional and appropriate email closing."
      }
    ]
  },
  {
    id: "work-meetings",
    title: "Business Meetings",
    description: "Learn professional language for participating in meetings and discussions.",
    keyPoints: [
      "Opening: 'Let's get started', 'The purpose of this meeting is...'",
      "Contributing: 'I'd like to add...', 'From my perspective...'",
      "Agreeing/Disagreeing: 'I agree', 'I see it differently'",
      "Closing: 'To summarize...', 'Are there any questions?'"
    ],
    examples: [
      {
        sentence: "Let's get started. The purpose of today's meeting is to discuss the new project.",
        explanation: "Opening a meeting professionally"
      },
      {
        sentence: "I see your point, but I think we need to approach this differently.",
        explanation: "Politely disagreeing"
      }
    ],
    exercises: [
      {
        id: "ex-meetings-1",
        question: "What's the most professional way to disagree in a meeting?",
        options: [
          "I see your point, but I have a different perspective",
          "That's wrong",
          "I don't agree",
          "No, that won't work"
        ],
        correctAnswer: 0,
        explanation: "Acknowledging the other view before presenting yours is diplomatic."
      }
    ]
  }
];

export const b2_technology_lessons: Lesson[] = [
  {
    id: "tech-devices",
    title: "Digital Devices & Gadgets",
    description: "Learn vocabulary for modern technology and digital devices.",
    keyPoints: [
      "Common devices: smartphone, tablet, laptop, smartwatch, headphones",
      "Features: touchscreen, wireless, Bluetooth, USB port, camera",
      "Actions: charge, connect, download, upload, sync",
      "Problems: battery died, won't turn on, froze, needs updating"
    ],
    examples: [
      {
        sentence: "My smartphone battery died, so I need to charge it.",
        explanation: "Describing a common device problem"
      },
      {
        sentence: "Can you help me connect my laptop to the WiFi?",
        explanation: "Asking for tech help"
      }
    ],
    exercises: [
      {
        id: "ex-devices-1",
        question: "What does 'sync' mean with digital devices?",
        options: [
          "Make data the same across multiple devices",
          "Turn off the device",
          "Delete all data",
          "Take a photo"
        ],
        correctAnswer: 0,
        explanation: "'Sync' means to synchronize data across devices so it's the same everywhere."
      }
    ]
  },
  {
    id: "tech-social-media",
    title: "Social Media & Online Communication",
    description: "Learn vocabulary for discussing social media and online interactions.",
    keyPoints: [
      "Platforms: Facebook, Instagram, Twitter, LinkedIn, TikTok",
      "Actions: post, share, like, comment, follow, unfollow",
      "Content: photo, video, story, reel, tweet, thread",
      "Privacy: public, private, followers only, block, report"
    ],
    examples: [
      {
        sentence: "I posted a photo from my vacation on Instagram.",
        explanation: "Talking about social media activity"
      },
      {
        sentence: "Make sure to check your privacy settings on social media.",
        explanation: "Giving advice about online safety"
      }
    ],
    exercises: [
      {
        id: "ex-social-1",
        question: "What does it mean to 'follow' someone on social media?",
        options: [
          "Subscribe to see their posts in your feed",
          "Walk behind them",
          "Send them a message",
          "Delete their account"
        ],
        correctAnswer: 0,
        explanation: "'Following' someone means subscribing to see their content."
      }
    ]
  },
  {
    id: "tech-digital-skills",
    title: "Digital Skills & Troubleshooting",
    description: "Learn how to discuss digital skills and solve common tech problems.",
    keyPoints: [
      "Basic skills: typing, browsing, emailing, file management",
      "Troubleshooting: restart, update, reset, clear cache",
      "Security: password, antivirus, backup, encryption",
      "Getting help: 'How do I...?', 'It's not working', 'Error message'"
    ],
    examples: [
      {
        sentence: "Try restarting your computer - that usually fixes the problem.",
        explanation: "Giving basic troubleshooting advice"
      },
      {
        sentence: "Make sure you back up your important files regularly.",
        explanation: "Advising about data safety"
      }
    ],
    exercises: [
      {
        id: "ex-digital-1",
        question: "What should you do first when a device isn't working properly?",
        options: [
          "Restart it",
          "Throw it away",
          "Buy a new one",
          "Ignore the problem"
        ],
        correctAnswer: 0,
        explanation: "Restarting is often the first and simplest troubleshooting step."
      }
    ]
  }
];

export const b2_education_lessons: Lesson[] = [
  {
    id: "education-system",
    title: "Education Systems",
    description: "Learn vocabulary for discussing education levels and academic institutions.",
    keyPoints: [
      "Levels: preschool, elementary, middle school, high school, university",
      "Qualifications: diploma, bachelor's degree, master's, PhD",
      "Terms: semester, academic year, curriculum, major, minor",
      "People: student, teacher, professor, principal, dean"
    ],
    examples: [
      {
        sentence: "I'm studying for a bachelor's degree in Computer Science.",
        explanation: "Talking about university education"
      },
      {
        sentence: "The academic year is divided into two semesters.",
        explanation: "Explaining the school calendar"
      }
    ],
    exercises: [
      {
        id: "ex-education-1",
        question: "What comes after a bachelor's degree?",
        options: [
          "Master's degree",
          "High school diploma",
          "Elementary school",
          "Preschool"
        ],
        correctAnswer: 0,
        explanation: "A master's degree is the next level after a bachelor's degree."
      }
    ]
  },
  {
    id: "education-study-skills",
    title: "Study Skills & Techniques",
    description: "Learn vocabulary for discussing effective study methods and learning strategies.",
    keyPoints: [
      "Study methods: note-taking, highlighting, summarizing, mind mapping",
      "Resources: textbook, library, online course, tutorial, study group",
      "Time management: schedule, deadline, prioritize, procrastinate",
      "Revision: review notes, practice tests, flashcards, memorize"
    ],
    examples: [
      {
        sentence: "I use flashcards to memorize new vocabulary.",
        explanation: "Describing a study technique"
      },
      {
        sentence: "It's important to review your notes regularly, not just before exams.",
        explanation: "Giving study advice"
      }
    ],
    exercises: [
      {
        id: "ex-study-1",
        question: "What does 'procrastinate' mean?",
        options: [
          "Delay or postpone doing something",
          "Study very hard",
          "Take detailed notes",
          "Pass an exam"
        ],
        correctAnswer: 0,
        explanation: "'Procrastinate' means to delay doing something, often until later than you should."
      }
    ]
  },
  {
    id: "education-exams",
    title: "Exams & Assessment",
    description: "Learn vocabulary for discussing tests, exams, and academic evaluation.",
    keyPoints: [
      "Types: quiz, test, midterm, final exam, oral exam, practical exam",
      "Grading: pass, fail, grade, mark, score, GPA",
      "Preparation: study for, cram, revise, review material",
      "Results: ace, pass with flying colors, barely pass, fail"
    ],
    examples: [
      {
        sentence: "I need to study for my final exams next week.",
        explanation: "Talking about exam preparation"
      },
      {
        sentence: "She passed the test with flying colors!",
        explanation: "Saying someone did very well on a test"
      }
    ],
    exercises: [
      {
        id: "ex-exams-1",
        question: "What does 'ace an exam' mean?",
        options: [
          "To do extremely well and get a very high score",
          "To barely pass",
          "To fail the exam",
          "To skip the exam"
        ],
        correctAnswer: 0,
        explanation: "'Ace' means to perform excellently, usually getting an A grade or perfect score."
      }
    ]
  }
];
