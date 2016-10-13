var rules = {
    abilities: ['str', 'dex', 'con', 'wis', 'int', 'car'],
    saves: [
        {id: 'fort', name: 'Fortitude', ability: 'con'},
        {id: 'ref', name: 'Reflex', ability: 'dex'},
        {id: 'will', name: 'Will', ability: 'wis'}
    ],
    sizes: [
        {id: 'fine', name: 'Fine', modifier: 8},
        {id: 'diminutive', name: 'Diminutive', modifier: 4},
        {id: 'tiny', name: 'Tiny', modifier: 2},
        {id: 'small', name: 'Small', modifier: 1},
        {id: 'medium', name: 'Medium', modifier: 0},
        {id: 'large', name: 'Large', modifier: -1},
        {id: 'huge', name: 'Huge', modifier: -2},
        {id: 'gargantuan', name: 'Gargantuan', modifier: -4},
        {id: 'colossal', name: 'Colossal', modifier: -8}
    ],
    types: [
        {id: 'aberration', name: 'Aberration', dice: 8, attack: 0.75, goodSaves: ['will']},
        {id: 'animal', name: 'Animal', dice: 8, attack: 0.75, goodSaves: ['fort', 'ref']},
        {id: 'construct', name: 'Construct' , dice: 10, attack: 0.75, goodSaves: []},
        {id: 'dragon', name: 'Dragon' , dice: 12, attack: 1, goodSaves: ['fort', 'ref', 'will']},
        {id: 'elemental', name: 'Elemental', dice: 8, attack: 0.75, goodSaves: ['ref']},
        {id: 'fey', name: 'Fey', dice: 6, attack: 0.5, goodSaves: ['ref', 'will']},
        {id: 'giant', name: 'Giant', dice: 8, attack: 0.75, goodSaves: ['fort']},
        {id: 'humanoid', name: 'Humanoid', dice: 8, attack: 0.75, goodSaves: []},
        {id: 'magical-beast', name: 'Magical Beast', dice: 10, attack: 1, goodSaves: ['fort', 'ref']},
        {id: 'monstrous-humanoid', name: 'Monstrous Humanoid', dice: 8, attack: 1, goodSaves: ['ref', 'will']},
        {id: 'ooze', name: 'Ooze' , dice: 10, attack: 0.75, goodSaves: []},
        {id: 'outsider', name: 'Outsider', dice: 8, attack: 1, goodSaves: ['fort', 'ref', 'will']},
        {id: 'plant', name: 'Plant', dice: 8, attack: 0.75, goodSaves: ['fort']},
        {id: 'undead', name: 'Undead' , dice: 12, attack: 0.5, goodSaves: ['will']},
        {id: 'vermin', name: 'Vermin', dice: 8, attack: 0.75, goodSaves: ['fort']}
    ],
    classes: [
        {id: 'barbarian', name: 'Barbarian', dice: 12, attack: 1, goodSaves: ['fort']},
        {id: 'bard', name: 'Bard', dice: 6, attack: 0.75, goodSaves: ['ref', 'will']},
        {id: 'cleric', name: 'Cleric', dice: 8, attack: 0.75, goodSaves: ['fort', 'will']},
        {id: 'druid', name: 'Druid', dice: 8, attack: 0.75, goodSaves: ['fort', 'will']},
        {id: 'fighter', name: 'Fighter', dice: 10, attack: 1, goodSaves: ['fort']},
        {id: 'monk', name: 'Monk', dice: 8, attack: 0.75, goodSaves: ['fort', 'ref', 'will']},
        {id: 'paladin', name: 'Paladin', dice: 10, attack: 1, goodSaves: ['fort']},
        {id: 'ranger', name: 'Ranger', dice: 8, attack: 1, goodSaves: ['fort', 'ref']},
        {id: 'rogue', name: 'Rogue', dice: 6, attack: 0.75, goodSaves: ['ref']},
        {id: 'sorcerer', name: 'Sorcerer', dice: 4, attack: 0.5, goodSaves: ['will']},
        {id: 'wizard', name: 'Wizard', dice: 4, attack: 0.5, goodSaves: ['will']}
    ],
    weapons: [
        {id: 'shortsword', name: 'Shortsword', dice: '1d6', type: 'melee', twoHands: false},
        {id: 'longsword', name: 'Longsword', dice: '1d8', type: 'melee', twoHands: true},
        {id: 'greatsword', name: 'Greatsword', dice: '2d6', type: 'melee', twoHands: true},
        {id: 'shortbow', name: 'Shortbow', dice: '1d6', type: 'ranged'},
        {id: 'longbow', name: 'Longbow', dice: '1d8', type: 'ranged'},
        {id: 'hand-crossbow', name: 'Hand crossbow', dice: '1d4', type: 'ranged'},
        {id: 'light-crossbow', name: 'Light crossbow', dice: '1d8', type: 'ranged'},
        {id: 'heavy-crossbow', name: 'Heavy crossbow', dice: '1d10', type: 'ranged'},
        {id: 'repeating-heavy-crossbow', name: 'Repeating heavy crossbow', dice: '1d10', type: 'ranged'},
        {id: 'repeating-light-crossbow', name: 'Repeating light crossbow', dice: '1d8', type: 'ranged'},
        {id: 'javelin', name: 'Javelin', dice: '1d6', type: 'ranged'},
        {id: 'dart', name: 'Dart', dice: '1d4', type: 'ranged'},
        {id: 'sling', name: 'Sling', dice: '1d4', type: 'ranged'}
    ],
    damageIncrement: [
        '1', '1d2', '1d3', '1d4', '1d6', '1d8', '1d10', '2d6', '3d6', '4d6', '6d6', '8d6'
    ],
    weaponEnhancement: [
        0, 1, 2, 3, 4, 5
    ],
    armorEnhancement: [
        0, 1, 2, 3, 4, 5
    ],
    weaponElemental: [
        'fire', 'acid', 'cold', 'electric'
    ],
    weaponAlignment: [
        'evil', 'chaos', 'law', 'good'
    ],
    vulnerabilities: [
        {id: '-'},
        {id: '+1'},
        {id: '+2'},
        {id: '+3'},
        {id: '+4'},
        {id: '+5'},
        {id: 'good'},
        {id: 'evil'},
        {id: 'chaos'},
        {id: 'law'}
    ],
    armors: [
        {id: 'padded', name: 'Padded', bonus: 1, maxDex: 8, penalty: 0, arcaneFailure:  5, weight: 10},
        {id: 'leather', name: 'Leather', bonus: 2, maxDex: 6, penalty: 0, arcaneFailure: 10, weight: 15},
        {id: 'studded-leather', name: 'Studded leather', bonus: 3, maxDex: 5, penalty: -1, arcaneFailure: 15, weight: 20},
        {id: 'chain-shirt', name: 'Chain shirt', bonus: 4, maxDex: 4, penalty: -2, arcaneFailure: 20, weight: 25},
        {id: 'hide', name: 'Hide', bonus: 3, maxDex: 4, penalty: -3, arcaneFailure: 20, weight: 25},
        {id: 'scale-mail', name: 'Scale mail', bonus: 4, maxDex: 3, penalty: -4, arcaneFailure: 25, weight: 30},
        {id: 'chainmail', name: 'Chainmail', bonus: 5, maxDex: 2, penalty: -5, arcaneFailure: 30, weight: 40},
        {id: 'breastplate', name: 'Breastplate', bonus: 5, maxDex: 3, penalty: -4, arcaneFailure: 25, weight: 30},
        {id: 'splint-mail', name: 'Splint mail', bonus: 6, maxDex: 0, penalty: -7, arcaneFailure: 40, weight: 45},
        {id: 'banded-mail', name: 'Banded mail', bonus: 6, maxDex: 1, penalty: -6, arcaneFailure: 35, weight: 35},
        {id: 'half-plate', name: 'Half-plate', bonus: 7, maxDex: 0, penalty: -7, arcaneFailure: 40, weight: 50},
        {id: 'full-plate', name: 'Full plate', bonus: 8, maxDex: 1, penalty: -6, arcaneFailure: 35, weight: 50}
    ],
    shields: [
        {id: 'buckler', name: 'Buckler', bonus: 1, penalty: -1, arcaneFailure: 5, weight: 5},
        {id: 'light-wooden', name: 'Light wooden', bonus: 1, penalty: -1, arcaneFailure: 5, weight: 5},
        {id: 'light-steel', name: 'Light steel', bonus: 1, penalty: -1, arcaneFailure: 5, weight: 6},
        {id: 'heavy-wooden', name: 'Heavy wooden', bonus: 2, penalty: -2, arcaneFailure: 15, weight: 10},
        {id: 'heavy-steel', name: 'Heavy steel', bonus: 2, penalty: -2, arcaneFailure: 15, weight: 15},
        {id: 'tower', name: 'Tower', bonus: 4, penalty: -10, arcaneFailure: 50, weight: 45}
    ],
    acFactors: [
        {type: 'armor', flatFooted: true, touch: false, scorePath: 'armor.total'},
        {type: 'shield', flatFooted: true, touch: false, scorePath: 'shield.total'},
        {type: 'natural', flatFooted: true, touch: false, scorePath: 'pc.naturalArmor'},
        {type: 'deflection', flatFooted: true, touch: true, scorePath: 'deflection'},
        {type: 'size', flatFooted: true, touch: true, scorePath: 'size.modifier'},
        {type: 'dexterity', flatFooted: false, touch: true, scorePath: 'effectiveDex'}
    ],
    enhancers: {
        categories: [
            {id: 'object', name: 'Object'},
            {id: 'potion', name: 'Potion'},
            {id: 'spell', name: 'Spell'}
        ],
        types: [
            '-', 'str', 'dex', 'con', 'wis', 'int', 'car', 'saves', 'deflection', 'armor', 'shield', 'skills'
        ]
    }
}