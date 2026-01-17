
import { Course } from './types';

// Image paths - using locally generated images
const IMAGES = {
  hero: '/images/bidri_hero.png',
  history: '/images/bidri_history.png',
  materials: '/images/bidri_materials.png',
  engraving: '/images/bidri_engraving.png',
  inlay: '/images/bidri_inlay.png',
  oxidation: '/images/bidri_oxidation.png',
  products: '/images/bidri_products.png',
  advanced: '/images/bidri_advanced.png',
  tools: '/images/bidri_tools.png',
  molding: '/images/bidri_molding.png',
  polishing: '/images/bidri_polishing.png',
  silver: '/images/bidri_silver.png'
};

export const BIDRI_COURSE: Course = {
  id: 'bidri-101',
  title: 'The Master Artisan Path',
  subtitle: 'A complete mastery course from raw alloy to the legendary blackened finish.',
  description: 'Discover the ancient secrets of Bidriwork. Master the 500-year-old art of inlaying silver into oxidized zinc, a heritage craft from the heart of the Deccan.',
  modules: [
    // MODULE 1: History & Heritage
    {
      id: 'module-1',
      title: 'History & Heritage of Bidri',
      description: 'Explore the rich 600-year journey of Bidriware from the Bahmani Sultanate to its protected GI status today.',
      image: IMAGES.history,
      lessons: [
        {
          id: '1-1',
          title: 'Origins in the Deccan Plateau',
          description: 'How Persian artistry merged with Indian soil to create a unique craft tradition.',
          duration: '15 min',
          difficulty: 1,
          image: IMAGES.history,
          keyMaterials: ['Historical texts', 'Archaeological evidence', 'Persian manuscripts'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Birth of a Legend'
            },
            {
              type: 'text',
              content: 'Bidriware traces its origins to the 14th century in Bidar, a historic city in present-day Karnataka, India. The art form flourished under the patronage of the Bahmani Sultans (1347-1527 CE), who ruled the Deccan region. It is widely believed that a Persian artisan named Abdullah-bin-Kaiser introduced the technique of metal inlay work to this region.'
            },
            {
              type: 'image',
              content: IMAGES.history,
              caption: 'The ancient fort and city of Bidar, birthplace of Bidriware'
            },
            {
              type: 'heading',
              content: 'Royal Patronage'
            },
            {
              type: 'text',
              content: 'Sultan Ahmed Shah Wali Bahmani (1422-1436 CE), impressed by Abdullah-bin-Kaiser\'s extraordinary skill, invited him to train local craftsmen. This royal patronage established Bidar as the permanent home of this exquisite art form. The craft was so valued that artisans held privileged positions in the royal courts.'
            },
            {
              type: 'list',
              content: 'Key Historical Milestones',
              items: [
                '14th Century: Persian artisan Abdullah-bin-Kaiser arrives in Bidar',
                '1422 CE: Sultan Ahmed Shah Wali Bahmani establishes the royal workshop',
                '16th Century: Bidriware gains fame across the Indian subcontinent',
                '17th Century: Mughal influence adds new design elements',
                '2006: Bidriware receives Geographical Indication (GI) protection'
              ]
            },
            {
              type: 'text',
              content: 'The name "Bidri" itself derives from the city of Bidar, where generations of artisan families have preserved and perfected this craft. Today, it remains one of India\'s most distinctive metal crafts, recognized globally for its unique aesthetic.'
            }
          ]
        },
        {
          id: '1-2',
          title: 'The Bahmani Sultanate Era',
          description: 'Understanding the golden age of Bidri craftsmanship under royal patronage.',
          duration: '20 min',
          difficulty: 1,
          image: IMAGES.hero,
          keyMaterials: ['Historical records', 'Sultanate artifacts', 'Court chronicles'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Court of the Bahmani Sultans'
            },
            {
              type: 'text',
              content: 'The Bahmani Sultanate represented one of the most culturally sophisticated kingdoms in medieval India. Their courts attracted artists, scholars, and craftsmen from Persia, Arabia, and Turkey. This cosmopolitan atmosphere created the perfect environment for artistic innovation.'
            },
            {
              type: 'image',
              content: IMAGES.products,
              caption: 'Intricate Bidri pieces reflecting the artistic heritage of the Sultanate period'
            },
            {
              type: 'heading',
              content: 'Evolution of Design Language'
            },
            {
              type: 'text',
              content: 'While the technique originated in Persia (where gold or silver was inlaid on steel or copper), the Indian adaptation was revolutionary. Local artisans developed a unique alloy of zinc and copper that could achieve a much deeper, more permanent black through oxidation with local soil.'
            },
            {
              type: 'list',
              content: 'Cultural Influences on Bidri Design',
              items: [
                'Persian: Arabesque patterns, calligraphy, geometric precision',
                'Turkish: Floral motifs, tulip designs',
                'Arabic: Calligraphic inscriptions, star patterns',
                'Mughal: Naturalistic flowers, vine patterns (later period)',
                'Deccani: Local flora, architectural elements from Bidar Fort'
              ]
            },
            {
              type: 'text',
              content: 'The Sultans commissioned Bidri pieces for ceremonial objects, diplomatic gifts, and personal use. Items ranged from huqqa (hookah) bases and sprinklers to betel-nut boxes and sword hilts. The craft became synonymous with wealth, prestige, and artistic excellence.'
            }
          ]
        },
        {
          id: '1-3',
          title: 'Bidri Today: GI Status & Preservation',
          description: 'How modern India protects and promotes this UNESCO-recognized heritage craft.',
          duration: '15 min',
          difficulty: 1,
          image: IMAGES.engraving,
          keyMaterials: ['GI documentation', 'Government policies', 'Artisan interviews'],
          contentSections: [
            {
              type: 'heading',
              content: 'Geographical Indication Protection'
            },
            {
              type: 'text',
              content: 'In 2006, Bidriware was granted Geographical Indication (GI) status under the Geographical Indications of Goods (Registration and Protection) Act, 1999. This legal protection ensures that only products made in Bidar using traditional methods can be called "Bidriware."'
            },
            {
              type: 'image',
              content: IMAGES.engraving,
              caption: 'Modern Bidri artisans preserving centuries-old techniques'
            },
            {
              type: 'heading',
              content: 'Challenges and Revival'
            },
            {
              type: 'text',
              content: 'The craft faces challenges including competition from machine-made imitations, declining numbers of skilled artisans, and changing consumer preferences. However, government initiatives, design interventions by institutions like NID, and growing appreciation for handmade products are driving a revival.'
            },
            {
              type: 'list',
              content: 'Modern Preservation Efforts',
              items: [
                'Karnataka State Handicrafts Development Corporation support',
                'National Institute of Design (NID) contemporary product development',
                'TRIFED marketing and distribution assistance',
                'GI certification preventing counterfeit products',
                'Digital platforms connecting artisans with global markets'
              ]
            },
            {
              type: 'text',
              content: 'Today, approximately 1,000 artisan families in Bidar continue to practice this craft. Many are fourth or fifth-generation craftsmen, carrying forward skills passed down through centuries. The unique combination of inherited wisdom and careful innovation ensures Bidriware remains both authentic and relevant.'
            }
          ]
        }
      ]
    },

    // MODULE 2: Materials & Metallurgy
    {
      id: 'module-2',
      title: 'Materials & Metallurgy',
      description: 'Master the science behind Bidriware: the unique zinc-copper alloy, pure silver, and the legendary soil of Bidar Fort.',
      image: IMAGES.materials,
      lessons: [
        {
          id: '2-1',
          title: 'The Zinc-Copper Alloy',
          description: 'Understanding the unique 16:1 metallurgical composition that defines Bidriware.',
          duration: '25 min',
          difficulty: 2,
          image: IMAGES.materials,
          keyMaterials: ['Zinc (94%)', 'Copper (6%)', 'Crucible', 'Furnace'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Foundation Metal'
            },
            {
              type: 'text',
              content: 'Unlike brass or bronze, Bidri uses a distinctive high-zinc alloy. The traditional ratio is approximately 16 parts zinc to 1 part copper (roughly 94% zinc, 6% copper). This specific composition is crucial—it ensures the metal flows well during casting while providing the reactive surface needed for the signature black oxidation.'
            },
            {
              type: 'image',
              content: IMAGES.materials,
              caption: 'Raw metals being prepared for alloying in a traditional workshop'
            },
            {
              type: 'heading',
              content: 'Why This Specific Ratio?'
            },
            {
              type: 'list',
              content: 'Properties of the Bidri Alloy',
              items: [
                'High zinc content enables deep black oxidation when treated with special soil',
                'Copper addition improves castability and prevents the alloy from being too brittle',
                'The alloy has a lower melting point (~400°C) than bronze, reducing fuel costs',
                'Soft enough for detailed chiseling, yet durable for finished products',
                'The zinc-rich surface reacts with alkaline compounds while silver remains inert'
              ]
            },
            {
              type: 'text',
              content: 'The melting process requires careful temperature control. The crucible is heated in a traditional furnace using charcoal or coal. Zinc, being volatile at high temperatures, can oxidize quickly, so artisans must work swiftly once the alloy reaches the proper fluidity.'
            },
            {
              type: 'heading',
              content: 'Modern Considerations'
            },
            {
              type: 'text',
              content: 'While the fundamental ratio remains unchanged, some contemporary artisans experiment with minor variations for specific products. However, straying too far from the traditional formula can compromise either the blackening process or the structural integrity of the finished piece.'
            }
          ]
        },
        {
          id: '2-2',
          title: 'Pure Silver for Inlay',
          description: 'Why 99.9% pure silver is essential for the contrasting beauty of Bidriware.',
          duration: '20 min',
          difficulty: 2,
          image: IMAGES.silver,
          keyMaterials: ['Pure silver (99.9%)', 'Silver wire', 'Silver sheets', 'Drawing dies'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Importance of Purity'
            },
            {
              type: 'text',
              content: 'Bidriware exclusively uses 99.9% pure silver for inlay work. This high purity is not just about aesthetics—it is essential for both the technique and the chemistry. Pure silver is softer and more malleable than sterling silver, making it easier to hammer into the engraved grooves. More importantly, pure silver remains completely inert during the oxidation process.'
            },
            {
              type: 'image',
              content: IMAGES.silver,
              caption: 'Fine silver wire and sheets used in Bidri inlay work'
            },
            {
              type: 'heading',
              content: 'Forms of Silver Used'
            },
            {
              type: 'list',
              content: 'Silver Preparations for Different Techniques',
              items: [
                'Thin wire (0.3-0.5mm): Used for Tarkashi (wire inlay) and fine line work',
                'Flat wire (ribbon): Used for broader linear patterns',
                'Thin sheets: Used for Teh-Nishan (sheet inlay) and larger motifs',
                'Cut pieces: Custom-shaped for specific design elements',
                'Gold (rare): Historically used in premium Ganga-Yamuna pieces'
              ]
            },
            {
              type: 'text',
              content: 'Artisans draw their own wire from silver ingots using traditional hand-operated drawing dies. This allows precise control over wire thickness. The silver sheets are hammered to the required thinness, typically 0.2-0.3mm for inlay work.'
            },
            {
              type: 'heading',
              content: 'The Science of Contrast'
            },
            {
              type: 'text',
              content: 'The stunning visual impact of Bidriware comes from the stark contrast between the matte black base and the lustrous silver. During oxidation, the zinc in the base alloy reacts with the soil-based solution, turning deep black. Silver, being a noble metal, does not react—it retains its bright, reflective quality, creating an effect that has captivated admirers for six centuries.'
            }
          ]
        },
        {
          id: '2-3',
          title: 'The Sacred Soil of Bidar Fort',
          description: 'Discover the magical earth from the centuries-old Bidar Fort that makes blackening possible.',
          duration: '25 min',
          difficulty: 3,
          image: IMAGES.oxidation,
          keyMaterials: ['Bidar Fort soil', 'Ammonium chloride', 'Water', 'Copper sulphate'],
          contentSections: [
            {
              type: 'heading',
              content: 'A Geological Secret'
            },
            {
              type: 'text',
              content: 'The most guarded secret of Bidriware lies in a special soil found only in the unexposed, centuries-old ruins within Bidar Fort. This soil, collected from specific locations within the fort\'s subterranean passages, is rich in alkaline nitrates and possesses unique oxidizing properties that cannot be replicated elsewhere.'
            },
            {
              type: 'image',
              content: IMAGES.history,
              caption: 'The ancient Bidar Fort, source of the irreplaceable blackening soil'
            },
            {
              type: 'heading',
              content: 'Identifying the Right Soil'
            },
            {
              type: 'text',
              content: 'Experienced artisans identify suitable soil by its appearance and, traditionally, by taste. The soil must come from areas that have remained protected from rain and direct sunlight, where centuries of mineral accumulation have created a uniquely alkaline composition. The potassium nitrate and sodium chloride content is critical.'
            },
            {
              type: 'list',
              content: 'Soil Composition and Properties',
              items: [
                'Rich in potassium nitrate (saltpetre) from ancient organic decomposition',
                'Contains sodium chloride and other alkaline compounds',
                'Acts as a powerful oxidizing agent when combined with ammonium chloride',
                'Must be sourced from unexposed, dark corners of the fort',
                'Cannot be artificially replicated despite scientific analysis'
              ]
            },
            {
              type: 'heading',
              content: 'Preparing the Blackening Solution'
            },
            {
              type: 'text',
              content: 'The soil is mixed with ammonium chloride (nausadar) and water to create a thick paste. This mixture is applied to the heated Bidri piece. The chemical reaction between the zinc-rich alloy and the alkaline solution produces zinc oxide and other compounds that give the surface its permanent, deep black patina. The silver, being chemically inert to this mixture, remains brilliant and untouched.'
            }
          ]
        },
        {
          id: '2-4',
          title: 'Essential Tools of the Trade',
          description: 'A comprehensive guide to the traditional tools used by Bidri artisans.',
          duration: '20 min',
          difficulty: 2,
          image: IMAGES.tools,
          keyMaterials: ['Steel chisels (Kalam)', 'Hammer', 'Files', 'Scrapers', 'Buffing tools'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Artisan\'s Arsenal'
            },
            {
              type: 'text',
              content: 'Bidri artisans use a specialized set of tools, many of which are handmade and passed down through generations. These tools have evolved over centuries to meet the precise demands of different stages in the Bidriware-making process.'
            },
            {
              type: 'image',
              content: IMAGES.tools,
              caption: 'Traditional metalworking tools used by Bidri craftsmen'
            },
            {
              type: 'heading',
              content: 'Casting and Molding Tools'
            },
            {
              type: 'list',
              content: 'For Creating the Base Object',
              items: [
                'Crucibles: Heat-resistant vessels for melting the alloy',
                'Molds: Made from a mixture of soil, castor oil, and resin',
                'Lathes: For shaping and turning cylindrical pieces',
                'Tongs and long-handled tools: For handling hot metal safely'
              ]
            },
            {
              type: 'heading',
              content: 'Engraving and Inlay Tools'
            },
            {
              type: 'list',
              content: 'For Detailed Work',
              items: [
                'Kalam (stylus/chisel): Small steel chisels of varying widths for engraving',
                'Light hammer: For tapping the kalam and setting silver',
                'Files: Coarse and fine, for smoothing surfaces',
                'Scrapers: For removing excess material and achieving smooth finishes',
                'Metal stylus: For sketching designs on the surface'
              ]
            },
            {
              type: 'heading',
              content: 'Finishing Tools'
            },
            {
              type: 'text',
              content: 'Final finishing uses sandpaper of various grades, buffing cloths, and coconut oil for the final polish. Modern artisans may use electric buffing wheels for efficiency, but the traditional hand-finishing methods are still preferred by master craftsmen for the subtle control they offer.'
            }
          ]
        }
      ]
    },

    // MODULE 3: Core Techniques
    {
      id: 'module-3',
      title: 'Core Production Techniques',
      description: 'Master the eight essential stages of Bidriware production, from molten metal to intricate inlay.',
      image: IMAGES.engraving,
      lessons: [
        {
          id: '3-1',
          title: 'Molding & Casting',
          description: 'Creating the base form using traditional lost-wax and sand-casting techniques.',
          duration: '30 min',
          difficulty: 3,
          image: IMAGES.molding,
          keyMaterials: ['Mold soil', 'Castor oil', 'Resin', 'Molten alloy'],
          contentSections: [
            {
              type: 'heading',
              content: 'The First Stage: Creating the Canvas'
            },
            {
              type: 'text',
              content: 'Every piece of Bidriware begins with casting. The mold is created from a special mixture of local soil, castor oil, and resin, which makes the material malleable and heat-resistant. This mixture is pressed and shaped around a master pattern to create the negative form.'
            },
            {
              type: 'image',
              content: IMAGES.molding,
              caption: 'Molten alloy being poured into a traditional mold'
            },
            {
              type: 'heading',
              content: 'Casting Methods'
            },
            {
              type: 'list',
              content: 'Traditional Techniques',
              items: [
                'Lost Wax (Cire Perdue): A wax model is encased in clay, melted out, and replaced with molten alloy',
                'Sand Casting: For simpler shapes, sand molds are used',
                'Two-part Molds: For complex three-dimensional forms',
                'Lathe turning: Hollow vessels are often turned on a lathe after casting'
              ]
            },
            {
              type: 'heading',
              content: 'The Pouring Process'
            },
            {
              type: 'text',
              content: 'The zinc-copper alloy is heated in a crucible until it reaches the proper fluidity (approximately 400-420°C). Working quickly to prevent zinc oxidation, the artisan pours the molten metal into the prepared mold. The pour must be steady and continuous to prevent air pockets and defects.'
            },
            {
              type: 'text',
              content: 'After cooling, the cast piece is carefully removed from the mold. At this stage, it appears rough and gray, bearing little resemblance to the finished masterpiece it will become. The transformation begins in the next stages.'
            }
          ]
        },
        {
          id: '3-2',
          title: 'Filing & Smoothening',
          description: 'Preparing a flawless surface for design work through meticulous filing.',
          duration: '20 min',
          difficulty: 2,
          image: IMAGES.tools,
          keyMaterials: ['Coarse files', 'Fine files', 'Scrapers', 'Sandpaper'],
          contentSections: [
            {
              type: 'heading',
              content: 'Refining the Raw Cast'
            },
            {
              type: 'text',
              content: 'The cast piece emerges from the mold with rough surfaces, seam lines, and minor imperfections. The second stage involves transforming this rough casting into a smooth canvas ready for the artist\'s chisel. This is painstaking work that requires patience and precision.'
            },
            {
              type: 'image',
              content: IMAGES.tools,
              caption: 'Filing and smoothing tools arranged on a workbench'
            },
            {
              type: 'heading',
              content: 'The Smoothening Process'
            },
            {
              type: 'list',
              content: 'Steps to a Perfect Surface',
              items: [
                '1. Remove major casting defects and sprue marks with coarse files',
                '2. File away mold seam lines and rough edges',
                '3. Use progressively finer files to smooth the entire surface',
                '4. Apply scrapers for a uniform texture',
                '5. Final smoothing with fine sandpaper (traditionally emery stone)'
              ]
            },
            {
              type: 'text',
              content: 'The importance of this stage cannot be overstated. Any imperfections left in the surface will be magnified after the blackening process. The goal is a uniformly smooth surface that will accept the design evenly and allow clean, precise chisel work in subsequent stages.'
            },
            {
              type: 'heading',
              content: 'Quality Check'
            },
            {
              type: 'text',
              content: 'Master artisans inspect the smoothened piece by running their fingertips across every surface. They can detect imperfections invisible to the eye. Only when the surface is perfectly uniform does it move to the next stage.'
            }
          ]
        },
        {
          id: '3-3',
          title: 'Designing & Engraving',
          description: 'The art of Kalam-Kari: sketching and chiseling intricate patterns onto metal.',
          duration: '35 min',
          difficulty: 4,
          image: IMAGES.engraving,
          keyMaterials: ['Copper sulphate', 'Steel stylus', 'Chisels (Kalam)', 'Small hammer'],
          contentSections: [
            {
              type: 'heading',
              content: 'Applying the Temporary Black Coating'
            },
            {
              type: 'text',
              content: 'Before designing, the smoothened piece is coated with a copper sulphate solution. This creates a temporary black layer that makes it easier to see the sketched design. The coating will be removed later but is essential for precision work at this stage.'
            },
            {
              type: 'image',
              content: IMAGES.engraving,
              caption: 'Master artisan carefully engraving patterns with a steel kalam'
            },
            {
              type: 'heading',
              content: 'Sketching the Design'
            },
            {
              type: 'text',
              content: 'Using a sharp steel stylus, the artisan sketches the design directly onto the blackened surface. This is traditionally done freehand, without templates or guides—demonstrating the remarkable skill developed over decades of practice. Geometric precision, symmetrical balance, and artistic composition must all be achieved by eye and hand alone.'
            },
            {
              type: 'heading',
              content: 'Chiseling (Kalam-Kari)'
            },
            {
              type: 'list',
              content: 'The Engraving Technique',
              items: [
                'Small steel chisels (kalam) of varying widths are used',
                'A light hammer taps the chisel to create grooves following the sketched lines',
                'Groove depth must be precisely half the thickness of the silver to be inlaid',
                'Too shallow: silver will fall out; Too deep: base may crack during polishing',
                'Grooves must have slightly undercut edges to grip the silver mechanically'
              ]
            },
            {
              type: 'text',
              content: 'The engraving process requires immense concentration. A single slip of the chisel can ruin hours of work. Master engravers develop a rhythmic technique—a steady, precise tapping that produces clean, consistent grooves. This skill takes years to develop.'
            }
          ]
        },
        {
          id: '3-4',
          title: 'Silver Inlay Techniques',
          description: 'Master Tarkashi (wire) and Teh-Nishan (sheet) inlay methods.',
          duration: '40 min',
          difficulty: 5,
          image: IMAGES.inlay,
          keyMaterials: ['Silver wire', 'Silver sheets', 'Setting hammer', 'Burnisher'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Heart of Bidri Artistry'
            },
            {
              type: 'text',
              content: 'Inlaying is where the magic happens. Pure silver (99.9%) is carefully embedded into the engraved grooves, creating the luminous patterns that define Bidriware. Two primary techniques exist, often used in combination within a single piece.'
            },
            {
              type: 'image',
              content: IMAGES.inlay,
              caption: 'Delicate silver wire being inlaid into engraved grooves'
            },
            {
              type: 'heading',
              content: 'Tarkashi: Wire Inlay'
            },
            {
              type: 'text',
              content: 'In Tarkashi, thin silver wire is pressed and hammered into the engraved grooves. The wire must be slightly wider than the groove to create friction and mechanical grip. The artisan uses a small hammer to gently tap the wire into place, then burnishes it flush with the surface.'
            },
            {
              type: 'heading',
              content: 'Teh-Nishan: Sheet Inlay'
            },
            {
              type: 'text',
              content: 'For larger motifs and filled areas, thin silver sheets are cut to shape and hammered into wider, flat-bottomed grooves. The edges of the groove are slightly undercut, creating a dovetail profile that locks the silver in place permanently—no solder or adhesive is ever used.'
            },
            {
              type: 'list',
              content: 'Keys to Successful Inlay',
              items: [
                'Use perfectly pure silver—alloys will not set properly',
                'Wire/sheet must be slightly larger than the groove for secure fit',
                'Hammer strikes must be gentle and controlled to avoid damaging the design',
                'Work methodically across the design to ensure uniform setting',
                'Final burnishing creates a smooth, integrated surface'
              ]
            },
            {
              type: 'text',
              content: 'The mechanical bond between silver and the base alloy is remarkably durable. Properly executed inlay will last centuries without loosening, as evidenced by antique Bidriware pieces that remain intact today.'
            }
          ]
        },
        {
          id: '3-5',
          title: 'Second Smoothening & Polishing',
          description: 'Preparing the inlaid piece for the crucial oxidation process.',
          duration: '20 min',
          difficulty: 2,
          image: IMAGES.polishing,
          keyMaterials: ['Fine files', 'Sandpaper', 'Buffing cloth', 'Polishing compound'],
          contentSections: [
            {
              type: 'heading',
              content: 'Revealing the Design'
            },
            {
              type: 'text',
              content: 'After inlay work is complete, the piece must be carefully smoothened to create a unified surface where silver and base metal are perfectly flush. This stage also removes the temporary copper sulphate coating, revealing the natural color of both metals.'
            },
            {
              type: 'image',
              content: IMAGES.polishing,
              caption: 'Polishing a Bidri piece to prepare for the oxidation process'
            },
            {
              type: 'heading',
              content: 'The Smoothening Process'
            },
            {
              type: 'list',
              content: 'Steps to Perfection',
              items: [
                '1. Use fine files to remove any excess silver above the surface',
                '2. Work carefully to avoid gouging the silver or base metal',
                '3. Progress through finer grades of sandpaper',
                '4. Apply buffing with cloth and appropriate compound',
                '5. Continue until silver and base metal form one smooth surface'
              ]
            },
            {
              type: 'text',
              content: 'At this stage, both metals appear grayish and similar in tone. The piece may look unremarkable, but it is perfectly prepared for the transformative final stages. The uniform smoothness ensures even oxidation across the entire surface.'
            },
            {
              type: 'heading',
              content: 'Quality Before Oxidation'
            },
            {
              type: 'text',
              content: 'This is the last opportunity to correct any imperfections. Once the piece is oxidized, making changes becomes much more difficult. Master artisans scrutinize every detail—loose inlay, surface irregularities, or incomplete designs must be addressed before proceeding.'
            }
          ]
        }
      ]
    },

    // MODULE 4: Advanced Techniques
    {
      id: 'module-4',
      title: 'Advanced Techniques & Styles',
      description: 'Explore prestigious techniques including Aftabi, Ganga-Yamuna, and relief work mastered by only the finest artisans.',
      image: IMAGES.advanced,
      lessons: [
        {
          id: '4-1',
          title: 'Aftabi: The Reverse Inlay',
          description: 'Master the most prestigious technique where silver covers the surface and design appears in black.',
          duration: '35 min',
          difficulty: 5,
          image: IMAGES.advanced,
          keyMaterials: ['Large silver sheets', 'Precision chisels', 'Advanced engraving tools'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Summit of Bidri Mastery'
            },
            {
              type: 'text',
              content: 'Aftabi represents the most difficult and prestigious style of Bidriware. Unlike standard techniques where silver patterns appear on a black background, Aftabi reverses this relationship—the entire surface is covered in silver, with the design appearing in the black base metal. This requires cutting away large areas of metal, a task reserved for master craftsmen with decades of experience.'
            },
            {
              type: 'image',
              content: IMAGES.advanced,
              caption: 'An Aftabi piece demonstrating the reverse inlay technique'
            },
            {
              type: 'heading',
              content: 'Technical Challenges'
            },
            {
              type: 'list',
              content: 'Why Aftabi Requires Mastery',
              items: [
                'Large areas of base metal must be cut away precisely',
                'The remaining "islands" of base metal must maintain structural integrity',
                'Silver sheets must be cut and fitted with microscopic precision',
                'Any error in large silver areas is extremely visible',
                'The technique requires 3-5 times more silver than standard methods'
              ]
            },
            {
              type: 'text',
              content: 'The visual effect of Aftabi is stunning—a sea of gleaming silver with delicate black patterns emerging from within. These pieces command premium prices and are considered collector\'s items. Only a handful of artisans in Bidar today possess the skill for true Aftabi work.'
            },
            {
              type: 'heading',
              content: 'Modern Applications'
            },
            {
              type: 'text',
              content: 'Contemporary Aftabi pieces often feature in luxury interiors and high-end gifting. The technique is also applied to jewelry and small ceremonial objects where its impact is maximized on intimate scales.'
            }
          ]
        },
        {
          id: '4-2',
          title: 'Ganga-Yamuna: Gold & Silver Harmony',
          description: 'The rare technique combining gold and silver inlay, named after India\'s sacred rivers.',
          duration: '30 min',
          difficulty: 5,
          image: IMAGES.hero,
          keyMaterials: ['Pure gold wire', 'Pure silver wire', 'Precision tools'],
          contentSections: [
            {
              type: 'heading',
              content: 'Where Precious Metals Meet'
            },
            {
              type: 'text',
              content: 'The Ganga-Yamuna pattern takes its name from the sacred confluence of India\'s two great rivers. Historically, this technique involved inlaying both gold and silver into the same piece, creating a visual metaphor for the meeting of divine waters. The gold represented the Ganga, and the silver, the Yamuna.'
            },
            {
              type: 'image',
              content: IMAGES.hero,
              caption: 'Intricate pattern with delicate metalwork'
            },
            {
              type: 'heading',
              content: 'Historical Significance'
            },
            {
              type: 'text',
              content: 'During the Mughal period, Ganga-Yamuna pieces were reserved for royalty and the highest nobility. The combination of gold and silver on the matte black base created a tricolor effect of extraordinary beauty. These pieces were often commissioned as gifts for diplomatic occasions.'
            },
            {
              type: 'heading',
              content: 'Contemporary Practice'
            },
            {
              type: 'list',
              content: 'Modern Interpretations',
              items: [
                'True gold inlay is rare today due to cost',
                'Some artisans use brass as a gold substitute for the warm tone',
                'Copper is sometimes combined with silver for a similar effect',
                'Pure gold work is still available from master craftsmen for premium pieces',
                'The technique adds significant time and cost to production'
              ]
            },
            {
              type: 'text',
              content: 'When executed in true gold and silver, the Ganga-Yamuna technique creates pieces of museum quality. The three-way contrast of black, silver, and gold produces a visual richness unmatched in metalwork traditions worldwide.'
            }
          ]
        },
        {
          id: '4-3',
          title: 'Relief Work: Zarnishan & Zarbuland',
          description: 'Creating dimensional designs through low and high relief carving techniques.',
          duration: '25 min',
          difficulty: 4,
          image: IMAGES.products,
          keyMaterials: ['Deep chisels', 'Carving tools', 'Modeling tools'],
          contentSections: [
            {
              type: 'heading',
              content: 'Adding Dimension to Design'
            },
            {
              type: 'text',
              content: 'While most Bidriware features flat inlay work, relief techniques add a sculptural dimension. These methods carve into or build up the surface to create three-dimensional effects that catch light and shadow, adding drama and depth to the finished piece.'
            },
            {
              type: 'image',
              content: IMAGES.products,
              caption: 'Collection of Bidri pieces showing various relief work styles'
            },
            {
              type: 'heading',
              content: 'Zarnishan: Low Relief'
            },
            {
              type: 'text',
              content: 'In Zarnishan, the background is cut away slightly, leaving the main design elements raised above the surface. The depth is subtle—typically 1-2mm—but sufficient to create shadow and visual interest. Silver may be inlaid into either the raised or recessed areas.'
            },
            {
              type: 'heading',
              content: 'Zarbuland: High Relief'
            },
            {
              type: 'text',
              content: 'Zarbuland involves more dramatic dimensional work, with design elements standing proud of the surface by several millimeters. This technique requires thicker casting to allow for deep carving while maintaining structural integrity.'
            },
            {
              type: 'list',
              content: 'Applications of Relief Techniques',
              items: [
                'Architectural elements on large decorative pieces',
                'Figurative designs depicting animals, flowers, and geometric forms',
                'Border treatments framing central flat inlay',
                'Mixed technique pieces combining flat and relief work',
                'Contemporary sculptural Bidri art pieces'
              ]
            }
          ]
        }
      ]
    },

    // MODULE 5: Finishing & Products
    {
      id: 'module-5',
      title: 'The Black Magic & Final Products',
      description: 'The transformative oxidation process and the diverse range of traditional and contemporary Bidri products.',
      image: IMAGES.oxidation,
      lessons: [
        {
          id: '5-1',
          title: 'The Oxidation Process',
          description: 'The chemistry and technique behind the signature matte black finish.',
          duration: '30 min',
          difficulty: 3,
          image: IMAGES.oxidation,
          keyMaterials: ['Bidar Fort soil', 'Ammonium chloride', 'Heat source', 'Water'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Transformation'
            },
            {
              type: 'text',
              content: 'The oxidation stage is where Bidriware earns its name and legend. A carefully prepared paste is applied to the heated piece, chemically transforming the zinc-rich surface to a permanent, deep black while leaving the silver completely untouched. This is the "black magic" of Bidri craftsmanship.'
            },
            {
              type: 'image',
              content: IMAGES.oxidation,
              caption: 'The dramatic moment of oxidation revealing the silver patterns'
            },
            {
              type: 'heading',
              content: 'Preparing the Oxidizing Solution'
            },
            {
              type: 'list',
              content: 'The Secret Recipe',
              items: [
                'Collect special soil from designated locations in Bidar Fort',
                'Mix soil with ammonium chloride (sal ammoniac/nausadar)',
                'Add water to create a thick, workable paste',
                'The consistency should be like thick cream',
                'Prepare fresh for each use—mixture loses potency quickly'
              ]
            },
            {
              type: 'heading',
              content: 'The Application Process'
            },
            {
              type: 'text',
              content: 'The polished piece is first preheated to improve the reaction rate. The artisan then applies the paste evenly across the entire surface, ensuring complete coverage. The chemical reaction begins immediately—the zinc in the alloy reacts with the alkaline nitrates in the soil mixture, forming black zinc oxide and other compounds.'
            },
            {
              type: 'text',
              content: 'After a few minutes, the piece is rinsed with clean water. The paste washes away to reveal the dramatic transformation: the base metal has turned a rich, matte black, while the inlaid silver gleams untouched—bright and brilliant against the dark backdrop.'
            },
            {
              type: 'heading',
              content: 'The Chemistry Explained'
            },
            {
              type: 'text',
              content: 'The blackening is caused by oxidation of zinc to zinc oxide, combined with the formation of zinc chloride and other compounds. Silver, being a noble metal, does not react with these compounds and remains inert. This selective chemistry is what makes Bidriware possible—and why the specific Bidar Fort soil, with its unique mineral composition, cannot be replicated.'
            }
          ]
        },
        {
          id: '5-2',
          title: 'Final Polishing & Preservation',
          description: 'Buffing and caring for heritage metalwork to ensure lasting beauty.',
          duration: '20 min',
          difficulty: 2,
          image: IMAGES.polishing,
          keyMaterials: ['Coconut oil', 'Soft cloth', 'Buffing wheel', 'Polishing compounds'],
          contentSections: [
            {
              type: 'heading',
              content: 'The Final Touch'
            },
            {
              type: 'text',
              content: 'After oxidation and rinsing, the Bidri piece requires final finishing to achieve its characteristic appearance. This stage deepens the black patina and brings out the full luster of the silver inlay.'
            },
            {
              type: 'image',
              content: IMAGES.polishing,
              caption: 'Final buffing of a completed Bidri piece'
            },
            {
              type: 'heading',
              content: 'Oil Finishing'
            },
            {
              type: 'text',
              content: 'Traditionally, coconut oil or groundnut oil is rubbed onto the surface. The oil is absorbed into the porous oxidized layer, deepening and enriching the black color. It also protects the surface from fingerprints and minor environmental damage.'
            },
            {
              type: 'heading',
              content: 'Silver Polishing'
            },
            {
              type: 'list',
              content: 'Bringing Out the Brilliance',
              items: [
                'Gentle buffing with a soft cloth removes any residue',
                'Silver polish may be carefully applied to highlight the inlay',
                'Avoid abrasive polishes that might scratch the black surface',
                'The contrast between matte black and polished silver should be maximized',
                'Electric buffing wheels can be used but require skilled handling'
              ]
            },
            {
              type: 'heading',
              content: 'Caring for Bidriware'
            },
            {
              type: 'text',
              content: 'Finished Bidriware is remarkably durable. The black patina is non-corrosive and will not fade over time. To maintain beauty: dust regularly with a soft cloth, occasionally apply a light coating of oil, and avoid harsh chemicals. The silver may develop tarnish over time, which can be removed with gentle silver polish without affecting the black base.'
            }
          ]
        },
        {
          id: '5-3',
          title: 'Traditional & Contemporary Products',
          description: 'From hookah bases to USB drives: the evolving world of Bidri products.',
          duration: '25 min',
          difficulty: 1,
          image: IMAGES.products,
          keyMaterials: ['Various Bidri products', 'Design catalogs', 'Market research'],
          contentSections: [
            {
              type: 'heading',
              content: 'A Heritage of Forms'
            },
            {
              type: 'text',
              content: 'Bidriware has always served both functional and decorative purposes. Traditional forms evolved from the needs of royal courts and nobility, while contemporary applications adapt the art to modern lifestyles. This diversity ensures the craft remains relevant across centuries.'
            },
            {
              type: 'image',
              content: IMAGES.products,
              caption: 'A collection of traditional Bidri vessels and decorative pieces'
            },
            {
              type: 'heading',
              content: 'Traditional Products'
            },
            {
              type: 'list',
              content: 'Historic Forms Still Made Today',
              items: [
                'Huqqa (hookah) bases: Perhaps the most iconic Bidri form',
                'Surahi (long-necked vessel): For water or rose water',
                'Pandan/Paandaan: Betel leaf containers',
                'Gulabpash: Rose water sprinklers',
                'Chhilam: Pipe bowls for huqqas',
                'Boxes: For jewelry, cards, and precious items',
                'Trays and plates: Serving and decorative use'
              ]
            },
            {
              type: 'heading',
              content: 'Contemporary Innovations'
            },
            {
              type: 'list',
              content: 'Modern Applications',
              items: [
                'Jewelry: Pendants, cufflinks, earrings, rings',
                'Home décor: Vases, lampshades, photo frames, clocks',
                'Office accessories: Pen stands, paperweights, business card holders',
                'Tech accessories: USB drive covers, phone stands, laptop accents',
                'Corporate gifts: Custom-branded items for luxury gifting',
                'Art installations: Large-scale sculptural pieces'
              ]
            },
            {
              type: 'heading',
              content: 'Design Evolution'
            },
            {
              type: 'text',
              content: 'While traditional motifs remain popular, contemporary designers have introduced new patterns including abstract designs, modern geometric forms, and even personalized text and logos. Organizations like the National Institute of Design (NID) have collaborated with artisans to develop products that appeal to younger, global audiences while maintaining authentic Bidri craftsmanship.'
            },
            {
              type: 'text',
              content: 'This balance of tradition and innovation is essential for the craft\'s survival. By finding new applications and markets, Bidri artisans can sustain their livelihoods while preserving the ancient skills passed down through generations.'
            }
          ]
        }
      ]
    }
  ]
};

// Helper function to get all lessons flattened
export const getAllLessons = () => {
  return BIDRI_COURSE.modules.flatMap(module => 
    module.lessons.map(lesson => ({
      ...lesson,
      moduleId: module.id,
      moduleTitle: module.title
    }))
  );
};

// Helper function to get lesson navigation info
export const getLessonNavigation = (currentLessonId: string) => {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  
  return {
    current: allLessons[currentIndex],
    previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
    next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    currentIndex,
    totalLessons: allLessons.length
  };
};
