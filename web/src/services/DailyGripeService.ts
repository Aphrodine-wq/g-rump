/**
 * Daily Gripe Service
 * Pre-written array of 100 gripes, indexed by day number
 * Zero API cost - pure client-side
 */

const DAILY_GRIPES = [
  "Today's gripe: Why do people still say 'literally'? It's been 15 years. Move on.",
  "Today's gripe: Coffee shops that charge extra for oat milk. It's 2024. Oat milk should be free.",
  "Today's gripe: People who type 'u' instead of 'you'. We have autocorrect. Use it.",
  "Today's gripe: Apps that ask for a review after you've used them for 2 seconds. Give me a break.",
  "Today's gripe: Weather apps that are wrong 50% of the time. What's the point?",
  "Today's gripe: People who leave their shopping carts in parking spaces. Just walk 10 feet.",
  "Today's gripe: 'Reply all' to emails that only needed a reply. You're not that important.",
  "Today's gripe: Self-checkout machines that yell at you. I'm trying my best, okay?",
  "Today's gripe: Password requirements that need 47 special characters. I'll forget it anyway.",
  "Today's gripe: People who stand in the middle of escalators. Move to the right. It's not hard.",
  "Today's gripe: 'Unsubscribe' buttons that take 5 clicks. Just let me leave.",
  "Today's gripe: Restaurants that put ice in water without asking. I wanted room temperature.",
  "Today's gripe: Apps that update and remove features I actually used. Thanks for nothing.",
  "Today's gripe: People who talk on speakerphone in public. Nobody wants to hear your conversation.",
  "Today's gripe: 'Free' apps that cost $9.99 a month. That's not free.",
  "Today's gripe: Websites that ask for cookies before I've even seen the page. Let me browse first.",
  "Today's gripe: People who don't use turn signals. It's a lever. Push it.",
  "Today's gripe: 'Smart' devices that need constant updates. How smart are they really?",
  "Today's gripe: People who take up two parking spaces. You're not that special.",
  "Today's gripe: Email signatures longer than the actual email. Nobody reads them.",
  "Today's gripe: Apps that send notifications at 3am. I'm sleeping. Leave me alone.",
  "Today's gripe: People who walk slowly in groups blocking the entire sidewalk. Single file exists.",
  "Today's gripe: 'Loading...' screens that last forever. Just tell me it's broken.",
  "Today's gripe: People who don't hold doors open. Basic decency, people.",
  "Today's gripe: Software that 'improves' by making everything worse. Stop helping.",
  "Today's gripe: People who use 'impact' as a verb. It's a noun. Look it up.",
  "Today's gripe: Restaurants that play music so loud you can't think. I'm trying to eat.",
  "Today's gripe: Apps that need location access to work. I just want to check the weather.",
  "Today's gripe: People who don't clean up after their dogs. It's not that hard.",
  "Today's gripe: 'New and improved' products that are just smaller and more expensive.",
  "Today's gripe: People who text while walking and bump into everyone. Look up.",
  "Today's gripe: Websites that autoplay videos with sound. I hate you.",
  "Today's gripe: People who don't return shopping carts. It's a 30-second walk.",
  "Today's gripe: Software updates that change everything I learned. Why?",
  "Today's gripe: People who stand right behind you in line. Personal space exists.",
  "Today's gripe: Apps that ask for camera access when I just want to read. No.",
  "Today's gripe: People who don't say 'thank you' when you hold the door. Rude.",
  "Today's gripe: 'Free trials' that require credit cards. That's not a trial, that's a trap.",
  "Today's gripe: People who leave trash on tables at restaurants. You're not at home.",
  "Today's gripe: Software that 'learns' your preferences by doing the opposite. Great job.",
  "Today's gripe: People who don't use headphones on public transport. We all hear it.",
  "Today's gripe: Apps that log you out every week 'for security'. I'm the only one using this.",
  "Today's gripe: People who don't signal when changing lanes. It's the law.",
  "Today's gripe: Websites that make you create an account to browse. Let me see first.",
  "Today's gripe: People who talk during movies. We all paid to watch, not listen to you.",
  "Today's gripe: Software that 'simplifies' by hiding everything I need. Thanks.",
  "Today's gripe: People who don't clean the microwave after using it. It takes 5 seconds.",
  "Today's gripe: Apps that need 47 permissions to work. I just want to check the time.",
  "Today's gripe: People who don't say 'excuse me' when they bump into you. Manners exist.",
  "Today's gripe: 'Smart' assistants that misunderstand everything. How smart are they?",
  "Today's gripe: People who don't put weights back at the gym. Lazy.",
  "Today's gripe: Software that crashes when you need it most. Perfect timing.",
  "Today's gripe: People who don't flush public toilets. Disgusting.",
  "Today's gripe: Apps that show ads between every action. I'm trying to use this.",
  "Today's gripe: People who don't wait for others to exit elevators before entering. Wait.",
  "Today's gripe: Software updates that fix things that weren't broken. Why?",
  "Today's gripe: People who don't cover their mouths when coughing. We're still in a pandemic.",
  "Today's gripe: Apps that drain battery in 2 hours. What are you even doing?",
  "Today's gripe: People who don't pick up after themselves. You're an adult.",
  "Today's gripe: Software that 'helps' by doing things I didn't ask for. Stop helping.",
  "Today's gripe: People who don't use turn signals in parking lots. It's still a road.",
  "Today's gripe: Apps that need internet for everything. Sometimes I'm offline.",
  "Today's gripe: People who don't say 'please' or 'thank you'. Basic manners.",
  "Today's gripe: Software that changes the UI every update. I just learned the old one.",
  "Today's gripe: People who don't clean up spills. It's not going to clean itself.",
  "Today's gripe: Apps that send 47 notifications a day. I'll check when I want.",
  "Today's gripe: People who don't wait their turn. Patience exists.",
  "Today's gripe: Software that 'optimizes' by making everything slower. Great optimization.",
  "Today's gripe: People who don't put dishes in the dishwasher. It's right there.",
  "Today's gripe: Apps that need location for everything. I just want to read news.",
  "Today's gripe: People who don't say 'bless you' when you sneeze. It's polite.",
  "Today's gripe: Software that asks 'are you sure?' for everything. Yes, I'm sure.",
  "Today's gripe: People who don't clean lint from dryers. Fire hazard, people.",
  "Today's gripe: Apps that need camera access to scan QR codes. Just let me type it.",
  "Today's gripe: People who don't use headphones in quiet spaces. We all hear your music.",
  "Today's gripe: Software that 'improves' by removing features. That's not improvement.",
  "Today's gripe: People who don't replace toilet paper. It's not going to replace itself.",
  "Today's gripe: Apps that need microphone access for no reason. I'm not talking to you.",
  "Today's gripe: People who don't say 'sorry' when they're wrong. Just apologize.",
  "Today's gripe: Software that 'learns' by doing the opposite of what you want. Great learning.",
  "Today's gripe: People who don't clean coffee makers. Mold exists.",
  "Today's gripe: Apps that need contacts access. I just want to play a game.",
  "Today's gripe: People who don't hold elevators. It's a button. Press it.",
  "Today's gripe: Software that 'streamlines' by making everything more complicated. Thanks.",
  "Today's gripe: People who don't clean up after parties. You made the mess.",
  "Today's gripe: Apps that need calendar access. I just want to check the weather.",
  "Today's gripe: People who don't say 'good morning'. It's not that hard.",
  "Today's gripe: Software that 'enhances' by breaking everything. Great enhancement.",
  "Today's gripe: People who don't clean shower drains. Hair clogs exist.",
  "Today's gripe: Apps that need photo access for no reason. I'm not sharing photos.",
  "Today's gripe: People who don't say 'have a nice day'. Basic kindness.",
  "Today's gripe: Software that 'upgrades' by making things worse. That's a downgrade.",
  "Today's gripe: People who don't clean ovens. Burnt food smells bad.",
  "Today's gripe: Apps that need storage access for everything. I have limited space.",
  "Today's gripe: People who don't say 'you're welcome'. It's polite.",
  "Today's gripe: Software that 'modernizes' by removing useful features. That's not modern.",
  "Today's gripe: People who don't clean refrigerators. Expired food exists.",
  "Today's gripe: Apps that need Bluetooth for no reason. I'm not connecting anything.",
  "Today's gripe: People who don't say 'please' when asking. It's one word.",
  "Today's gripe: Software that 'innovates' by copying everything. That's not innovation.",
  "Today's gripe: People who don't clean windows. You can see through them, right?",
  "Today's gripe: Apps that need NFC access. I'm not paying with my phone.",
  "Today's gripe: People who don't say 'thank you' for gifts. It's basic gratitude.",
  "Today's gripe: Software that 'revolutionizes' by doing what others did 5 years ago. Revolutionary.",
  "Today's gripe: People who don't clean mirrors. You can see yourself, right?",
  "Today's gripe: Apps that need all permissions or they won't work. That's not a choice.",
  "Today's gripe: People who don't say 'excuse me' when interrupting. It's polite.",
  "Today's gripe: Software that 'transforms' by making everything the same. Great transformation.",
  "Today's gripe: People who don't clean sinks. Soap scum exists.",
  "Today's gripe: Apps that need everything to work. I just want one feature.",
  "Today's gripe: People who don't say 'sorry' when late. Just apologize.",
  "Today's gripe: Software that 'evolves' by going backwards. That's devolution.",
  "Today's gripe: People who don't clean toilets. Nobody wants to see that.",
  "Today's gripe: Apps that need your soul to function. Just let me use the app.",
  "Today's gripe: People who don't say 'goodbye' when leaving. It's polite.",
  "Today's gripe: Software that 'progresses' by regressing. That's not progress.",
  "Today's gripe: People who don't clean floors. Dirt exists.",
  "Today's gripe: Apps that need your firstborn. I just want to check email.",
  "Today's gripe: People who don't say 'hello' when entering. Basic greeting.",
  "Today's gripe: Software that 'advances' by going backwards. That's retreating.",
  "Today's gripe: People who don't clean anything. Just clean something. Anything.",
  "Today's gripe: Apps that need everything about you. I just want to use the app. That's it."
]

export class DailyGripeService {
  private getDayNumber(): number {
    // Get days since epoch (Jan 1, 2024) to cycle through gripes
    const epoch = new Date('2024-01-01').getTime()
    const now = Date.now()
    const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24))
    return daysSinceEpoch % DAILY_GRIPES.length
  }

  getTodaysGripe(): string {
    const dayNumber = this.getDayNumber()
    return DAILY_GRIPES[dayNumber] || DAILY_GRIPES[0]
  }

  getGripeDate(): string {
    const today = new Date()
    return today.toISOString().split('T')[0] // YYYY-MM-DD
  }
}

export const dailyGripeService = new DailyGripeService()

