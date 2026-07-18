/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Lesson, Quiz, Song, Video, Badge } from './types';

// Standard Badges
export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_welcome',
    name: 'First Steps',
    description: 'Welcome to EduInclusive! Started your learning adventure.',
    icon: '✨',
    category: 'general',
    unlocked: true,
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'badge_asl_novice',
    name: 'Hands Talking',
    description: 'Successfully learned your first Sign Language letter!',
    icon: '🤟',
    category: 'sign',
    unlocked: false,
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  {
    id: 'badge_math_wizard',
    name: 'Math Wizard',
    description: 'Scored 100% on the Primary Mathematics Quiz.',
    icon: '🔢',
    category: 'math',
    unlocked: false,
    color: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'badge_it_pioneer',
    name: 'IT Explorer',
    description: 'Completed your first IT basics interaction with Gemma AI.',
    icon: '💻',
    category: 'it',
    unlocked: false,
    color: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'badge_science_star',
    name: 'Nature Explorer',
    description: 'Learned about the Planets and Earth Science.',
    icon: '🪐',
    category: 'science',
    unlocked: false,
    color: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'badge_abc_champion',
    name: 'Grammar Guide',
    description: 'Completed the Pre-Primary English spelling challenges.',
    icon: '📚',
    category: 'english',
    unlocked: false,
    color: 'bg-rose-100 text-rose-800 border-rose-300'
  }
];

// ASL Alphabet Map
export interface ASLSign {
  letter: string;
  handshape: string;
  orientation: string;
  movement: string;
  emoji: string;
  visualPattern: string; // ASCII visual helper
}

export const ASL_ALPHABET: Record<string, ASLSign> = {
  A: {
    letter: 'A',
    handshape: 'Fist with thumb resting flat against the side of index finger.',
    orientation: 'Palm facing forward, fingers curled tight.',
    movement: 'Stationary.',
    emoji: '✊',
    visualPattern: ' [|||] \n/=====\\ \n|  o  | (Thumb on side)\n\\_____/'
  },
  B: {
    letter: 'B',
    handshape: 'Flat open hand, four fingers straight up, touching. Thumb crossed over palm.',
    orientation: 'Palm facing forward, fingers pointing up.',
    movement: 'Stationary.',
    emoji: '✋',
    visualPattern: ' |||| \n |||| \n |||| \n( o )_ (Thumb across)'
  },
  C: {
    letter: 'C',
    handshape: 'C-like curve. All fingers curved up and thumb curved down to form an open circle.',
    orientation: 'Palm facing sideways, mimicking a "C" shape.',
    movement: 'Stationary.',
    emoji: '👌',
    visualPattern: '  /--\\ \n |      \n |      \n  \\____/'
  },
  D: {
    letter: 'D',
    handshape: 'Index finger pointing straight up. Middle, ring, and pinky touch the thumb to form a circle.',
    orientation: 'Palm forward.',
    movement: 'Stationary.',
    emoji: '☝️',
    visualPattern: '   ||   \n  /oo\\  \n | o  | \n  \\___/'
  },
  E: {
    letter: 'E',
    handshape: 'Fingers curled tightly, knuckles bent. Thumb folded horizontally below the fingertips.',
    orientation: 'Palm forward.',
    movement: 'Stationary.',
    emoji: '✊',
    visualPattern: ' [====] (Fingertips resting)\n [----] (on thumb top)\n  \\____/'
  },
  F: {
    letter: 'F',
    handshape: 'Index finger and thumb touch in a circle. Middle, ring, and pinky fingers spread straight up.',
    orientation: 'Palm forward.',
    movement: 'Stationary.',
    emoji: '👌',
    visualPattern: '  |||  \n (oo)  \n  \\_/__'
  },
  G: {
    letter: 'G',
    handshape: 'Index finger and thumb extend horizontally parallel to each other (like pinching). Other fingers curled.',
    orientation: 'Palm facing towards yourself/sideways.',
    movement: 'Stationary.',
    emoji: '🤏',
    visualPattern: ' ===> (Index)\n ===> (Thumb)\n [||]'
  },
  H: {
    letter: 'H',
    handshape: 'Index and middle fingers extend horizontally side-by-side. Thumb tucked, others closed.',
    orientation: 'Palm sideways, fingers pointing to the left.',
    movement: 'Stationary.',
    emoji: '👉',
    visualPattern: ' ====> (Index)\n ====> (Middle)\n [||]'
  },
  I: {
    letter: 'I',
    handshape: 'Pinky finger pointing straight up. Others curled tightly, thumb over them.',
    orientation: 'Palm forward.',
    movement: 'Stationary.',
    emoji: '🤙',
    visualPattern: '       || (Pinky)\n  /---\\ \n | o o | \n  \\___/'
  },
  L: {
    letter: 'L',
    handshape: 'Index finger straight up, thumb straight out at a 90-degree angle forming an "L" shape.',
    orientation: 'Palm forward.',
    movement: 'Stationary.',
    emoji: '☝️',
    visualPattern: '  ||   \n  ||   \n  ||___===> (Thumb)\n  \\____/'
  },
  O: {
    letter: 'O',
    handshape: 'All fingers curved down to touch the thumb, forming a perfect "O" circle.',
    orientation: 'Palm sideways/forward.',
    movement: 'Stationary.',
    emoji: '⭕',
    visualPattern: '  /--\\ \n |    | \n |    | \n  \\__/'
  },
  V: {
    letter: 'V',
    handshape: 'Index and middle fingers extended straight up in a "V" shape (peace sign). Others curled.',
    orientation: 'Palm forward.',
    movement: 'Stationary.',
    emoji: '✌️',
    visualPattern: '  \\  / \n   \\/  \n  [||] \n  \\__/'
  },
  Y: {
    letter: 'Y',
    handshape: 'Thumb and pinky extended wide, middle three fingers curled down.',
    orientation: 'Palm forward.',
    movement: 'Stationary.',
    emoji: '🤙',
    visualPattern: ' \\     /\n  \\___/ \n  [|||] \n  \\___/'
  },
};

