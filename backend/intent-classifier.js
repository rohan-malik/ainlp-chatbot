import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load knowledge base
const knowledgeBase = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'knowledge-base.json'), 'utf8')
);

// Intent classification system
const INTENTS = {
  GREETING: 'greeting',
  FAREWELL: 'farewell',
  GRATITUDE: 'gratitude',
  AFFIRMATION: 'affirmation',
  NEGATION: 'negation',
  HELP_REQUEST: 'help_request',
  CAPABILITY_INQUIRY: 'capability_inquiry',
  IIM_QUERY: 'iim_query',
  SMALL_TALK: 'small_talk',
  UNCLEAR: 'unclear',
};

// Comprehensive intent patterns
const intentPatterns = {
  [INTENTS.GREETING]: {
    keywords: [
      'hi', 'hello', 'hey', 'hola', 'bonjour', 'namaste', 'namaskar', 'vanakkam', 'namaskara',
      'buenos dias', 'buenos noches', 'good morning', 'good afternoon', 'good evening',
      'how are you', 'whats up', 'what\'s up', 'how you doing', 'how\'re you', 'howdy',
      'नमस्ते', 'नमस्कार', 'हेलो', 'हाय', 'सुप्रभात', 'शुभ संध्या',
      'வணக்கம்', 'ஹலோ', 'ஹாய்',
      'నమస్కారం', 'హలో', 'హాయ్',
      'hallo', 'guten tag', 'guten morgen'
    ],
    minConfidence: 0.9,
  },
  [INTENTS.FAREWELL]: {
    keywords: [
      'bye', 'goodbye', 'see you', 'take care', 'cheers', 'cya', 'farewell', 'until later',
      'adios', 'au revoir', 'auf wiedersehen',
      'अलविदा', 'फिर मिलेंगे', 'बाय',
      'பிரியாவிடை', 'வந்தமை', 'பிறகு பார்ப்போம்',
      'విదాయ', 'చాలు', 'కుదిరిన'
    ],
    minConfidence: 0.9,
  },
  [INTENTS.GRATITUDE]: {
    keywords: [
      'thanks', 'thank you', 'thankyou', 'thanks a lot', 'thank you so much', 'appreciate',
      'gracias', 'merci', 'danke',
      'धन्यवाद', 'धन्य', 'सुक्रिया',
      'நன்றி', 'நன்றிகள்',
      'ధన్యవాదాలు', 'కృతజ్ఞతలు'
    ],
    minConfidence: 0.9,
  },
  [INTENTS.AFFIRMATION]: {
    keywords: [
      'ok', 'okay', 'sure', 'yes', 'yep', 'yeah', 'alright', 'got it', 'understood',
      'si', 'oui', 'ja',
      'हाँ', 'जी', 'ठीक है',
      'ஆம்', 'சரி',
      'అవును', 'సరిగ్గా'
    ],
    minConfidence: 0.9,
  },
  [INTENTS.NEGATION]: {
    keywords: [
      'no', 'nope', 'nah', 'not really', 'don\'t think so',
      'no', 'non', 'nein',
      'नहीं', 'ना', 'नहीं है',
      'இல்லை', 'வேண்டாம்',
      'కాదు', 'లేదు'
    ],
    minConfidence: 0.9,
  },
  [INTENTS.HELP_REQUEST]: {
    keywords: [
      'help', 'can you help', 'can you assist', 'i need help', 'assist me', 'support',
      'ayuda', 'aide', 'hilfe',
      'मदद', 'सहायता', 'मदद करो',
      'உதவி', 'உதவ வேண்டும்',
      'సహాయం', 'సాయం'
    ],
    minConfidence: 0.8,
  },
  [INTENTS.CAPABILITY_INQUIRY]: {
    keywords: [
      'what can you', 'what do you', 'what are you', 'what\'s your', 'your capabilities',
      'can you do', 'what help', 'what information', 'what topics', 'what questions',
      'what all', 'what can i ask', 'what should i ask', 'how can you help',
      'what are you capable of', 'what do you know about', 'what can i talk about',
      'what can i ask you', 'what should i ask you', 'what topics can you help'
    ],
    minConfidence: 0.6,
  },
  [INTENTS.IIM_QUERY]: {
    keywords: [
      'iim', 'indore', 'mba', 'admission', 'placement', 'campus', 'program',
      'pgp', 'pgpx', 'ipm', 'epgp', 'dpm', 'edpm', 'pgpmx', 'faculty', 'student',
      'scholarship', 'fee', 'hostel', 'cat', 'ipmat', 'entrance', 'recruit', 'salary',
      'course', 'class', 'exam', 'application', 'interview', 'result', 'club', 'event',
      'facility', 'research', 'academic', 'management', 'business', 'education',
      'director', 'board', 'governance', 'collaboration', 'international', 'conference',
      'specialization', 'internship', 'recruiter', 'sector', 'infrastructure', 'diversity',
      'better', 'best', 'compare', 'difference', 'vs', 'versus', 'prefer', 'suitable'
    ],
    minConfidence: 0.7,
  },
  [INTENTS.SMALL_TALK]: {
    keywords: [
      'how are you', 'how\'s it going', 'what\'s up', 'how\'re you doing',
      'nice to meet', 'glad to meet', 'pleasure to meet',
      'how\'s your day', 'how\'s everything', 'how\'s life',
      'tell me about yourself', 'who are you', 'what are you'
    ],
    minConfidence: 0.75,
  },
};

