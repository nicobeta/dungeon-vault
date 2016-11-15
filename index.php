<?php

if (!isset($_GET['name'])) {
    exit;
}
$id = $_GET['name'];
$folder = in_array($id, ['juan', 'grageon', 'bistolfi', 'angor'])? 'pc' : 'npc';
$file = file_get_contents('characters/' . $folder . '/' . $id . '.json');

?>
<!DOCTYPE HTML>
<html lang='en-US'>
<head>
<meta charset='utf-8'>
<title>Dungeon Vault</title>

<!-- Mobile Meta -->
<meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no'>
<meta name='mobile-web-app-capable' content='yes'>
<meta name='apple-mobile-web-app-capable' content='yes'>
<meta name='apple-mobile-web-app-status-bar-style' content='black'>

<!-- Icons -->
<link rel="shortcut icon" href="unnamed.png">

<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.4/css/bootstrap.min.css">
<link href='//fonts.googleapis.com/css?family=Roboto:400,700,300' rel='stylesheet' type='text/css'>
<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel='stylesheet'>
<link href="site.css" rel='stylesheet'>
</head>
<body>

<div id="app"></div>

<template id="template">
<div>

    <nav class="navbar navbar-dark navbar-fixed-top bg-primary">
        <div class="container">
            <span class="navbar-brand">
                {{pc.name}}
            </span>
            <ul class="nav navbar-nav pull-right">
                <li class="nav-item active">
                    <a v-if="editMode" class="nav-link" href="#" @click.prevent="save">
                        <i v-if="editMode" class="fa fa-close"></i>
                    </a>
                    <a v-else class="nav-link" href="#" @click.prevent="editMode = !editMode">
                        <i class="fa fa-pencil"></i>
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <div class="container">
        <div class="row">
            <div v-show="editMode" class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Basics
                    </div>
                    <div class="card-block">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="label">Name</label>
                                    <input type="text" v-model="pc.name" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Type</label>
                                    <select v-model="pc.type" class="form-control">
                                        <option v-for="type in rules.types" v-bind:value="type.id">
                                            {{type.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div v-bind:class="[pc.npc? 'col-md-6' : 'col-md-12']">
                                <label>Size</label>
                                <div class="form-group">
                                    <select v-model="pc.size" class="form-control">
                                        <option v-for="size in rules.sizes" v-bind:value="size.id">
                                            {{size.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div v-if="pc.npc" class="col-md-6">
                                <div class="form-group">
                                    <label>Current size</label>
                                    <select v-model="pc.currentSize" class="form-control">
                                        <option v-for="size in rules.sizes" v-bind:value="size.id">
                                            {{size.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div v-if="!pc.titanPower" class="row">
                            <div class="col-md-12">
                                <label class="form-check-inline">
                                    <input class="form-check-input" name="magicSize" type="radio" value="reduced" v-model="pc.magicSize"> Reduced
                                </label>
                                <label class="form-check-inline">
                                    <input class="form-check-input" name="magicSize" type="radio" value="normal" v-model="pc.magicSize"> Normal
                                </label>
                                <label class="form-check-inline">
                                    <input class="form-check-input" name="magicSize" type="radio" value="enlarged" v-model="pc.magicSize"> Enlarged
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Abilities
                    </div>
                    <div class="card-block">
                        <div class="form-group row">
                            <div v-for="ability in rules.abilities" class="col-sm-2">
                                <label>{{ability.toUpperCase()}}</label>
                                <input type="number" v-model.number="pc.abilities[ability]" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Levels
                    </div>
                    <div class="card-block">
                        <div v-for="(cl, index) in pc.classes" class="form-group row">
                            <div class="col-md-8">
                                <select v-model="cl.id" class="form-control">
                                    <option v-for="value in availableClasses" v-bind:value="value.id">
                                        {{value.name}}
                                    </option>
                                </select>
                            </div>
                            <div class="col-md-2">
                                <input type="number" v-model.number="cl.levels" class="form-control">
                            </div>
                            <div class="col-md-2">
                                <button @click='removeLevels(index)' class="btn btn-danger">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <button @click='addLevels' class="btn btn-primary">Add levels</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Defense
                    </div>
                    <div class="card-block">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Armor</label>
                                    <select v-model="pc.armor.id" class="form-control">
                                        <option v-bind:value="false">-</option>
                                        <option v-for="armor in rules.armors" v-bind:value="armor.id">
                                            {{armor.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div v-if="pc.armor.id" class="form-group">
                                    <label>Enhancement</label>
                                    <select v-model="pc.armor.enhancement" class="form-control">
                                        <option v-for="bonus in rules.armorEnhancement" v-bind:value="bonus">
                                            +{{bonus}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div v-if="pc.armor.id" class="row">
                            <div class="col-md-6">
                                <label class="form-check-inline">
                                    <input class="form-check-input" type="checkbox" value="1" v-model="pc.armor.mithral"> Mithral
                                </label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Shield</label>
                                    <select v-model="pc.shield.id" class="form-control">
                                        <option v-bind:value="false">-</option>
                                        <option v-for="shield in rules.shields" v-bind:value="shield.id">
                                            {{shield.name}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div v-if="pc.shield.id" class="form-group">
                                    <label>Enhancement</label>
                                    <select v-model="pc.shield.enhancement" class="form-control">
                                        <option v-for="bonus in rules.armorEnhancement" v-bind:value="bonus">
                                            +{{bonus}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Damage reduction</label>
                            <div class="row">
                                <div class="col-md-6">
                                    <input type="number" v-model.number="pc.dr.reduction" class="form-control">
                                </div>
                                <div class="col-md-6">
                                    <select v-if="pc.dr.reduction" v-model="pc.dr.vulnerability" class="form-control">
                                        <option v-for="vulnerability in rules.vulnerabilities" v-bind:value="vulnerability.id">
                                            {{vulnerability.id}}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Spell resistance</label>
                                    <input type="number" v-model.number="pc.sr" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Natural armor</label>
                                    <input type="number" v-model.number="pc.naturalArmor" class="form-control">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Attack
                    </div>
                    <div class="card-block">
                        <h5>Melee</h5>
                        <div v-for="(weapon, index) in pc.weapons.melee">
                            <div class="card">
                                <div class="card-block">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label>Weapon</label>
                                                <select v-model="weapon.id" class="form-control">
                                                    <option v-bind:value="false">-</option>
                                                    <option v-for="weapon in rules.weapons.melee" v-bind:value="weapon.id">
                                                        {{weapon.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Enhancement</label>
                                                <select v-model="weapon.enhancement" class="form-control">
                                                    <option v-for="enhancement in rules.weaponEnhancement" v-bind:value="enhancement">
                                                        +{{enhancement}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Power Attack</label>
                                                <select v-model="weapon.powerAttack" class="form-control">
                                                    <option v-bind:value="0">0</option>
                                                    <option v-for="n in baseAttack" v-bind:value="n">
                                                        {{n}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Focus</label>
                                                <select v-model="weapon.focus" class="form-control">
                                                    <option v-bind:value="0">0</option>
                                                    <option v-for="n in 2" v-bind:value="n">
                                                        {{n}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Specialization</label>
                                                <select v-model="weapon.specialization" class="form-control">
                                                    <option v-bind:value="0">0</option>
                                                    <option v-for="n in 2" v-bind:value="n">
                                                        {{n}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div v-for="elemental in rules.weaponElemental" class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" v-bind:value="elemental" v-model="weapon.elemental"> {{_.capitalize(elemental)}}
                                            </label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div v-for="alignment in rules.weaponAlignment" class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" v-bind:value="alignment" v-model="weapon.alignment"> {{_.capitalize(alignment)}}
                                            </label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="1" v-model="weapon.masterwork"> Masterwork
                                            </label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="1" v-model="weapon.finesse"> Finesse
                                            </label>
                                        </div>
                                        <div v-if="weapon.doubleWeapon" class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="1" v-model="weapon.twoWeaponFighting"> Two-Weapon Fighting
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <button @click='removeMeleeWeapon(index)' class="btn btn-danger">Remove weapon</button>
                                </div>
                            </div>
                        </div>
                        <button @click='addMeleeWeapon' class="btn btn-primary">Add melee weapon</button>
                    </div>
                    <div class="card-block">
                        <h5>Ranged</h5>
                        <div v-for="(weapon, index) in pc.weapons.ranged">
                            <div class="card">
                                <div class="card-block">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label>Weapon</label>
                                                <select v-model="weapon.id" class="form-control">
                                                    <option v-bind:value="false">-</option>
                                                    <option v-for="weapon in rules.weapons.ranged" v-bind:value="weapon.id">
                                                        {{weapon.name}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Enhancement</label>
                                                <select v-model="weapon.enhancement" class="form-control">
                                                    <option v-for="enhancement in rules.weaponEnhancement" v-bind:value="enhancement">
                                                        +{{enhancement}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Composite</label>
                                                <select v-model="weapon.composite" class="form-control">
                                                    <option v-for="n in 10" v-bind:value="n">
                                                        {{n}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Focus</label>
                                                <select v-model="weapon.focus" class="form-control">
                                                    <option v-bind:value="0">0</option>
                                                    <option v-for="n in 2" v-bind:value="n">
                                                        {{n}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Specialization</label>
                                                <select v-model="weapon.specialization" class="form-control">
                                                    <option v-bind:value="0">0</option>
                                                    <option v-for="n in 2" v-bind:value="n">
                                                        {{n}}
                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div v-for="elemental in rules.weaponElemental" class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" v-bind:value="elemental" v-model="weapon.elemental"> {{_.capitalize(elemental)}}
                                            </label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div v-for="alignment in rules.weaponAlignment" class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" v-bind:value="alignment" v-model="weapon.alignment"> {{_.capitalize(alignment)}}
                                            </label>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="1" v-model="weapon.masterwork"> Masterwork
                                            </label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="1" v-model="weapon.pointBlankShot"> Point Blank Shot
                                            </label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="1" v-model="weapon.rapidShot"> Rapid Shot
                                            </label>
                                        </div>
                                        <div class="col-md-3">
                                            <label class="form-check-inline">
                                                <input class="form-check-input" type="checkbox" value="1" v-model="weapon.zen"> Zen Archery
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <button @click='removeRangedWeapon(index)' class="btn btn-danger">Remove weapon</button>
                                </div>
                            </div>
                        </div>
                        <button @click='addRangedWeapon' class="btn btn-primary">Add ranged weapon</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Enhancers
                    </div>
                    <div class="card-block">
                        <div v-for="(enhancer, index) in pc.enhancers">
                            <div class="card">
                                <div class="card-block">
                                    <div class="form-group">
                                        <input type="text" v-model="enhancer.name" class="form-control">
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-4">
                                            <select v-model="enhancer.category" class="form-control">
                                                <option v-for="category in rules.enhancers.categories" v-bind:value="category.id">
                                                    {{category.name}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-sm-4">
                                            <select v-model="enhancer.type" class="form-control">
                                                <option v-for="type in rules.enhancers.types" v-bind:value="type">
                                                    {{type}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-sm-4">
                                            <input type="number" v-model.number="enhancer.bonus" class="form-control">
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <button @click='removeEnhancer(index)' class="btn btn-danger">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button @click='addEnhancer' class="btn btn-primary">Add enhancer</button>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Special Qualities
                    </div>
                    <div class="card-block">
                        <div v-for="(quality, index) in pc.specialQualities">
                            <div class="form-group row">
                                <div class="col-md-10">
                                    <input type="text" v-model="quality.text" class="form-control">
                                </div>
                                <div class="col-md-2">
                                    <button @click='removeQuality(index)' class="btn btn-danger">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button @click='addQuality' class="btn btn-primary">Add quality</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="!editMode" class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Basics
                    </div>
                    <div class="card-block">
                        <p>
                            <strong>{{pc.name}}</strong><br>{{pc.currentSize}} {{pc.type}}
                        </p>
                        <p>
                            <strong>HP:</strong> {{hp}}
                        </p>
                        <p>
                            <strong>Abilities:</strong>
                            <span v-html="abilitiesString"></span>
                        </p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Defense
                    </div>
                    <div class="card-block">
                        <p>
                            <strong>AC:</strong> {{ac.total}}, touch {{ac.touch}}, flat-footed {{ac.flatFooted}} ({{acString}})
                        </p>
                        <p>
                            <strong>Saves:</strong> {{savesString}}
                        </p>
                        <p v-if='pc.dr.reduction'>
                            <strong>DR:</strong> {{pc.dr.reduction}}/{{pc.dr.vulnerability}}
                        </p>
                        <p v-if='pc.sr'>
                            <strong>SR:</strong> {{pc.sr}}
                        </p>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Attack
                    </div>
                    <div class="card-block">
                        <div>
                            <h5>
                                Melee
                            </h5>
                            <div v-for='weapon in attacks.melee' class='card card-block'>
                                <div>
                                    <strong>
                                        Weapon:
                                    </strong>
                                    <span v-if='weapon.enhancement'>
                                        +{{weapon.enhancement}}
                                    </span>
                                    <span v-for='elemental in weapon.elemental'>
                                        {{elemental}}
                                    </span>
                                    <span v-for='alignment in weapon.alignment'>
                                        {{alignment}}
                                    </span>
                                    <span>
                                        {{weapon.name}}
                                    </span>
                                </div>
                                <div>
                                    <strong>
                                        Attack:
                                    </strong>
                                    <span>
                                        {{weapon.fullAttack.join(' / ')}}
                                    </span>
                                </div>
                                <div class="text-muted" v-if="showInfo">
                                    {{weapon.attackFactorsString}}
                                </div>
                                <div>
                                    <strong>
                                        Damage:
                                    </strong>
                                    <span>
                                        {{weapon.damage.fixed}}
                                    </span>
                                    <span>
                                         + {{weapon.damage.dice}} weapon
                                    </span>
                                    <span v-for='elemental in weapon.elemental'>
                                        + 1d6 {{elemental}}
                                    </span>
                                    <span v-for='alignment in weapon.alignment'>
                                        + 2d6 {{alignment}}
                                    </span>
                                </div>
                                <div class="text-muted" v-if="showInfo">
                                    {{weapon.damageFactorsString}}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h5>
                                Ranged
                            </h5>
                            <div v-for='weapon in attacks.ranged' class="card card-block">
                                <div>
                                    <strong>
                                        Weapon:
                                    </strong>
                                    <span v-if='weapon.enhancement'>
                                        +{{weapon.enhancement}}
                                    </span>
                                    <span v-for='elemental in weapon.elemental'>
                                        {{elemental}}
                                    </span>
                                    <span v-for='alignment in weapon.alignment'>
                                        {{alignment}}
                                    </span>
                                    <span>
                                        {{weapon.name}}
                                    </span>
                                </div>
                                <div>
                                    <strong>
                                        Attack:
                                    </strong>
                                    <span>
                                        {{weapon.fullAttack.join(' / ')}}
                                    </span>
                                </div>
                                <div class="text-muted" v-if="showInfo">
                                    {{weapon.attackFactorsString}}
                                </div>
                                <div>
                                    <strong>
                                        Damage:
                                    </strong>
                                    <span>
                                        {{weapon.damage.fixed}}
                                    </span>
                                    <span>
                                         + {{weapon.damage.dice}} weapon
                                    </span>
                                    <span v-for='elemental in weapon.elemental'>
                                        + 1d6 {{elemental}}
                                    </span>
                                    <span v-for='alignment in weapon.alignment'>
                                        + 2d6 {{alignment}}
                                    </span>
                                </div>
                                <div class="text-muted" v-if="showInfo">
                                    {{weapon.damageFactorsString}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-header">
                        Special Qualities
                    </div>
                    <div class="card-block">
                        <p v-for="(quality, index) in pc.specialQualities">
                            {{quality.text}}
                        </p>
                    </div>
                </div>
                <hr>
                <div class="actions">
                    <button class="btn btn-block" v-bind:class="{'active': pc.haste}" @click='pc.haste = !pc.haste'>
                        <div><img src="img/haste.png"></div>
                        <span v-if="pc.haste">Stop</span>
                        <span v-else>Start</span>
                        Haste
                    </button>
                    <button class="btn btn-block" v-bind:class="{'active': pc.majorHaste}" @click='pc.majorHaste = !pc.majorHaste'>
                        <div><img src="img/major-haste.png"></div>
                        <span v-if="pc.majorHaste">Stop</span>
                        <span v-else>Start</span>
                        Major haste
                    </button>
                    <button class="btn btn-block" v-bind:class="{'active': pc.flanking}" @click='pc.flanking = !pc.flanking'>
                        <div><img src="img/rogue.png"></div>
                        <span v-if="pc.flanking">Stop</span>
                        <span v-else>Start</span>
                        Flanking
                    </button>
                    <button class="btn btn-block" v-bind:class="{'active': pc.titanPower}" @click='toggleTitanPower'>
                        <div><img src="img/titan.png"></div>
                        <span v-if="pc.titanPower">Stop</span>
                        <span v-else>Start</span>
                        Titan Power
                    </button>
                    <button v-if="antimagic" class="btn btn-block" @click='stopAntimagic'>
                        <div><img src="img/magic.png"></div>
                        Start magic
                    </button>
                    <button v-if="!antimagic" class="btn btn-block active" @click='startAntimagic'>
                        <div><img src="img/magic.png"></div>
                        Stop magic
                    </button>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script type="text/javascript">
var character = <?=$file?>;
</script>

<script src="//cdnjs.cloudflare.com/ajax/libs/vue/2.0.1/vue.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/vue-resource/1.0.3/vue-resource.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.2/lodash.min.js"></script>
<script src="lang.js?"></script>
<script src="rules.js?"></script>
<script src="app.js?"></script>

</html>