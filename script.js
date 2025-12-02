// DANE
const NUTY = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const SKALE = {
    major:        [2, 2, 1, 2, 2, 2, 1],
    minor:        [2, 1, 2, 2, 1, 2, 2],
    dorian:       [2, 1, 2, 2, 2, 1, 2],
    mixolydian:   [2, 2, 1, 2, 2, 1, 2],
    pentatonic:   [2, 2, 3, 2, 3]
};

const AKORDY = { 
    major:     { name: "maj",  intervals: [0, 4, 7] },
    minor:     { name: "min",  intervals: [0, 3, 7] },
    dom7:      { name: "7",    intervals: [0, 4, 7, 10] },
    sus2:      { name: "sus2", intervals: [0, 2, 7] },
    sus4:      { name: "sus4", intervals: [0, 5, 7] }
};




function noteIndeks(note) {
    return NUTY.indexOf(note);
}

function transpose(note, semitones) {
    return NUTY[(noteIndeks(note) + semitones) % NUTY.length];
}


// gen skali

function generujSkale(root, scaleName) {
    const pattern = SKALE[scaleName];
    if (!pattern) { //failsafe
        alert("n ma takiej skali");
        return null;
    }

    const scale = [root];
    let current = root;

    pattern.forEach(step => { //transpozycja czy inny przymiotnik polski
        current = transpose(current, step);
        scale.push(current);
    });

    return scale;
}


// gen akordu do nuty

function generujAkord(root, type) {
    const info = AKORDY[type];
    if (!info) {
        alert("nie ma takiego typu");
        
        return null;
    }

    const nutyAkordu = info.intervals.map(i => transpose(root, i));

    return {
        name: `${root}${info.name}`,
        NUTY: nutyAkordu,
        intervals: info.intervals
    };
}



function generujAkordZeSkali(scale, degree, type) {
    const index = degree - 1;
    if (index < 0 || index >= scale.length) {
        alert("taki stopien n istnieje");
        return null;
    }

    const rootNote = scale[index];  
    return generujAkord(rootNote, type);
}


// pseudo interface

function runInteractive() {

    // tonika
    const root = prompt("podaj tonike (np C D# A):");
    if (!NUTY.includes(root)) {
        return alert("niepoprawna!");
    }

    // skala
    const scaleName = prompt("podaj skale (major, minor, dorian, mixolydian, pentatonic):");
    const scale = generujSkale(root, scaleName);
    if (!scale) return;

    console.log("skala:", scaleName, root);
    console.log(scale.join(" - "));

    // lista do prompta
    let scaleText = "wybierz stopien skali:\n\n";
    scale.forEach((note, i) => {
        scaleText += `${i + 1}: ${note}\n`;
    });
    scaleText += `\n(1 - ${scale.length})`;

    // pokazywaie tych smiesznych skali
    const degree = Number(prompt(scaleText));

    // generowanie każdego typu akordu
    console.log(`\nakordy od stopnia ${degree}:`);

    Object.keys(AKORDY).forEach(type => {
        const chord = generujAkordZeSkali(scale, degree, type);
        if (chord) {
            console.log(` ${chord.name}`);
            console.log("   dzwieki:", chord.NUTY.join(" - "));
            console.log("   interwaly:", chord.intervals.join(", "));
        }
    });
}
runInteractive();
