
import slide from "../../../public/images/slide.png"
import slide2 from "../../../public/images/movie.png"
import slide3 from "../../../public/images/movie2.png"
import slide4 from "../../../public/images/movie3.png"
import slide5 from "../../../public/images/movie4.png"
import slide6 from "../../../public/images/movie6.png"
import slide7 from "../../../public/images/movie7.png"



export const TrendingMovies = [
  {
    id:1,
    title: "Song of Praise",
    year: 2025,
    category: "Documentaries",
    image: slide2,
    isTop10:true,
    isLeaving:false,
    isRecent:false,
    video:"https://videos.evolveplatform.net/videos/IGR22gbqCUFQcavsKbA0nNF9pXvHWIGTszD73gOW_3664878620.mp4"
  },
  {
    id:2,
    title: "The Silent Earth",
    year: 2024,
    category: "Sci-Fi",
    image: slide,
      isTop10:true,
    isLeaving:false,
    isRecent:true,
    video:"https://res.cloudinary.com/dvu4qhyqq/video/upload/v1751612942/newmov_rg94fr.mov"
  },
  {
      id:3,
    title: "Love Unfiltered",
    year: 2023,
    category: "Romance",
    image: slide3,
    video:"https://res.cloudinary.com/dvu4qhyqq/video/upload/v1751612942/newmov_rg94fr.mov"
  },
  {
      id:4,
    title: "The Forgotten Path",
    year: 2022,
    category: "Drama",
    image: slide4,
      isTop10:false,
    isLeaving:true,
    isRecent:false
  },
  {
      id:5,
    title: "Rebels of Time",
    year: 2025,
    category: "Action",
    image: slide5,
      isTop10:true,
    isLeaving:false,
    isRecent:false,
    video:"https://res.cloudinary.com/dvu4qhyqq/video/upload/v1751612942/newmov_rg94fr.mov"
  },
  {
      id:7,
    title: "Laughing Stock",
    year: 2021,
    category: "Comedy",
    image: slide6,
     isTop10:false,
    isLeaving:true,
    isRecent:false
  },
  {
        id:8,
    title: "Deep Dive",
    year: 2023,
    category: "Documentaries",
    image: slide7,
     isTop10:true,
    isLeaving:false,
    isRecent:false
  },
  {
    title: "Galactic Warzone",
    year: 2022,
    category: "Sci-Fi",
    image: slide,
      isTop10:true,
    isLeaving:false,
    isRecent:false,
    id:9
  },
  {
    id:10,
    title: "After the Fall",
    year: 2020,
    category: "Thriller",
    image: slide7,
     isTop10:false,
    isLeaving:false,
    isRecent:true
  },
  {
    title: "Crimson Tide",
    year: 2023,
    category: "Action",
    image: slide5,  isTop10:true,
    isLeaving:false,
    isRecent:false,
    id:11
  },
  {
    title: "Beyond the River",
    year: 2021,
    category: "Adventure",
    image: slide3,
      isTop10:true,
    isLeaving:false,
    isRecent:false,
    id:12
  },
  {
    title: "Pixel Dreams",
    year: 2024,
    category: "Animation",
    image: slide2,
      isTop10:true,
    isLeaving:false,
    isRecent:false,
    id:13
  },
  {
    title: "Voices in the Dark",
    year: 2023,
    category: "Horror",
    image: slide6,
      isTop10:true,
    isLeaving:false,
    isRecent:false,
    id:15
  },
  {
    title: "Legacy of Ashes",
    year: 2022,
    category: "Drama",
    image: slide3,
      isTop10:true,
    isLeaving:false,
    isRecent:false,
    id:20
  },
  {
    title: "Echoes of the Past",
    year: 2025,
    category: "History",
    image: slide4,
      isTop10:true,
    isLeaving:false,
    isRecent:false,
    id:23
  },
];

