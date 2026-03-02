import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

// Wikipedia URL helpers
const WIKI = "https://en.wikipedia.org/wiki/";
const THINKER_WIKI = {
  "Barthes (early)": "Roland_Barthes", "Barthes (late)": "Roland_Barthes",
  "James (William)": "William_James", "Jackson (Rosemary)": "Rosemary_Jackson",
  "Gilbert & Gubar": "Sandra_Gilbert", "the Formalists": "Russian_formalism",
  "Shelley (Mary)": "Mary_Shelley", "Octavia Butler": "Octavia_E._Butler",
  "de Beauvoir": "Simone_de_Beauvoir", "de Certeau": "Michel_de_Certeau",
  "de Man": "Paul_de_Man", "hooks": "Bell_hooks", "de Quincey": "Thomas_De_Quincey",
  "M.R. James": "M._R._James", "M. John Harrison": "M._John_Harrison",
  "Mark Fisher": "Mark_Fisher_(theorist)", "Sun Ra": "Sun_Ra",
  "van Gennep": "Arnold_van_Gennep", "Robert Eggers": "Robert_Eggers",
  "George Eliot": "George_Eliot", "Angela Carter": "Angela_Carter",
  "Clive Barker": "Clive_Barker", "Adam Nevill": "Adam_Nevill",
  "Shirley Jackson": "Shirley_Jackson", "Le Guin": "Ursula_K._Le_Guin",
  "Dick": "Philip_K._Dick", "Poe": "Edgar_Allan_Poe",
  "Shelley": "Percy_Bysshe_Shelley", "Wilde": "Oscar_Wilde",
  "Keats": "John_Keats", "Wordsworth": "William_Wordsworth",
  "Hugo": "Victor_Hugo", "Novalis": "Novalis",
  "Hume": "David_Hume", "Kant": "Immanuel_Kant",
  "Voltaire": "Voltaire", "Diderot": "Denis_Diderot",
  "Horace": "Horace", "Virgil": "Virgil",
  "Aristotle": "Aristotle", "Plato": "Plato",
  "Flaubert": "Gustave_Flaubert", "Tolstoy": "Leo_Tolstoy",
  "Balzac": "Honoré_de_Balzac", "Zola": "Émile_Zola",
  "Dreiser": "Theodore_Dreiser", "Crane": "Stephen_Crane",
  "Norris": "Frank_Norris", "Mallarmé": "Stéphane_Mallarmé",
  "Rimbaud": "Arthur_Rimbaud", "Verlaine": "Paul_Verlaine",
  "Yeats": "W._B._Yeats", "Baudelaire": "Charles_Baudelaire",
  "Pater": "Walter_Pater", "Huysmans": "Joris-Karl_Huysmans",
  "Gautier": "Théophile_Gautier", "Rachilde": "Rachilde",
  "Hoffmann": "E._T._A._Hoffmann", "Hawthorne": "Nathaniel_Hawthorne",
  "Melville": "Herman_Melville", "Lovecraft": "H._P._Lovecraft",
  "Machen": "Arthur_Machen", "Blackwood": "Algernon_Blackwood",
  "Hodgson": "William_Hope_Hodgson", "Chambers": "Robert_W._Chambers",
  "Joyce": "James_Joyce", "Woolf": "Virginia_Woolf",
  "Eliot": "T._S._Eliot", "Pound": "Ezra_Pound",
  "Kafka": "Franz_Kafka", "Breton": "André_Breton",
  "Lautréamont": "Comte_de_Lautréamont", "Éluard": "Paul_Éluard",
  "Césaire": "Aimé_Césaire", "Hughes": "Langston_Hughes",
  "Hurston": "Zora_Neale_Hurston", "Locke": "Alain_LeRoy_Locke",
  "McKay": "Claude_McKay", "Larsen": "Nella_Larsen",
  "Sartre": "Jean-Paul_Sartre", "Camus": "Albert_Camus",
  "Kierkegaard": "Søren_Kierkegaard", "Dostoevsky": "Fyodor_Dostoevsky",
  "Kerouac": "Jack_Kerouac", "Ginsberg": "Allen_Ginsberg",
  "Burroughs": "William_S._Burroughs", "Corso": "Gregory_Corso",
  "Brooks": "Cleanth_Brooks", "Ransom": "John_Crowe_Ransom",
  "Wimsatt": "William_K._Wimsatt", "Warren": "Robert_Penn_Warren",
  "Saussure": "Ferdinand_de_Saussure", "Lévi-Strauss": "Claude_Lévi-Strauss",
  "Jakobson": "Roman_Jakobson", "Ballard": "J._G._Ballard",
  "Delany": "Samuel_R._Delany", "Ellison": "Harlan_Ellison",
  "Moorcock": "Michael_Moorcock", "Derrida": "Jacques_Derrida",
  "Foucault": "Michel_Foucault", "Deleuze": "Gilles_Deleuze",
  "Pynchon": "Thomas_Pynchon", "DeLillo": "Don_DeLillo",
  "Barth": "John_Barth", "Borges": "Jorge_Luis_Borges",
  "Calvino": "Italo_Calvino", "Said": "Edward_Said",
  "Fanon": "Frantz_Fanon", "Spivak": "Gayatri_Chakravorty_Spivak",
  "Achebe": "Chinua_Achebe", "Rushdie": "Salman_Rushdie",
  "García Márquez": "Gabriel_García_Márquez", "Allende": "Isabel_Allende",
  "Carpentier": "Alejo_Carpentier", "Cixous": "Hélène_Cixous",
  "Irigaray": "Luce_Irigaray", "Kristeva": "Julia_Kristeva",
  "Gibson": "William_Gibson", "Sterling": "Bruce_Sterling",
  "Stephenson": "Neal_Stephenson", "Cadigan": "Pat_Cadigan",
  "Miéville": "China_Miéville", "VanderMeer": "Jeff_VanderMeer",
  "Catling": "Brian_Catling", "Butler": "Octavia_E._Butler",
  "Jemisin": "N._K._Jemisin", "Eshun": "Kodwo_Eshun",
  "Okorafor": "Nnedi_Okorafor", "Longinus": "Longinus_(literature)",
  "Burke": "Edmund_Burke", "Auerbach": "Erich_Auerbach",
  "Bernays": "Jacob_Bernays", "Freud": "Sigmund_Freud",
  "Marx": "Karl_Marx", "Brecht": "Bertolt_Brecht",
  "Barthes": "Roland_Barthes", "Genette": "Gérard_Genette",
  "Bakhtin": "Mikhail_Bakhtin", "Shklovsky": "Viktor_Shklovsky",
  "Walpole": "Horace_Walpole", "Radcliffe": "Ann_Radcliffe",
  "Morrison": "Toni_Morrison", "Booth": "Wayne_C._Booth",
  "Nabokov": "Vladimir_Nabokov", "Ishiguro": "Kazuo_Ishiguro",
  "Benjamin": "Walter_Benjamin", "Rabelais": "François_Rabelais",
  "Bentham": "Jeremy_Bentham", "Orwell": "George_Orwell",
  "Atwood": "Margaret_Atwood", "Du Bois": "W._E._B._Du_Bois",
  "Fisher": "Mark_Fisher_(theorist)", "Sebald": "W._G._Sebald",
  "Richards": "I._A._Richards", "Empson": "William_Empson",
  "Ligotti": "Thomas_Ligotti", "Bataille": "Georges_Bataille",
  "Cronenberg": "David_Cronenberg", "Suvin": "Darko_Suvin",
  "Otto": "Rudolf_Otto", "Tolkien": "J._R._R._Tolkien",
  "Lewis": "C._S._Lewis", "Peake": "Mervyn_Peake",
  "Jordan": "Robert_Jordan", "Saramago": "José_Saramago",
  "Turner": "Victor_Turner", "Barker": "Clive_Barker",
  "Danielewski": "Mark_Z._Danielewski", "Huxley": "Aldous_Huxley",
  "Zamyatin": "Yevgeny_Zamyatin", "Todorov": "Tzvetan_Todorov",
  "Cortázar": "Julio_Cortázar", "Levinas": "Emmanuel_Levinas",
  "McCarthy": "Cormac_McCarthy", "Cohen": "Jeffrey_Jerome_Cohen",
  "Eco": "Umberto_Eco", "Blake": "William_Blake",
  "Debord": "Guy_Debord", "Sinclair": "Iain_Sinclair",
  "Perec": "Georges_Perec", "Tarkovsky": "Andrei_Tarkovsky",
  "Faulkner": "William_Faulkner", "Beckett": "Samuel_Beckett",
  "Ionesco": "Eugène_Ionesco", "Emerson": "Ralph_Waldo_Emerson",
  "Thoreau": "Henry_David_Thoreau", "Fuller": "Margaret_Fuller",
  "Piranesi (Clarke)": "Susanna_Clarke",
  "van Gennep": "Arnold_van_Gennep",
};