/**
 * Classify user intent
 * @param {string} query - User query
 * @param {array} conversationHistory - Previous messages
 * @returns {object} - { intent, confidence, context }
 */
function classifyIntent(query, conversationHistory = []) {
  const queryLower = query.toLowerCase().trim();
  
  // Score each intent
  const scores = {};
  
  for (const [intent, pattern] of Object.entries(intentPatterns)) {
    let score = 0;
    let matchCount = 0;
    
    // Check keyword matches
    for (const keyword of pattern.keywords) {
      if (queryLower.includes(keyword)) {
        matchCount++;
        // Each match contributes equally
        score += 1;
      }
    }
    
    // Normalize score based on number of keywords
    if (matchCount > 0) {
      // Higher score for more matches, capped at 1
      score = Math.min(matchCount / Math.sqrt(pattern.keywords.length), 1);
    }
    
    scores[intent] = {
      score,
      matchCount,
      minConfidence: pattern.minConfidence,
      passes: score >= pattern.minConfidence,
    };
  }
  
  // Find best matching intent (with priority for more specific intents)
  let bestIntent = INTENTS.UNCLEAR;
  let bestScore = 0;
  
  // Priority order (more specific intents first)
  const intentPriority = [
    INTENTS.CAPABILITY_INQUIRY,
    INTENTS.GREETING,
    INTENTS.FAREWELL,
    INTENTS.GRATITUDE,
    INTENTS.AFFIRMATION,
    INTENTS.NEGATION,
    INTENTS.HELP_REQUEST,
    INTENTS.SMALL_TALK,
    INTENTS.IIM_QUERY,
  ];
  
  for (const intent of intentPriority) {
    const data = scores[intent];
    if (data.passes && data.score > bestScore) {
      bestIntent = intent;
      bestScore = data.score;
    }
  }
  
  // If no intent matches, check conversation context
  if (bestIntent === INTENTS.UNCLEAR && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-4);
    const hasIIMContext = recentMessages.some(msg => {
      if (msg.content) {
        return intentPatterns[INTENTS.IIM_QUERY].keywords.some(
          keyword => msg.content.toLowerCase().includes(keyword)
        );
      }
      return false;
    });
    
    if (hasIIMContext) {
      bestIntent = INTENTS.IIM_QUERY;
      bestScore = 0.6;
    }
  }
  
  return {
    intent: bestIntent,
    confidence: bestScore,
    scores,
  };
}

/**
 * Get response for intent
 * @param {string} intent - Intent type
 * @param {string} language - Language code
 * @param {string} style - Style (professional, casual, minimalist)
 * @returns {string|null} - Response or null if should use RAG
 */