export const FaqData = [
  {
    quest:"What is FaithStream?",
    ans:"FaithStream is an all-in-one streaming platform dedicated to faith-based, inspirational, and family-friendly entertainment. It brings together movies, series, sermons, devotionals, podcasts, worship sessions, animations, and live faith events from creators around the world in one place."
  },
  {
    quest:"What kind of content can I watch on FaithStream?",
    ans:"FaithStream offers a wide variety of uplifting content including: Faith-based movies and series, Sermons and Bible teachings, PrayerStreams and live worship, Daily devotionals, Christian podcasts, Gospel music and FaithSound, Talk shows and documentaries, Kids’ Christian animations, Inspirational and motivational programs"
  },
  {
    quest:"Is FaithStream available worldwide?",
    ans:"Yes. FaithStream connects viewers globally, allowing users from different countries to access faith-based entertainment and teachings from around the world."
  },
  {
    quest:"What makes FaithStream different from other streaming platforms?",
    ans:"FaithStream focuses exclusively on faith-centered and uplifting content, ensuring viewers experience entertainment that inspires spiritual growth, hope, and positive values."
  },
  {
    quest:"Can I access podcasts and talk shows on FaithStream?",
    ans:"Yes. FaithStream includes Christian podcasts, faith discussions, talk shows, testimonies, and documentary-style programs designed to educate and inspire."
  },
  {
    quest:"Is FaithStream only for Christians?",
    ans:"FaithStream welcomes everyone seeking positive, inspirational, and value-driven entertainment, regardless of background or denomination."
  },
  {
    quest:"How do I log in or log out of my account?",
    ans:"Use your registered email and password to log in securely. You can log out anytime from your profile or account settings menu."
  },

]


export const supportTopics = [
  {
    topic: "Getting Started",
    desc: "How to sign up, create profile. and start streaming.",
    content: `  <h4><strong>Getting Started</strong></h4>
  <p>How to sign up, create profile, and start streaming.</p><br/>
  <p>To get started on FaithStream, first create an account by entering your email address and setting a secure password. 
  Once you’ve signed up, you can choose a subscription plan or start with a free trial if it’s available. After setting up your account, 
  create your first profile—you can use your name or create separate profiles for different family members.</p><br/>
  
  <p>When you log in, you’ll land on the homepage where you can browse inspiring movies, series, and documentaries. 
  Use the search bar to look for specific titles, or explore the categories we’ve curated to help you discover new faith-based stories.</p><br/>
  
  <p>If you want to watch on different devices, download the FaithStream app on your smartphone, tablet, or smart TV 
  and sign in with the same account. You’re ready to start watching.</p><br/>
  
  <p>If you need more guidance, check out the tutorials and tips below to make the most of your streaming experience.</p>
`,
  },
  {
    topic: "Streaming & Playback",
    desc: "Tips for better video quality and resolving playback issues.",
    content: `   <h4>Streaming & Playback</h4>
  <p><strong>Tips for better video quality and resolving playback issues.</strong></p>

  <p>For the best streaming experience, make sure you have a stable internet connection—we recommend at least 5 Mbps for HD quality. 
  If your video is buffering, try lowering the video quality by clicking the settings icon during playback or restarting your router.</p>

  <p>To start watching, simply click on a title and press play. You can pause, rewind, or fast forward using on-screen controls. 
  If you want to watch offline, download movies or episodes (available on mobile apps) by tapping the download icon next to the title.</p>

  <p>If the video won’t play or you see an error, try signing out and signing back in, clearing your browser cache, 
  or updating the FaithStream app to the latest version. For more detailed troubleshooting, check our technical support section.</p>
`,
  },
  {
    topic: "Content & Recommendations",
    desc: "How to find movies you’ll love and manage your watchlists.",
    content: `  <strong>Getting Started</strong>
  <p>How to sign up, create profile, and start streaming.</p>
  <p>To get started on FaithStream, first create an account by entering your email address and setting a secure password. 
  Once you’ve signed up, you can choose a subscription plan or start with a free trial if it’s available. After setting up your account, 
  create your first profile—you can use your name or create separate profiles for different family members.</p>
  
  <p>When you log in, you’ll land on the homepage where you can browse inspiring movies, series, and documentaries. 
  Use the search bar to look for specific titles, or explore the categories we’ve curated to help you discover new faith-based stories.</p>
  
  <p>If you want to watch on different devices, download the FaithStream app on your smartphone, tablet, or smart TV 
  and sign in with the same account. You’re ready to start watching.</p>
  
  <p>If you need more guidance, check out the tutorials and tips below to make the most of your streaming experience.</p>
`,
  },
  {
    topic: "Faith & Family Features",
    desc: "Set up parental controls, filters, and family-friendly settings.",
    content: `  <h3>Getting Started</h3>
  <p><strong>How to sign up, create profile, and start streaming.</strong></p>
  <p>To get started on FaithStream, first create an account by entering your email address and setting a secure password. 
  Once you’ve signed up, you can choose a subscription plan or start with a free trial if it’s available. After setting up your account, 
  create your first profile—you can use your name or create separate profiles for different family members.</p>
  
  <p>When you log in, you’ll land on the homepage where you can browse inspiring movies, series, and documentaries. 
  Use the search bar to look for specific titles, or explore the categories we’ve curated to help you discover new faith-based stories.</p>
  
  <p>If you want to watch on different devices, download the FaithStream app on your smartphone, tablet, or smart TV 
  and sign in with the same account. You’re ready to start watching.</p>
  
  <p>If you need more guidance, check out the tutorials and tips below to make the most of your streaming experience.</p>
`,
  },
  {
    topic: "Device Support",
    desc: "Learn how to use FaithStream on mobile, web, and smart TVs.",
    content: `  <h3>Getting Started</h3>
  <p><strong>How to sign up, create profile, and start streaming.</strong></p>
  <p>To get started on FaithStream, first create an account by entering your email address and setting a secure password. 
  Once you’ve signed up, you can choose a subscription plan or start with a free trial if it’s available. After setting up your account, 
  create your first profile—you can use your name or create separate profiles for different family members.</p>
  
  <p>When you log in, you’ll land on the homepage where you can browse inspiring movies, series, and documentaries. 
  Use the search bar to look for specific titles, or explore the categories we’ve curated to help you discover new faith-based stories.</p>
  
  <p>If you want to watch on different devices, download the FaithStream app on your smartphone, tablet, or smart TV 
  and sign in with the same account. You’re ready to start watching.</p>
  
  <p>If you need more guidance, check out the tutorials and tips below to make the most of your streaming experience.</p>
`,
  },
];