const NODE_WIKI = {
  classicism: "Classicism", enlightenment: "Age_of_Enlightenment",
  romanticism: "Romanticism", transcendentalism: "Transcendentalism",
  dark_romanticism: "Dark_romanticism", realism: "Literary_realism",
  naturalism: "Naturalism_(literature)", symbolism: "Symbolism_(arts)",
  aestheticism: "Aestheticism", decadence: "Decadent_movement",
  weird_fiction: "Weird_fiction", modernism: "Literary_modernism",
  surrealism: "Surrealism", harlem_renaissance: "Harlem_Renaissance",
  existentialism: "Existentialism", beat_generation: "Beat_Generation",
  new_criticism: "New_Criticism", structuralism: "Structuralism",
  new_wave_sf: "New_Wave_science_fiction",
  poststructuralism: "Post-structuralism", postmodernism: "Postmodern_literature",
  postcolonialism: "Postcolonialism", magical_realism: "Magic_realism",
  feminist_lit: "Feminist_literary_criticism", cyberpunk: "Cyberpunk",
  new_weird: "New_weird", afrofuturism: "Afrofuturism",
  the_sublime: "Sublime_(philosophy)", mimesis: "Mimesis",
  catharsis: "Catharsis", alienation: "Marx%27s_theory_of_alienation",
  the_uncanny: "Uncanny", intertextuality: "Intertextuality",
  death_of_author: "The_Death_of_the_Author",
  stream_of_consciousness: "Stream_of_consciousness_(narrative_mode)",
  the_absurd: "Absurdism", defamiliarization: "Defamiliarization",
  gothic: "Gothic_fiction", unreliable_narrator: "Unreliable_narrator",
  flaneur: "Flâneur", carnival: "Carnivalesque",
  panopticon: "Panopticon", double_consciousness: "Double_consciousness",
  ecriture_feminine: "Écriture_féminine", hauntology: "Hauntology",
  palimpsest: "Palimpsest", close_reading: "Close_reading",
  heteroglossia: "Heteroglossia", cosmic_horror: "Lovecraftian_horror",
  the_abject: "Abjection", cognitive_estrangement: "Cognitive_estrangement",
  the_numinous: "Numinous", secondary_creation: "Mythopoeia#Sub-creation",
  the_doppelganger: "Doppelgänger", liminality: "Liminality",
  body_horror: "Body_horror", folk_horror: "Folk_horror",
  dystopia: "Dystopia", the_fantastic: "Fantastic",
  the_other: "Other_(philosophy)", apocalypticism: "Apocalypticism",
  epistemic_horror: "Cosmic_horror", the_monstrous: "Monster_theory",
  the_labyrinth: "Labyrinth", mythopoeia: "Mythopoeia",
  psychogeography: "Psychogeography", the_weird: "Weird_fiction",
  the_eerie: "The_Weird_and_the_Eerie",
};

function wikiUrl(name) {
  if (THINKER_WIKI[name]) return WIKI + THINKER_WIKI[name];
  return WIKI + name.replace(/ /g, "_");
}

function nodeWikiUrl(id) {
  if (NODE_WIKI[id]) return WIKI + NODE_WIKI[id];
  return null;
}