function getIntentResponse(intent, language = 'en', style = 'professional') {
  const responses = {
    [INTENTS.GREETING]: {
      en: {
        professional: "Hello! How can I assist you today?",
        casual: "Hey there! 👋 How can I help you?",
        minimalist: "Hello. How can I help?",
      },
      hi: {
        professional: "नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?",
        casual: "हेलो! 👋 मैं आपकी कैसे मदद कर सकता हूँ?",
        minimalist: "नमस्ते। कैसे मदद कर सकता हूँ?",
      },
      ta: {
        professional: "வணக்கம்! நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        casual: "ஹாய்! 👋 நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        minimalist: "வணக்கம்। உதவ முடியுமா?",
      },
      te: {
        professional: "నమస్కారం! నేను మీకు ఎలా సహాయం చేయగలను?",
        casual: "హాయ్! 👋 నేను మీకు ఎలా సహాయం చేయగలను?",
        minimalist: "నమస్కారం. సహాయం చేయగలను?",
      },
      es: {
        professional: "¡Hola! ¿Cómo puedo ayudarte?",
        casual: "¡Hola! 👋 ¿Cómo puedo ayudarte?",
        minimalist: "Hola. ¿Cómo puedo ayudar?",
      },
      fr: {
        professional: "Bonjour! Comment puis-je vous aider?",
        casual: "Bonjour! 👋 Comment puis-je vous aider?",
        minimalist: "Bonjour. Comment puis-je aider?",
      },
    },
    [INTENTS.FAREWELL]: {
      en: {
        professional: "Goodbye! Feel free to reach out if you have more questions.",
        casual: "Bye! 👋 Feel free to come back anytime!",
        minimalist: "Goodbye. Come back anytime.",
      },
      hi: {
        professional: "अलविदा! यदि आपके पास और सवाल हों तो बेझिझक पूछें।",
        casual: "बाय! 👋 कभी भी वापस आ सकते हो!",
        minimalist: "अलविदा। कभी भी आ सकते हो।",
      },
      ta: {
        professional: "பிரியாவிடை! மேலும் கேள்விகள் இருந்தால் கேளுங்கள்.",
        casual: "பிரியாவிடை! 👋 எப்போது வேண்டுமானாலும் திரும்பி வாருங்கள்!",
        minimalist: "பிரியாவிடை. எப்போது வேண்டுமானாலும் வாருங்கள்.",
      },
      te: {
        professional: "విదాయ! మరిన్ని ప్రశ్నలు ఉంటే అడగండి.",
        casual: "విదాయ! 👋 ఎప్పుడైనా తిరిగి రండి!",
        minimalist: "విదాయ. ఎప్పుడైనా రండి.",
      },
      es: {
        professional: "¡Adiós! Siéntete libre de hacer más preguntas.",
        casual: "¡Adiós! 👋 ¡Vuelve cuando quieras!",
        minimalist: "Adiós. Vuelve cuando quieras.",
      },
      fr: {
        professional: "Au revoir! N'hésitez pas à poser d'autres questions.",
        casual: "Au revoir! 👋 Reviens quand tu veux!",
        minimalist: "Au revoir. Reviens quand tu veux.",
      },
    },
    [INTENTS.GRATITUDE]: {
      en: {
        professional: "You're welcome! Is there anything else I can help you with?",
        casual: "You're welcome! 😊 Anything else I can help with?",
        minimalist: "Welcome. Anything else?",
      },
      hi: {
        professional: "आपका स्वागत है! क्या मैं और कुछ मदद कर सकता हूँ?",
        casual: "आपका स्वागत है! 😊 और कुछ मदद कर सकता हूँ?",
        minimalist: "स्वागत है। और कुछ?",
      },
      ta: {
        professional: "நல்லது! வேறு ஏதாவது உதவ முடியுமா?",
        casual: "நல்லது! 😊 வேறு ஏதாவது உதவ முடியுமா?",
        minimalist: "நல்லது। வேறு?",
      },
      te: {
        professional: "సుస్వాగతం! మరేమైనా సహాయం చేయగలను?",
        casual: "సుస్వాగతం! 😊 మరేమైనా సహాయం చేయగలను?",
        minimalist: "సుస్వాగతం. మరేమైనా?",
      },
      es: {
        professional: "¡De nada! ¿Hay algo más en lo que pueda ayudarte?",
        casual: "¡De nada! 😊 ¿Hay algo más?",
        minimalist: "De nada. ¿Algo más?",
      },
      fr: {
        professional: "De rien! Y a-t-il autre chose que je puisse faire?",
        casual: "De rien! 😊 Y a-t-il autre chose?",
        minimalist: "De rien. Autre chose?",
      },
    },
    [INTENTS.CAPABILITY_INQUIRY]: {
      en: {
        professional: "I'm your IIM Indore Assistant. I can help you with:\n• Admissions & eligibility\n• Programs (PGP, IPM, EPGP, etc.)\n• Placements & salaries\n• Campus facilities & student life\n• Faculty & research\n• Scholarships & fees\n• Any other questions about IIM Indore\n\nWhat would you like to know?",
        casual: "I'm your IIM Indore Assistant! 🎓 I can help with:\n• 📚 Programs & admissions\n• 💼 Placements & careers\n• 🏫 Campus & facilities\n• 👥 Faculty & research\n• 💰 Fees & scholarships\n• 🎉 Student life & events\n\nWhat interests you?",
        minimalist: "I help with IIM Indore info:\n- Programs (PGP, IPM, EPGP)\n- Admissions & eligibility\n- Placements & salaries\n- Campus & facilities\n- Faculty & research\n- Fees & scholarships\n\nWhat do you want to know?",
      },
      hi: {
        professional: "मैं आपका IIM इंदौर सहायक हूँ। मैं आपको मदद कर सकता हूँ:\n• प्रवेश और योग्यता\n• कार्यक्रम (PGP, IPM, EPGP, आदि)\n• प्लेसमेंट और वेतन\n• कैंपस सुविधाएं और छात्र जीवन\n• संकाय और अनुसंधान\n• छात्रवृत्ति और शुल्क\n• IIM इंदौर के बारे में कोई भी सवाल\n\nआप क्या जानना चाहते हैं?",
        casual: "मैं आपका IIM इंदौर सहायक हूँ! 🎓 मैं मदद कर सकता हूँ:\n• 📚 कार्यक्रम और प्रवेश\n• 💼 प्लेसमेंट और करियर\n• 🏫 कैंपस और सुविधाएं\n• 👥 संकाय और अनुसंधान\n• 💰 शुल्क और छात्रवृत्ति\n• 🎉 छात्र जीवन और कार्यक्रम\n\nआपको क्या दिलचस्पी है?",
        minimalist: "मैं IIM इंदौर की जानकारी देता हूँ:\n- कार्यक्रम (PGP, IPM, EPGP)\n- प्रवेश और योग्यता\n- प्लेसमेंट और वेतन\n- कैंपस और सुविधाएं\n- संकाय और अनुसंधान\n- शुल्क और छात्रवृत्ति\n\nआप क्या जानना चाहते हैं?",
      },
      ta: {
        professional: "நான் உங்கள் IIM இந்தூர் உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n• சேர்க்கை மற்றும் தகுதி\n• நிரல்கள் (PGP, IPM, EPGP, முதலியன)\n• வேலை வாய்ப்பு மற்றும் சம்பளம்\n• வளாக வசதிகள் மற்றும் மாணவர் வாழ்க்கை\n• ஆசிரியர் மற்றும் ஆராய்ச்சி\n• உதவித்தொகை மற்றும் கட்டணம்\n• IIM இந்தூர் பற்றிய ஏதேனும் கேள்வி\n\nநீங்கள் என்ன தெரிய விரும்புகிறீர்கள்?",
        casual: "நான் உங்கள் IIM இந்தூர் உதவியாளர்! 🎓 நான் உதவ முடியும்:\n• 📚 நிரல்கள் மற்றும் சேர்க்கை\n• 💼 வேலை வாய்ப்பு மற்றும் வாழ்க்கை\n• 🏫 வளாகம் மற்றும் வசதிகள்\n• 👥 ஆசிரியர் மற்றும் ஆராய்ச்சி\n• 💰 கட்டணம் மற்றும் உதவித்தொகை\n• 🎉 மாணவர் வாழ்க்கை மற்றும் நிகழ்வுகள்\n\nநீங்கள் என்ன விரும்புகிறீர்கள்?",
        minimalist: "நான் IIM இந்தூர் தகவல் தருகிறேன்:\n- நிரல்கள் (PGP, IPM, EPGP)\n- சேர்க்கை மற்றும் தகுதி\n- வேலை வாய்ப்பு மற்றும் சம்பளம்\n- வளாகம் மற்றும் வசதிகள்\n- ஆசிரியர் மற்றும் ஆராய்ச்சி\n- கட்டணம் மற்றும் உதவித்தொகை\n\nநீங்கள் என்ன தெரிய விரும்புகிறீர்கள்?",
      },
      te: {
        professional: "నేను మీ IIM ఇందూర్ సహాయకుడిని. నేను మీకు సహాయం చేయగలను:\n• ప్రవేశం మరియు అర్హత\n• కార్యక్రమాలు (PGP, IPM, EPGP, మొదలైనవి)\n• ఉద్యోగ సంస్థాపన మరియు జీతం\n• ఆఫీస్ సదుపాయాలు మరియు విద్యార్థి జీవితం\n• సంకాయ మరియు పరిశోధన\n• ఉపకారాలు మరియు ఫీజు\n• IIM ఇందూర్ గురించిన ఏదైనా ప్రశ్న\n\nమీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        casual: "నేను మీ IIM ఇందూర్ సహాయకుడిని! 🎓 నేను సహాయం చేయగలను:\n• 📚 కార్యక్రమాలు మరియు ప్రవేశం\n• 💼 ఉద్యోగ సంస్థాపన మరియు కెరీర్\n• 🏫 ఆఫీస్ మరియు సదుపాయాలు\n• 👥 సంకాయ మరియు పరిశోధన\n• 💰 ఫీజు మరియు ఉపకారాలు\n• 🎉 విద్యార్థి జీవితం మరియు ఈవెంట్‌లు\n\nమీరు ఏమి ఆసక్తి కలిగి ఉన్నారు?",
        minimalist: "నేను IIM ఇందూర్ సమాచారం ఇస్తాను:\n- కార్యక్రమాలు (PGP, IPM, EPGP)\n- ప్రవేశం మరియు అర్హత\n- ఉద్యోగ సంస్థాపన మరియు జీతం\n- ఆఫీస్ మరియు సదుపాయాలు\n- సంకాయ మరియు పరిశోధన\n- ఫీజు మరియు ఉపకారాలు\n\nమీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      },
      es: {
        professional: "Soy tu Asistente de IIM Indore. Puedo ayudarte con:\n• Admisiones y elegibilidad\n• Programas (PGP, IPM, EPGP, etc.)\n• Colocaciones y salarios\n• Instalaciones del campus y vida estudiantil\n• Facultad e investigación\n• Becas y aranceles\n• Cualquier pregunta sobre IIM Indore\n\n¿Qué te gustaría saber?",
        casual: "¡Soy tu Asistente de IIM Indore! 🎓 Puedo ayudarte con:\n• 📚 Programas y admisiones\n• 💼 Colocaciones y carreras\n• 🏫 Campus e instalaciones\n• 👥 Facultad e investigación\n• 💰 Aranceles y becas\n• 🎉 Vida estudiantil y eventos\n\n¿Qué te interesa?",
        minimalist: "Doy información de IIM Indore:\n- Programas (PGP, IPM, EPGP)\n- Admisiones y elegibilidad\n- Colocaciones y salarios\n- Campus e instalaciones\n- Facultad e investigación\n- Aranceles y becas\n\n¿Qué quieres saber?",
      },
      fr: {
        professional: "Je suis votre Assistant IIM Indore. Je peux vous aider avec:\n• Admissions et éligibilité\n• Programmes (PGP, IPM, EPGP, etc.)\n• Placements et salaires\n• Installations du campus et vie étudiante\n• Faculté et recherche\n• Bourses et frais\n• Toute question sur IIM Indore\n\nQue voulez-vous savoir?",
        casual: "Je suis votre Assistant IIM Indore! 🎓 Je peux vous aider avec:\n• 📚 Programmes et admissions\n• 💼 Placements et carrières\n• 🏫 Campus et installations\n• 👥 Faculté et recherche\n• 💰 Frais et bourses\n• 🎉 Vie étudiante et événements\n\nQu'est-ce qui vous intéresse?",
        minimalist: "Je donne des infos sur IIM Indore:\n- Programmes (PGP, IPM, EPGP)\n- Admissions et éligibilité\n- Placements et salaires\n- Campus et installations\n- Faculté et recherche\n- Frais et bourses\n\nQue voulez-vous savoir?",
      },
    },
    [INTENTS.HELP_REQUEST]: {
      en: {
        professional: "Of course! I'm here to help. What would you like to know about IIM Indore?",
        casual: "Absolutely! 😊 I'm here to help. What do you want to know?",
        minimalist: "Sure. What do you want to know?",
      },
      hi: {
        professional: "बिल्कुल! मैं यहाँ मदद करने के लिए हूँ। आप IIM इंदौर के बारे में क्या जानना चाहते हैं?",
        casual: "बिल्कुल! 😊 मैं यहाँ मदद करने के लिए हूँ। आप क्या जानना चाहते हैं?",
        minimalist: "ठीक है। आप क्या जानना चाहते हैं?",
      },
      ta: {
        professional: "நிச்சயமாக! நான் உதவ இருக்கிறேன். IIM இந்தூர் பற்றி நீங்கள் என்ன தெரிய விரும்புகிறீர்கள்?",
        casual: "நிச்சயமாக! 😊 நான் உதவ இருக்கிறேன். நீங்கள் என்ன தெரிய விரும்புகிறீர்கள்?",
        minimalist: "சரி. நீங்கள் என்ன தெரிய விரும்புகிறீர்கள்?",
      },
      te: {
        professional: "నిశ్చితంగా! నేను సహాయం చేయడానికి ఉన్నాను. IIM ఇందూర్ గురించి మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        casual: "నిశ్చితంగా! 😊 నేను సహాయం చేయడానికి ఉన్నాను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
        minimalist: "సరి. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?",
      },
      es: {
        professional: "¡Por supuesto! Estoy aquí para ayudarte. ¿Qué quieres saber sobre IIM Indore?",
        casual: "¡Claro! 😊 Estoy aquí para ayudarte. ¿Qué quieres saber?",
        minimalist: "Claro. ¿Qué quieres saber?",
      },
      fr: {
        professional: "Bien sûr! Je suis là pour vous aider. Que voulez-vous savoir sur IIM Indore?",
        casual: "Bien sûr! 😊 Je suis là pour vous aider. Que voulez-vous savoir?",
        minimalist: "Bien sûr. Que voulez-vous savoir?",
      },
    },
    [INTENTS.AFFIRMATION]: {
      en: {
        professional: "Great! How can I assist you?",
        casual: "Awesome! 😊 What can I help with?",
        minimalist: "Good. How can I help?",
      },
      hi: {
        professional: "बहुत अच्छा! मैं आपकी कैसे सहायता कर सकता हूँ?",
        casual: "शानदार! 😊 मैं क्या मदद कर सकता हूँ?",
        minimalist: "अच्छा। मैं कैसे मदद कर सकता हूँ?",
      },
      ta: {
        professional: "சிறப்பு! நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
        casual: "அருமை! 😊 நான் என்ன உதவ முடியும்?",
        minimalist: "நல்லது। நான் எவ்வாறு உதவ முடியும்?",
      },
      te: {
        professional: "గ్రేట్! నేను మీకు ఎలా సహాయం చేయగలను?",
        casual: "అద్భుతం! 😊 నేను ఏమి సహాయం చేయగలను?",
        minimalist: "బాగా. నేను ఎలా సహాయం చేయగలను?",
      },
      es: {
        professional: "¡Excelente! ¿Cómo puedo ayudarte?",
        casual: "¡Genial! 😊 ¿Qué puedo hacer?",
        minimalist: "Bien. ¿Cómo puedo ayudar?",
      },
      fr: {
        professional: "Excellent! Comment puis-je vous aider?",
        casual: "Super! 😊 Que puis-je faire?",
        minimalist: "Bien. Comment puis-je aider?",
      },
    },
    [INTENTS.NEGATION]: {
      en: {
        professional: "I understand. Is there anything else I can help you with?",
        casual: "No problem! 😊 Anything else I can help with?",
        minimalist: "Okay. Anything else?",
      },
      hi: {
        professional: "मैं समझता हूँ। क्या मैं और कुछ मदद कर सकता हूँ?",
        casual: "कोई समस्या नहीं! 😊 और कुछ मदद कर सकता हूँ?",
        minimalist: "ठीक है। और कुछ?",
      },
      ta: {
        professional: "நான் புரிந்துகொள்கிறேன். வேறு ஏதாவது உதவ முடியுமா?",
        casual: "பிரச்சனை இல்லை! 😊 வேறு ஏதாவது உதவ முடியுமா?",
        minimalist: "சரி. வேறு?",
      },
      te: {
        professional: "నేను అర్థం చేసుకున్నాను. మరేమైనా సహాయం చేయగలను?",
        casual: "సమస్య లేదు! 😊 మరేమైనా సహాయం చేయగలను?",
        minimalist: "సరి. మరేమైనా?",
      },
      es: {
        professional: "Entiendo. ¿Hay algo más en lo que pueda ayudarte?",
        casual: "¡Sin problema! 😊 ¿Hay algo más?",
        minimalist: "Okay. ¿Algo más?",
      },
      fr: {
        professional: "Je comprends. Y a-t-il autre chose que je puisse faire?",
        casual: "Pas de problème! 😊 Y a-t-il autre chose?",
        minimalist: "D'accord. Autre chose?",
      },
    },
  };
  
  // Get language responses
  const langResponses = responses[intent];
  if (!langResponses) return null;
  
  const langData = langResponses[language];
  if (!langData) return null;
  
  return langData[style] || null;
}

export { classifyIntent, getIntentResponse, INTENTS };