export const MovieLanguages = [
  { name: "English", code: "en" },
  { name: "French", code: "fr" },
  { name: "Spanish", code: "es" },
  { name: "German", code: "de" },
  { name: "Italian", code: "it" },
  { name: "Portuguese", code: "pt" },
  { name: "Russian", code: "ru" },
  { name: "Chinese (Simplified)", code: "zh" },
  { name: "Japanese", code: "ja" },
  { name: "Korean", code: "ko" },
  { name: "Hindi", code: "hi" },
  { name: "Arabic", code: "ar" },
  { name: "Turkish", code: "tr" },
  { name: "Dutch", code: "nl" },
  { name: "Swedish", code: "sv" },
  { name: "Danish", code: "da" },
  { name: "Finnish", code: "fi" },
  { name: "Norwegian", code: "no" },
  { name: "Thai", code: "th" },
  { name: "Greek", code: "el" },
  { name: "Hebrew", code: "he" },
  { name: "Polish", code: "pl" },
  { name: "Czech", code: "cs" },
  { name: "Hungarian", code: "hu" },
  { name: "Indonesian", code: "id" },
  { name: "Malay", code: "ms" },
  { name: "Vietnamese", code: "vi" },
  { name: "Tagalog", code: "tl" },
  { name: "Bengali", code: "bn" },
  { name: "Tamil", code: "ta" },
  { name: "Telugu", code: "te" },
  { name: "Persian", code: "fa" }
];

export const avatar_urls = ["https://d3jaci99bhbzji.cloudfront.net/thumbnails/518e1c03-dbf7-4f8b-ab5f-a58fe9b54264-1757141187396.jpg", "https://d3jaci99bhbzji.cloudfront.net/thumbnails/afb6006c-0ad6-421b-80d9-e6a7acaa247a-1757141238413.jpg","https://d3jaci99bhbzji.cloudfront.net/thumbnails/b8643b98-dd26-4548-8465-1954f15a434a-1757141277416.jpg", "https://d3jaci99bhbzji.cloudfront.net/thumbnails/e9c21cd0-d25c-493c-9496-addec228b442-1757141315927.jpg","https://d3jaci99bhbzji.cloudfront.net/thumbnails/15567412-ff42-4eea-823a-b32778a8ace4-1757141359776.jpg"]
