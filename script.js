(function () {
  "use strict";

  const NOTE_INDEX = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
    Cb: 11,
  };

  const NOTE_NAMES = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
  const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
  const NATURAL_MINOR_STEPS = [0, 2, 3, 5, 7, 8, 10];
  const MAJOR_QUALITIES = ["major", "minor", "minor", "major", "dominant", "minor", "diminished"];
  const MINOR_QUALITIES = ["minor", "diminished", "major", "minor", "dominant", "major", "major"];
  const MOOD_LABELS = {
    warm: "Warm",
    bright: "Bright",
    melancholic: "Melancholic",
    soulful: "Soulful",
  };

  const SAMPLE_INPUT = `[Verse]
G              D
I found a light beside the window
Em             C
It kept me warm through the rain

[Chorus]
C              G
Hold on, hold on to the morning
Am             D
Every road comes home again`;

  const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];
  const OPEN_SHAPES = {
    C: { frets: ["x", 3, 2, 0, 1, 0], fingers: ["", 3, 2, "", 1, ""], name: "C" },
    Cmaj7: { frets: ["x", 3, 2, 0, 0, 0], fingers: ["", 3, 2, "", "", ""], name: "Cmaj7" },
    Cadd9: { frets: ["x", 3, 2, 0, 3, 3], fingers: ["", 3, 2, "", 4, 4], name: "Cadd9" },
    C6: { frets: ["x", 3, 2, 2, 1, 0], fingers: ["", 3, 2, 2, 1, ""], name: "C6" },
    Cm: { frets: ["x", 3, 5, 5, 4, 3], fingers: ["", 1, 3, 4, 2, 1], base: 3, name: "Cm" },
    Cm7: { frets: ["x", 3, 5, 3, 4, 3], fingers: ["", 1, 3, 1, 2, 1], base: 3, name: "Cm7" },
    C7: { frets: ["x", 3, 2, 3, 1, 0], fingers: ["", 3, 2, 4, 1, ""], name: "C7" },
    Csus4: { frets: ["x", 3, 3, 0, 1, 1], fingers: ["", 3, 4, "", 1, 1], name: "Csus4" },

    D: { frets: ["x", "x", 0, 2, 3, 2], fingers: ["", "", "", 1, 3, 2], name: "D" },
    Dmaj7: { frets: ["x", "x", 0, 2, 2, 2], fingers: ["", "", "", 1, 1, 1], name: "Dmaj7" },
    Dadd9: { frets: ["x", "x", 0, 2, 3, 0], fingers: ["", "", "", 1, 3, ""], name: "Dadd9" },
    D6: { frets: ["x", "x", 0, 2, 0, 2], fingers: ["", "", "", 1, "", 2], name: "D6" },
    Dm: { frets: ["x", "x", 0, 2, 3, 1], fingers: ["", "", "", 2, 3, 1], name: "Dm" },
    Dm7: { frets: ["x", "x", 0, 2, 1, 1], fingers: ["", "", "", 2, 1, 1], name: "Dm7" },
    D7: { frets: ["x", "x", 0, 2, 1, 2], fingers: ["", "", "", 2, 1, 3], name: "D7" },
    Dsus4: { frets: ["x", "x", 0, 2, 3, 3], fingers: ["", "", "", 1, 3, 4], name: "Dsus4" },

    E: { frets: [0, 2, 2, 1, 0, 0], fingers: ["", 2, 3, 1, "", ""], name: "E" },
    Emaj7: { frets: [0, 2, 1, 1, 0, 0], fingers: ["", 3, 1, 2, "", ""], name: "Emaj7" },
    Eadd9: { frets: [0, 2, 4, 1, 0, 0], fingers: ["", 2, 4, 1, "", ""], name: "Eadd9" },
    E6: { frets: [0, 2, 2, 1, 2, 0], fingers: ["", 2, 3, 1, 4, ""], name: "E6" },
    Em: { frets: [0, 2, 2, 0, 0, 0], fingers: ["", 2, 3, "", "", ""], name: "Em" },
    Em7: { frets: [0, 2, 0, 0, 0, 0], fingers: ["", 2, "", "", "", ""], name: "Em7" },
    Em9: { frets: [0, 2, 0, 0, 0, 2], fingers: ["", 2, "", "", "", 3], name: "Em9" },
    E7: { frets: [0, 2, 0, 1, 0, 0], fingers: ["", 2, "", 1, "", ""], name: "E7" },
    Esus4: { frets: [0, 2, 2, 2, 0, 0], fingers: ["", 1, 2, 3, "", ""], name: "Esus4" },

    F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], base: 1, name: "F" },
    Fmaj7: { frets: ["x", 3, 3, 2, 1, 0], fingers: ["", 3, 4, 2, 1, ""], name: "Fmaj7" },
    Fadd9: { frets: [1, 3, 3, 0, 1, 1], fingers: [1, 3, 4, "", 1, 1], base: 1, name: "Fadd9" },
    Fm: { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], base: 1, name: "Fm" },
    Fm7: { frets: [1, 3, 1, 1, 1, 1], fingers: [1, 3, 1, 1, 1, 1], base: 1, name: "Fm7" },
    F7: { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], base: 1, name: "F7" },
    Fsus4: { frets: [1, 3, 3, 3, 1, 1], fingers: [1, 2, 3, 4, 1, 1], base: 1, name: "Fsus4" },

    G: { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, "", "", "", 4], name: "G" },
    Gmaj7: { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, "", "", "", 1], name: "Gmaj7" },
    Gadd9: { frets: [3, 0, 0, 2, 0, 3], fingers: [3, "", "", 1, "", 4], name: "Gadd9" },
    G6: { frets: [3, 2, 0, 0, 0, 0], fingers: [3, 2, "", "", "", ""], name: "G6" },
    Gm: { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], base: 3, name: "Gm" },
    Gm7: { frets: [3, 5, 3, 3, 3, 3], fingers: [1, 3, 1, 1, 1, 1], base: 3, name: "Gm7" },
    G7: { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, "", "", "", 1], name: "G7" },
    Gsus4: { frets: [3, 3, 0, 0, 1, 3], fingers: [3, 4, "", "", 1, 3], name: "Gsus4" },

    A: { frets: ["x", 0, 2, 2, 2, 0], fingers: ["", "", 1, 2, 3, ""], name: "A" },
    Amaj7: { frets: ["x", 0, 2, 1, 2, 0], fingers: ["", "", 2, 1, 3, ""], name: "Amaj7" },
    Aadd9: { frets: ["x", 0, 2, 4, 2, 0], fingers: ["", "", 1, 3, 2, ""], name: "Aadd9" },
    A6: { frets: ["x", 0, 2, 2, 2, 2], fingers: ["", "", 1, 1, 1, 1], name: "A6" },
    Am: { frets: ["x", 0, 2, 2, 1, 0], fingers: ["", "", 2, 3, 1, ""], name: "Am" },
    Am7: { frets: ["x", 0, 2, 0, 1, 0], fingers: ["", "", 2, "", 1, ""], name: "Am7" },
    A7: { frets: ["x", 0, 2, 0, 2, 0], fingers: ["", "", 1, "", 2, ""], name: "A7" },
    Asus4: { frets: ["x", 0, 2, 2, 3, 0], fingers: ["", "", 1, 2, 3, ""], name: "Asus4" },

    B: { frets: ["x", 2, 4, 4, 4, 2], fingers: ["", 1, 3, 3, 3, 1], base: 2, name: "B" },
    Bmaj7: { frets: ["x", 2, 4, 3, 4, 2], fingers: ["", 1, 3, 2, 4, 1], base: 2, name: "Bmaj7" },
    Badd9: { frets: ["x", 2, 4, 4, 2, 2], fingers: ["", 1, 3, 4, 1, 1], base: 2, name: "Badd9" },
    Bm: { frets: ["x", 2, 4, 4, 3, 2], fingers: ["", 1, 3, 4, 2, 1], base: 2, name: "Bm" },
    Bm7: { frets: ["x", 2, 4, 2, 3, 2], fingers: ["", 1, 3, 1, 2, 1], base: 2, name: "Bm7" },
    B7: { frets: ["x", 2, 1, 2, 0, 2], fingers: ["", 2, 1, 3, "", 4], name: "B7" },
    Bsus4: { frets: ["x", 2, 4, 4, 5, 2], fingers: ["", 1, 2, 3, 4, 1], base: 2, name: "Bsus4" },
  };

  const QUALITY_FALLBACKS = {
    "": [""],
    m: ["m"],
    min: ["m"],
    minor: ["m"],
    maj: ["maj7", ""],
    M: ["maj7", ""],
    maj7: ["maj7", ""],
    M7: ["maj7", ""],
    maj9: ["maj7", "add9", ""],
    6: ["6", ""],
    add9: ["add9", ""],
    "(add9)": ["add9", ""],
    7: ["7", ""],
    9: ["9", "7", ""],
    sus: ["sus4", ""],
    sus4: ["sus4", ""],
    "7sus4": ["sus4", "7", ""],
    m7: ["m7", "m"],
    min7: ["m7", "m"],
    m9: ["m9", "m7", "m"],
  };

  function normalizeNoteName(note) {
    if (!note) return null;
    const trimmed = note.trim();
    const letter = trimmed.charAt(0).toUpperCase();
    const accidental = trimmed.slice(1);
    return `${letter}${accidental}`;
  }

  function noteValue(note) {
    const normalized = normalizeNoteName(note);
    return Object.prototype.hasOwnProperty.call(NOTE_INDEX, normalized) ? NOTE_INDEX[normalized] : null;
  }

  function displayNote(value) {
    return NOTE_NAMES[((value % 12) + 12) % 12];
  }

  function unwrapToken(token) {
    let prefix = "";
    let suffix = "";
    let core = token;

    while (/^[([{]/.test(core)) {
      prefix += core.charAt(0);
      core = core.slice(1);
    }

    while (/[)\]}.,;:]$/.test(core)) {
      suffix = core.slice(-1) + suffix;
      core = core.slice(0, -1);
    }

    return { prefix, core, suffix };
  }

  function parseChord(token) {
    const { prefix, core, suffix } = unwrapToken(token);
    if (!core || /^N\.?C\.?$/i.test(core)) {
      return core ? { prefix, root: "N.C.", quality: "none", rawQuality: "", bass: null, suffix } : null;
    }

    const match = core.match(/^([A-Ga-g](?:#|b)?)([^/\s]*)(?:\/([A-Ga-g](?:#|b)?|\d+(?:-\d+)?))?$/);
    if (!match) return null;

    const root = normalizeNoteName(match[1]);
    const rawQuality = match[2] || "";
    const bass = match[3] ? normalizeNoteName(match[3]) : null;

    if (!isSupportedQuality(rawQuality)) return null;

    return {
      prefix,
      root,
      quality: classifyQuality(rawQuality),
      rawQuality,
      bass,
      suffix,
    };
  }

  function isSupportedQuality(quality) {
    if (quality === "") return true;
    return /^(m|min|minor|maj|M|maj7|M7|6|7|9|11|13|m6|m7|min7|m9|dim|dim7|aug|\+|sus|sus2|sus4|7sus4|add2|add4|add9|\(add9\)|5)$/i.test(quality);
  }

  function classifyQuality(quality) {
    const lower = quality.toLowerCase();
    if (!lower) return "major";
    if (lower.includes("dim")) return "diminished";
    if (lower.includes("aug") || lower.includes("+")) return "augmented";
    if (lower.startsWith("m") && !lower.startsWith("maj")) return "minor";
    if (lower.includes("sus")) return "suspended";
    if (lower.includes("7") || lower.includes("9") || lower.includes("11") || lower.includes("13")) return "dominant";
    if (lower.includes("maj") || quality.includes("M")) return "major";
    return "major";
  }

  function chordToString(chord, rawQualityOverride) {
    if (chord.root === "N.C.") return `${chord.prefix}N.C.${chord.suffix}`;
    const quality = rawQualityOverride !== undefined ? rawQualityOverride : chord.rawQuality;
    const bass = chord.bass ? `/${chord.bass}` : "";
    return `${chord.prefix}${chord.root}${quality}${bass}${chord.suffix}`;
  }

  function normalizeQualityForShape(rawQuality) {
    if (!rawQuality) return "";
    if (rawQuality === "M" || rawQuality === "M7") return rawQuality;
    return rawQuality.toLowerCase();
  }

  function generateMovableShape(root, quality) {
    const rootValue = noteValue(root);
    if (rootValue === null) return null;

    const qualityTemplates = {
      "": [0, 2, 2, 1, 0, 0],
      m: [0, 2, 2, 0, 0, 0],
      7: [0, 2, 0, 1, 0, 0],
      m7: [0, 2, 0, 0, 0, 0],
      maj7: [0, 2, 1, 1, 0, 0],
      sus4: [0, 2, 2, 2, 0, 0],
      6: [0, 2, 2, 1, 2, 0],
    };

    const template = qualityTemplates[quality === "add9" || quality === "9" || quality === "m9" ? quality.replace("9", "7") : quality];
    const resolvedTemplate = template || qualityTemplates[""];
    let base = (rootValue - NOTE_INDEX.E + 12) % 12;
    if (base === 0) base = 12;

    const frets = resolvedTemplate.map((fret) => (fret === "x" ? "x" : fret + base));
    const fingers = frets.map((fret) => {
      if (fret === "x") return "";
      if (fret === base) return 1;
      if (fret === base + 1) return 2;
      if (fret === base + 2) return 3;
      return 4;
    });

    return {
      frets,
      fingers,
      base,
      name: `${root}${quality}`,
      note: "Movable E-shape voicing",
    };
  }

  function getChordShape(chordName) {
    const parsed = parseChord(chordName);
    if (!parsed || parsed.root === "N.C.") return null;

    const qualityKey = normalizeQualityForShape(parsed.rawQuality);
    const fallbacks = QUALITY_FALLBACKS[qualityKey] || [qualityKey, ""];

    for (const quality of fallbacks) {
      const exactName = `${parsed.root}${quality}`;
      if (OPEN_SHAPES[exactName]) return OPEN_SHAPES[exactName];
    }

    for (const quality of fallbacks) {
      const movable = generateMovableShape(parsed.root, quality);
      if (movable) return movable;
    }

    return null;
  }

  function isSeparatorToken(token) {
    return /^[|/\\\-–—:]+$/.test(token);
  }

  function tokenizeLine(line) {
    const matches = line.matchAll(/\S+/g);
    return Array.from(matches, (match) => ({
      value: match[0],
      start: match.index,
    }));
  }

  function isChordLine(line) {
    const trimmed = line.trim();
    if (!trimmed || /^\[[^\]]+\]$/.test(trimmed)) return false;

    const tokens = tokenizeLine(line);
    if (!tokens.length) return false;

    let chordCount = 0;
    let meaningfulCount = 0;

    for (const token of tokens) {
      if (isSeparatorToken(token.value)) continue;
      meaningfulCount += 1;
      if (parseChord(token.value)) chordCount += 1;
    }

    if (!meaningfulCount) return false;
    return chordCount > 0 && chordCount / meaningfulCount >= 0.75;
  }

  function getInlineChordTokens(line) {
    const matches = line.matchAll(/\[([^\]\r\n]+)\]/g);
    return Array.from(matches, (match) => {
      const chord = parseChord(match[1].trim());
      return chord
        ? {
            fullMatch: match[0],
            value: match[1].trim(),
            start: match.index,
            chord,
          }
        : null;
    }).filter(Boolean);
  }

  function hasInlineChords(line) {
    return getInlineChordTokens(line).length > 0;
  }

  function collectChords(inputText) {
    const chords = [];
    const lines = inputText.split(/\r?\n/);

    for (const line of lines) {
      for (const token of getInlineChordTokens(line)) {
        if (token.chord.root !== "N.C.") chords.push(token.chord);
      }

      if (hasInlineChords(line)) continue;
      if (!isChordLine(line)) continue;
      for (const token of tokenizeLine(line)) {
        const parsed = parseChord(token.value);
        if (parsed && parsed.root !== "N.C.") chords.push(parsed);
      }
    }

    return chords;
  }

  function scoreKey(chords, tonic, mode) {
    const steps = mode === "minor" ? NATURAL_MINOR_STEPS : MAJOR_STEPS;
    const expectedQualities = mode === "minor" ? MINOR_QUALITIES : MAJOR_QUALITIES;
    let score = 0;

    for (let index = 0; index < chords.length; index += 1) {
      const chord = chords[index];
      const rootValue = noteValue(chord.root);
      if (rootValue === null) continue;

      const degree = steps.indexOf((rootValue - tonic + 12) % 12);
      if (degree !== -1) {
        score += 3;
        const expected = expectedQualities[degree];
        if (expected === chord.quality || (expected === "dominant" && chord.quality === "major")) {
          score += 2;
        }
      }

      if (rootValue === tonic) score += 2;
      if (index === 0 && rootValue === tonic) score += 4;
      if (index === chords.length - 1 && rootValue === tonic) score += 2;
    }

    return score;
  }

  function detectKey(inputText) {
    const chords = collectChords(inputText);
    if (!chords.length) return { name: "C", mode: "major", confidence: 0 };

    let best = { tonic: 0, mode: "major", score: -Infinity };

    for (let tonic = 0; tonic < 12; tonic += 1) {
      for (const mode of ["major", "minor"]) {
        const score = scoreKey(chords, tonic, mode);
        if (score > best.score) best = { tonic, mode, score };
      }
    }

    return {
      name: displayNote(best.tonic),
      mode: best.mode,
      confidence: Math.max(0, Math.round((best.score / Math.max(1, chords.length * 5)) * 100)),
    };
  }

  function detectMood(inputText, keyInfo) {
    const source = inputText.toLowerCase();
    const keywordScores = {
      bright: ["morning", "light", "sun", "shine", "happy", "dance", "smile", "vui", "nang", "sang", "cuoi"],
      melancholic: ["rain", "dark", "lost", "cry", "tears", "lonely", "buon", "mua", "khoc", "dau", "chia tay", "nuoc mat"],
      soulful: ["love", "heart", "hold", "found", "remember", "yeu", "thuong", "nho", "tim", "doi cho"],
      warm: ["home", "again", "safe", "gentle", "dream", "binh yen", "tro ve", "em", "anh"],
    };
    const scores = { warm: 0, bright: 0, melancholic: 0, soulful: 0 };

    Object.entries(keywordScores).forEach(([mood, words]) => {
      words.forEach((word) => {
        if (source.includes(word)) scores[mood] += 1;
      });
    });

    if (keyInfo.mode === "minor") scores.melancholic += 2;
    if (keyInfo.mode === "major") scores.warm += 1;

    return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  }

  function degreeInMajor(root, keyName) {
    const rootValue = noteValue(root);
    const tonic = noteValue(keyName);
    if (rootValue === null || tonic === null) return -1;
    return MAJOR_STEPS.indexOf((rootValue - tonic + 12) % 12);
  }

  function resolvesByFifth(currentRoot, nextRoot) {
    const current = noteValue(currentRoot);
    const next = noteValue(nextRoot);
    if (current === null || next === null) return false;
    return (current - next + 12) % 12 === 7;
  }

  function hasExtension(quality) {
    return /(?:6|7|9|11|13|add)/i.test(quality);
  }

  function chooseMajorColor(degree, context) {
    const rich = context.intensity === "rich";
    const gentle = context.intensity === "gentle";

    if (context.mood === "bright") return degree === 0 ? "6" : "add9";
    if (context.mood === "melancholic") return degree === 0 || degree === 3 ? "maj7" : "add9";
    if (context.mood === "soulful") return rich ? "maj9" : "maj7";
    if (gentle) return "add9";
    return rich ? "maj9" : "maj7";
  }

  function chooseMinorColor(context) {
    if (context.mood === "melancholic") return context.intensity === "gentle" ? "m7" : "m9";
    if (context.mood === "soulful") return context.intensity === "gentle" ? "m7" : "m9";
    return context.intensity === "rich" ? "m9" : "m7";
  }

  function chooseDominantColor(context) {
    if (context.mood === "bright" && context.intensity !== "rich") return "sus4";
    if (context.mood === "melancholic") return context.intensity === "gentle" ? "7" : "7sus4";
    if (context.mood === "soulful") return context.intensity === "gentle" ? "7" : "9";
    return context.intensity === "rich" ? "9" : "7";
  }

  function improveChord(chord, context) {
    if (!chord || chord.root === "N.C.") return { text: chordToString(chord), changed: false, reason: "" };
    if (hasExtension(chord.rawQuality) || chord.quality === "diminished" || chord.quality === "augmented") {
      return { text: chordToString(chord), changed: false, reason: "" };
    }

    const nextChord = context.nextChord;
    const degree = degreeInMajor(chord.root, context.keyName);
    let nextQuality = chord.rawQuality;
    let reason = "";

    if (chord.quality === "minor") {
      nextQuality = chooseMinorColor(context);
      reason = `${context.mood} minor color`;
    } else if (chord.quality === "suspended") {
      nextQuality = context.intensity === "rich" ? "7sus4" : chord.rawQuality || "sus4";
      reason = context.intensity === "rich" ? `${context.mood} suspension` : "";
    } else if (nextChord && resolvesByFifth(chord.root, nextChord.root) && degree !== 0) {
      nextQuality = chooseDominantColor(context);
      reason = `${context.mood} dominant resolution`;
    } else if (degree === 0 || degree === 3) {
      nextQuality = chooseMajorColor(degree, context);
      reason = `${context.mood} major color`;
    } else if (degree === 4) {
      nextQuality = chooseDominantColor(context);
      reason = `${context.mood} dominant function`;
    } else if (chord.quality === "major") {
      nextQuality = context.mood === "soulful" && context.intensity === "rich" ? "9" : "add9";
      reason = `${context.mood} open color`;
    }

    if (nextQuality === chord.rawQuality) return { text: chordToString(chord), changed: false, reason: "" };
    return { text: chordToString(chord, nextQuality), changed: true, reason };
  }

  function getChordTokens(line) {
    return tokenizeLine(line)
      .map((token) => ({ ...token, chord: parseChord(token.value) }))
      .filter((token) => token.chord);
  }

  function replaceChordLine(line, keyName, intensity, mood, changes) {
    const tokens = tokenizeLine(line);
    const chordTokens = getChordTokens(line);
    let chordPointer = 0;
    let output = "";

    for (const token of tokens) {
      const parsed = parseChord(token.value);
      const targetStart = Math.max(token.start, output.length === 0 ? token.start : output.length + 1);
      if (output.length < targetStart) output += " ".repeat(targetStart - output.length);

      if (!parsed) {
        output += token.value;
        continue;
      }

      const nextChord = chordTokens.slice(chordPointer + 1).find((candidate) => candidate.chord.root !== "N.C.");
      const improved = improveChord(parsed, {
        keyName,
        intensity,
        mood,
        nextChord: nextChord ? nextChord.chord : null,
      });
      output += improved.text;

      if (improved.changed) {
        changes.push(`${chordToString(parsed)} -> ${improved.text} (${improved.reason})`);
      }

      chordPointer += 1;
    }

    return output;
  }

  function replaceInlineChordLine(line, keyName, intensity, mood, changes) {
    const chordTokens = getInlineChordTokens(line);
    let chordPointer = 0;

    return line.replace(/\[([^\]\r\n]+)\]/g, (fullMatch, chordText) => {
      const parsed = parseChord(chordText.trim());
      if (!parsed) return fullMatch;

      const nextChord = chordTokens.slice(chordPointer + 1).find((candidate) => candidate.chord.root !== "N.C.");
      const improved = improveChord(parsed, {
        keyName,
        intensity,
        mood,
        nextChord: nextChord ? nextChord.chord : null,
      });

      chordPointer += 1;

      if (improved.changed) {
        changes.push(`[${chordToString(parsed)}] -> [${improved.text}] (${improved.reason})`);
      }

      return `[${improved.text}]`;
    });
  }

  function improveSong(inputText, options = {}) {
    const source = String(inputText || "");
    const selectedKey = options.key || "auto";
    const intensity = options.intensity || "balanced";
    const detection = selectedKey === "auto" ? detectKey(source) : { name: selectedKey, mode: "major", confidence: 100 };
    const selectedMood = options.mood || "auto";
    const mood = selectedMood === "auto" ? detectMood(source, detection) : selectedMood;
    const changes = [];
    const lines = source.split(/\r?\n/);

    const outputLines = lines.map((line) => {
      if (hasInlineChords(line)) return replaceInlineChordLine(line, detection.name, intensity, mood, changes);
      if (!isChordLine(line)) return line;
      return replaceChordLine(line, detection.name, intensity, mood, changes);
    });

    return {
      outputText: outputLines.join("\n"),
      detectedKey: `${detection.name} ${detection.mode}`,
      mood,
      moodLabel: MOOD_LABELS[mood] || mood,
      confidence: detection.confidence,
      changes,
    };
  }

  function lineCount(text) {
    if (!text) return 0;
    return text.split(/\r?\n/).length;
  }

  function clearChildren(element) {
    while (element.firstChild) element.removeChild(element.firstChild);
  }

  function createChordDiagram(chordName) {
    const shape = getChordShape(chordName);
    const popover = document.createElement("span");
    popover.className = "chord-popover";
    popover.setAttribute("role", "tooltip");

    const title = document.createElement("span");
    title.className = "diagram-title";
    title.textContent = chordName;
    popover.appendChild(title);

    if (!shape) {
      const missing = document.createElement("span");
      missing.className = "diagram-note";
      missing.textContent = "No guitar shape in the local library yet.";
      popover.appendChild(missing);
      return popover;
    }

    const markers = document.createElement("span");
    markers.className = "string-markers";
    shape.frets.forEach((fret) => {
      const marker = document.createElement("span");
      marker.textContent = fret === "x" ? "x" : fret === 0 ? "o" : "";
      markers.appendChild(marker);
    });
    popover.appendChild(markers);

    const fretValues = shape.frets.filter((fret) => typeof fret === "number" && fret > 0);
    const base = shape.base || 1;
    const highestFret = fretValues.length ? Math.max(...fretValues) : 4;
    const rows = Math.max(4, Math.min(6, highestFret - base + 1));

    const boardWrap = document.createElement("span");
    boardWrap.className = "diagram-board-wrap";

    const baseLabel = document.createElement("span");
    baseLabel.className = "base-fret";
    baseLabel.textContent = base > 1 ? `${base}fr` : "";
    boardWrap.appendChild(baseLabel);

    const board = document.createElement("span");
    board.className = "diagram-board";
    board.style.setProperty("--fret-count", rows);

    for (let row = 0; row < rows; row += 1) {
      for (let stringIndex = 0; stringIndex < 6; stringIndex += 1) {
        const cell = document.createElement("span");
        cell.className = "fret-cell";
        const fret = shape.frets[stringIndex];
        const absoluteFret = base + row;

        if (fret === absoluteFret) {
          const dot = document.createElement("span");
          dot.className = "finger-dot";
          dot.textContent = shape.fingers[stringIndex] || "";
          cell.appendChild(dot);
        }

        board.appendChild(cell);
      }
    }

    boardWrap.appendChild(board);
    popover.appendChild(boardWrap);

    const strings = document.createElement("span");
    strings.className = "string-names";
    STRING_NAMES.forEach((name) => {
      const stringName = document.createElement("span");
      stringName.textContent = name;
      strings.appendChild(stringName);
    });
    popover.appendChild(strings);

    const frets = document.createElement("span");
    frets.className = "diagram-note";
    frets.textContent = `Frets: ${shape.frets.join(" ")}`;
    popover.appendChild(frets);

    if (shape.note) {
      const note = document.createElement("span");
      note.className = "diagram-note";
      note.textContent = shape.note;
      popover.appendChild(note);
    }

    if (shape.name !== chordName) {
      const voicing = document.createElement("span");
      voicing.className = "diagram-note";
      voicing.textContent = `Voicing shown: ${shape.name}`;
      popover.appendChild(voicing);
    }

    return popover;
  }

  function appendSongToken(lineElement, chord, lyric) {
    const token = document.createElement("span");
    token.className = "song-token";

    const chordElement = document.createElement("span");
    chordElement.className = "song-chord";
    chordElement.textContent = chord || "";
    if (chord) {
      chordElement.tabIndex = 0;
      chordElement.setAttribute("aria-label", `${chord} guitar hand placement`);
      chordElement.appendChild(createChordDiagram(chord));
    }

    const lyricElement = document.createElement("span");
    lyricElement.className = "song-lyric";
    lyricElement.textContent = lyric || " ";

    token.append(chordElement, lyricElement);
    lineElement.appendChild(token);
  }

  function renderInlinePerformanceLine(line, container) {
    const lineElement = document.createElement("div");
    lineElement.className = "performance-line";
    const chordPattern = /\[([^\]\r\n]+)\]/g;
    let cursor = 0;
    let pendingChord = "";
    let match;

    while ((match = chordPattern.exec(line)) !== null) {
      const lyricBefore = line.slice(cursor, match.index);
      if (lyricBefore || pendingChord) appendSongToken(lineElement, pendingChord, lyricBefore);
      pendingChord = match[1].trim();
      cursor = match.index + match[0].length;
    }

    appendSongToken(lineElement, pendingChord, line.slice(cursor));
    container.appendChild(lineElement);
  }

  function renderPerformanceSheet(text, container) {
    clearChildren(container);

    if (!text.trim()) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Your guitar-friendly chord sheet will appear here.";
      container.appendChild(empty);
      return;
    }

    text.split(/\r?\n/).forEach((line) => {
      if (!line.trim()) {
        const blank = document.createElement("div");
        blank.className = "performance-line blank-line";
        container.appendChild(blank);
        return;
      }

      if (/^\[[^\]]+\]$/.test(line.trim()) && !hasInlineChords(line)) {
        const section = document.createElement("div");
        section.className = "performance-line section-line";
        section.textContent = line.trim();
        container.appendChild(section);
        return;
      }

      if (/^[A-Za-z0-9 .:'"()-]+:$/.test(line.trim()) && !hasInlineChords(line)) {
        const section = document.createElement("div");
        section.className = "performance-line section-line";
        section.textContent = line.trim();
        container.appendChild(section);
        return;
      }

      if (hasInlineChords(line)) {
        renderInlinePerformanceLine(line, container);
        return;
      }

      if (isChordLine(line)) {
        const chordRow = document.createElement("div");
        chordRow.className = "performance-line chord-line";
        tokenizeLine(line).forEach((token) => {
          if (parseChord(token.value)) {
            appendSongToken(chordRow, token.value, " ");
            return;
          }

          const separator = document.createElement("span");
          separator.className = "chord-row-only";
          separator.textContent = token.value;
          chordRow.appendChild(separator);
        });
        container.appendChild(chordRow);
        return;
      }

      const lyricLine = document.createElement("div");
      lyricLine.className = "performance-line";
      appendSongToken(lyricLine, "", line);
      container.appendChild(lyricLine);
    });
  }

  function renderSummary(result) {
    const summaryTitle = document.getElementById("summary-title");
    const changeList = document.getElementById("changeList");
    summaryTitle.textContent = `Detected ${result.detectedKey} · ${result.moodLabel} mood`;

    const visibleChanges = result.changes.slice(0, 10);
    if (!visibleChanges.length) {
      changeList.innerHTML = "<li>No chord substitutions were needed. Try a different mood or the richer setting for more color.</li>";
      return;
    }

    changeList.innerHTML = "";
    visibleChanges.forEach((change) => {
      const item = document.createElement("li");
      item.textContent = change;
      changeList.appendChild(item);
    });

    if (result.changes.length > visibleChanges.length) {
      const item = document.createElement("li");
      item.textContent = `${result.changes.length - visibleChanges.length} more changes in the output.`;
      changeList.appendChild(item);
    }
  }

  function initApp() {
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const performanceSheet = document.getElementById("performanceSheet");
    const inputCounter = document.getElementById("inputCounter");
    const inputMessage = document.getElementById("inputMessage");
    const copyMessage = document.getElementById("copyMessage");
    const enhanceButton = document.getElementById("enhanceButton");
    const loadSampleButton = document.getElementById("loadSampleButton");
    const copyButton = document.getElementById("copyButton");
    const keySelect = document.getElementById("keySelect");
    const intensitySelect = document.getElementById("intensitySelect");
    const moodSelect = document.getElementById("moodSelect");

    function updateCounter() {
      const count = lineCount(inputText.value);
      inputCounter.textContent = `${count} ${count === 1 ? "line" : "lines"}`;
    }

    function runEnhancement() {
      const value = inputText.value.trimEnd();
      inputMessage.textContent = "";
      inputMessage.classList.remove("error");
      copyMessage.textContent = "";

      if (!value.trim()) {
        inputMessage.textContent = "Paste a chord-over-lyrics sheet or load the sample first.";
        inputMessage.classList.add("error");
        inputText.focus();
        return;
      }

      const result = improveSong(value, {
        key: keySelect.value,
        intensity: intensitySelect.value,
        mood: moodSelect.value,
      });

      outputText.value = result.outputText;
      renderPerformanceSheet(result.outputText, performanceSheet);
      renderSummary(result);
      inputMessage.textContent = `Processed ${lineCount(value)} lines.`;
    }

    inputText.addEventListener("input", updateCounter);
    enhanceButton.addEventListener("click", runEnhancement);
    loadSampleButton.addEventListener("click", () => {
      inputText.value = SAMPLE_INPUT;
      updateCounter();
      runEnhancement();
    });

    copyButton.addEventListener("click", async () => {
      copyMessage.textContent = "";
      if (!outputText.value.trim()) {
        copyMessage.textContent = "Nothing to copy yet.";
        return;
      }

      try {
        await navigator.clipboard.writeText(outputText.value);
        copyMessage.textContent = "Improved sheet copied.";
      } catch (error) {
        outputText.select();
        document.execCommand("copy");
        copyMessage.textContent = "Improved sheet selected and copied.";
      }
    });

    inputText.value = SAMPLE_INPUT;
    updateCounter();
    runEnhancement();
  }

  if (typeof window !== "undefined") {
    window.improveSong = improveSong;
    window.addEventListener("DOMContentLoaded", initApp);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      improveSong,
      detectKey,
      detectMood,
      hasInlineChords,
      isChordLine,
      parseChord,
    };
  }
})();