// Educative Songs
export const EDUCATIVE_SONGS: Song[] = [
  {
    id: 'song_abc',
    title: 'The Sign & Speak ABCs',
    description: 'Learn the letters, hear the sounds, and sign along with friendly rhythms!',
    emoji: '🎶',
    tempo: 110,
    lyrics: [
      { time: 0, text: '🎵 Let’s sing and sign, it’s learning time! 🎵' },
      { time: 4, text: 'A is for Apple! Hold your fist, twist your thumb on your cheek! 🍎' },
      { time: 8, text: 'B is for Butterfly! Open your palm, fingers high, fly away! 🦋' },
      { time: 12, text: 'C is for Cookie! Curve your hands like a giant circle! 🍪' },
      { time: 16, text: 'D is for Dolphin! Index finger up, let them dive and swim! 🐬' },
      { time: 20, text: 'We can sing! We can sign! Speaking with hands, feeling fine! 🤟' },
      { time: 24, text: 'IT is next, we can learn what a keyboard does, click and churn! 💻' }
    ],
    // Frequencies or relative notes to synthesize (e.g. C4, E4, G4...)
    notes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
  },
  {
    id: 'song_numbers',
    title: 'Count with Me (Pre-Primary Math)',
    description: 'A fun clapping song to count from 1 to 10 with bleep-bloop math sounds.',
    emoji: '🔢',
    tempo: 120,
    lyrics: [
      { time: 0, text: '🎵 One, two, clap with me! Math is fun as you will see! 🎵' },
      { time: 4, text: '1 little finger, pointing to the sky! ☝️' },
      { time: 8, text: '2 friendly eyes, looking very wide! 👀' },
      { time: 12, text: '3 happy shapes: Circle, Square, and Star! 🌟' },
      { time: 16, text: '4 wheels spinning on a speedy motor car! 🚗' },
      { time: 20, text: 'Plus (+) adds more, Minus (-) takes away! We are math stars every day! ⭐' }
    ],
    notes: [329.63, 329.63, 349.23, 392.00, 392.00, 349.23, 329.63, 293.66]
  },
  {
    id: 'song_it_basics',
    title: 'The Computer Song (Bleep-Bloop IT)',
    description: 'A cheerful chiptune song explaining hardware, perfect for students with hearing impairments.',
    emoji: '⚡',
    tempo: 100,
    lyrics: [
      { time: 0, text: '🎵 Inside the computer, what do we see? Hardware and software working in glee! 🎵' },
      { time: 4, text: 'The CPU is the brain, thinking fast, no strain! 🧠' },
      { time: 8, text: 'The Screen shows the lights, colors shining so bright! 🖥️' },
      { time: 12, text: 'The Keyboard is for typing, keys clicking and writing! ⌨️' },
      { time: 16, text: 'The Mouse goes click, click! Moving arrows real quick! 🖱️' },
      { time: 20, text: 'Now we are coding, computers loading! Bleep bloop bleep! ⚡' }
    ],
    notes: [440.00, 392.00, 440.00, 523.25, 392.00, 349.23, 293.66, 440.00]
  }
];