const NODES = [
  { id: "classicism", label: "Classicism", type: "movement", era: "ancient", description: "Emphasis on order, harmony, proportion, and adherence to established forms. Rooted in Greek and Roman models.", thinkers: ["Aristotle", "Horace", "Virgil"], works: ["Poetics", "Ars Poetica", "Aeneid"] },
  { id: "enlightenment", label: "Enlightenment", type: "movement", era: "18c", description: "Reason as the primary authority. Skepticism of tradition, emphasis on empiricism, individual liberty, and progress.", thinkers: ["Voltaire", "Diderot", "Hume", "Kant"], works: ["Candide", "Encyclopédie", "Critique of Pure Reason"] },
  { id: "romanticism", label: "Romanticism", type: "movement", era: "19c-early", description: "Revolt against rationalism. Elevation of emotion, imagination, the sublime, nature, and the individual genius.", thinkers: ["Wordsworth", "Shelley", "Keats", "Novalis", "Hugo"], works: ["Lyrical Ballads", "Frankenstein", "Hymns to the Night"] },
  { id: "transcendentalism", label: "Transcendentalism", type: "movement", era: "19c-early", description: "American offshoot of Romanticism. Inherent goodness of people and nature, self-reliance, spiritual unity.", thinkers: ["Emerson", "Thoreau", "Fuller"], works: ["Self-Reliance", "Walden", "Woman in the 19th Century"] },
  { id: "dark_romanticism", label: "Dark Romanticism", type: "movement", era: "19c-early", description: "The shadow-side of Romanticism. Sin, self-destruction, the demonic, and the fallibility of the human will.", thinkers: ["Poe", "Hawthorne", "Melville", "Hoffmann"], works: ["The Fall of the House of Usher", "The Scarlet Letter", "Moby-Dick"] },
  { id: "realism", label: "Realism", type: "movement", era: "19c-mid", description: "Faithful representation of everyday life without idealization. Focus on middle-class experience and social conditions.", thinkers: ["Flaubert", "Tolstoy", "George Eliot", "Balzac"], works: ["Madame Bovary", "Anna Karenina", "Middlemarch"] },
  { id: "naturalism", label: "Naturalism", type: "movement", era: "19c-late", description: "Extension of realism through scientific determinism. Humans as animals shaped by heredity and environment.", thinkers: ["Zola", "Dreiser", "Crane", "Norris"], works: ["Germinal", "Sister Carrie", "The Red Badge of Courage"] },
  { id: "symbolism", label: "Symbolism", type: "movement", era: "19c-late", description: "Rejection of realism in favor of suggestion, musicality, and the evocation of inner states through symbols.", thinkers: ["Baudelaire", "Mallarmé", "Rimbaud", "Verlaine", "Yeats"], works: ["Les Fleurs du mal", "A Season in Hell", "Un Coup de Dés"] },
  { id: "aestheticism", label: "Aestheticism", type: "movement", era: "19c-late", description: "Art for art's sake. Beauty as the highest value, severed from moral or social utility.", thinkers: ["Wilde", "Pater", "Huysmans", "Gautier"], works: ["The Picture of Dorian Gray", "Against Nature"] },
  { id: "decadence", label: "Decadence", type: "movement", era: "19c-late", description: "Cultivation of artifice over nature, perversity over convention. Fascination with decay, ennui, and transgressive beauty.", thinkers: ["Huysmans", "Wilde", "Baudelaire", "Rachilde"], works: ["Against Nature", "Salomé", "Monsieur Vénus"] },
  { id: "weird_fiction", label: "Weird Fiction", type: "movement", era: "20c-early", description: "Literature of radical ontological wrongness. Not ghosts or monsters but the sense that reality itself is alien.", thinkers: ["Lovecraft", "Machen", "Blackwood", "Hodgson", "Chambers"], works: ["The Call of Cthulhu", "The Great God Pan", "The Willows"] },
  { id: "modernism", label: "Modernism", type: "movement", era: "20c-early", description: "Radical break with tradition. Fragmentation, stream of consciousness, mythic method, alienation, formal experimentation.", thinkers: ["Joyce", "Woolf", "Eliot", "Pound", "Kafka"], works: ["Ulysses", "Mrs Dalloway", "The Waste Land", "The Trial"] },
  { id: "surrealism", label: "Surrealism", type: "movement", era: "20c-early", description: "Liberation of the unconscious mind. Automatic writing, dream logic, juxtaposition of the irrational.", thinkers: ["Breton", "Lautréamont", "Éluard", "Césaire"], works: ["Nadja", "Manifestoes of Surrealism"] },
  { id: "harlem_renaissance", label: "Harlem Renaissance", type: "movement", era: "20c-early", description: "Flowering of Black art, literature, and intellectual life. Reclamation of identity, folk traditions, and the politics of visibility.", thinkers: ["Hughes", "Hurston", "Locke", "McKay", "Larsen"], works: ["The Weary Blues", "Their Eyes Were Watching God"] },
  { id: "existentialism", label: "Existentialism", type: "movement", era: "20c-mid", description: "Existence precedes essence. Radical freedom, absurdity, authenticity, anxiety, and the weight of choice.", thinkers: ["Sartre", "Camus", "de Beauvoir", "Kierkegaard", "Dostoevsky"], works: ["Being and Nothingness", "The Stranger", "The Second Sex"] },
  { id: "beat_generation", label: "Beat Generation", type: "movement", era: "20c-mid", description: "Rejection of conformity, spontaneous prose, spiritual seeking, drugs, jazz, and the open road.", thinkers: ["Kerouac", "Ginsberg", "Burroughs", "Corso"], works: ["On the Road", "Howl", "Naked Lunch"] },
  { id: "new_criticism", label: "New Criticism", type: "movement", era: "20c-mid", description: "Close reading of the text as a self-contained object. Rejection of authorial intent and historical context.", thinkers: ["Brooks", "Ransom", "Wimsatt", "Warren"], works: ["The Well Wrought Urn", "Understanding Poetry"] },
  { id: "structuralism", label: "Structuralism", type: "movement", era: "20c-mid", description: "Meaning arises from underlying systems and structures. Language as a model for all cultural phenomena.", thinkers: ["Saussure", "Lévi-Strauss", "Barthes (early)", "Jakobson"], works: ["Course in General Linguistics", "Mythologiques"] },
  { id: "new_wave_sf", label: "New Wave SF", type: "movement", era: "20c-mid", description: "Science fiction turns inward. Psychological depth, literary ambition, social critique replace hardware.", thinkers: ["Ballard", "Le Guin", "Delany", "Ellison", "Moorcock"], works: ["The Drowned World", "The Left Hand of Darkness", "Dhalgren"] },
  { id: "poststructuralism", label: "Post-structuralism", type: "movement", era: "20c-late", description: "Dismantling of stable structures. Meaning endlessly deferred, power permeates discourse.", thinkers: ["Derrida", "Foucault", "Deleuze", "Barthes (late)"], works: ["Of Grammatology", "Discipline and Punish", "S/Z"] },
  { id: "postmodernism", label: "Postmodernism", type: "movement", era: "20c-late", description: "Skepticism of grand narratives, playful self-referentiality, pastiche, blurred high/low boundaries.", thinkers: ["Pynchon", "DeLillo", "Barth", "Borges", "Calvino"], works: ["Gravity's Rainbow", "White Noise", "Ficciones"] },
  { id: "postcolonialism", label: "Postcolonialism", type: "movement", era: "20c-late", description: "Interrogation of colonial legacies, power, identity, hybridity, and the politics of representation.", thinkers: ["Said", "Fanon", "Spivak", "Achebe", "Rushdie"], works: ["Orientalism", "The Wretched of the Earth", "Things Fall Apart"] },
  { id: "magical_realism", label: "Magical Realism", type: "movement", era: "20c-late", description: "The marvelous treated as mundane. Reality and fantasy coexist without contradiction.", thinkers: ["García Márquez", "Allende", "Rushdie", "Carpentier"], works: ["One Hundred Years of Solitude", "Midnight's Children"] },
  { id: "feminist_lit", label: "Feminist Literary Thought", type: "movement", era: "20c-late", description: "Interrogation of gender in literary production, canon formation, and textual meaning.", thinkers: ["de Beauvoir", "Woolf", "Cixous", "hooks", "Gilbert & Gubar"], works: ["A Room of One's Own", "The Second Sex", "The Laugh of the Medusa"] },
  { id: "cyberpunk", label: "Cyberpunk", type: "movement", era: "20c-late", description: "High tech, low life. Corporate dystopia, body modification, virtual reality, street-level survival.", thinkers: ["Gibson", "Sterling", "Dick", "Stephenson", "Cadigan"], works: ["Neuromancer", "Do Androids Dream of Electric Sheep?", "Snow Crash"] },
  { id: "new_weird", label: "New Weird", type: "movement", era: "21c", description: "Post-Lovecraftian genre-blending: fantasy, SF, and horror collapsed together. Politically aware, ecologically anxious.", thinkers: ["Miéville", "VanderMeer", "M. John Harrison", "Catling"], works: ["Perdido Street Station", "Annihilation", "The Vorrh"] },
  { id: "afrofuturism", label: "Afrofuturism", type: "movement", era: "21c", description: "Black speculative thought blending science fiction, mythology, and Afrodiasporic traditions.", thinkers: ["Butler", "Jemisin", "Sun Ra", "Eshun", "Okorafor"], works: ["Kindred", "The Fifth Season", "Space Is the Place", "Binti"] },
  { id: "the_sublime", label: "The Sublime", type: "concept", era: "cross-era", description: "Experience of awe, terror, and vastness that exceeds rational comprehension.", thinkers: ["Longinus", "Burke", "Kant", "Shelley"], works: ["On the Sublime", "A Philosophical Enquiry"] },
  { id: "mimesis", label: "Mimesis", type: "concept", era: "cross-era", description: "Art as imitation of reality. Central tension from Plato's suspicion to Aristotle's defense.", thinkers: ["Plato", "Aristotle", "Auerbach"], works: ["Republic", "Poetics", "Mimesis"] },
  { id: "catharsis", label: "Catharsis", type: "concept", era: "cross-era", description: "Emotional purgation through art, especially tragedy. Pity and fear achieving release.", thinkers: ["Aristotle", "Bernays", "Freud"], works: ["Poetics"] },
  { id: "alienation", label: "Alienation", type: "concept", era: "cross-era", description: "Estrangement from self, society, labor, or meaning.", thinkers: ["Marx", "Kafka", "Brecht", "Camus"], works: ["Economic and Philosophic Manuscripts", "The Metamorphosis"] },
  { id: "the_uncanny", label: "The Uncanny", type: "concept", era: "cross-era", description: "The familiar made strange. What should have remained hidden but has come to light.", thinkers: ["Freud", "Hoffmann", "Todorov", "Kristeva"], works: ["The Uncanny", "The Sandman"] },
  { id: "intertextuality", label: "Intertextuality", type: "concept", era: "cross-era", description: "All texts exist in relation to other texts. Meaning through networks of reference.", thinkers: ["Kristeva", "Barthes", "Genette", "Bakhtin"], works: ["Desire in Language", "S/Z", "Palimpsests"] },
  { id: "death_of_author", label: "Death of the Author", type: "concept", era: "20c-late", description: "The author's intentions are irrelevant. The reader produces the text's significance.", thinkers: ["Barthes", "Foucault", "Derrida"], works: ["Death of the Author", "What Is an Author?"] },
  { id: "stream_of_consciousness", label: "Stream of Consciousness", type: "concept", era: "20c-early", description: "Rendering the continuous flow of a character's thoughts, sensations, and associations.", thinkers: ["James (William)", "Joyce", "Woolf", "Faulkner"], works: ["Ulysses", "Mrs Dalloway", "The Sound and the Fury"] },
  { id: "the_absurd", label: "The Absurd", type: "concept", era: "20c-mid", description: "The conflict between human desire for meaning and the universe's indifference.", thinkers: ["Camus", "Beckett", "Ionesco", "Kierkegaard"], works: ["The Myth of Sisyphus", "Waiting for Godot"] },
  { id: "defamiliarization", label: "Defamiliarization", type: "concept", era: "20c-early", description: "Making the familiar strange to force fresh perception. Shklovsky's ostranenie.", thinkers: ["Shklovsky", "Brecht", "the Formalists"], works: ["Art as Technique"] },
  { id: "gothic", label: "The Gothic", type: "concept", era: "cross-era", description: "Literature of terror, transgression, and the return of the repressed.", thinkers: ["Walpole", "Radcliffe", "Shelley", "Poe", "Morrison"], works: ["Castle of Otranto", "Frankenstein", "Beloved"] },
  { id: "unreliable_narrator", label: "Unreliable Narrator", type: "concept", era: "cross-era", description: "A narrator whose credibility is compromised — by self-deception, madness, or manipulation.", thinkers: ["Booth", "Nabokov", "Ishiguro", "Poe"], works: ["Lolita", "The Remains of the Day"] },
  { id: "flaneur", label: "The Flâneur", type: "concept", era: "19c-mid", description: "The urban wanderer-observer. Detached spectatorship as aesthetic practice.", thinkers: ["Baudelaire", "Benjamin", "Poe", "de Certeau"], works: ["The Painter of Modern Life", "The Arcades Project"] },
  { id: "carnival", label: "The Carnivalesque", type: "concept", era: "cross-era", description: "Subversive laughter, grotesque bodies, inversion of hierarchies.", thinkers: ["Bakhtin", "Rabelais", "Rushdie", "Angela Carter"], works: ["Rabelais and His World", "Nights at the Circus"] },
  { id: "panopticon", label: "The Panopticon", type: "concept", era: "20c-late", description: "Foucault's model of disciplinary power: surveillance internalized.", thinkers: ["Foucault", "Bentham", "Orwell", "Atwood"], works: ["Discipline and Punish", "1984"] },
  { id: "double_consciousness", label: "Double Consciousness", type: "concept", era: "cross-era", description: "Seeing oneself through the eyes of the oppressor. The twoness of being Black and American.", thinkers: ["Du Bois", "Fanon", "Ellison", "Morrison"], works: ["The Souls of Black Folk", "Invisible Man"] },
  { id: "ecriture_feminine", label: "Écriture Féminine", type: "concept", era: "20c-late", description: "Writing the body. Language resisting phallogocentric structure through rhythm and excess.", thinkers: ["Cixous", "Irigaray", "Kristeva"], works: ["The Laugh of the Medusa"] },
  { id: "hauntology", label: "Hauntology", type: "concept", era: "21c", description: "Futures that never arrived, pasts that refuse to die. The spectre as ontological condition.", thinkers: ["Derrida", "Fisher", "Morrison", "Sebald"], works: ["Specters of Marx", "Ghosts of My Life"] },
  { id: "palimpsest", label: "The Palimpsest", type: "concept", era: "cross-era", description: "A text written over another, where earlier layers bleed through.", thinkers: ["Genette", "de Quincey", "Derrida", "Sebald"], works: ["Palimpsests", "The Rings of Saturn"] },
  { id: "close_reading", label: "Close Reading", type: "concept", era: "20c-mid", description: "Rigorous attention to formal elements as primary method of interpretation.", thinkers: ["Richards", "Empson", "Brooks", "de Man"], works: ["Practical Criticism", "Seven Types of Ambiguity"] },
  { id: "heteroglossia", label: "Heteroglossia", type: "concept", era: "cross-era", description: "Multiple voices and social registers coexisting within a single text.", thinkers: ["Bakhtin", "Dostoevsky", "Joyce", "Rushdie"], works: ["The Dialogic Imagination", "Ulysses"] },
  { id: "cosmic_horror", label: "Cosmic Horror", type: "concept", era: "20c-early", description: "Humanity's insignificance before vast, indifferent forces. The universe doesn't know you exist.", thinkers: ["Lovecraft", "Ligotti", "Machen", "Blackwood", "VanderMeer"], works: ["The Call of Cthulhu", "The Conspiracy Against the Human Race"] },
  { id: "the_abject", label: "The Abject", type: "concept", era: "20c-late", description: "What the self expels to establish its borders. Horror at boundary collapse.", thinkers: ["Kristeva", "Bataille", "Clive Barker", "Cronenberg"], works: ["Powers of Horror", "Story of the Eye"] },
  { id: "cognitive_estrangement", label: "Cognitive Estrangement", type: "concept", era: "20c-mid", description: "Suvin's SF definition: a novum forces perceiving your own reality from outside.", thinkers: ["Suvin", "Brecht", "Le Guin", "Miéville"], works: ["Metamorphoses of Science Fiction"] },
  { id: "the_numinous", label: "The Numinous", type: "concept", era: "cross-era", description: "Otto's mysterium tremendum — the sacred as wholly other. Ontological awe.", thinkers: ["Otto", "Tolkien", "Lewis", "Le Guin"], works: ["The Idea of the Holy", "On Fairy-Stories"] },
  { id: "secondary_creation", label: "Secondary Creation", type: "concept", era: "20c-mid", description: "Tolkien's sub-creation: a consistent secondary world with inner truth.", thinkers: ["Tolkien", "Le Guin", "Peake", "Jemisin"], works: ["On Fairy-Stories", "The Lord of the Rings"] },
  { id: "the_doppelganger", label: "The Doppelgänger", type: "concept", era: "cross-era", description: "The double, the shadow-self. Encounter with one's own otherness.", thinkers: ["Hoffmann", "Dostoevsky", "Poe", "Saramago", "Nabokov"], works: ["The Sandman", "The Double", "William Wilson"] },
  { id: "liminality", label: "Liminality", type: "concept", era: "cross-era", description: "The threshold state — between life and death, human and animal, real and unreal.", thinkers: ["Turner", "van Gennep", "Barker", "Danielewski"], works: ["The Ritual Process", "House of Leaves"] },
  { id: "body_horror", label: "Body Horror", type: "concept", era: "20c-late", description: "The body as site of violation, mutation, dissolution. Flesh made unrecognizable.", thinkers: ["Cronenberg", "Barker", "Shelley", "Kafka"], works: ["Videodrome", "The Metamorphosis", "Frankenstein"] },
  { id: "folk_horror", label: "Folk Horror", type: "concept", era: "cross-era", description: "The landscape remembers what you've forgotten. Pre-Christian ritual, the old gods still hungry.", thinkers: ["M.R. James", "Shirley Jackson", "Robert Eggers", "Adam Nevill"], works: ["The Lottery", "The Wicker Man", "The Witch"] },
  { id: "dystopia", label: "Dystopia", type: "concept", era: "20c-early", description: "The nightmare state perfected. Utopian logic carried to totalitarian conclusion.", thinkers: ["Orwell", "Huxley", "Zamyatin", "Atwood", "Butler"], works: ["1984", "Brave New World", "We", "The Handmaid's Tale"] },
  { id: "the_fantastic", label: "The Fantastic", type: "concept", era: "cross-era", description: "Todorov: hesitation between natural and supernatural explanations.", thinkers: ["Todorov", "Jackson (Rosemary)", "Cortázar", "Borges"], works: ["The Fantastic", "Blow-Up"] },
  { id: "the_other", label: "The Other / Alterity", type: "concept", era: "cross-era", description: "That which is not-self. Every boundary implies what it excludes.", thinkers: ["Levinas", "Said", "Fanon", "Le Guin", "Butler"], works: ["Totality and Infinity", "Orientalism"] },
  { id: "apocalypticism", label: "Apocalypticism", type: "concept", era: "cross-era", description: "The end as revelation. From biblical eschatology to climate collapse.", thinkers: ["McCarthy", "Shelley (Mary)", "Ballard", "Octavia Butler"], works: ["The Road", "The Last Man", "Parable of the Sower"] },
  { id: "epistemic_horror", label: "Epistemic Horror", type: "concept", era: "cross-era", description: "The horror of knowing. Understanding as contamination.", thinkers: ["Lovecraft", "Ligotti", "Danielewski", "VanderMeer", "Borges"], works: ["House of Leaves", "Annihilation", "The Library of Babel"] },
  { id: "the_monstrous", label: "The Monstrous", type: "concept", era: "cross-era", description: "The monster as boundary-crosser. It violates categories. The monster always escapes.", thinkers: ["Cohen", "Shelley", "Kafka", "Angela Carter", "Miéville"], works: ["Monster Theory", "Frankenstein", "The Bloody Chamber"] },
  { id: "the_labyrinth", label: "The Labyrinth", type: "concept", era: "cross-era", description: "Structure as trap. The maze that is also a text, a mind, a city.", thinkers: ["Borges", "Kafka", "Danielewski", "Eco"], works: ["The Garden of Forking Paths", "The Trial", "House of Leaves"] },
  { id: "mythopoeia", label: "Mythopoeia", type: "concept", era: "cross-era", description: "Deliberate creation of myth. Forging new ones with the weight of the ancient.", thinkers: ["Tolkien", "Blake", "Le Guin", "Jemisin", "Peake"], works: ["The Silmarillion", "Earthsea", "The Broken Earth"] },
  { id: "psychogeography", label: "Psychogeography", type: "concept", era: "20c-late", description: "Emotional effects of geographic environment. The city as palimpsest. Walking as reading.", thinkers: ["Debord", "Sinclair", "Benjamin", "Perec", "Sebald"], works: ["Theory of the Dérive", "The Rings of Saturn"] },
  { id: "the_weird", label: "The Weird", type: "concept", era: "cross-era", description: "Fisher: that which does not belong. The wrongness of presence. The outside pressing in.", thinkers: ["Mark Fisher", "Lovecraft", "Miéville", "VanderMeer"], works: ["The Weird and the Eerie", "Annihilation"] },
  { id: "the_eerie", label: "The Eerie", type: "concept", era: "cross-era", description: "Failure of absence or presence. Something where there should be nothing. Landscapes emptied.", thinkers: ["Mark Fisher", "Sebald", "Tarkovsky", "M.R. James"], works: ["The Weird and the Eerie", "Stalker"] },
];

