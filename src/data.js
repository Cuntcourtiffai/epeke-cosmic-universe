export const LINKS={
 web:'https://cuntcourtiffai.github.io/My-portfolio-/index.html',
 ugc:'https://cuntcourtiffai.github.io/epeke-portfolio/',
 ig:'https://www.instagram.com/cvntcourtiffai?igsh=MThuZHp4dTVvN2hmaQ==',
 tt1:'https://www.tiktok.com/@secsisani?_r=1&_t=ZS-98PgO8Qj9JU',
 tt2:'https://www.tiktok.com/@_iph_fi?_r=1&_t=ZS-98PgQoyjfzJ',
 mail:'mailto:epekevuyisani@gmail.com',wa:'https://wa.me/2349044354460',phone:'0904 435 4460'};
export const WORLDS=[
 {id:'solar-coast',name:'The Solar Coast',cue:'Abundance · Opportunity',pal:['#2a1206','#8a5a1c','#C9AC75'],
  text:'Golden light on a glittering shore. The sun does not ask permission to rise. Some worlds are just the horizon, waiting.',
  go:['/work','See the work']},
 {id:'moon-ocean',name:'The Moon Ocean',cue:'Reflection · Transformation',pal:['#05060f','#0A1024','#49218A'],
  text:'Silver water, violet haze, a moon pouring light into the dark. Something observes from far away. Most nights, it only watches.',
  go:['/archive','Read the archive']},
 {id:'angel-veil',name:'The Angel Veil',cue:'Protection · Renewal',pal:['#0A1024','#4a4e7a','#D8DCE8'],
  text:'White haze and translucent wings made of light, not feathers. A threshold for protection and change. The small guide drifts here most naturally.',
  go:['/invitation','Open the invitation']},
 {id:'living-tree',name:'The Living Tree',cue:'Growth · Learning',pal:['#04100f','#0A1024','#1f5a4a'],
  text:'Roots of cosmic filament, branches that become constellations. Biotechnology, code and craft, still growing.',
  go:['/archive','Read the archive']},
 {id:'overflow',name:'The Overflow',cue:'Creativity · Receiving',pal:['#160c04','#5a3a10','#C9AC75'],
  text:'A vessel that holds more than expected. What spills out becomes a river of light, and ideas become things that exist.',
  go:['/work','See the work']}];
export const ARCHETYPES=[
 {id:'magician',name:'The Magician',density:1.5,speed:1.3,accent:'#C9AC75',note:'Gold stirs. The ribbon moves faster.',ribbon:1},
 {id:'old-soul',name:'The Old Soul',density:.7,speed:.5,accent:'#D8DCE8',note:'Slower air, deeper shadow, more stillness.'},
 {id:'young-soul',name:'The Young Soul',density:1.4,speed:1,accent:'#F2EBDD',note:'More drifting stars and play.'},
 {id:'oracle',name:'The Oracle',density:1,speed:.7,accent:'#9B7BFF',note:'Reflections sharpen. An eye may open.',eye:1},
 {id:'wanderer',name:'The Wanderer',density:1,speed:1.1,accent:'#ff4d5e',note:'The ribbon points toward distant places.',ribbon:1},
 {id:'alchemist',name:'The Alchemist',density:1.2,speed:.9,accent:'#b08cff',note:'Gold, silver and violet trade places.'},
 {id:'guardian',name:'The Guardian',density:.9,speed:.6,accent:'#3aa0e0',note:'Protective symbols hold steady.',eye:1},
 {id:'cartographer',name:'The Cartographer',density:1,speed:.8,accent:'#F2EBDD',note:'Constellation lines mark the paths.',lines:1}];
// status: completed | demo | experiment | wip | concept
export const PROJECTS=[
 {name:'Web development portfolio',cat:'Web development',status:'completed',desc:'My live portfolio of websites and demonstration projects, built with HTML, CSS and Figma-led design.',tools:'HTML · CSS · Figma',link:LINKS_WEB()},
 {name:'UGC creator portfolio website',cat:'UGC & content',status:'completed',desc:'Live creator portfolio, "UGC Creator | Beauty, Fashion & Lifestyle", in an Ethereal Renaissance Webcore look (moss green, antique gold, dusty pink, ivory). Covers skincare, fashion and accessories, fragrance and grooming, lifestyle and tech content.',tools:'Web design · UGC · Visual storytelling',link:'https://cuntcourtiffai.github.io/epeke-portfolio/'},
 {name:'UGC portfolio PDF (A4)',cat:'UGC & content',status:'wip',desc:'Matching A4 PDF version of the UGC portfolio, "Epeke_Vuyisani_UGC_Portfolio.pdf". Add a download link once the final file is in public/.',tools:'Layout · Visual design',link:null},
 {name:'The Cosmic Digital Universe',cat:'Digital experiments',status:'wip',desc:'This site: an explorable personal universe with five worlds, a ghost-angel guide and a session archetype system.',tools:'React · Vite · SVG · Canvas',link:null},
 {name:'Biotechnology coursework',cat:'Academic',status:'wip',desc:'Final-year Biotechnology at Ebonyi State University. Add specific projects or coursework here.',tools:'—',link:null}];
function LINKS_WEB(){return 'https://cuntcourtiffai.github.io/My-portfolio-/index.html'}
function LINKS_UGC(){return 'https://cuntcourtiffai.github.io/epeke-portfolio/'}
export const SKILLS=['HTML','CSS','Figma web design','Microsoft Excel','Word','PowerPoint','Data entry & documentation','UGC & visual storytelling'];