// Videos
export const EDUCATIVE_VIDEOS: Video[] = [
  {
    id: 'vid_math_1',
    title: 'Interactive Counting & Shapes',
    duration: '2:15',
    thumbnail: '🔢',
    description: 'Learn shapes and basic counting with cheerful cartoon animations.',
    subject: 'math',
    videoUrl: 'https://www.youtube.com/embed/V_xozwy4R_4' // Standard fun educational youtube link
  },
  {
    id: 'vid_science_1',
    title: 'Meet the Solar System Planets!',
    duration: '3:40',
    thumbnail: '🪐',
    description: 'A colorful tour of the planets in our solar system for primary children.',
    subject: 'science',
    videoUrl: 'https://www.youtube.com/embed/mQrlgH97v94'
  },
  {
    id: 'vid_english_1',
    title: 'Vowels & Easy Phonics',
    duration: '1:50',
    thumbnail: '🔤',
    description: 'Catchy cartoon phonics sounds to help with early reading and writing.',
    subject: 'english',
    videoUrl: 'https://www.youtube.com/embed/fe9M7uK-pEY'
  },
  {
    id: 'vid_sign_1',
    title: 'Intro to American Sign Language',
    duration: '4:10',
    thumbnail: '🤟',
    description: 'Learn simple signs like Hello, Please, Thank You, and the ASL fingerspelling basics.',
    subject: 'sign',
    videoUrl: 'https://www.youtube.com/embed/0FcwzMq4iWg'
  },
  {
    id: 'vid_it_1',
    title: 'What is inside a Computer?',
    duration: '3:05',
    thumbnail: '🖥️',
    description: 'Simple explanation of CPU, RAM, and hard drives using friendly graphics.',
    subject: 'it',
    videoUrl: 'https://www.youtube.com/embed/OAw_PZ0S5mU'
  }
];

// Quizzes
export const SUBJECT_QUIZZES: Quiz[] = [
  {
    id: 'quiz_pre_math',
    title: 'Pre-Primary Fun Shapes & Counting',
    category: 'math',
    points: 15,
    questions: [
      {
        id: 'q_m1',
        question: 'How many sides does a triangle have?',
        options: ['2 sides', '3 sides', '4 sides', 'No sides'],
        correctAnswer: 1,
        explanation: 'A triangle always has 3 sides and 3 corners!'
      },
      {
        id: 'q_m2',
        question: 'If you have 3 apples and you get 2 more, how many apples do you have now?',
        options: ['4 apples', '5 apples', '6 apples', '3 apples'],
        correctAnswer: 1,
        explanation: '3 + 2 is equal to 5 apples in total!'
      },
      {
        id: 'q_m3',
        question: 'Which of these shapes is perfectly round like the sun?',
        options: ['Square', 'Rectangle', 'Circle', 'Triangle'],
        correctAnswer: 2,
        explanation: 'A Circle is round and has no straight sides!'
      }
    ]
  },
  {
    id: 'quiz_primary_science',
    title: 'Solar System & Earth Science',
    category: 'science',
    points: 20,
    questions: [
      {
        id: 'q_s1',
        question: 'Which planet is known as the "Blue Planet" because of all its water?',
        options: ['Mars', 'Earth', 'Jupiter', 'Venus'],
        correctAnswer: 1,
        explanation: 'Earth looks blue from space because water covers over 70% of its surface!'
      },
      {
        id: 'q_s2',
        question: 'What is the massive hot star at the center of our solar system?',
        options: ['The Moon', 'The Sun', 'Mars', 'Pluto'],
        correctAnswer: 1,
        explanation: 'The Sun is the giant star that provides warmth and light to all planets!'
      },
      {
        id: 'q_s3',
        question: 'What happens to water when it gets heated by the sun and turns into vapor?',
        options: ['Condensation', 'Evaporation', 'Precipitation', 'Freezing'],
        correctAnswer: 1,
        explanation: 'Heating water makes it evaporate, turning liquid water into light water vapor gas!'
      }
    ]
  },
  {
    id: 'quiz_sign_language',
    title: 'Sign Language Basics & Inclusivity',
    category: 'sign',
    points: 25,
    questions: [
      {
        id: 'q_sl1',
        question: 'What does the universal "🤟" hand sign stand for?',
        options: ['"I Love You"', '"No Way"', '"Hello"', '"Go Away"'],
        correctAnswer: 0,
        explanation: 'The 🤟 combines the ASL fingerspelling for I, L, and Y to mean "I Love You"!'
      },
      {
        id: 'q_sl2',
        question: 'How do you form the ASL letter "C"?',
        options: [
          'Pointing your finger up',
          'Curving fingers and thumb to form an open circle shape',
          'Making a closed fist',
          'Stretching your pinky and thumb out'
        ],
        correctAnswer: 1,
        explanation: 'Curving all fingers and thumb to make a cup/circle forms the letter C!'
      }
    ]
  },
  {
    id: 'quiz_it_basics',
    title: 'Computers & Simple IT',
    category: 'it',
    points: 20,
    questions: [
      {
        id: 'q_it1',
        question: 'What is considered the "Brain" of the computer that does all the heavy thinking?',
        options: ['The Monitor/Screen', 'The CPU (Central Processing Unit)', 'The Keyboard', 'The Power Plug'],
        correctAnswer: 1,
        explanation: 'The CPU processes commands and performs all calculation thinking inside the computer!'
      },
      {
        id: 'q_it2',
        question: 'Which of the following is an "input device" that you use to write words on a screen?',
        options: ['Speaker', 'Printer', 'Keyboard', 'Monitor'],
        correctAnswer: 2,
        explanation: 'The Keyboard is an input device used to type text and key in instructions!'
      },
      {
        id: 'q_it3',
        question: 'Which of these is a great practice to stay safe when exploring the internet?',
        options: [
          'Sharing your password with strangers',
          'Asking a parent/teacher before downloading files',
          'Clicking on bright flashing pop-ups',
          'Entering your real name everywhere'
        ],
        correctAnswer: 1,
        explanation: 'Always get helper guidance from a trusted adult before downloading programs or sharing info!'
      }
    ]
  }
];