const EDGES = [
  { source: "classicism", target: "enlightenment", type: "influenced", label: "rationalist inheritance" },
  { source: "enlightenment", target: "romanticism", type: "reacted_against", label: "revolt against reason" },
  { source: "romanticism", target: "transcendentalism", type: "influenced", label: "American branch" },
  { source: "romanticism", target: "dark_romanticism", type: "extended", label: "shadow side" },
  { source: "romanticism", target: "realism", type: "reacted_against", label: "rejection of idealization" },
  { source: "realism", target: "naturalism", type: "extended", label: "scientific determinism" },
  { source: "realism", target: "modernism", type: "reacted_against", label: "formal rupture" },
  { source: "romanticism", target: "modernism", type: "synthesized", label: "mythic interiority" },
  { source: "romanticism", target: "symbolism", type: "influenced", label: "inner vision" },
  { source: "symbolism", target: "modernism", type: "influenced", label: "linguistic density" },
  { source: "symbolism", target: "surrealism", type: "influenced", label: "beyond the visible" },
  { source: "symbolism", target: "decadence", type: "synthesized", label: "artifice & excess" },
  { source: "aestheticism", target: "modernism", type: "influenced", label: "formal autonomy" },
  { source: "aestheticism", target: "decadence", type: "extended", label: "beauty as transgression" },
  { source: "romanticism", target: "aestheticism", type: "influenced", label: "art as highest value" },
  { source: "dark_romanticism", target: "weird_fiction", type: "influenced", label: "the irrational" },
  { source: "dark_romanticism", target: "gothic", type: "central_to", label: "founding current" },
  { source: "decadence", target: "weird_fiction", type: "influenced", label: "morbid fascination" },
  { source: "weird_fiction", target: "new_weird", type: "influenced", label: "post-Lovecraftian turn" },
  { source: "modernism", target: "existentialism", type: "influenced", label: "alienation & fragmentation" },
  { source: "modernism", target: "postmodernism", type: "reacted_against", label: "ironic deconstruction" },
  { source: "existentialism", target: "postmodernism", type: "influenced", label: "meaning crisis" },
  { source: "existentialism", target: "beat_generation", type: "influenced", label: "authentic experience" },
  { source: "surrealism", target: "beat_generation", type: "influenced", label: "spontaneous mind" },
  { source: "surrealism", target: "magical_realism", type: "synthesized", label: "marvelous real" },
  { source: "postmodernism", target: "postcolonialism", type: "influenced", label: "skepticism of master narratives" },
  { source: "romanticism", target: "magical_realism", type: "synthesized", label: "enchanted reality" },
  { source: "postcolonialism", target: "magical_realism", type: "synthesized", label: "cultural memory" },
  { source: "structuralism", target: "poststructuralism", type: "reacted_against", label: "structures collapse" },
  { source: "poststructuralism", target: "postmodernism", type: "influenced", label: "decentered meaning" },
  { source: "new_criticism", target: "structuralism", type: "influenced", label: "text as system" },
  { source: "harlem_renaissance", target: "postcolonialism", type: "influenced", label: "identity & representation" },
  { source: "harlem_renaissance", target: "afrofuturism", type: "influenced", label: "reclamation of narrative" },
  { source: "postcolonialism", target: "afrofuturism", type: "synthesized", label: "speculative decolonization" },
  { source: "feminist_lit", target: "ecriture_feminine", type: "influenced", label: "gendered language" },
  { source: "poststructuralism", target: "feminist_lit", type: "influenced", label: "power & discourse" },
  { source: "poststructuralism", target: "death_of_author", type: "influenced", label: "decentered subject" },
  { source: "new_wave_sf", target: "cyberpunk", type: "influenced", label: "literary ambition meets tech" },
  { source: "naturalism", target: "cyberpunk", type: "influenced", label: "street-level determinism" },
  { source: "postmodernism", target: "cyberpunk", type: "influenced", label: "simulation & pastiche" },
  { source: "cyberpunk", target: "new_weird", type: "synthesized", label: "genre-blending" },
  { source: "weird_fiction", target: "new_wave_sf", type: "influenced", label: "the alien within" },
  { source: "new_wave_sf", target: "afrofuturism", type: "influenced", label: "social SF" },
  { source: "the_sublime", target: "romanticism", type: "central_to", label: "core aesthetic" },
  { source: "the_sublime", target: "gothic", type: "influenced", label: "terror & awe" },
  { source: "mimesis", target: "classicism", type: "central_to", label: "foundational principle" },
  { source: "mimesis", target: "realism", type: "central_to", label: "faithful representation" },
  { source: "catharsis", target: "classicism", type: "central_to", label: "tragic theory" },
  { source: "alienation", target: "modernism", type: "central_to", label: "defining condition" },
  { source: "alienation", target: "existentialism", type: "central_to", label: "existential estrangement" },
  { source: "alienation", target: "cyberpunk", type: "influenced", label: "technological alienation" },
  { source: "the_uncanny", target: "gothic", type: "central_to", label: "the familiar-strange" },
  { source: "the_uncanny", target: "modernism", type: "influenced", label: "psychoanalytic turn" },
  { source: "intertextuality", target: "postmodernism", type: "central_to", label: "textual networks" },
  { source: "intertextuality", target: "poststructuralism", type: "central_to", label: "no outside-text" },
  { source: "death_of_author", target: "postmodernism", type: "central_to", label: "meaning unmoored" },
  { source: "death_of_author", target: "intertextuality", type: "influenced", label: "reader produces meaning" },
  { source: "stream_of_consciousness", target: "modernism", type: "central_to", label: "formal innovation" },
  { source: "the_absurd", target: "existentialism", type: "central_to", label: "confronting meaninglessness" },
  { source: "the_absurd", target: "postmodernism", type: "influenced", label: "play in the void" },
  { source: "defamiliarization", target: "modernism", type: "central_to", label: "making it new" },
  { source: "defamiliarization", target: "surrealism", type: "influenced", label: "radical estrangement" },
  { source: "gothic", target: "romanticism", type: "influenced", label: "dark Romanticism" },
  { source: "gothic", target: "magical_realism", type: "synthesized", label: "haunted histories" },
  { source: "unreliable_narrator", target: "modernism", type: "influenced", label: "subjective truth" },
  { source: "unreliable_narrator", target: "postmodernism", type: "central_to", label: "truth as construct" },
  { source: "naturalism", target: "existentialism", type: "influenced", label: "determinism vs freedom" },
  { source: "classicism", target: "mimesis", type: "influenced", label: "art imitates nature" },
  { source: "the_sublime", target: "the_uncanny", type: "synthesized", label: "awe meets dread" },
  { source: "flaneur", target: "modernism", type: "central_to", label: "urban consciousness" },
  { source: "flaneur", target: "psychogeography", type: "influenced", label: "walking as reading" },
  { source: "carnival", target: "postmodernism", type: "influenced", label: "subversive laughter" },
  { source: "carnival", target: "magical_realism", type: "synthesized", label: "grotesque vitality" },
  { source: "carnival", target: "heteroglossia", type: "influenced", label: "polyphonic excess" },
  { source: "panopticon", target: "poststructuralism", type: "central_to", label: "power/knowledge" },
  { source: "panopticon", target: "dystopia", type: "influenced", label: "surveillance state" },
  { source: "panopticon", target: "cyberpunk", type: "influenced", label: "corporate surveillance" },
  { source: "double_consciousness", target: "harlem_renaissance", type: "central_to", label: "founding concept" },
  { source: "double_consciousness", target: "postcolonialism", type: "influenced", label: "colonial subjectivity" },
  { source: "double_consciousness", target: "afrofuturism", type: "influenced", label: "split temporalities" },
  { source: "ecriture_feminine", target: "feminist_lit", type: "central_to", label: "bodily writing" },
  { source: "ecriture_feminine", target: "poststructuralism", type: "synthesized", label: "language & the body" },
  { source: "hauntology", target: "poststructuralism", type: "extended", label: "spectral deconstruction" },
  { source: "hauntology", target: "gothic", type: "synthesized", label: "ghost as theory" },
  { source: "hauntology", target: "afrofuturism", type: "influenced", label: "haunted futures" },
  { source: "hauntology", target: "the_eerie", type: "synthesized", label: "absent presences" },
  { source: "palimpsest", target: "intertextuality", type: "synthesized", label: "layered texts" },
  { source: "palimpsest", target: "postcolonialism", type: "influenced", label: "erased histories" },
  { source: "palimpsest", target: "hauntology", type: "synthesized", label: "what bleeds through" },
  { source: "palimpsest", target: "psychogeography", type: "synthesized", label: "layered landscapes" },
  { source: "close_reading", target: "new_criticism", type: "central_to", label: "method" },
  { source: "close_reading", target: "poststructuralism", type: "influenced", label: "deconstructive reading" },
  { source: "heteroglossia", target: "postmodernism", type: "influenced", label: "many voices" },
  { source: "heteroglossia", target: "postcolonialism", type: "influenced", label: "linguistic resistance" },
  { source: "cosmic_horror", target: "weird_fiction", type: "central_to", label: "defining mode" },
  { source: "cosmic_horror", target: "the_sublime", type: "synthesized", label: "awe without redemption" },
  { source: "cosmic_horror", target: "the_absurd", type: "synthesized", label: "meaningless cosmos" },
  { source: "cosmic_horror", target: "new_weird", type: "influenced", label: "post-cosmic turn" },
  { source: "cosmic_horror", target: "epistemic_horror", type: "influenced", label: "knowledge as wound" },
  { source: "the_abject", target: "body_horror", type: "central_to", label: "theoretical engine" },
  { source: "the_abject", target: "gothic", type: "influenced", label: "boundary collapse" },
  { source: "the_abject", target: "the_monstrous", type: "synthesized", label: "expelled selfhood" },
  { source: "cognitive_estrangement", target: "new_wave_sf", type: "central_to", label: "critical SF" },
  { source: "cognitive_estrangement", target: "defamiliarization", type: "extended", label: "SF as ostranenie" },
  { source: "cognitive_estrangement", target: "cyberpunk", type: "influenced", label: "seeing the present" },
  { source: "cognitive_estrangement", target: "afrofuturism", type: "influenced", label: "speculative critique" },
  { source: "the_numinous", target: "the_sublime", type: "synthesized", label: "sacred awe" },
  { source: "the_numinous", target: "secondary_creation", type: "central_to", label: "wonder in world-building" },
  { source: "the_numinous", target: "folk_horror", type: "reacted_against", label: "sacred turned sinister" },
  { source: "secondary_creation", target: "mythopoeia", type: "central_to", label: "world as myth" },
  { source: "secondary_creation", target: "new_weird", type: "influenced", label: "radical world-building" },
  { source: "the_doppelganger", target: "the_uncanny", type: "central_to", label: "self as other" },
  { source: "the_doppelganger", target: "dark_romanticism", type: "central_to", label: "shadow self" },
  { source: "the_doppelganger", target: "gothic", type: "influenced", label: "the double" },
  { source: "liminality", target: "the_fantastic", type: "central_to", label: "threshold hesitation" },
  { source: "liminality", target: "gothic", type: "influenced", label: "haunted thresholds" },
  { source: "liminality", target: "new_weird", type: "influenced", label: "zone fiction" },
  { source: "body_horror", target: "the_monstrous", type: "synthesized", label: "flesh unbound" },
  { source: "body_horror", target: "cyberpunk", type: "influenced", label: "posthuman flesh" },
  { source: "body_horror", target: "modernism", type: "influenced", label: "Kafka's metamorphosis" },
  { source: "folk_horror", target: "gothic", type: "synthesized", label: "landscape as menace" },
  { source: "folk_horror", target: "the_eerie", type: "synthesized", label: "empty landscapes, old rites" },
  { source: "folk_horror", target: "the_uncanny", type: "influenced", label: "familiar ground, alien ritual" },
  { source: "dystopia", target: "enlightenment", type: "reacted_against", label: "reason's nightmare" },
  { source: "dystopia", target: "cyberpunk", type: "influenced", label: "corporate totalitarianism" },
  { source: "dystopia", target: "naturalism", type: "synthesized", label: "systemic determinism" },
  { source: "dystopia", target: "apocalypticism", type: "synthesized", label: "end-state logic" },
  { source: "the_fantastic", target: "magical_realism", type: "influenced", label: "hesitation dissolved" },
  { source: "the_fantastic", target: "gothic", type: "influenced", label: "the inexplicable" },
  { source: "the_fantastic", target: "surrealism", type: "synthesized", label: "dream-reality blur" },
  { source: "the_other", target: "postcolonialism", type: "central_to", label: "constructed otherness" },
  { source: "the_other", target: "the_monstrous", type: "synthesized", label: "monster as other" },
  { source: "the_other", target: "existentialism", type: "influenced", label: "self through other" },
  { source: "the_other", target: "feminist_lit", type: "influenced", label: "woman as other" },
  { source: "apocalypticism", target: "afrofuturism", type: "synthesized", label: "apocalypse already happened" },
  { source: "apocalypticism", target: "the_sublime", type: "synthesized", label: "terrible beauty of endings" },
  { source: "apocalypticism", target: "cosmic_horror", type: "influenced", label: "terminal insignificance" },
  { source: "epistemic_horror", target: "the_labyrinth", type: "synthesized", label: "trapped in knowledge" },
  { source: "epistemic_horror", target: "unreliable_narrator", type: "influenced", label: "truth as contagion" },
  { source: "epistemic_horror", target: "the_weird", type: "central_to", label: "wrongness perceived" },
  { source: "the_monstrous", target: "gothic", type: "central_to", label: "what crosses boundaries" },
  { source: "the_monstrous", target: "new_weird", type: "central_to", label: "taxonomic rebellion" },
  { source: "the_monstrous", target: "carnival", type: "synthesized", label: "grotesque body" },
  { source: "the_labyrinth", target: "postmodernism", type: "central_to", label: "structure as prison" },
  { source: "the_labyrinth", target: "the_fantastic", type: "influenced", label: "impossible architecture" },
  { source: "mythopoeia", target: "romanticism", type: "influenced", label: "myth-making impulse" },
  { source: "mythopoeia", target: "afrofuturism", type: "synthesized", label: "new mythologies" },
  { source: "mythopoeia", target: "magical_realism", type: "synthesized", label: "myth alive in the present" },
  { source: "psychogeography", target: "cyberpunk", type: "influenced", label: "city as datasphere" },
  { source: "psychogeography", target: "the_eerie", type: "synthesized", label: "haunted topography" },
  { source: "the_weird", target: "weird_fiction", type: "central_to", label: "theoretical frame" },
  { source: "the_weird", target: "new_weird", type: "central_to", label: "name & engine" },
  { source: "the_weird", target: "the_uncanny", type: "reacted_against", label: "beyond the repressed" },
  { source: "the_weird", target: "cosmic_horror", type: "synthesized", label: "ontological wrongness" },
  { source: "the_eerie", target: "folk_horror", type: "synthesized", label: "what lingers" },
  { source: "the_eerie", target: "the_weird", type: "synthesized", label: "Fisher's twin modes" },
  { source: "the_eerie", target: "hauntology", type: "synthesized", label: "absent futures" },
];

