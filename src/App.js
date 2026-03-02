import { useState, useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

const NODES = [
  // Movements & Periods
  { id: "classicism", label: "Classicism", type: "movement", era: "ancient", description: "Emphasis on order, harmony, proportion, and adherence to established forms. Rooted in Greek and Roman models.", thinkers: ["Aristotle", "Horace", "Virgil"], works: ["Poetics", "Ars Poetica", "Aeneid"] },
  { id: "enlightenment", label: "Enlightenment", type: "movement", era: "18c", description: "Reason as the primary authority. Skepticism of tradition, emphasis on empiricism, individual liberty, and progress.", thinkers: ["Voltaire", "Diderot", "Hume", "Kant"], works: ["Candide", "Encyclopédie", "Critique of Pure Reason"] },
  { id: "romanticism", label: "Romanticism", type: "movement", era: "19c-early", description: "Revolt against rationalism. Elevation of emotion, imagination, the sublime, nature, and the individual genius.", thinkers: ["Wordsworth", "Shelley", "Keats", "Novalis", "Hugo"], works: ["Lyrical Ballads", "Frankenstein", "Hymns to the Night"] },
  { id: "transcendentalism", label: "Transcendentalism", type: "movement", era: "19c-early", description: "American offshoot of Romanticism. Inherent goodness of people and nature, self-reliance, spiritual unity.", thinkers: ["Emerson", "Thoreau", "Fuller"], works: ["Self-Reliance", "Walden", "Woman in the 19th Century"] },
  { id: "realism", label: "Realism", type: "movement", era: "19c-mid", description: "Faithful representation of everyday life without idealization. Focus on middle-class experience and social conditions.", thinkers: ["Flaubert", "Tolstoy", "George Eliot", "Balzac"], works: ["Madame Bovary", "Anna Karenina", "Middlemarch"] },
  { id: "naturalism", label: "Naturalism", type: "movement", era: "19c-late", description: "Extension of realism through scientific determinism. Humans as animals shaped by heredity and environment.", thinkers: ["Zola", "Dreiser", "Crane", "Norris"], works: ["Germinal", "Sister Carrie", "The Red Badge of Courage"] },
  { id: "symbolism", label: "Symbolism", type: "movement", era: "19c-late", description: "Rejection of realism in favor of suggestion, musicality, and the evocation of inner states through symbols. The visible world as a veil over deeper truths.", thinkers: ["Baudelaire", "Mallarmé", "Rimbaud", "Verlaine", "Yeats"], works: ["Les Fleurs du mal", "A Season in Hell", "Un Coup de Dés"] },
  { id: "aestheticism", label: "Aestheticism", type: "movement", era: "19c-late", description: "Art for art's sake. Beauty as the highest value, severed from moral or social utility. Sensory experience elevated to a creed.", thinkers: ["Wilde", "Pater", "Huysmans", "Gautier"], works: ["The Picture of Dorian Gray", "Against Nature", "The Renaissance"] },
  { id: "modernism", label: "Modernism", type: "movement", era: "20c-early", description: "Radical break with tradition. Fragmentation, stream of consciousness, mythic method, alienation, formal experimentation.", thinkers: ["Joyce", "Woolf", "Eliot", "Pound", "Kafka"], works: ["Ulysses", "Mrs Dalloway", "The Waste Land", "The Trial"] },
  { id: "surrealism", label: "Surrealism", type: "movement", era: "20c-early", description: "Liberation of the unconscious mind. Automatic writing, dream logic, juxtaposition of the irrational. Art as psychic revolution.", thinkers: ["Breton", "Lautréamont", "Éluard", "Césaire"], works: ["Nadja", "Manifestoes of Surrealism", "Notebook of a Return to the Native Land"] },
  { id: "harlem_renaissance", label: "Harlem Renaissance", type: "movement", era: "20c-early", description: "Flowering of Black art, literature, and intellectual life. Reclamation of identity, folk traditions, and the politics of visibility.", thinkers: ["Hughes", "Hurston", "Locke", "McKay", "Larsen"], works: ["The Weary Blues", "Their Eyes Were Watching God", "The New Negro"] },
  { id: "existentialism", label: "Existentialism", type: "movement", era: "20c-mid", description: "Existence precedes essence. Radical freedom, absurdity, authenticity, anxiety, and the weight of choice.", thinkers: ["Sartre", "Camus", "de Beauvoir", "Kierkegaard", "Dostoevsky"], works: ["Being and Nothingness", "The Stranger", "The Second Sex"] },
  { id: "beat_generation", label: "Beat Generation", type: "movement", era: "20c-mid", description: "Rejection of conformity, spontaneous prose, spiritual seeking, drugs, jazz, and the open road. Anti-establishment ecstasy.", thinkers: ["Kerouac", "Ginsberg", "Burroughs", "Corso"], works: ["On the Road", "Howl", "Naked Lunch"] },
  { id: "structuralism", label: "Structuralism", type: "movement", era: "20c-mid", description: "Meaning arises from underlying systems and structures, not individual elements. Language as a model for all cultural phenomena.", thinkers: ["Saussure", "Lévi-Strauss", "Barthes (early)", "Jakobson"], works: ["Course in General Linguistics", "Mythologiques", "Elements of Semiology"] },
  { id: "poststructuralism", label: "Post-structuralism", type: "movement", era: "20c-late", description: "Dismantling of stable structures. Meaning is endlessly deferred, texts deconstruct themselves, power permeates discourse.", thinkers: ["Derrida", "Foucault", "Deleuze", "Barthes (late)"], works: ["Of Grammatology", "Discipline and Punish", "S/Z"] },
  { id: "postmodernism", label: "Postmodernism", type: "movement", era: "20c-late", description: "Skepticism of grand narratives, playful self-referentiality, pastiche, blurred boundaries between high and low culture.", thinkers: ["Pynchon", "DeLillo", "Barth", "Borges", "Calvino"], works: ["Gravity's Rainbow", "White Noise", "Ficciones", "If on a winter's night a traveler"] },
  { id: "postcolonialism", label: "Postcolonialism", type: "movement", era: "20c-late", description: "Interrogation of colonial legacies, power, identity, hybridity, and the politics of representation.", thinkers: ["Said", "Fanon", "Spivak", "Achebe", "Rushdie"], works: ["Orientalism", "The Wretched of the Earth", "Things Fall Apart"] },
  { id: "magical_realism", label: "Magical Realism", type: "movement", era: "20c-late", description: "The marvelous treated as mundane. Reality and fantasy coexist without contradiction, often tied to cultural memory.", thinkers: ["García Márquez", "Allende", "Rushdie", "Carpentier"], works: ["One Hundred Years of Solitude", "Midnight's Children"] },
  { id: "feminist_lit", label: "Feminist Literary Thought", type: "movement", era: "20c-late", description: "Interrogation of gender in literary production, canon formation, and textual meaning. From recovery of silenced voices to écriture féminine.", thinkers: ["de Beauvoir", "Woolf", "Cixous", "hooks", "Gilbert & Gubar"], works: ["A Room of One's Own", "The Second Sex", "The Laugh of the Medusa", "The Madwoman in the Attic"] },
  { id: "afrofuturism", label: "Afrofuturism", type: "movement", era: "21c", description: "Black speculative thought blending science fiction, mythology, and Afrodiasporic traditions. Reimagining the past and future simultaneously.", thinkers: ["Butler", "Jemisin", "Sun Ra", "Eshun", "Okorafor"], works: ["Kindred", "The Fifth Season", "Space Is the Place", "Binti"] },
  { id: "new_criticism", label: "New Criticism", type: "movement", era: "20c-mid", description: "Close reading of the text as a self-contained object. Rejection of authorial intent, historical context, and reader response. The words on the page.", thinkers: ["Brooks", "Ransom", "Wimsatt", "Warren"], works: ["The Well Wrought Urn", "Understanding Poetry"] },

  // Core Concepts
  { id: "the_sublime", label: "The Sublime", type: "concept", era: "cross-era", description: "Experience of awe, terror, and vastness that exceeds rational comprehension. From Longinus through Burke to Kant to the Romantics.", thinkers: ["Longinus", "Burke", "Kant", "Shelley"], works: ["On the Sublime", "A Philosophical Enquiry", "Mont Blanc"] },
  { id: "mimesis", label: "Mimesis", type: "concept", era: "cross-era", description: "Art as imitation of reality. Central tension in Western aesthetics from Plato's suspicion to Aristotle's defense to modern complications.", thinkers: ["Plato", "Aristotle", "Auerbach"], works: ["Republic", "Poetics", "Mimesis: The Representation of Reality"] },
  { id: "catharsis", label: "Catharsis", type: "concept", era: "cross-era", description: "Emotional purgation through art, especially tragedy. The audience experiences pity and fear vicariously, achieving release.", thinkers: ["Aristotle", "Bernays", "Freud"], works: ["Poetics"] },
  { id: "alienation", label: "Alienation", type: "concept", era: "cross-era", description: "Estrangement from self, society, labor, or meaning. From Marx's economic alienation to existential and modernist senses.", thinkers: ["Marx", "Kafka", "Brecht", "Camus"], works: ["Economic and Philosophic Manuscripts", "The Metamorphosis", "The Stranger"] },
  { id: "the_uncanny", label: "The Uncanny", type: "concept", era: "cross-era", description: "The familiar made strange. Freud's unheimlich — what should have remained hidden but has come to light. Doubles, automata, returns.", thinkers: ["Freud", "Hoffmann", "Todorov", "Kristeva"], works: ["The Uncanny", "The Sandman"] },
  { id: "intertextuality", label: "Intertextuality", type: "concept", era: "cross-era", description: "All texts exist in relation to other texts. Meaning is produced through networks of reference, allusion, and transformation.", thinkers: ["Kristeva", "Barthes", "Genette", "Bakhtin"], works: ["Desire in Language", "S/Z", "Palimpsests"] },
  { id: "death_of_author", label: "Death of the Author", type: "concept", era: "20c-late", description: "The author's intentions and biography are irrelevant to textual meaning. The reader produces the text's significance.", thinkers: ["Barthes", "Foucault", "Derrida"], works: ["Death of the Author", "What Is an Author?"] },
  { id: "stream_of_consciousness", label: "Stream of Consciousness", type: "concept", era: "20c-early", description: "Narrative technique rendering the continuous flow of a character's thoughts, sensations, and associations.", thinkers: ["James (William)", "Joyce", "Woolf", "Faulkner"], works: ["Ulysses", "Mrs Dalloway", "The Sound and the Fury"] },
  { id: "the_absurd", label: "The Absurd", type: "concept", era: "20c-mid", description: "The conflict between human desire for meaning and the universe's indifference. Neither despair nor hope — lucid confrontation.", thinkers: ["Camus", "Beckett", "Ionesco", "Kierkegaard"], works: ["The Myth of Sisyphus", "Waiting for Godot", "The Bald Soprano"] },
  { id: "defamiliarization", label: "Defamiliarization", type: "concept", era: "20c-early", description: "Making the familiar strange to force fresh perception. Shklovsky's ostranenie — art exists to recover the sensation of life.", thinkers: ["Shklovsky", "Brecht", "the Formalists"], works: ["Art as Technique"] },
  { id: "gothic", label: "The Gothic", type: "concept", era: "cross-era", description: "Literature of terror, transgression, and the return of the repressed. Haunted spaces, doubles, excess, the monstrous.", thinkers: ["Walpole", "Radcliffe", "Shelley", "Poe", "Morrison"], works: ["Castle of Otranto", "Frankenstein", "Beloved"] },
  { id: "unreliable_narrator", label: "Unreliable Narrator", type: "concept", era: "cross-era", description: "A narrator whose credibility is compromised — by self-deception, madness, bias, or deliberate manipulation of the reader.", thinkers: ["Booth", "Nabokov", "Ishiguro", "Poe"], works: ["Lolita", "The Remains of the Day", "The Tell-Tale Heart"] },
  { id: "flâneur", label: "The Flâneur", type: "concept", era: "19c-mid", description: "The urban wanderer-observer. Detached spectatorship of modern city life as both aesthetic practice and philosophical stance.", thinkers: ["Baudelaire", "Benjamin", "Poe", "de Certeau"], works: ["The Painter of Modern Life", "The Arcades Project", "The Man of the Crowd"] },
  { id: "carnival", label: "The Carnivalesque", type: "concept", era: "cross-era", description: "Bakhtin's concept of subversive laughter, grotesque bodies, and the inversion of hierarchies. The marketplace against the cathedral.", thinkers: ["Bakhtin", "Rabelais", "Rushdie", "Angela Carter"], works: ["Rabelais and His World", "Midnight's Children", "Nights at the Circus"] },
  { id: "panopticon", label: "The Panopticon", type: "concept", era: "20c-late", description: "Foucault's model of disciplinary power: surveillance internalized. You behave because you might be watched, not because you are.", thinkers: ["Foucault", "Bentham", "Orwell", "Atwood"], works: ["Discipline and Punish", "1984", "The Handmaid's Tale"] },
  { id: "double_consciousness", label: "Double Consciousness", type: "concept", era: "cross-era", description: "Du Bois's concept of seeing oneself through the eyes of the oppressor. The twoness of being Black and American — never fully either.", thinkers: ["Du Bois", "Fanon", "Ellison", "Morrison"], works: ["The Souls of Black Folk", "Invisible Man", "Black Skin White Masks"] },
  { id: "ecriture_feminine", label: "Écriture Féminine", type: "concept", era: "20c-late", description: "Writing the body. Language that resists phallogocentric structure through rhythm, excess, jouissance, and the semiotic.", thinkers: ["Cixous", "Irigaray", "Kristeva"], works: ["The Laugh of the Medusa", "This Sex Which Is Not One", "Revolution in Poetic Language"] },
  { id: "hauntology", label: "Hauntology", type: "concept", era: "21c", description: "Derrida's concept of the ghost that haunts the present — futures that never arrived, pasts that refuse to die. The spectre as ontological condition.", thinkers: ["Derrida", "Fisher", "Morrison", "Sebald"], works: ["Specters of Marx", "Ghosts of My Life", "Beloved", "Austerlitz"] },
  { id: "palimpsest", label: "The Palimpsest", type: "concept", era: "cross-era", description: "A text written over another, where earlier layers bleed through. Metaphor for how history, memory, and identity are layered, never fully erased.", thinkers: ["Genette", "De Quincey", "Derrida", "Sebald"], works: ["Palimpsests", "Suspiria de Profundis", "The Rings of Saturn"] },
  { id: "close_reading", label: "Close Reading", type: "concept", era: "20c-mid", description: "Rigorous attention to the formal elements of a text — diction, syntax, imagery, rhythm — as the primary method of interpretation.", thinkers: ["Richards", "Empson", "Brooks", "de Man"], works: ["Practical Criticism", "Seven Types of Ambiguity", "The Well Wrought Urn"] },
  { id: "heteroglossia", label: "Heteroglossia", type: "concept", era: "cross-era", description: "Bakhtin's concept of multiple voices, languages, and social registers coexisting within a single text. The novel as a polyphonic form.", thinkers: ["Bakhtin", "Dostoevsky", "Joyce", "Rushdie"], works: ["The Dialogic Imagination", "Problems of Dostoevsky's Poetics", "Ulysses"] },
];

const EDGES = [
  // Historical flow
  { source: "classicism", target: "enlightenment", type: "influenced", label: "rationalist inheritance" },
  { source: "enlightenment", target: "romanticism", type: "reacted_against", label: "revolt against reason" },
  { source: "romanticism", target: "transcendentalism", type: "influenced", label: "American branch" },
  { source: "romanticism", target: "realism", type: "reacted_against", label: "rejection of idealization" },
  { source: "realism", target: "naturalism", type: "extended", label: "scientific determinism" },
  { source: "realism", target: "modernism", type: "reacted_against", label: "formal rupture" },
  { source: "romanticism", target: "modernism", type: "synthesized", label: "mythic interiority" },
  { source: "romanticism", target: "symbolism", type: "influenced", label: "inner vision" },
  { source: "symbolism", target: "modernism", type: "influenced", label: "linguistic density" },
  { source: "symbolism", target: "surrealism", type: "influenced", label: "beyond the visible" },
  { source: "aestheticism", target: "modernism", type: "influenced", label: "formal autonomy" },
  { source: "romanticism", target: "aestheticism", type: "influenced", label: "art as highest value" },
  { source: "aestheticism", target: "symbolism", type: "synthesized", label: "beauty & suggestion" },
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
  { source: "structuralism", target: "new_criticism", type: "reacted_against", label: "beyond the single text" },
  { source: "harlem_renaissance", target: "postcolonialism", type: "influenced", label: "identity & representation" },
  { source: "harlem_renaissance", target: "afrofuturism", type: "influenced", label: "reclamation of narrative" },
  { source: "postcolonialism", target: "afrofuturism", type: "synthesized", label: "speculative decolonization" },
  { source: "feminist_lit", target: "ecriture_feminine", type: "influenced", label: "gendered language" },
  { source: "poststructuralism", target: "feminist_lit", type: "influenced", label: "power & discourse" },
  { source: "poststructuralism", target: "death_of_author", type: "influenced", label: "decentered subject" },

  // Concept connections
  { source: "the_sublime", target: "romanticism", type: "central_to", label: "core aesthetic" },
  { source: "the_sublime", target: "gothic", type: "influenced", label: "terror & awe" },
  { source: "mimesis", target: "classicism", type: "central_to", label: "foundational principle" },
  { source: "mimesis", target: "realism", type: "central_to", label: "faithful representation" },
  { source: "catharsis", target: "classicism", type: "central_to", label: "tragic theory" },
  { source: "alienation", target: "modernism", type: "central_to", label: "defining condition" },
  { source: "alienation", target: "existentialism", type: "central_to", label: "existential estrangement" },
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
  { source: "flâneur", target: "modernism", type: "central_to", label: "urban consciousness" },
  { source: "flâneur", target: "realism", type: "influenced", label: "city as text" },
  { source: "carnival", target: "postmodernism", type: "influenced", label: "subversive laughter" },
  { source: "carnival", target: "magical_realism", type: "synthesized", label: "grotesque vitality" },
  { source: "carnival", target: "heteroglossia", type: "influenced", label: "polyphonic excess" },
  { source: "panopticon", target: "poststructuralism", type: "central_to", label: "power/knowledge" },
  { source: "panopticon", target: "postmodernism", type: "influenced", label: "surveillance society" },
  { source: "double_consciousness", target: "harlem_renaissance", type: "central_to", label: "founding concept" },
  { source: "double_consciousness", target: "postcolonialism", type: "influenced", label: "colonial subjectivity" },
  { source: "double_consciousness", target: "afrofuturism", type: "influenced", label: "split temporalities" },
  { source: "ecriture_feminine", target: "feminist_lit", type: "central_to", label: "bodily writing" },
  { source: "ecriture_feminine", target: "poststructuralism", type: "synthesized", label: "language & the body" },
  { source: "hauntology", target: "poststructuralism", type: "extended", label: "spectral deconstruction" },
  { source: "hauntology", target: "gothic", type: "synthesized", label: "ghost as theory" },
  { source: "hauntology", target: "afrofuturism", type: "influenced", label: "haunted futures" },
  { source: "palimpsest", target: "intertextuality", type: "synthesized", label: "layered texts" },
  { source: "palimpsest", target: "postcolonialism", type: "influenced", label: "erased histories" },
  { source: "palimpsest", target: "hauntology", type: "synthesized", label: "what bleeds through" },
  { source: "close_reading", target: "new_criticism", type: "central_to", label: "method" },
  { source: "close_reading", target: "poststructuralism", type: "influenced", label: "deconstructive reading" },
  { source: "heteroglossia", target: "postmodernism", type: "influenced", label: "many voices" },
  { source: "heteroglossia", target: "postcolonialism", type: "influenced", label: "linguistic resistance" },
];

const EDGE_COLORS = {
  influenced: "#6B8AFF",
  reacted_against: "#FF6B6B",
  synthesized: "#A78BFA",
  extended: "#34D399",
  central_to: "#FBBF24",
};

const EDGE_LABELS = {
  influenced: "Influenced",
  reacted_against: "Reacted Against",
  synthesized: "Synthesized",
  extended: "Extended",
  central_to: "Central To",
};

const NODE_COLORS = {
  movement: { fill: "#1a1a2e", stroke: "#6B8AFF", text: "#e0e0ff" },
  concept: { fill: "#1a1a2e", stroke: "#A78BFA", text: "#e0d0ff" },
};

export default function LiteraryConceptMap() {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [edgeFilter, setEdgeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dimensions, setDimensions] = useState({ w: 900, h: 650 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const zoomRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const w = Math.min(window.innerWidth - 20, 1400);
      const h = Math.min(window.innerHeight - 20, 900);
      setDimensions({ w: Math.max(w, 600), h: Math.max(h, 450) });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const { w, h } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const defs = svg.append("defs");

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const merge = glow.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    Object.keys(EDGE_COLORS).forEach(type => {
      defs.append("marker")
        .attr("id", `arrow-${type}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 28)
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-4L10,0L0,4")
        .attr("fill", EDGE_COLORS[type])
        .attr("opacity", 0.7);
    });

    const nodes = NODES.map(n => ({ ...n, x: w/2 + (Math.random()-0.5)*500, y: h/2 + (Math.random()-0.5)*400 }));
    const edges = EDGES.map(e => ({ ...e }));

    const g = svg.append("g");

    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);
    zoomRef.current = { zoom, svg };

    svg.call(zoom.transform, d3.zoomIdentity.translate(w * 0.1, h * 0.1).scale(0.8));

    const linkG = g.append("g").attr("class", "links");
    const linkLabelG = g.append("g").attr("class", "link-labels");
    const nodeG = g.append("g").attr("class", "nodes");

    const link = linkG.selectAll("line")
      .data(edges)
      .join("line")
      .attr("stroke", d => EDGE_COLORS[d.type] || "#444")
      .attr("stroke-width", 1.2)
      .attr("stroke-opacity", 0.35)
      .attr("marker-end", d => `url(#arrow-${d.type})`);

    const linkLabel = linkLabelG.selectAll("text")
      .data(edges)
      .join("text")
      .text(d => d.label)
      .attr("font-size", 7.5)
      .attr("fill", "#555")
      .attr("text-anchor", "middle")
      .attr("dy", -3)
      .style("pointer-events", "none")
      .style("opacity", 0);

    const node = nodeG.selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        }));

    node.append("circle")
      .attr("r", d => d.type === "movement" ? 20 : 14)
      .attr("fill", d => NODE_COLORS[d.type].fill)
      .attr("stroke", d => NODE_COLORS[d.type].stroke)
      .attr("stroke-width", 1.5)
      .attr("filter", "url(#glow)");

    node.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", d => d.type === "movement" ? 34 : 26)
      .attr("font-size", d => d.type === "movement" ? 10 : 8.5)
      .attr("font-weight", d => d.type === "movement" ? 600 : 400)
      .attr("fill", d => NODE_COLORS[d.type].text)
      .style("pointer-events", "none");

    node.append("text")
      .text(d => {
        const words = d.label.replace(/^The /, "").split(" ");
        return words.length === 1 ? words[0].slice(0,3).toUpperCase() : words.map(w => w[0]).join("").slice(0, 3).toUpperCase();
      })
      .attr("text-anchor", "middle")
      .attr("dy", 3.5)
      .attr("font-size", 8)
      .attr("font-weight", 700)
      .attr("fill", d => NODE_COLORS[d.type].stroke)
      .style("pointer-events", "none")
      .style("opacity", 0.8);

    node.on("click", (event, d) => {
      event.stopPropagation();
      setSelected(prev => prev?.id === d.id ? null : d);
    });

    node.on("mouseenter", (event, d) => {
      setHoveredNode(d.id);
      const connected = new Set();
      edges.forEach(e => {
        const sid = typeof e.source === "object" ? e.source.id : e.source;
        const tid = typeof e.target === "object" ? e.target.id : e.target;
        if (sid === d.id) connected.add(tid);
        if (tid === d.id) connected.add(sid);
      });
      connected.add(d.id);

      node.style("opacity", n => connected.has(n.id) ? 1 : 0.08);
      link.style("opacity", e => {
        const sid = typeof e.source === "object" ? e.source.id : e.source;
        const tid = typeof e.target === "object" ? e.target.id : e.target;
        return (sid === d.id || tid === d.id) ? 0.8 : 0.03;
      }).attr("stroke-width", e => {
        const sid = typeof e.source === "object" ? e.source.id : e.source;
        const tid = typeof e.target === "object" ? e.target.id : e.target;
        return (sid === d.id || tid === d.id) ? 2.5 : 1.2;
      });
      linkLabel.style("opacity", e => {
        const sid = typeof e.source === "object" ? e.source.id : e.source;
        const tid = typeof e.target === "object" ? e.target.id : e.target;
        return (sid === d.id || tid === d.id) ? 1 : 0;
      });
    });

    node.on("mouseleave", () => {
      setHoveredNode(null);
      node.style("opacity", 1);
      link.style("opacity", 0.35).attr("stroke-width", 1.2);
      linkLabel.style("opacity", 0);
    });

    svg.on("click", () => setSelected(null));

    const sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(120).strength(0.3))
      .force("charge", d3.forceManyBody().strength(-280))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide().radius(35))
      .force("x", d3.forceX(w / 2).strength(0.03))
      .force("y", d3.forceY(h / 2).strength(0.03));

    sim.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    simRef.current = sim;

    return () => sim.stop();
  }, [dimensions]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll(".nodes g").style("opacity", function(d) {
      let show = true;
      if (filter !== "all") show = d.type === filter;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const match = d.label.toLowerCase().includes(term) ||
          d.description?.toLowerCase().includes(term) ||
          d.thinkers?.some(t => t.toLowerCase().includes(term)) ||
          d.works?.some(w => w.toLowerCase().includes(term));
        show = show && match;
      }
      return show ? 1 : 0.06;
    });

    svg.selectAll(".links line").each(function(d) {
      const el = d3.select(this);
      const sid = typeof d.source === "object" ? d.source.id : d.source;
      const tid = typeof d.target === "object" ? d.target.id : d.target;
      const sNode = NODES.find(n => n.id === sid);
      const tNode = NODES.find(n => n.id === tid);

      let show = true;
      if (filter !== "all") show = sNode?.type === filter || tNode?.type === filter;
      if (edgeFilter !== "all") show = show && d.type === edgeFilter;
      el.style("opacity", show ? 0.35 : 0.02);
    });
  }, [filter, edgeFilter, searchTerm]);

  const selectedNode = selected ? NODES.find(n => n.id === selected.id) : null;
  const connectedEdges = selectedNode ? EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id) : [];

  const stats = { nodes: NODES.length, edges: EDGES.length, movements: NODES.filter(n => n.type === "movement").length, concepts: NODES.filter(n => n.type === "concept").length };

  return (
    <div style={{ background: "#0a0a14", color: "#e0e0e0", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "10px 16px", borderBottom: "1px solid #151530", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, flexWrap: "wrap", gap: 8, background: "#0d0d1a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>Literary Concept Map</h1>
            <p style={{ margin: "1px 0 0", fontSize: 10, color: "#4a4a6a" }}>
              {stats.nodes} nodes ({stats.movements} movements, {stats.concepts} concepts) · {stats.edges} connections
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search nodes, thinkers, works..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: "#111122", color: "#ccc", border: "1px solid #1e1e3e", borderRadius: 6, padding: "5px 10px", fontSize: 11, width: 200, outline: "none" }}
          />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: "#111122", color: "#aaa", border: "1px solid #1e1e3e", borderRadius: 6, padding: "5px 8px", fontSize: 11 }}>
            <option value="all">All Types</option>
            <option value="movement">Movements</option>
            <option value="concept">Concepts</option>
          </select>
          <select value={edgeFilter} onChange={e => setEdgeFilter(e.target.value)} style={{ background: "#111122", color: "#aaa", border: "1px solid #1e1e3e", borderRadius: 6, padding: "5px 8px", fontSize: 11 }}>
            <option value="all">All Relations</option>
            {Object.entries(EDGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <svg ref={svgRef} width={dimensions.w} height={dimensions.h} style={{ flex: 1, display: "block" }} />

        {/* Legend */}
        <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(10,10,20,0.92)", border: "1px solid #151530", borderRadius: 8, padding: "8px 12px", fontSize: 9, backdropFilter: "blur(8px)" }}>
          <div style={{ fontWeight: 600, marginBottom: 5, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 8 }}>Edges</div>
          {Object.entries(EDGE_COLORS).map(([k, c]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2, cursor: "pointer", opacity: edgeFilter === "all" || edgeFilter === k ? 1 : 0.3 }} onClick={() => setEdgeFilter(prev => prev === k ? "all" : k)}>
              <div style={{ width: 16, height: 2, background: c, borderRadius: 1 }} />
              <span style={{ color: "#888" }}>{EDGE_LABELS[k]}</span>
            </div>
          ))}
          <div style={{ marginTop: 6, fontWeight: 600, marginBottom: 5, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 8 }}>Nodes</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", border: `1.5px solid ${NODE_COLORS.movement.stroke}`, background: NODE_COLORS.movement.fill }} />
            <span style={{ color: "#888" }}>Movement</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", border: `1.5px solid ${NODE_COLORS.concept.stroke}`, background: NODE_COLORS.concept.fill }} />
            <span style={{ color: "#888" }}>Concept</span>
          </div>
        </div>

        {/* Hover hint */}
        {!selected && !hoveredNode && (
          <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,10,20,0.8)", border: "1px solid #151530", borderRadius: 6, padding: "6px 10px", fontSize: 10, color: "#4a4a6a" }}>
            Hover to trace · Click for details · Drag to rearrange
          </div>
        )}

        {/* Detail Panel */}
        {selectedNode && (
          <div style={{
            position: "absolute", top: 0, right: 0, width: Math.min(340, dimensions.w * 0.4), height: "100%",
            background: "rgba(10,10,20,0.96)", borderLeft: "1px solid #151530",
            overflowY: "auto", padding: "16px 18px",
            backdropFilter: "blur(12px)",
            animation: "slideIn 0.15s ease-out"
          }}>
            <style>{`@keyframes slideIn { from { transform: translateX(16px); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{
                  fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600,
                  color: NODE_COLORS[selectedNode.type].stroke, display: "block", marginBottom: 3
                }}>{selectedNode.type} · {selectedNode.era}</span>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{selectedNode.label}</h2>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#555", fontSize: 18, cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>×</button>
            </div>

            <p style={{ fontSize: 12, lineHeight: 1.65, color: "#999", marginBottom: 14 }}>{selectedNode.description}</p>

            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a4a6a", marginBottom: 5, fontWeight: 600 }}>Key Thinkers</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {selectedNode.thinkers.map(t => (
                  <span key={t} style={{ background: "#12122a", padding: "2px 7px", borderRadius: 4, fontSize: 10, color: "#8888aa", border: "1px solid #1a1a3a" }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a4a6a", marginBottom: 5, fontWeight: 600 }}>Key Works</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {selectedNode.works.map(w => (
                  <span key={w} style={{ background: "#12122a", padding: "2px 7px", borderRadius: 4, fontSize: 10, color: "#8888aa", fontStyle: "italic", border: "1px solid #1a1a3a" }}>{w}</span>
                ))}
              </div>
            </div>

            {connectedEdges.length > 0 && (
              <div>
                <h3 style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4a4a6a", marginBottom: 6, fontWeight: 600 }}>Connections ({connectedEdges.length})</h3>
                {connectedEdges.map((e, i) => {
                  const isSource = e.source === selectedNode.id;
                  const otherId = isSource ? e.target : e.source;
                  const other = NODES.find(n => n.id === otherId);
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 7, marginBottom: 4,
                      padding: "5px 7px", borderRadius: 5, background: "#0e0e1e",
                      cursor: "pointer", border: "1px solid transparent",
                      transition: "border-color 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#1e1e3e"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                    onClick={() => setSelected(other)}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: EDGE_COLORS[e.type], flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, color: "#ccc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          <span style={{ color: "#555" }}>{isSource ? "→" : "←"}</span> {other?.label}
                        </div>
                        <div style={{ fontSize: 9, color: "#555" }}>
                          {EDGE_LABELS[e.type]} · {e.label}
                        </div>
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
