
var vm = new Vue({
    el: '#app',
    template: '#template',
    data: {
        showInfo: true,
        editMode: false,
        antimagic: false,
        pc: window.character,
        rules: window.rules
    },
    created: function () {
        document.title = this.pc.name;
    },
    computed: {
        availableClasses: function () {
            var vm = this;
            if (vm.pc.npc) {
                vm.rules.classes.push(_.find(vm.rules.types, _.matchesProperty('id', vm.pc.type)));
            }
            return vm.rules.classes;
        },
        abilities: function () {
            var vm = this,
                sizeScoreModifiers = _.clone(vm.sizeScoreModifiers);

            console.info(sizeScoreModifiers);

            // Return abilities
            return _.mapValues(vm.pc.abilities, function (value, key) {
                var ability = {name: key, score: value};
                ability.enhancer = _.chain(vm.pc.enhancers).filter({type: key}).maxBy('bonus').value();
                ability.sizeScoreModifier = _.isUndefined(sizeScoreModifiers[key])? 0 : sizeScoreModifiers[key];
                ability.modifier = Math.floor((ability.score + (ability.enhancer? ability.enhancer.bonus : 0) + ability.sizeScoreModifier - 10) / 2);
                return ability;
            });
        },
        sizeScoreModifiers: function () {
            var vm = this,
                sizeScoreModifiers = {str: 0, dex: 0, con: 0};

            // Manage enlarge and reduce spells
            if (vm.pc.magicSize !== 'normal') {
                if (vm.pc.magicSize === 'enlarged') {
                    sizeScoreModifiers.str += 2;
                    sizeScoreModifiers.dex -= 2;
                }
                if (vm.pc.magicSize === 'reduced') {
                    sizeScoreModifiers.str -= 2;
                    sizeScoreModifiers.dex += 2;
                }
                return sizeScoreModifiers;
            }

            // If the creature has increased or decreased the default size
            sizeIndex = _.findIndex(vm.rules.sizes, {id: vm.pc.size});
            currentSizeIndex = _.findIndex(vm.rules.sizes, {id: vm.pc.currentSize});

            // Manage real enlargement
            if (sizeIndex < currentSizeIndex) {
                while (sizeIndex < currentSizeIndex) {
                    sizeIndex++;
                    sizeScoreModifiers.str += vm.rules.sizes[sizeIndex].abilities.str;
                    sizeScoreModifiers.dex -= vm.rules.sizes[sizeIndex].abilities.dex;
                    sizeScoreModifiers.con += vm.rules.sizes[sizeIndex].abilities.con;
                }
            }

            // Manage real reduction
            if (sizeIndex > currentSizeIndex) {
                while (sizeIndex > currentSizeIndex) {
                    sizeIndex--;
                    sizeScoreModifiers.str -= vm.rules.sizes[sizeIndex].abilities.str;
                    sizeScoreModifiers.dex += vm.rules.sizes[sizeIndex].abilities.dex;
                    sizeScoreModifiers.con -= vm.rules.sizes[sizeIndex].abilities.con;
                }
            }

            console.log(sizeScoreModifiers);

            // Return final values
            return sizeScoreModifiers;
        },
        abilitiesString: function () {
            var vm = this;
            return _.map(this.abilities, function (value) {
                var string = value.name.toUpperCase() + ' ' + (value.modifier > -1 ? '+' : '') + value.modifier;
                string += '<span class="text-muted"> (' + value.score;
                if (value.enhancer) {
                    string += ' ' + vm.modifier(value.enhancer.bonus) + ' ' + value.enhancer.name;
                }
                if (!_.isUndefined(value.sizeScoreModifier) && value.sizeScoreModifier !== 0) {
                    string += ' ' + vm.modifier(value.sizeScoreModifier) + ' size';
                }
                string += ')</span>';
                return string;
            }).join(', ');
        },
        armor: function () {
            var vm = this,
                armor;
            if (!vm.pc.armor.id) {
                return {};
            }
            armor = _.find(vm.rules.armors, _.matchesProperty('id', vm.pc.armor.id));
            armor.total = armor.bonus + vm.pc.armor.enhancement;
            armor.magic = _.chain(vm.pc.enhancers).filter({type: 'armor'}).maxBy('bonus').value();
            if (armor.magic && armor.magic.bonus > armor.total) {
                armor.total = armor.magic.bonus;
            }
            return armor;
        },
        shield: function () {
            var vm = this,
                shield;
            if (!vm.pc.shield.id) {
                return {};
            }
            shield = _.find(vm.rules.shields, _.matchesProperty('id', vm.pc.shield.id));
            shield.total = shield.bonus + vm.pc.shield.enhancement;
            shield.magic = _.chain(vm.pc.enhancers).filter({type: 'shield'}).maxBy('bonus').value();
            if (shield.magic && shield.magic.bonus > shield.total) {
                shield.total = shield.magic.bonus;
            }
            return shield;
        },
        size: function () {
            var vm = this,
                pcSize = {},
                sizeIndex = _.findIndex(vm.rules.sizes, {id: vm.pc.size});
            if (!vm.pc.titanPower && !vm.pc.npc) {
                switch (vm.pc.magicSize) {
                    case 'enlarged':
                        vm.pc.currentSize = vm.rules.sizes[sizeIndex + 1].id;
                        break;
                    case 'normal':
                        vm.pc.currentSize = vm.pc.size;
                        break;
                    case 'reduced':
                        vm.pc.currentSize = vm.rules.sizes[sizeIndex - 1].id;
                        break;
                }
            }
            _.forEach(rules.sizes, function (size, index) {
                if (vm.pc.currentSize === size.id) {
                    size.scale = index;
                    size.hasPenalty = (size.modifier < 0)? true : false;
                    pcSize = size;
                }
            });
            return pcSize;
        },
        type: function () {
            var vm = this;
            return _.find(vm.rules.types, _.matchesProperty('id', vm.pc.type));
        },
        naturalArmor: function () {
            var vm = this,
                naturalArmor = 0;
            _.forEach(vm.pc.enhancers, function (enhancer) {
                if (enhancer.type === 'naturalArmor' && naturalArmor < enhancer.bonus) {
                    naturalArmor = enhancer.bonus;
                }
            });
            naturalArmor = naturalArmor + vm.pc.naturalArmor;
            return naturalArmor;
        },
        deflection: function () {
            var vm = this,
                deflection = 0;
            _.forEach(vm.pc.enhancers, function (enhancer) {
                if (enhancer.type === 'deflection' && deflection < enhancer.bonus) {
                    deflection = enhancer.bonus;
                }
            });
            return deflection;
        },
        dodge: function () {
            var vm = this;
            if (vm.pc.haste) {
                return 1;
            }
            if (vm.pc.majorHaste) {
                return 4;
            }
            return 0;
        },
        effectiveDex: function () {
            var vm = this;
            if (vm.pc.armor.id) {
                if (vm.pc.armor.mithral && (vm.abilities.dex.modifier >= (vm.armor.maxDex + 2))) {
                    return vm.armor.maxDex + 2;
                }
                if (vm.abilities.dex.modifier > vm.armor.maxDex) {
                    return vm.armor.maxDex;
                }
            }
            return vm.abilities.dex.modifier;
        },
        acItems: function () {
            var vm = this;
            return _.map(vm.rules.acFactors, function (value) {
                value.score = _.get(vm, value.scorePath, 0);
                return value;
            });
        },
        ac: function () {
            var vm = this;
            return {
                flatFooted: _.sumBy(_.filter(vm.acItems, {flatFooted: true}), 'score') + 10,
                touch: _.sumBy(_.filter(vm.acItems, {touch: true}), 'score') + 10,
                total: _.sumBy(vm.acItems, 'score') + 10
            }
        },
        acString: function () {
            return '10 ' + _.map(this.acItems, function (value) {
                var sign = (value.score > -1)? '+' : '-';
                return [sign, Math.abs(value.score), value.type].join(' ');
            }).join(' ');
        },
        classes: function () {
            var vm = this;
            return _.map(vm.pc.classes, function (cl) {
                return _.merge(_.clone(cl), _.find(vm.availableClasses, _.matchesProperty('id', cl.id)));
            });
        },
        hp: function () {
            var vm = this;
            return _.sumBy(vm.classes, function (cl) {
                var dice = vm.pc.type === 'undead'? 12 : cl.dice;
                return cl.levels * (dice + vm.abilities.con.modifier);
            });
        },
        saves: function () {
            var vm = this;
            return _.map(vm.rules.saves, function (save, index) {

                // Calculate base
                save.base = _.sumBy(vm.classes, function (cl) {
                    return _.includes(save.id, cl.goodSaves)? Math.floor(cl.levels / 2) + 2 : Math.floor(cl.levels / 3);
                });

                // Get enhancers
                save.enhancers = _.filter(vm.pc.enhancers, function (enhancer) {
                    return (enhancer.type === save.id || enhancer.type === 'saves');
                });

                // Get the active enhancer by max bonus
                save.magicBonus = (save.enhancers.length)? _.maxBy(save.enhancers, 'bonus').bonus : 0;
                save.activeEnhancer = _.findLast(save.enhancers, {bonus: save.magicBonus});

                // Calculate total
                save.modifier = save.base + vm.abilities[save.ability].modifier + save.magicBonus;

                // Return the result
                return save;
            });
        },
        savesString: function () {
            var vm = this;
            return _.map(vm.saves, function (value) {
                var string = value.id.toUpperCase() + ' ' + (value.modifier > -1 ? '+' : '') + value.modifier;
                if (value.magicBonus) {
                    string += ' (' + value.activeEnhancer.name + ' +' + value.activeEnhancer.bonus + ')';
                }
                return string;
            }).join(', ');
        },
        baseAttack: function () {
            var vm = this;
            if (!_.isUndefined(vm.pc.transformation) && vm.pc.transformation) {
                return _.sum(_.map(vm.classes, 'levels'));
            }
            return _.sum(_.map(vm.classes, function (cl) {
                return Math.floor(cl.attack * cl.levels);
            }));
        },
        attackCount: function () {
            var vm = this;
            if (vm.baseAttack >= 16) {
                return 4;
            }
            if (vm.baseAttack >= 11) {
                return 3;
            }
            if (vm.baseAttack >= 6) {
                return 2;
            }
            return 1;
        },
        attacks: function () {
            var vm = this,
                attack = {};
            return _.mapValues(vm.pc.weapons, function (weapons, weaponsType) {
                return _.map(weapons, function (weapon) {
                    var factors = [],
                        str = 0,
                        powerAttack = 0,
                        weaponSize,
                        attackCount = vm.attackCount;

                    // Set weapon
                    weapon = _.merge(_.clone(weapon), _.find(vm.rules.weapons[weaponsType], _.matchesProperty('id', weapon.id)));
                    weaponSize = _.indexOf(vm.rules.damageIncrement, weapon.dice) + (vm.size.scale - 4);
                    if (vm.pc.titanPower) {
                        weaponSize++;
                    }
                    weapon.dice = vm.rules.damageIncrement[weaponSize];

                    // Set attack ability
                    if (weapon.type === 'melee') {
                        weapon.attackAbility = (!_.isUndefined(weapon.finesse) && weapon.finesse)? 'dex' : 'str';
                    } else {
                        weapon.attackAbility = (!_.isUndefined(weapon.zen) && weapon.zen)? 'wis' : 'dex';
                    }

                    // Set max attack bonus
                    weapon.attackFactors = {
                        baseAttack: vm.baseAttack,
                        ability: vm.abilities[weapon.attackAbility].modifier,
                        size: vm.size.modifier,
                        enhancement: weapon.enhancement,
                        haste: vm.pc.haste? 1 : 0,
                        flanking: (vm.pc.flanking && weapon.type === 'melee')? 2 : 0,
                        powerAttack: _.isUndefined(weapon.powerAttack)? 0 : 0 - weapon.powerAttack,
                        focus: weapon.focus,
                        pointBlankShot: (!_.isUndefined(weapon.pointBlankShot) && weapon.pointBlankShot)? 1 : 0,
                        rapidShot: (!_.isUndefined(weapon.rapidShot) && weapon.rapidShot)? -2 : 0,
                        twoWeaponFighting: (!_.isUndefined(weapon.twoWeaponFighting) && weapon.twoWeaponFighting && weapon.doubleWeapon)? -2 : 0
                    };
                    if (!weapon.enhancement && weapon.masterwork) {
                        weapon.attackFactors.masterwork = 1;
                    }
                    weapon.max = _.sum(_.values(weapon.attackFactors));

                    // Set full attack array
                    weapon.fullAttack = [];
                    for (i = 0; i < attackCount; i++) {
                        weapon.fullAttack.push('+' + (weapon.max - (5 * i)));
                    }

                    // Add extra attack for double weapons or rapid shot
                    if ((weapon.attackFactors.twoWeaponFighting < 0) || (weapon.attackFactors.rapidShot < 0)) {
                        weapon.fullAttack.unshift(weapon.fullAttack[0]);
                    }

                    // Calculate strength
                    if (weapon.type === 'melee') {
                        str = vm.abilities.str.modifier;
                    } else if (weapon.composite !== undefined && weapon.composite) {
                        str = _.min([vm.abilities.str.modifier, weapon.composite]);
                    }

                    // Set damage
                    weapon.damage = {
                        str: str,
                        powerAttackBonus: (weapon.powerAttack !== undefined)? weapon.powerAttack : 0,
                        dice: weapon.dice,
                        enhancement: weapon.enhancement,
                        specialization: weapon.specialization,
                        pointBlankShot: (!_.isUndefined(weapon.pointBlankShot) && weapon.pointBlankShot)? 1 : 0
                    };

                    // Calculate extra strength for melee attacks
                    if (weapon.type === 'melee') {
                        weapon.damage.str = (weapon.twoHands)? Math.floor(str * 1.5) : str;
                        weapon.damage.powerAttackBonus = (weapon.twoHands && weapon.powerAttack)? weapon.powerAttack * 2 : weapon.powerAttack;
                    }

                    // Get minimum fixed damage
                    weapon.damage.fixed = weapon.damage.str + weapon.enhancement + (weapon.damage.powerAttackBonus? weapon.damage.powerAttackBonus : 0) + weapon.specialization;

                    // Get attack strings
                    factors = [];
                    _.each(weapon.attackFactors, function (factor, key) {
                        if (factor === 0) return;
                        if (key === 'powerAttack' && weaponsType === 'ranged') return;
                        if (key === 'ability') {
                            key = weapon.attackAbility;
                        }
                        if (!_.isUndefined(factor)) {
                            factors.push(vm.modifier(factor) + ' ' + vm.translate(key));
                        }
                    });
                    weapon.attackFactorsString = factors.join(' ');

                    // Get damage string
                    factors = [];
                    _.each(weapon.damage, function (factor, key) {
                        if (factor === 0) return;
                        if (key === 'powerAttackBonus' && weaponsType === 'ranged') return;
                        if (key === 'fixed' || key === 'dice') return;
                        if (!_.isUndefined(factor)) {
                            factors.push(vm.modifier(factor) + ' ' + vm.translate(key));
                        }
                    });
                    weapon.damageFactorsString = factors.join(' ');

                    // Return computed weapon stats
                    return weapon;
                });
            });
        }
    },
    watch: {
        'pc.armor.id': function (armor) {
            if (!armor) {
                this.pc.armor.id = false;
                this.pc.armor.enhancement = 0;
            }
        },
        'pc.shield.id': function (shield) {
            if (!shield) {
                this.pc.shield.id = false;
                this.pc.shield.enhancement = 0;
            }
        },
        'pc.name': function (name) {
            document.title = name;
        }
    },
    methods: {
        addLevels: function (index) {
            var vm = this;
            vm.pc.classes.push({id: 'fighter', levels: 1});
        },
        removeLevels: function (index) {
            var vm = this;
            vm.pc.classes.splice(index, 1);
        },
        addMeleeWeapon: function (index) {
            var vm = this;
            vm.pc.weapons.melee.push(vm.rules.baseMeleeWeapon);
        },
        removeMeleeWeapon: function (index) {
            var vm = this;
            vm.pc.weapons.melee.splice(index, 1);
        },
        addRangedWeapon: function (index) {
            var vm = this;
            vm.pc.weapons.ranged.push(vm.rules.baseMeleeWeapon);
        },
        removeRangedWeapon: function (index) {
            var vm = this;
            vm.pc.weapons.ranged.splice(index, 1);
        },
        addEnhancer: function (index) {
            var vm = this;
            vm.pc.enhancers.push({category: 'object', name: '', type: '-', bonus: 0});
        },
        removeEnhancer: function (index) {
            var vm = this;
            vm.pc.enhancers.splice(index, 1);
        },
        addQuality: function () {
            var vm = this;
            vm.pc.specialQualities.push({text: ''});
        },
        removeQuality: function (index) {
            var vm = this;
            vm.pc.specialQualities.splice(index, 1);
        },
        startAntimagic: function () {
            var vm = this;
            vm.antimagic = true;
            vm.backup = JSON.stringify(vm.pc);
            vm.pc.titanPower = false;
            vm.pc.currentSize = vm.pc.size;
            vm.pc.enhancers = [];
            vm.pc.armor.enhancement = 0;
            vm.pc.shield.enhancement = 0;
            vm.pc.haste = false;
            vm.pc.majorHaste = false;
            vm.pc.weapons = _.mapValues(vm.pc.weapons, function (weapons, weaponsType) {
                return _.map(weapons, function (weapon) {
                    weapon.enhancement = 0;
                    weapon.elemental = [];
                    weapon.alignment = [];
                    return weapon;
                });
            });
        },
        stopAntimagic: function () {
            var vm = this;
            vm.antimagic = false;
            vm.pc = JSON.parse(vm.backup);
        },
        toggleTitanPower: function () {
            var vm = this;
            vm.pc.titanPower = !vm.pc.titanPower;
            if (vm.pc.titanPower) {
                vm.pc.previousMagicSize = vm.pc.magicSize;
                vm.pc.previousSize = vm.pc.size;
                vm.pc.previousCurrentSize = vm.pc.currentSize;
                vm.pc.magicSize = 'normal';
                vm.pc.currentSize = 'huge';
            } else {
                vm.pc.magicSize = vm.pc.previousMagicSize;
                vm.pc.size = vm.pc.previousSize;
                vm.pc.currentSize = vm.pc.previousCurrentSize;
            }
        },
        modifier: function (value) {
            var string = '',
                sign = '+';
            if (_.isUndefined(value)) {
                return string;
            }
            value = parseInt(value, 10);
            if (value === 0) {
                return '+ 0 ';
            }
            if (value < 0) {
                sign = '-';
            }
            string = sign + ' ' + Math.abs(value);
            return string;
        },
        translate: function (string) {
            return window.lang[string];
        },
        save: function () {
            this.editMode = false;
            this.$http.post('save.php', this.pc).then(function (response) {
                console.log(response);
            });
        }
    }
});