const EDGE_COLORS = { influenced: "#6B8AFF", reacted_against: "#FF6B6B", synthesized: "#A78BFA", extended: "#34D399", central_to: "#FBBF24" };
const EDGE_LABELS_DISPLAY = { influenced: "Influenced", reacted_against: "Reacted Against", synthesized: "Synthesized", extended: "Extended", central_to: "Central To" };
const NC = { movement: { fill: "#1a1a2e", stroke: "#6B8AFF", text: "#e0e0ff" }, concept: { fill: "#1a1a2e", stroke: "#A78BFA", text: "#e0d0ff" } };

const linkStyle = { color: "inherit", textDecoration: "none", transition: "color 0.15s" };

export default function LiteraryConceptMap2DLinked() {
  const svgRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [edgeFilter, setEdgeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dims, setDims] = useState({ w: 900, h: 650 });

  useEffect(() => {
    const u = () => { setDims({ w: Math.max(Math.min(window.innerWidth - 20, 1400), 600), h: Math.max(Math.min(window.innerHeight - 20, 900), 450) }); };
    u(); window.addEventListener("resize", u); return () => window.removeEventListener("resize", u);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const { w, h } = dims;
    const svg = d3.select(svgRef.current); svg.selectAll("*").remove();
    const defs = svg.append("defs");
    const gl = defs.append("filter").attr("id", "glow"); gl.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur"); const mg = gl.append("feMerge"); mg.append("feMergeNode").attr("in", "blur"); mg.append("feMergeNode").attr("in", "SourceGraphic");
    Object.keys(EDGE_COLORS).forEach(t => { defs.append("marker").attr("id", `a-${t}`).attr("viewBox", "0 -5 10 10").attr("refX", 28).attr("refY", 0).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-4L10,0L0,4").attr("fill", EDGE_COLORS[t]).attr("opacity", 0.7); });
    const nodes = NODES.map(n => ({ ...n, x: w/2 + (Math.random()-0.5)*600, y: h/2 + (Math.random()-0.5)*500 }));
    const edges = EDGES.map(e => ({ ...e }));
    const g = svg.append("g");
    const zm = d3.zoom().scaleExtent([0.15, 4]).on("zoom", ev => g.attr("transform", ev.transform));
    svg.call(zm); svg.call(zm.transform, d3.zoomIdentity.translate(w*0.1, h*0.1).scale(0.8));
    const lG = g.append("g").attr("class", "links"), llG = g.append("g").attr("class", "link-labels"), nG = g.append("g").attr("class", "nodes");
    const lk = lG.selectAll("line").data(edges).join("line").attr("stroke", d => EDGE_COLORS[d.type]).attr("stroke-width", 1.2).attr("stroke-opacity", 0.3).attr("marker-end", d => `url(#a-${d.type})`);
    const ll = llG.selectAll("text").data(edges).join("text").text(d => d.label).attr("font-size", 7).attr("fill", "#555").attr("text-anchor", "middle").attr("dy", -3).style("pointer-events", "none").style("opacity", 0);
    const nd = nG.selectAll("g").data(nodes).join("g").style("cursor", "pointer")
      .call(d3.drag().on("start", (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; }).on("drag", (ev, d) => { d.fx=ev.x; d.fy=ev.y; }).on("end", (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx=null; d.fy=null; }));
    nd.append("circle").attr("r", d => d.type === "movement" ? 18 : 13).attr("fill", d => NC[d.type].fill).attr("stroke", d => NC[d.type].stroke).attr("stroke-width", 1.5).attr("filter", "url(#glow)");
    nd.append("text").text(d => d.label).attr("text-anchor", "middle").attr("dy", d => d.type === "movement" ? 30 : 24).attr("font-size", d => d.type === "movement" ? 9 : 7.5).attr("font-weight", d => d.type === "movement" ? 600 : 400).attr("fill", d => NC[d.type].text).style("pointer-events", "none");
    nd.append("text").text(d => { const ws = d.label.replace(/^The /, "").split(" "); return ws.length === 1 ? ws[0].slice(0,3).toUpperCase() : ws.map(x => x[0]).join("").slice(0,3).toUpperCase(); }).attr("text-anchor", "middle").attr("dy", 3).attr("font-size", 7).attr("font-weight", 700).attr("fill", d => NC[d.type].stroke).style("pointer-events", "none").style("opacity", 0.8);
    nd.on("click", (ev, d) => { ev.stopPropagation(); setSelected(p => p?.id === d.id ? null : d); });
    nd.on("mouseenter", (ev, d) => {
      const cn = new Set(); edges.forEach(e => { const s = typeof e.source === "object" ? e.source.id : e.source; const t = typeof e.target === "object" ? e.target.id : e.target; if (s === d.id) cn.add(t); if (t === d.id) cn.add(s); }); cn.add(d.id);
      nd.style("opacity", n => cn.has(n.id) ? 1 : 0.06);
      lk.style("opacity", e => { const s = typeof e.source === "object" ? e.source.id : e.source; const t = typeof e.target === "object" ? e.target.id : e.target; return (s === d.id || t === d.id) ? 0.8 : 0.02; }).attr("stroke-width", e => { const s = typeof e.source === "object" ? e.source.id : e.source; const t = typeof e.target === "object" ? e.target.id : e.target; return (s === d.id || t === d.id) ? 2.5 : 1.2; });
      ll.style("opacity", e => { const s = typeof e.source === "object" ? e.source.id : e.source; const t = typeof e.target === "object" ? e.target.id : e.target; return (s === d.id || t === d.id) ? 1 : 0; });
    });
    nd.on("mouseleave", () => { nd.style("opacity", 1); lk.style("opacity", 0.3).attr("stroke-width", 1.2); ll.style("opacity", 0); });
    svg.on("click", () => setSelected(null));
    const sim = d3.forceSimulation(nodes).force("link", d3.forceLink(edges).id(d => d.id).distance(100).strength(0.25)).force("charge", d3.forceManyBody().strength(-220)).force("center", d3.forceCenter(w/2, h/2)).force("collision", d3.forceCollide().radius(30)).force("x", d3.forceX(w/2).strength(0.025)).force("y", d3.forceY(h/2).strength(0.025));
    sim.on("tick", () => { lk.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y); ll.attr("x", d => (d.source.x+d.target.x)/2).attr("y", d => (d.source.y+d.target.y)/2); nd.attr("transform", d => `translate(${d.x},${d.y})`); });
    return () => sim.stop();
  }, [dims]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll(".nodes g").style("opacity", function(d) { let s = true; if (filter !== "all") s = d.type === filter; if (searchTerm) { const t = searchTerm.toLowerCase(); s = s && (d.label.toLowerCase().includes(t) || d.description?.toLowerCase().includes(t) || d.thinkers?.some(x => x.toLowerCase().includes(t)) || d.works?.some(x => x.toLowerCase().includes(t))); } return s ? 1 : 0.05; });
    svg.selectAll(".links line").each(function(d) { const el = d3.select(this); const s = typeof d.source === "object" ? d.source.id : d.source; const t = typeof d.target === "object" ? d.target.id : d.target; const sN = NODES.find(n => n.id === s); const tN = NODES.find(n => n.id === t); let sh = true; if (filter !== "all") sh = sN?.type === filter || tN?.type === filter; if (edgeFilter !== "all") sh = sh && d.type === edgeFilter; el.style("opacity", sh ? 0.3 : 0.015); });
  }, [filter, edgeFilter, searchTerm]);

  const sn = selected ? NODES.find(n => n.id === selected.id) : null;
  const ce = sn ? EDGES.filter(e => e.source === sn.id || e.target === sn.id) : [];
  const st = { n: NODES.length, e: EDGES.length, m: NODES.filter(n => n.type === "movement").length, c: NODES.filter(n => n.type === "concept").length };

  return (
    <div style={{ background: "#0a0a14", color: "#e0e0e0", fontFamily: "'Inter', system-ui, sans-serif", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #151530", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, flexWrap: "wrap", gap: 8, background: "#0d0d1a" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>Literary Concept Map</h1>
          <p style={{ margin: "1px 0 0", fontSize: 10, color: "#4a4a6a" }}>{st.n} nodes ({st.m} movements, {st.c} concepts) · {st.e} connections</p>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ background: "#111122", color: "#ccc", border: "1px solid #1e1e3e", borderRadius: 6, padding: "5px 10px", fontSize: 11, width: 160, outline: "none" }} />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: "#111122", color: "#aaa", border: "1px solid #1e1e3e", borderRadius: 6, padding: "5px 8px", fontSize: 11 }}><option value="all">All</option><option value="movement">Movements</option><option value="concept">Concepts</option></select>
          <select value={edgeFilter} onChange={e => setEdgeFilter(e.target.value)} style={{ background: "#111122", color: "#aaa", border: "1px solid #1e1e3e", borderRadius: 6, padding: "5px 8px", fontSize: 11 }}><option value="all">All Relations</option>{Object.entries(EDGE_LABELS_DISPLAY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </div>
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <svg ref={svgRef} width={dims.w} height={dims.h} style={{ flex: 1, display: "block" }} />
        <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(10,10,20,0.92)", border: "1px solid #151530", borderRadius: 8, padding: "8px 12px", fontSize: 9, backdropFilter: "blur(6px)" }}>
          <div style={{ fontWeight: 600, marginBottom: 5, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 8 }}>Edges</div>
          {Object.entries(EDGE_COLORS).map(([k, c]) => (<div key={k} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, cursor: "pointer", opacity: edgeFilter === "all" || edgeFilter === k ? 1 : 0.3 }} onClick={() => setEdgeFilter(p => p === k ? "all" : k)}><div style={{ width: 16, height: 2, background: c, borderRadius: 1 }} /><span style={{ color: "#888" }}>{EDGE_LABELS_DISPLAY[k]}</span></div>))}
          <div style={{ marginTop: 6, fontWeight: 600, marginBottom: 5, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 8 }}>Nodes</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}><div style={{ width: 10, height: 10, borderRadius: "50%", border: `1.5px solid ${NC.movement.stroke}`, background: NC.movement.fill }} /><span style={{ color: "#888" }}>Movement</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 8, height: 8, borderRadius: "50%", border: `1.5px solid ${NC.concept.stroke}`, background: NC.concept.fill }} /><span style={{ color: "#888" }}>Concept</span></div>
        </div>
        {!sn && <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,10,20,0.8)", border: "1px solid #151530", borderRadius: 6, padding: "6px 10px", fontSize: 10, color: "#4a4a6a" }}>Hover to trace · Click for details · Drag to rearrange</div>}
        {sn && (
          <div style={{ position: "absolute", top: 0, right: 0, width: Math.min(340, dims.w * 0.4), height: "100%", background: "rgba(10,10,20,0.96)", borderLeft: "1px solid #151530", overflowY: "auto", padding: "16px 18px", backdropFilter: "blur(12px)", animation: "si 0.15s ease-out" }}>
            <style>{`@keyframes si { from { transform: translateX(16px); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: NC[sn.type].stroke, display: "block", marginBottom: 3 }}>{sn.type} · {sn.era}</span>
                {nodeWikiUrl(sn.id) ? (
                  <a href={nodeWikiUrl(sn.id)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", transition: "color 0.15s" }} onMouseEnter={e => e.target.style.color = NC[sn.type].stroke} onMouseLeave={e => e.target.style.color = "#fff"}>{sn.label} <span style={{ fontSize: 11, opacity: 0.4 }}>↗</span></h2>
                  </a>
                ) : (
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{sn.label}</h2>
                )}
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer" }}>×</button>
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.65, color: "#999", marginBottom: 14 }}>{sn.description}</p>
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a4a6a", marginBottom: 5, fontWeight: 600 }}>Key Thinkers</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {sn.thinkers.map(t => (
                  <a key={t} href={wikiUrl(t)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <span style={{ background: "#12122a", padding: "2px 7px", borderRadius: 4, fontSize: 10, color: "#8888aa", border: "1px solid #1a1a3a", cursor: "pointer", transition: "color 0.15s, border-color 0.15s", display: "inline-block" }} onMouseEnter={e => { e.target.style.color = "#bbbbff"; e.target.style.borderColor = "#3333aa"; }} onMouseLeave={e => { e.target.style.color = "#8888aa"; e.target.style.borderColor = "#1a1a3a"; }}>{t}</span>
                  </a>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a4a6a", marginBottom: 5, fontWeight: 600 }}>Key Works</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>{sn.works.map(w => <span key={w} style={{ background: "#12122a", padding: "2px 7px", borderRadius: 4, fontSize: 10, color: "#8888aa", fontStyle: "italic", border: "1px solid #1a1a3a" }}>{w}</span>)}</div>
            </div>
            {ce.length > 0 && (
              <div>
                <h3 style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a4a6a", marginBottom: 6, fontWeight: 600 }}>Connections ({ce.length})</h3>
                {ce.map((e, i) => {
                  const iS = e.source === sn.id; const oId = iS ? e.target : e.source; const o = NODES.find(n => n.id === oId);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3, padding: "4px 6px", borderRadius: 5, background: "#0e0e1e", cursor: "pointer", border: "1px solid transparent", transition: "border-color 0.15s" }} onMouseEnter={ev => ev.currentTarget.style.borderColor = "#1e1e3e"} onMouseLeave={ev => ev.currentTarget.style.borderColor = "transparent"} onClick={() => setSelected(o)}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: EDGE_COLORS[e.type], flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10, color: "#ccc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><span style={{ color: "#444" }}>{iS ? "→" : "←"}</span> {o?.label}</div>
                        <div style={{ fontSize: 8.5, color: "#555" }}>{EDGE_LABELS_DISPLAY[e.type]} · {e.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