// Subject Materials/Lessons
export const EDUCATIVE_LESSONS: Lesson[] = [
  {
    id: 'les_math_counting',
    title: 'Let’s Count from 1 to 10!',
    category: 'math',
    content: 'Counting is the base of all mathematics. We can use our fingers to represent numbers, or count items like apples, stars, or books. Let’s look at the numbers grid to visualize how numbers grow!',
    signHelper: 'Sign for COUNT: Double-tap the extended tips of your right pointer and middle fingers onto your left open flat palm moving forward.',
    signSteps: [
      'Hold left hand flat, palm facing up.',
      'Hold right hand with index and middle fingers extended (number 2 shape).',
      'Tap the right fingers twice on the left palm, sliding them slightly forward.'
    ],
    illustrationType: 'math_grid'
  },
  {
    id: 'les_science_solar',
    title: 'Our Beautiful Solar System',
    category: 'science',
    content: 'Our solar system is composed of the Sun, our massive central star, and eight planets orbiting it: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the third planet and the only one known to sustain life.',
    signHelper: 'Sign for SUN: Form a circular "O" shape with your hand near your ear, then push it upward and outward while opening fingers like shining sun rays.',
    signSteps: [
      'Form an "O" shape with your dominant hand near your temple.',
      'Extend your hand upward and outward toward the sky.',
      'Splay all fingers wide, representing bright shining light rays.'
    ],
    illustrationType: 'solar_system'
  },
  {
    id: 'les_english_spelling',
    title: 'Fun Grammar: Building Sentences',
    category: 'english',
    content: 'A complete sentence is like a small story! It always needs a Noun (the person, place, or thing) and a Verb (the action word). For example: "The butterfly (noun) flies (verb) in the garden."',
    signHelper: 'Sign for READ: Hold your non-dominant hand flat like a book page. Form a "V" shape with your dominant hand (representing eyes) and sweep it down the page.',
    signSteps: [
      'Hold your left hand flat, palm facing right (like a book page).',
      'Extend right index and middle fingers into a "V" shape pointing at the left hand.',
      'Scan the "V" fingers from the top of the left palm to the bottom twice.'
    ],
    illustrationType: 'grammar_tree'
  },
  {
    id: 'les_it_hardware',
    title: 'What makes a Computer Work?',
    category: 'it',
    content: 'A computer is divided into Hardware (things you can physically touch, like the screen and keyboard) and Software (the digital programs and games inside the system). Understanding hardware helps us use technology with confidence!',
    signHelper: 'Sign for COMPUTER: Make a curved "C" handshape and tap it twice along the top of your opposite forearm (pointing towards the elbow).',
    signSteps: [
      'Hold your left arm horizontally across your chest.',
      'Form a "C" shape with your right hand.',
      'Tap the right "C" hand twice along the top of your left forearm, moving upward from wrist to elbow.'
    ],
    illustrationType: 'computer_hardware'
  }
];
