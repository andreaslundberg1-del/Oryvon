export interface FamilyNode {
  id: string;
  name: string;
  role: string;
  tier: number;
  image?: string;
  spouseName?: string;
  details?: Record<string, string>;
}

export const UNIVERSE_REGISTRY: Record<string, any> = {
    harrypotter: {
        id: 'harrypotter',
        title: 'Harry Potter',
        subtitle: 'THE WIZARDING WORLD OF HOGWARTS',
        rating: '9.2/10',
        tagline: 'It does not do to dwell on dreams and forget to live.',
        description: 'The Harry Potter universe chronicles the magical world parallel to our own. Centers on Hogwarts School of Witchcraft and Wizardry, the history of wizarding magic, and the epic battle to defeat the Dark Lord Voldemort.',
        backdrop: '/Images/harrypotter_castle.png',
        accentColor: '#fbbf24',
        universeType: 'HIGH FANTASY / MAGIC',
        releaseYears: '2001–2011',
        categoryTags: [
            'MAGIC',
            'WIZARDS',
            'ADVENTURE'
        ],
        metrics: {
            races: '8',
            factions: '12',
            characters: '280+',
            events: '150+'
        },
        locations: [
            {
                name: 'Hogwarts Castle',
                desc: 'The historic Scottish castle housing the elite school of witchcraft and wizardry.',
                image: '/Images/harrypotter_castle.png'
            },
            {
                name: 'Diagon Alley',
                desc: 'A cobblestoned wizarding shopping area located hidden behind London.',
                image: '/Images/portal_cinema.png'
            },
            {
                name: 'The Forbidden Forest',
                desc: 'The dark, mysterious forest bounding Hogwarts, home to magical beasts.',
                image: '/Images/witcher_forest.png'
            },
            {
                name: 'Hogsmeade Village',
                desc: 'The picturesque all-wizarding village near Hogwarts, famous for Butterbeer.',
                image: '/Images/middle_earth_rivendell.png'
            },
            {
                name: 'Ministry of Magic',
                desc: 'The underground headquarters of the British wizarding government in London.',
                image: '/Images/cosmic_sphere.png'
            }
        ],
        characters: [
            {
                id: 'harry-potter',
                name: 'Harry Potter',
                role: 'The Chosen One',
                desc: 'The Boy Who Lived, destined to either defeat Lord Voldemort or die trying.',
                quote: 'I don\'t go looking for trouble. Trouble usually finds me.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Species: 'Human',
                    BloodStatus: 'Half-blood',
                    House: 'Gryffindor',
                    Wand: '11" Holly, Phoenix feather core',
                    Birth: '31 July 1980',
                    Status: 'Alive',
                    PlayedBy: 'Daniel Radcliffe'
                },
                relationships: [
                    {
                        name: 'Hermione Granger',
                        role: 'Best Friend',
                        avatar: '🔮',
                        charId: 'hermione-granger'
                    },
                    {
                        name: 'Ron Weasley',
                        role: 'Best Friend',
                        avatar: '🦁',
                        charId: 'ron-weasley'
                    },
                    {
                        name: 'Albus Dumbledore',
                        role: 'Mentor',
                        avatar: '🧙‍♂️',
                        charId: 'albus-dumbledore'
                    },
                    {
                        name: 'Severus Snape',
                        role: 'Complex protector',
                        avatar: '🧪',
                        charId: 'severus-snape'
                    },
                    {
                        name: 'Lord Voldemort',
                        role: 'Enemy',
                        avatar: '💀',
                        charId: 'lord-voldemort'
                    }
                ],
                tabs: {
                    about: 'Harry Potter is a famous wizard, best known for surviving the Killing Curse as a baby and defeating Lord Voldemort. He is exceptionally skilled at Defense Against the Dark Arts, an outstanding Seeker in Quidditch, and led Dumbledore\'s Army during the dark times.',
                    relationships: 'Harry\'s closest bonds are with Ron and Hermione, his surrogate family the Weasleys, and his godfather Sirius Black. His relationship with Severus Snape remained highly complex until Snape\'s memories revealed his lifelong protection of Harry due to his love for Lily Potter.',
                    appearance: 'Harry has messy jet-black hair that sticks up at the back, bright green eyes inherited from his mother, and a thin lightning-bolt scar on his forehead. He wears round wire-framed glasses, often held together with Spellotape.',
                    abilities: 'Highly proficient in Defense Against the Dark Arts. Able to produce a powerful stag Patronus at age thirteen. A natural flyer and Quidditch Seeker. Possessed Parseltongue abilities until the Horcrux portion of Voldemort\'s soul inside him was destroyed.',
                    quotes: '"I\'ll be in my bedroom, making no noise and pretending I don\'t exist." · "Working hard is important, but there\'s something that matters even more: believing in yourself."'
                }
            },
            {
                id: 'hermione-granger',
                name: 'Hermione Granger',
                role: 'Brightest Witch of Her Age',
                desc: 'An exceptionally gifted Muggle-born witch who uses her unparalleled intellect to guide Harry and Ron.',
                quote: 'Books! And cleverness! There are more important things — friendship and bravery.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Species: 'Human',
                    BloodStatus: 'Muggle-born',
                    House: 'Gryffindor',
                    Wand: '10¾" Vine wood, Dragon heartstring',
                    Birth: '19 September 1979',
                    Status: 'Alive',
                    PlayedBy: 'Emma Watson'
                },
                relationships: [
                    {
                        name: 'Harry Potter',
                        role: 'Best Friend',
                        avatar: '⚡',
                        charId: 'harry-potter'
                    },
                    {
                        name: 'Ron Weasley',
                        role: 'Husband',
                        avatar: '🦁',
                        charId: 'ron-weasley'
                    },
                    {
                        name: 'Albus Dumbledore',
                        role: 'Advisor',
                        avatar: '🧙‍♂️',
                        charId: 'albus-dumbledore'
                    }
                ],
                tabs: {
                    about: 'Hermione is the intellectual powerhouse of the golden trio. Her extensive research, masterly brewing of Polyjuice Potion, and quick-thinking spellcasting saved Harry and Ron countlessly on their quests.',
                    relationships: 'Hermione shares an unbreakable bond of friendship with Harry. Despite constant bickering, she developed deep feelings for Ron Weasley, culminating in their marriage and family in later years.',
                    appearance: 'Hermione has bushy brown hair, warm brown eyes, and rather large front teeth (until they were shrunk magically in her fourth year). She is often seen carrying a massive pile of library books.',
                    abilities: 'Unrivaled academic and research capabilities. Extremely skilled in charms, transfiguration, and defense. Brewed highly complex potions at age twelve. Possesses a deep understanding of ancient runes and arithmancy.',
                    quotes: '"Fear of a name increases fear of the thing itself." · "Honestly, don\'t you two read?"'
                }
            },
            {
                id: 'ron-weasley',
                name: 'Ron Weasley',
                role: 'Loyal Companion',
                desc: 'Harry\'s fiercely loyal best friend, a strategic wizard chess player, and youngest Weasley brother.',
                quote: 'Don\'t let the Muggles get you down!',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Species: 'Human',
                    BloodStatus: 'Pure-blood',
                    House: 'Gryffindor',
                    Wand: '14" Willow, Unicorn hair',
                    Birth: '1 March 1980',
                    Status: 'Alive',
                    PlayedBy: 'Rupert Grint'
                },
                relationships: [
                    {
                        name: 'Harry Potter',
                        role: 'Best Friend',
                        avatar: '⚡',
                        charId: 'harry-potter'
                    },
                    {
                        name: 'Hermione Granger',
                        role: 'Wife',
                        avatar: '📚',
                        charId: 'hermione-granger'
                    },
                    {
                        name: 'Lord Voldemort',
                        role: 'Enemy',
                        avatar: '💀',
                        charId: 'lord-voldemort'
                    }
                ],
                tabs: {
                    about: 'Ron is the heart and humor of the trio. Growing up in a large pure-blood wizarding family, he provides Harry and Hermione with crucial knowledge of the wizarding world\'s customs, tales, and deep culture.',
                    relationships: 'Ron stands by Harry in every crisis, overcoming deep-seated insecurities of being overshadowed by his older brothers and Harry\'s fame. His love for Hermione grows steadily across their Hogwarts years.',
                    appearance: 'Tall and lanky, Ron has bright red hair, freckles, a long nose, and large hands and feet. He is often seen in hand-me-down robes or Weasley jumpers.',
                    abilities: 'Superb wizard chess strategist. Talented Keep in Quidditch, helping Gryffindor win the Quidditch Cup. Highly resilient in duels and combat under pressure.',
                    quotes: '"Why spiders? Why couldn\'t it be \'follow the butterflies\'?" · "She\'s mental, that one. I\'m telling you."'
                }
            },
            {
                id: 'albus-dumbledore',
                name: 'Albus Dumbledore',
                role: 'Hogwarts Headmaster',
                desc: 'Considered the greatest wizard of modern times, founder of the Order of the Phoenix, and guide to Harry.',
                quote: 'Happiness can be found, even in the darkest of times, if one only remembers to turn on the light.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Species: 'Human',
                    BloodStatus: 'Half-blood',
                    House: 'Gryffindor',
                    Wand: '15" Elder, Thestral tail hair core',
                    Birth: 'August 1881',
                    Status: 'Deceased',
                    PlayedBy: 'Richard Harris / Michael Gambon'
                },
                relationships: [
                    {
                        name: 'Harry Potter',
                        role: 'Protégé',
                        avatar: '⚡',
                        charId: 'harry-potter'
                    },
                    {
                        name: 'Severus Snape',
                        role: 'Confidant',
                        avatar: '🧪',
                        charId: 'severus-snape'
                    },
                    {
                        name: 'Lord Voldemort',
                        role: 'Adversary',
                        avatar: '💀',
                        charId: 'lord-voldemort'
                    }
                ],
                tabs: {
                    about: 'Albus Percival Wulfric Brian Dumbledore served as Headmaster of Hogwarts. He was a brilliant, eccentric mastermind who orchestrated Voldemort\'s downfall, keeping the grand plan secret from even those he loved most.',
                    relationships: 'Dumbledore shared a deeply paternal bond with Harry. He placed absolute, controversial trust in Severus Snape, tasking him with the ultimate double-agent sacrifice to protect Harry and the school.',
                    appearance: 'A tall, thin wizard with silver hair and a beard long enough to tuck into his belt. He has piercing blue eyes, a crooked nose from being broken, and wears half-moon spectacles and sweeping robes.',
                    abilities: 'Unrivaled mastery of all branches of magic. Wielder of the Elder Wand. Discovered the twelve uses of dragon\'s blood. Capable of performing powerful wandless and silent magic.',
                    quotes: '"To the well-organized mind, death is but the next great adventure." · "It is our choices, Harry, that show what we truly are, far more than our abilities."'
                }
            },
            {
                id: 'severus-snape',
                name: 'Severus Snape',
                role: 'Potions Master & Double Agent',
                desc: 'The brooding, tragic Slytherin master who protected Harry while acting as Voldemort\'s right hand.',
                quote: 'Always.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Species: 'Human',
                    BloodStatus: 'Half-blood',
                    House: 'Slytherin',
                    Wand: '13½" Ebony, core unknown',
                    Birth: '9 January 1960',
                    Status: 'Deceased',
                    PlayedBy: 'Alan Rickman'
                },
                relationships: [
                    {
                        name: 'Harry Potter',
                        role: 'Secretly protected',
                        avatar: '⚡',
                        charId: 'harry-potter'
                    },
                    {
                        name: 'Albus Dumbledore',
                        role: 'Commanding leader',
                        avatar: '🧙‍♂️',
                        charId: 'albus-dumbledore'
                    },
                    {
                        name: 'Lord Voldemort',
                        role: 'Deceived master',
                        avatar: '💀',
                        charId: 'lord-voldemort'
                    }
                ],
                tabs: {
                    about: 'Severus Snape served as Potions Master, Defense Against the Dark Arts teacher, and later Headmaster. He was a highly accomplished wizard whose cold exterior masked a tragic life dedicated to protecting Harry out of love for Lily Potter.',
                    relationships: 'Snape harbored deep resentment for James Potter, which he projected onto Harry. However, bound by his love for Lily, he made a pact with Dumbledore to act as a double agent, enduring hatred from both sides to ensure Harry\'s survival.',
                    appearance: 'A thin man with sallow skin, a hooked nose, greasy shoulder-length black hair, and dark, cold eyes that resemble tunnels. He wears sweeping black cloaks that make him look like a bat.',
                    abilities: 'Master of Potions and Occlumency, capable of shielding his mind perfectly from Voldemort. Creator of spells like Sectumsempra and Muffliato. The only Death Eater capable of conjuring a Patronus (a silver doe).',
                    quotes: '"Control your emotions. Discipline your mind!" · "I can teach you how to bottle fame, brew glory, even stopper death — if you aren\'t a big pack of dunderheads."'
                }
            },
            {
                id: 'lord-voldemort',
                name: 'Lord Voldemort',
                role: 'The Dark Lord',
                desc: 'Tom Riddle, the most powerful and feared dark wizard in history, seeking absolute immortality.',
                quote: 'There is no good and evil, there is only power and those too weak to seek it.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Species: 'Human (Mutated)',
                    BloodStatus: 'Half-blood',
                    House: 'Slytherin',
                    Wand: '13½" Yew, Phoenix feather core',
                    Birth: '31 December 1926',
                    Status: 'Deceased',
                    PlayedBy: 'Ralph Fiennes'
                },
                relationships: [
                    {
                        name: 'Harry Potter',
                        role: 'Archenemy',
                        avatar: '⚡',
                        charId: 'harry-potter'
                    },
                    {
                        name: 'Albus Dumbledore',
                        role: 'Feared adversary',
                        avatar: '🧙‍♂️',
                        charId: 'albus-dumbledore'
                    },
                    {
                        name: 'Severus Snape',
                        role: 'Trusted servant (Deceived)',
                        avatar: '🧪',
                        charId: 'severus-snape'
                    }
                ],
                tabs: {
                    about: 'Tom Marvolo Riddle renamed himself Lord Voldemort, commanding the Death Eaters in two wizarding wars. He split his soul into seven Horcruxes to secure dark immortality, terrorizing the magical world.',
                    relationships: 'Voldemort understands only domination and fear. He views his Death Eaters as servants. He shares a unique, magical soul connection with Harry Potter due to the accidental Horcrux created in Godric\'s Hollow.',
                    appearance: 'Tall and skeletal, Voldemort has pale white skin, red glowing eyes with slit pupils like a snake, no nose (only slit nostrils), and long, spider-like fingers.',
                    abilities: 'Unparalleled mastery of the Dark Arts. Extremely skilled Legilimens. Parseltongue speaker. Able to fly without a broom or support. Created numerous Horcruxes and dark spells.',
                    quotes: '"The boy who lived... come to die." · "Greatness inspires envy, envy engenders spite, spite spawns lies."'
                }
            }
        ],
        familyTree: {
            title: 'HOUSE OF POTTER',
            members: [
                {
                    id: 'james-potter-sr',
                    name: 'James Potter Sr.',
                    role: 'Father',
                    details: {
                        House: 'Gryffindor',
                        Status: 'Deceased'
                    },
                    spouseId: 'lily-potter',
                    spouseName: 'Lily Evans',
                    childrenIds: [
                        'harry-potter'
                    ],
                    tier: 1
                },
                {
                    id: 'lily-potter',
                    name: 'Lily Evans Potter',
                    role: 'Mother',
                    details: {
                        House: 'Gryffindor',
                        Status: 'Deceased'
                    },
                    spouseId: 'james-potter-sr',
                    childrenIds: [
                        'harry-potter'
                    ],
                    tier: 1
                },
                {
                    id: 'harry-potter',
                    name: 'Harry Potter',
                    role: 'Selected Character',
                    details: {
                        House: 'Gryffindor',
                        Wand: '11" Holly'
                    },
                    spouseId: 'ginny-weasley',
                    spouseName: 'Ginny Weasley',
                    parentIds: [
                        'james-potter-sr',
                        'lily-potter'
                    ],
                    childrenIds: [
                        'james-potter-jr',
                        'albus-potter',
                        'lily-potter-jr'
                    ],
                    tier: 2
                },
                {
                    id: 'ginny-weasley',
                    name: 'Ginny Weasley',
                    role: 'Spouse',
                    details: {
                        House: 'Gryffindor',
                        Wand: 'Yew'
                    },
                    spouseId: 'harry-potter',
                    childrenIds: [
                        'james-potter-jr',
                        'albus-potter',
                        'lily-potter-jr'
                    ],
                    tier: 2
                },
                {
                    id: 'james-potter-jr',
                    name: 'James Sirius Potter',
                    role: 'Son',
                    details: {
                        House: 'Gryffindor'
                    },
                    parentIds: [
                        'harry-potter',
                        'ginny-weasley'
                    ],
                    tier: 3
                },
                {
                    id: 'albus-potter',
                    name: 'Albus Severus Potter',
                    role: 'Son',
                    details: {
                        House: 'Slytherin'
                    },
                    parentIds: [
                        'harry-potter',
                        'ginny-weasley'
                    ],
                    tier: 3
                },
                {
                    id: 'lily-potter-jr',
                    name: 'Lily Luna Potter',
                    role: 'Daughter',
                    details: {
                        House: 'Gryffindor'
                    },
                    parentIds: [
                        'harry-potter',
                        'ginny-weasley'
                    ],
                    tier: 3
                }
            ]
        },
        factions: [
            {
                id: 'order-phoenix',
                name: 'Order of the Phoenix',
                emblem: '🔥',
                desc: 'A secret society founded by Albus Dumbledore to oppose and fight Lord Voldemort and his Death Eaters during both wizarding wars.',
                leader: 'Albus Dumbledore',
                base: '12 Grimmauld Place, London',
                members: [
                    {
                        name: 'Albus Dumbledore',
                        role: 'Founder',
                        avatar: '🧙‍♂️',
                        charId: 'albus-dumbledore'
                    },
                    {
                        name: 'Harry Potter',
                        role: 'Key Ally',
                        avatar: '⚡',
                        charId: 'harry-potter'
                    },
                    {
                        name: 'Severus Snape',
                        role: 'Spy',
                        avatar: '🧪',
                        charId: 'severus-snape'
                    }
                ]
            },
            {
                id: 'death-eaters',
                name: 'The Death Eaters',
                emblem: '💀',
                desc: 'A radical group of pure-blood supremacist dark wizards and witches dedicated to serving Lord Voldemort and purging Muggle-borns.',
                leader: 'Lord Voldemort',
                base: 'Malfoy Manor, Wiltshire',
                members: [
                    {
                        name: 'Lord Voldemort',
                        role: 'Dark Lord',
                        avatar: '💀',
                        charId: 'lord-voldemort'
                    },
                    {
                        name: 'Severus Snape',
                        role: 'Right hand (Agent)',
                        avatar: '🧪',
                        charId: 'severus-snape'
                    }
                ]
            }
        ],
        lore: [
            {
                id: 'elder-wand',
                title: 'The Elder Wand',
                desc: 'An unbeatable wand made of Elder wood with a Thestral tail hair core, one of the three Deathly Hallows. It demands its master be conquered to pass its true allegiance.',
                image: '/Images/oryndor_symbol.png',
                circularRadar: true
            },
            {
                id: 'deathly-hallows',
                title: 'The Deathly Hallows',
                desc: 'Three highly powerful magical objects crafted by Death: the Elder Wand, the Resurrection Stone, and the Cloak of Invisibility. Together, they make the owner the Master of Death.',
                image: '/Images/cosmic_sphere.png',
                circularRadar: true
            }
        ],
        events: [
            {
                id: 'yule-ball',
                title: 'The Yule Ball',
                date: '24 Dec 1994',
                desc: 'A traditional winter gala held during the Triwizard Tournament, featuring beautiful ice sculptures, formal waltzes, and magical music in Hogwarts\' Great Hall.',
                image: '/Images/harrypotter_castle.png'
            },
            {
                id: 'battle-hogwarts',
                title: 'The Battle of Hogwarts',
                date: '2 May 1998',
                desc: 'The historic, climactic final battle of the Second Wizarding War, where defenders of Hogwarts stood against Voldemort\'s dark legions, culminating in Voldemort\'s defeat.',
                image: '/Images/got_throne.png'
            }
        ],
        media: {
            images: [
                {
                    title: 'Hogwarts Great Hall at night',
                    url: '/Images/harrypotter_castle.png'
                },
                {
                    title: 'The Forbidden Forest foggy peaks',
                    url: '/Images/witcher_forest.png'
                }
            ],
            artifacts: [
                {
                    title: 'Gryffindor Runic Sword',
                    count: 1
                },
                {
                    title: 'The Golden Snitch Relief',
                    count: 1
                }
            ],
            videos: [
                {
                    title: 'Hogwarts Express Cinematic Journey',
                    duration: '2:45'
                }
            ],
            soundtracks: [
                {
                    title: 'Hedwig\'s Flight Orchestral Theme',
                    duration: '4:55'
                }
            ],
            documents: [
                {
                    title: 'A History of Magic (Bathilda Bagshot)',
                    count: 1
                }
            ]
        }
    },
    lotr: {
        id: 'lotr',
        title: 'The Lord of the Rings',
        subtitle: 'THE CHRONICLES OF ARDA & MIDDLE-EARTH',
        rating: '9.5/10',
        tagline: 'All we have to decide is what to do with the time that is given to us.',
        description: 'The Lord of the Rings details the epic struggles across the ages of Middle-earth. From the creation of Arda to the forging of the Rings of Power and the final destruction of the One Ring in Mount Doom, the story chronicles the free peoples standing against Sauron.',
        backdrop: '/Images/middle_earth_rivendell.png',
        accentColor: '#10b981',
        universeType: 'HIGH FANTASY / EPIC',
        releaseYears: '2001–Present',
        categoryTags: [
            'FANTASY',
            'LORE',
            'MYSTIQUE'
        ],
        metrics: {
            races: '18',
            factions: '24',
            characters: '428',
            events: '380+'
        },
        locations: [
            {
                name: 'The Shire',
                desc: 'A peaceful, green region of Eriador inhabited by Hobbits in subterranean holes.',
                image: '/Images/middle_earth_rivendell.png'
            },
            {
                name: 'Rivendell',
                desc: 'The valley sanctuary of Elves, ruled by Elrond, known as the Last Homely House.',
                image: '/Images/middle_earth_rivendell.png'
            },
            {
                name: 'Mines of Moria',
                desc: 'The colossal underground dwarven kingdom of Khazad-dûm, now filled with dark entities.',
                image: '/Images/witcher_forest.png'
            },
            {
                name: 'Edoras of Rohan',
                desc: 'The mountaintop capital of Rohan, famous for the golden hall of Meduseld.',
                image: '/Images/fellowship_mountain.png'
            },
            {
                name: 'Minas Tirith',
                desc: 'The seven-tiered stone capital of Gondor, standing proud against the shadow of Mordor.',
                image: '/Images/got_throne.png'
            }
        ],
        characters: [
            {
                id: 'aragorn',
                name: 'Aragorn Elessar',
                role: 'Heir of Elendil',
                desc: 'The legendary Dúnedain Ranger of the North who ascends to the throne of Gondor and Arnor.',
                quote: 'I would rather share one lifetime with you than face all the ages of this world alone.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Race: 'Dúnadan (Man)',
                    Title: 'King of Gondor & Arnor',
                    Faction: 'Gondor / Fellowship',
                    Birth: 'TA 2931',
                    Status: 'Alive',
                    PlayedBy: 'Viggo Mortensen'
                },
                relationships: [
                    {
                        name: 'Frodo Baggins',
                        role: 'Protected Ring-bearer',
                        avatar: '💍',
                        charId: 'frodo-baggins'
                    },
                    {
                        name: 'Gandalf the Grey',
                        role: 'Wizard Guide',
                        avatar: '🧙‍♂️',
                        charId: 'gandalf'
                    },
                    {
                        name: 'Legolas Greenleaf',
                        role: 'Best Friend',
                        avatar: '🏹',
                        charId: 'legolas'
                    },
                    {
                        name: 'Gimli',
                        role: 'Best Friend',
                        avatar: '🪓',
                        charId: 'gimli'
                    }
                ],
                tabs: {
                    about: 'Aragorn II, son of Arathorn II, is the 39th Heir of Isildur. He lived in exile as a Ranger named Strider until guiding Frodo to Rivendell and leading the armies of the West against Sauron, claiming his crown as King Elessar.',
                    relationships: 'Aragorn shares an eternal love with the Elf Arwen, choosing a mortal life together. He is bound in absolute brotherhood with Legolas and Gimli, and served as a crucial protector to Frodo Baggins.',
                    appearance: 'Tall and broad-shouldered, Aragorn has shaggy dark hair, grey eyes, and a rugged, weather-beaten face. He wields Andúril, the Flame of the West, forged from the shards of Narsil.',
                    abilities: 'Superb swordsman, ranger tracker, and healer, utilizing Athelas leaves. Blessed with the long life of the Dúnedain, living to 210 years of age. A charismatic leader of men.',
                    quotes: '"A day may come when the courage of Men fails... but it is not this day!" · "If by my life or death I can protect you, I will."'
                }
            },
            {
                id: 'gandalf',
                name: 'Gandalf the Grey',
                role: 'Wizard Guide',
                desc: 'An angelic Maiar spirit sent in the form of an old wizard to guide the free peoples against Sauron.',
                quote: 'All we have to decide is what to do with the time that is given to us.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Race: 'Maiar (Istar)',
                    Title: 'The White Rider',
                    Faction: 'Fellowship / White Council',
                    Birth: 'Before the First Age',
                    Status: 'Alive',
                    PlayedBy: 'Ian McKellen'
                },
                relationships: [
                    {
                        name: 'Frodo Baggins',
                        role: 'Guided Hobbits',
                        avatar: '💍',
                        charId: 'frodo-baggins'
                    },
                    {
                        name: 'Aragorn Elessar',
                        role: 'Heir of Gondor',
                        avatar: '👑',
                        charId: 'aragorn'
                    }
                ],
                tabs: {
                    about: 'Gandalf is one of the five Istari wizards sent to Middle-earth. He fell fighting the Balrog in Moria, only to return as Gandalf the White, possessing greater power to marshal the free forces against Sauron.',
                    relationships: 'Gandalf has a special affection for Hobbits, recognizing their hidden resilience. He serves as a wise guide to Aragorn and a strategist across Rohan and Gondor.',
                    appearance: 'An old man with a long grey beard, a tall pointed blue hat, and a sweeping silver scarf. After his rebirth, he wears brilliant white robes and shines with divine inner light.',
                    abilities: 'Wielder of Narya, the Ring of Fire. Master of light magic, fire, and spiritual encouragement. Highly skilled swordsman wielding Glamdring.',
                    quotes: '"A wizard is never late, Frodo Baggins. Nor is he early. He arrives precisely when he means to." · "Run, you fools!"'
                }
            },
            {
                id: 'frodo-baggins',
                name: 'Frodo Baggins',
                role: 'Ring-bearer',
                desc: 'A humble hobbit of the Shire who carries the ultimate burden of the One Ring to Mount Doom.',
                quote: 'I will take the Ring, though I do not know the way.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Race: 'Hobbit',
                    Title: 'Bearer of the One Ring',
                    Faction: 'Fellowship / Shire',
                    Birth: 'TA 2968',
                    Status: 'Alive (Sailed West)',
                    PlayedBy: 'Elijah Wood'
                },
                relationships: [
                    {
                        name: 'Aragorn Elessar',
                        role: 'King Protector',
                        avatar: '👑',
                        charId: 'aragorn'
                    },
                    {
                        name: 'Gandalf the Grey',
                        role: 'Wizard Guide',
                        avatar: '🧙‍♂️',
                        charId: 'gandalf'
                    },
                    {
                        name: 'Samwise Gamgee',
                        role: 'Loyal Companion',
                        avatar: '🍳',
                        charId: 'samwise'
                    }
                ],
                tabs: {
                    about: 'Frodo Baggins inherited the One Ring from his uncle Bilbo. He volunteered to carry the Ring into the heart of Mordor, enduring spiritual torture and corruption to cast it into Mount Doom.',
                    relationships: 'Frodo shares an unbreakable bond of loyalty with Samwise Gamgee, who carries him up the slopes of Mount Doom. He relies heavily on Gandalf\'s wisdom.',
                    appearance: 'A typical hobbit, standing around four feet tall, with curly brown hair, blue eyes, and thick hairy feet. He wears the Mithril coat and carries Sting.',
                    abilities: 'Immense mental resilience against the Ring\'s corruption. High stealth, elusiveness, and general Hobbit resourcefulness under extreme survival duress.',
                    quotes: '"No, Sam. I must carry this alone." · "It\'s gone. It\'s done. The Ring is destroyed."'
                }
            }
        ],
        familyTree: {
            title: 'HOUSE OF ELENDIL',
            members: [
                {
                    id: 'elwing',
                    name: 'Elwing the White',
                    role: 'Grandmother',
                    details: {
                        Race: 'Half-elf',
                        Status: 'Sailed'
                    },
                    spouseId: 'earendil',
                    spouseName: 'Eärendil',
                    childrenIds: [
                        'elrond',
                        'elros'
                    ],
                    tier: 1
                },
                {
                    id: 'earendil',
                    name: 'Eärendil the Mariner',
                    role: 'Grandfather',
                    details: {
                        Race: 'Half-elf',
                        Status: 'Star Mariner'
                    },
                    spouseId: 'elwing',
                    childrenIds: [
                        'elrond',
                        'elros'
                    ],
                    tier: 1
                },
                {
                    id: 'elrond',
                    name: 'Elrond Half-elven',
                    role: 'Great Uncle',
                    details: {
                        Race: 'Elf',
                        Ruler: 'Rivendell'
                    },
                    spouseId: 'celebrain',
                    spouseName: 'Celebrían',
                    parentIds: [
                        'elwing',
                        'earendil'
                    ],
                    childrenIds: [
                        'arwen'
                    ],
                    tier: 2
                },
                {
                    id: 'elros',
                    name: 'Elros Tar-Minyatur',
                    role: 'Ancestral Patriarch',
                    details: {
                        Choice: 'Mortal Man',
                        King: 'Numenor'
                    },
                    parentIds: [
                        'elwing',
                        'earendil'
                    ],
                    childrenIds: [
                        'aragorn'
                    ],
                    tier: 2
                },
                {
                    id: 'arwen',
                    name: 'Arwen Undómiel',
                    role: 'Spouse',
                    details: {
                        Race: 'Elf',
                        Status: 'Mortal Choice'
                    },
                    spouseId: 'aragorn',
                    parentIds: [
                        'elrond',
                        'celebrain'
                    ],
                    tier: 2
                },
                {
                    id: 'aragorn',
                    name: 'Aragorn II Elessar',
                    role: 'Selected Character',
                    details: {
                        Race: 'Dúnadan',
                        Wand: 'Andúril'
                    },
                    spouseId: 'arwen',
                    spouseName: 'Arwen',
                    parentIds: [
                        'elros'
                    ],
                    childrenIds: [
                        'eldarion'
                    ],
                    tier: 2
                },
                {
                    id: 'eldarion',
                    name: 'Eldarion Elessar',
                    role: 'Son',
                    details: {
                        Title: 'King of Reunited Kingdom'
                    },
                    parentIds: [
                        'aragorn',
                        'arwen'
                    ],
                    tier: 3
                }
            ]
        },
        factions: [
            {
                id: 'fellowship',
                name: 'The Fellowship of the Ring',
                emblem: '🛡️',
                desc: 'A council of nine companions representing the free races (Elves, Dwarves, Men, Hobbits) sworn to protect Frodo and destroy the One Ring.',
                leader: 'Gandalf the Grey / Aragorn',
                base: 'Rivendell Sanctuary',
                members: [
                    {
                        name: 'Frodo Baggins',
                        role: 'Ring-bearer',
                        avatar: '💍',
                        charId: 'frodo-baggins'
                    },
                    {
                        name: 'Gandalf the Grey',
                        role: 'Guide',
                        avatar: '🧙‍♂️',
                        charId: 'gandalf'
                    },
                    {
                        name: 'Aragorn Elessar',
                        role: 'Sword',
                        avatar: '👑',
                        charId: 'aragorn'
                    }
                ]
            },
            {
                id: 'gondor',
                name: 'Kingdom of Gondor',
                emblem: '🌳',
                desc: 'The southern kingdom of Men, guarding the White Tree and acting as the main shield of the free world against the dark armies of Mordor.',
                leader: 'Aragorn Elessar',
                base: 'Minas Tirith Stone City',
                members: [
                    {
                        name: 'Aragorn Elessar',
                        role: 'True King',
                        avatar: '👑',
                        charId: 'aragorn'
                    }
                ]
            }
        ],
        lore: [
            {
                id: 'one-ring',
                title: 'The One Ring',
                desc: 'Forged secretly by Sauron in the fires of Mount Doom, holding a massive portion of his divine power to dominate all other Rings of Power and bind Middle-earth in darkness.',
                image: '/Images/oryndor_symbol.png',
                circularRadar: true
            },
            {
                id: 'silmarils',
                title: 'The Silmarils',
                desc: 'Three perfect holy gems crafted by Fëanor in the Elder Days, locking away the sacred primordial light of the Two Trees of Valinor.',
                image: '/Images/cosmic_sphere.png',
                circularRadar: true
            }
        ],
        events: [
            {
                id: 'last-alliance',
                title: 'The Last Alliance of Elves & Men',
                date: 'SA 3441',
                desc: 'The monumental battle at the slopes of Mount Doom where Gil-galad and Elendil defeated Sauron, and Isildur cut the Ring from Sauron\'s hand.',
                image: '/Images/fellowship_mountain.png'
            },
            {
                id: 'council-elrond',
                title: 'The Council of Elrond',
                date: 'TA 3018',
                desc: 'The legendary assembly in Rivendell where representatives of Elves, Dwarves, and Men resolved to cast the One Ring into Mount Doom.',
                image: '/Images/middle_earth_rivendell.png'
            }
        ],
        media: {
            images: [
                {
                    title: 'Rivendell valley at sunrise',
                    url: '/Images/middle_earth_rivendell.png'
                },
                {
                    title: 'Meduseld Golden Hall structure',
                    url: '/Images/fellowship_mountain.png'
                }
            ],
            artifacts: [
                {
                    title: 'Andúril Flame of the West',
                    count: 1
                },
                {
                    title: 'Evenstar Elven Necklace',
                    count: 1
                }
            ],
            videos: [
                {
                    title: 'The Lord of the Rings Saga Retrospective',
                    duration: '5:45'
                }
            ],
            soundtracks: [
                {
                    title: 'Concerning Hobbits (Shire Flute Theme)',
                    duration: '2:55'
                }
            ],
            documents: [
                {
                    title: 'The Red Book of Westmarch (Bilbo Bagins)',
                    count: 1
                }
            ]
        }
    }
};
export function getUniverseData(id: string) {
    const normalizedId = id === 'witcher-movie' || id === 'witcher-game' ? 'witcher' : id;
    if (UNIVERSE_REGISTRY[normalizedId]) return UNIVERSE_REGISTRY[normalizedId];
    // Capitalize and format
    const title = id.replace(/-/g, ' ').replace(/\b\w/g, (c)=>c.toUpperCase());
    // Custom theme colors for high-fidelity aesthetics
    let accentColor = '#fbbf24';
    let backdrop = '/Images/middle_earth_rivendell.png';
    let type = 'CINEMATIC REALM';
    if (id === 'got') {
        accentColor = '#ef4444';
        backdrop = '/Images/got_throne.png';
        type = 'DARK FANTASY';
    } else if (id === 'houseofthedragon') {
        accentColor = '#ef4444';
        backdrop = '/Images/hotd_dragon.png';
        type = 'DARK FANTASY / DRAGONS';
    } else if (id === 'ringsofpower') {
        accentColor = '#fbbf24';
        backdrop = '/Images/rop_forging.png';
        type = 'EPIC FANTASY';
    } else if (id === 'starwars') {
        accentColor = '#3b82f6';
        backdrop = '/Images/starwars_sunset.png';
        type = 'SPACE OPERA / SCI-FI';
    } else if (id === 'eldenring') {
        accentColor = '#f59e0b';
        backdrop = '/Images/elden_ring_tree.png';
        type = 'DARK SOULSLIKE FANTASY';
    } else if (id === 'tes') {
        accentColor = '#06b6d4';
        backdrop = '/Images/tes_skyrim.png';
        type = 'HIGH FANTASY RPG';
    } else if (id === 'witcher') {
        accentColor = '#b91c1c';
        backdrop = '/Images/witcher_forest.png';
        type = 'DARK MONSTER FANTASY';
    } else if (id === 'dune') {
        accentColor = '#f97316';
        backdrop = '/Images/dune_desert.png';
        type = 'SPACE OPERA / SCI-FI';
    } else if (id === 'avatar') {
        accentColor = '#06b6d4';
        backdrop = '/Images/avatar_jungle.png';
        type = 'BIOLUMINESCENT SCI-FI';
    } else if (id === 'marvel') {
        accentColor = '#dc2626';
        backdrop = '/Images/cosmic_sphere.png';
        type = 'SUPERHERO / MULTIVERSE';
    } else if (id === 'gow') {
        accentColor = '#ea580c';
        backdrop = '/Images/god_of_war_axe.png';
        type = 'NORSE MYTHOLOGY ACTION';
    } else if (id === 'zelda') {
        accentColor = '#10b981';
        backdrop = '/Images/witcher_forest.png';
        type = 'HIGH FANTASY ADVENTURE';
    } else if (id === 'thehobbit') {
        accentColor = '#f59e0b';
        backdrop = '/Images/hobbit_erebor.png';
        type = 'HIGH FANTASY ADVENTURE';
    } else if (id === 'breakingbad') {
        accentColor = '#a3e635';
        backdrop = '/Images/breaking_bad_rv.png';
        type = 'CRIME DRAMA / THRILLER';
    } else if (id === 'bloodborne') {
        accentColor = '#06b6d4';
        backdrop = '/Images/bloodborne_yharnam.png';
        type = 'GOTHIC SOULSLIKE HORROR';
    } else if (id === 'cyberpunk') {
        accentColor = '#f43f5e';
        backdrop = '/Images/cyberpunk_neon.png';
        type = 'CYBERPUNK SCI-FI RPG';
    } else if (id === 'masseffect') {
        accentColor = '#3b82f6';
        backdrop = '/Images/mass_effect_normandy.png';
        type = 'SPACE OPERA SCI-FI';
    } else if (id === 'reddead') {
        accentColor = '#ef4444';
        backdrop = '/Images/red_dead_sunset.png';
        type = 'WILD WEST ACTION ADVENTURE';
    } else if (id === 'ac') {
        accentColor = '#ffffff';
        backdrop = '/Images/assassins_creed_dome.png';
        type = 'HISTORICAL SCI-FI ACTION';
    } else if (id === 'roman-empire') {
        accentColor = '#b91c1c';
        backdrop = '/Images/assassins_creed_dome.png';
        type = 'ANCIENT HISTORY';
    } else if (id === 'ancient-egypt') {
        accentColor = '#f59e0b';
        backdrop = '/Images/dune_desert.png';
        type = 'ANCIENT Egyptian HISTORY';
    } else if (id === 'greek-myth') {
        accentColor = '#fbbf24';
        backdrop = '/Images/assassins_creed_dome.png';
        type = 'GREEK MYTHOLOGY';
    } else if (id === 'norse-myth') {
        accentColor = '#06b6d4';
        backdrop = '/Images/god_of_war_axe.png';
        type = 'NORSE MYTHOLOGY';
    } else if (id === 'football-history' || id === 'sports') {
        accentColor = '#10b981';
        backdrop = '/Images/portal_sport.png';
        type = 'SPORTS HISTORY / ARENA';
    } else if (id === 'naruto') {
        accentColor = '#f97316';
        backdrop = '/Images/avatar_jungle.png';
        type = 'ANIME SHONEN ACTION';
    } else if (id === 'onepiece') {
        accentColor = '#3b82f6';
        backdrop = '/Images/middle_earth_map.png';
        type = 'ANIME PIRATE ADVENTURE';
    }

    return {
        id,
        title,
        subtitle: `THE CHRONICLES OF ${title.toUpperCase()}`,
        rating: '9.0/10',
        tagline: `Unlocking the legendary archives, maps, and lore chronicles.`,
        description: `Access the high-resolution tactical map charts, coordinate databases, faction records, and historical scroll documents of the ${title} universe.`,
        backdrop,
        accentColor,
        universeType: type,
        releaseYears: '2000–Present',
        categoryTags: [
            'RPG',
            'LORE',
            'CHRONICLES'
        ],
        metrics: {
            races: '10',
            factions: '15',
            characters: '120+',
            events: '80+'
        },
        locations: [
            {
                name: 'Central Sector Capital',
                desc: 'The major planetary coordinate where factions converge.',
                image: backdrop
            },
            {
                name: 'Outer Borders Sanctuary',
                desc: 'The quiet outskirt mountains serving as training grounds.',
                image: '/Images/fellowship_mountain.png'
            },
            {
                name: 'Ancient Runic Temple',
                desc: 'Ruin housing long-lost relic anomalies.',
                image: '/Images/witcher_forest.png'
            }
        ],
        characters: [
            {
                id: 'champion',
                name: 'The Main Champion',
                role: 'The Chosen Vanguard',
                desc: 'The key protagonist whose lineage dictates the destiny of the entire sector.',
                quote: 'We stand together, or fall alone in the deep space darkness.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Race: 'Human',
                    Title: 'Vanguard Commander',
                    Faction: 'Sovereign Order',
                    Birth: 'Year 001',
                    Status: 'Alive',
                    PlayedBy: 'Cinematic Avatar'
                },
                relationships: [
                    {
                        name: 'The Ancient Mentor',
                        role: 'Advising sage',
                        avatar: '🧙‍♂️',
                        charId: 'mentor'
                    },
                    {
                        name: 'The Dark Overlord',
                        role: 'Sovereign Enemy',
                        avatar: '💀',
                        charId: 'overlord'
                    }
                ],
                tabs: {
                    about: `The primary champion of the ${title} realm, carrying the ancestral blade and coordinate files crucial for restoring order.`,
                    relationships: 'Holds alliances with the free houses, working to bridge planetary bounds.',
                    appearance: 'Wears heavy composite armor engraved with gold glowing runic sigils, carrying the core insignia.',
                    abilities: 'Exceptional master of weaponry, isometric combat, and high-frequency leylines.',
                    quotes: '"Nothing stands between us and the horizon." · "Let the archives record our stand."'
                }
            },
            {
                id: 'mentor',
                name: 'The Ancient Mentor',
                role: 'Keeper of Scrolls',
                desc: 'The elder scholar holding the key to deciphering ancient runes and leylines.',
                quote: 'Look closely at the stars; they record the path of the future.',
                image: '/Images/gandalf_portrait.png',
                stats: {
                    Race: 'Elder Spirit',
                    Title: 'Grand Archon',
                    Faction: 'Order of Scholars',
                    Birth: 'Before Time',
                    Status: 'Active',
                    PlayedBy: 'Dimensional Sage'
                },
                relationships: [
                    {
                        name: 'The Main Champion',
                        role: 'Student Guide',
                        avatar: '⚡',
                        charId: 'champion'
                    }
                ],
                tabs: {
                    about: 'The guiding sage who preserves the ancestral scrolls, pointing the vanguard toward coordinates of the ring anomalies.',
                    relationships: 'Acts as counselor to the royal dynasty, advising on matters of the deep borders.',
                    appearance: 'Draped in cosmic indigo robes that hum with raw magical energy, holding a star-binding wood staff.',
                    abilities: 'Vast foresight and prescience. Deep mastery of elemental transfiguration.',
                    quotes: '"Patience is the ultimate weapon." · "History repeats for those who forget the scrolls."'
                }
            }
        ],
        familyTree: {
            title: 'HOUSE OF ORIGINS',
            members: [
                {
                    id: 'parent-a',
                    name: 'Ancestral Patriarch',
                    role: 'Father',
                    details: {
                        Faction: 'Sovereign Order'
                    },
                    spouseId: 'parent-b',
                    spouseName: 'Matriarch',
                    childrenIds: [
                        'champion'
                    ],
                    tier: 1
                },
                {
                    id: 'parent-b',
                    name: 'Ancestral Matriarch',
                    role: 'Mother',
                    details: {
                        Faction: 'Scholars'
                    },
                    spouseId: 'parent-a',
                    childrenIds: [
                        'champion'
                    ],
                    tier: 1
                },
                {
                    id: 'champion',
                    name: 'The Main Champion',
                    role: 'Selected Character',
                    details: {
                        Class: 'Vanguard'
                    },
                    spouseId: 'spouse',
                    spouseName: 'Allied Princess',
                    parentIds: [
                        'parent-a',
                        'parent-b'
                    ],
                    childrenIds: [
                        'heir'
                    ],
                    tier: 2
                },
                {
                    id: 'spouse',
                    name: 'Allied Princess',
                    role: 'Spouse',
                    details: {
                        Faction: 'Royal Dynasty'
                    },
                    spouseId: 'champion',
                    childrenIds: [
                        'heir'
                    ],
                    tier: 2
                },
                {
                    id: 'heir',
                    name: 'The Royal Heir',
                    role: 'Son',
                    details: {
                        Class: 'Novice'
                    },
                    parentIds: [
                        'champion',
                        'spouse'
                    ],
                    tier: 3
                }
            ]
        },
        factions: [
            {
                id: 'sovereign-vanguard',
                name: 'The Sovereign Vanguard',
                emblem: '🛡️',
                desc: 'The primary military order guarding the outer walls from dimensional corruption.',
                leader: 'The Archon general',
                base: 'Core Citadels',
                members: [
                    {
                        name: 'The Main Champion',
                        role: 'Commander',
                        avatar: '⚡',
                        charId: 'champion'
                    }
                ]
            }
        ],
        lore: [
            {
                id: 'relic-core',
                title: 'The Elemental Relic Core',
                desc: 'A primordial power artifact left by precursors that channels high-frequency cosmic leylines to fuel global systems.',
                image: '/Images/oryndor_symbol.png',
                circularRadar: true
            }
        ],
        events: [
            {
                id: 'awakening',
                title: 'The Stellar Convergence Event',
                date: 'Year 001',
                desc: 'The monumental celestial alignment that unlocked planetary gateways, allowing portals to form.',
                image: backdrop
            }
        ],
        media: {
            images: [
                {
                    title: 'Planetary core view',
                    url: backdrop
                }
            ],
            artifacts: [
                {
                    title: 'Precursor relic orb',
                    count: 1
                }
            ],
            videos: [
                {
                    title: 'Cinematic Universe Trailer',
                    duration: '3:00'
                }
            ],
            soundtracks: [
                {
                    title: 'The Grand Cosmic Anthem',
                    duration: '3:30'
                }
            ],
            documents: [
                {
                    title: 'Ancestral Annals of History',
                    count: 1
                }
            ]
        }
    };
}