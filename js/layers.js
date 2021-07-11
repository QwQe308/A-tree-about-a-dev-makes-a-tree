var version = 0
var DEVreq = {
    v0:[0.2,0.5,1,30,90,1e10,1e11,1e13,1e30,1e31,1e50,1e53]
}
var VERSIONreq = {
    v0:1e56
}
var VERSIONchange = {
    0:0,
    1:0.1
}
var shownum = false
var showprestigetext = false
var layerslist=["p","dev"/*,"v","u"*/]

function isable(input){
    if(input) return 0;
    return "10{10}10"
}

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        cha:{
            11:ExpantaNum(0),
            "11log%":ExpantaNum(0),
            12:ExpantaNum(0),
            "12log%":ExpantaNum(0),
        }
    }},
    color: "lightblue",
    canReset(){return hasUpgrade("dev",14)&&player.points.gte(layers.p.requires())},
    requires(){return new ExpantaNum(10)}, // Can be a function that takes requirement increases into account
    trueResource: "重置点(p点)", // Name of prestige currency
    trueBaseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        mult = mult.mul(challengeEffect("p",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = new ExpantaNum(1)
        exp = exp.mul(upgradeEffect("p",22))
        if(inChallenge("p",12)) exp=exp.mul(0.8)
        if(inChallenge("dev",21)) exp=exp.mul(1.1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    clickables: {
        11: {
            canClick(){return player.dev.upgrades!=[]},
            display() {return `重置升级 不返回任何点数。`},
            onClick(){player.p.upgrades=[];player.points = new ExpantaNum(0)}
        }
    },
    layerShown(){return hasUpgrade("dev",14)},
    effect(){
        var eff = hasUpgrade("p",23) ? player.p.best.pow(0.5).add(1).pow(upgradeEffect("p",21)) : player.p.points.pow(0.5).add(1).pow(upgradeEffect("p",21))
        if(inChallenge("dev",21)) eff = eff.pow(1.2)
        return eff
    },
    effectDescription(){return `加成点数获取x${format(layers.p.effect(),1)}`},
    deactivated(){return !hasUpgrade("dev",14)},

    upgrades: {
        11: {
            description: "p11:p点获取量基于点数的数量级提升。",
            cost(){
                var base = new OmegaNum(9).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.points.max(1).log10().max(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",11),1)}`}
        },
        12: {
            description: "p12:点数加成自身。",
            cost(){
                var base = new OmegaNum(25).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.points.add(1).log10().add(1).pow(2).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",12),1)}`}
        },
        13: {
            description: "p13:重置点再次加成点数。",
            cost(){
                var base = new OmegaNum(128).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return player.p.points.add(1).pow(2).log10().add(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",13),1)}`}
        },
        14: {
            description: "p14:重置点改善前三个升级。",
            cost(){
                var base = new OmegaNum(8192).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",14) ? player.p.points.add(1).log10().add(1).pow(2).log10().div(5).add(1).pow(upgradeEffect("p",15)) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(player.p.points.add(1).log10().add(1).pow(2).log10().div(5).add(1).pow(upgradeEffect("p",15)),2)}`}
        },
        15: {
            description: "p15:点数改善p14。",
            cost(){
                var base = new OmegaNum(131072).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",15)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",15) ? player.points.add(1).log10().add(1).pow(2).log10().div(10).add(1) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(player.points.add(1).log10().add(1).pow(2).log10().div(10).add(1),2)}`}
        },
        21: {
            description: "p21:点数加成重置点对点数的加成。",
            cost(){
                var base = new OmegaNum(262144).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",22)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",21) ? ExpantaNum(1.75).sub(ExpantaNum(0.75).div(player.points.add(1).log10().pow(0.5).div(3).add(1))) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(ExpantaNum(1.75).sub(ExpantaNum(0.75).div(player.points.add(1).log10().pow(0.5).div(3).add(1))),2)}`}
        },
        22: {
            description: "p22:重置点加成重置点获取指数。",
            cost(){
                var base = new OmegaNum(524288).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasUpgrade("dev",22)||hasUpgrade("dev",23)},
            effect(){return hasUpgrade("p",22) ? ExpantaNum(1.5).sub(ExpantaNum(0.5).div(player.p.points.add(1).log10().pow(0.5).div(5).add(1))) : new ExpantaNum(1)},
            effectDisplay(){return `x${format(ExpantaNum(1.5).sub(ExpantaNum(0.5).div(player.p.points.add(1).log10().pow(0.5).div(5).add(1))),2)}`}
        },
        23: {
            description: "p23:解锁几个p挑战。注：进入它们重置p层级，但你目前的p点对点数的加成改为基于最大p点值。挑战中升级不能重置。挑战奖励不会因失去这个升级而消失。",
            cost(){return new OmegaNum(2e6).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))},
            unlocked(){return hasUpgrade("dev",22)||hasUpgrade("dev",23)},
        },
        24: {
            description: "p24:pc11的效果的平方影响点数。",
            cost(){
                var base = new OmegaNum(1e27).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasChallenge("dev",21)},
            effect(){return challengeEffect("p",11).pow(2)},
            effectDisplay(){return `x${format(upgradeEffect("p",24),1)}`}
        },
        25: {
            description: "p25:获得一个随时间降低的点数产量加成。",
            cost(){
                var base = new OmegaNum(1e36).mul(player.devSpeed).add(isable(upgradeEffect("dev",23)))
                if(inChallenge("p",11)||inChallenge("dev",21)) base = base.add(player.p.points.div(1.33))
                return base
            },
            unlocked(){return hasChallenge("dev",21)},
            effect(){return ExpantaNum(16384).div(player.p.resetTime+1000).pow(2).add(1)},
            effectDisplay(){return `x${format(upgradeEffect("p",25),1)}`}
        },
    },
    challenges: {
        11: {
            name: "pc11:SUPER PRESTIGE",
            challengeDescription: "重置p层级时，p层级升级被重置。同时，升级价格加上你的p点数的75%。",
            goalDescription(){return format(ExpantaNum(1e20))+"点数"},
            goal:ExpantaNum(1e20),
            rewardDisplay(){return `你在此挑战中的对数进度的立方(${format(player.p.cha["11log%"].pow(3).mul(100),2)}%)会给予你以下加成：<br /> x${format(challengeEffect("p", 11),2)}P点获取`},
            rewardEffect(){return OmegaNum(100).pow(player.p.cha["11log%"].pow(3))},
            unlocked(){return hasUpgrade("p",23)},
            onEnter(){player.p.upgrades=[23];player.p.points=new ExpantaNum(0)},
            onExit(){player.p.activeChallenge=11}
        },
        12: {
            name: "pc12:META P-POINT",
            challengeDescription: "超过你所拥有的p点的点数产量被软上限。(^0.5)点数获取指数降低。(x0.8)",
            goalDescription(){return format(ExpantaNum(1e20))+"点数"},
            goal:ExpantaNum(1e20),
            rewardDisplay(){return `你在此挑战中的对数进度的立方(${format(player.p.cha["12log%"].pow(3).mul(100),2)}%)会给予你以下加成：<br /> x${format(challengeEffect("p", 12),2)}点数`},
            rewardEffect(){return OmegaNum(1000).pow(player.p.cha["12log%"].pow(3))},
            unlocked(){return hasUpgrade("p",23)},
            onEnter(){player.p.upgrades=[23];player.p.points=new ExpantaNum(0)},
            onExit(){player.p.activeChallenge=12}
        },
    },
    onPrestige(gain){if(inChallenge("p",11)||inChallenge("dev",21)){player.p.upgrades=[23]}},
    update(diff){
        if(!player.p.cha) player.p.cha={}
        for(i=11;i<=12;i++){
            if(inChallenge("p",i)){
                player.p.cha[i]=player.p.cha[i].max(player.points).min(layers.p.challenges[i].goal)
                player.p.cha[i+"log%"]=player.p.cha[i].add(1).log10().div(layers.p.challenges[i].goal.log10()).min(1)
                if(!hasUpgrade("p",23)) player.p.activeChallenge=null
        }}
    }
})

addLayer("dev", {
    name: "dev", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DEV", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    requires(){
        if(DEVreq["v"+version][player.dev.total.toNumber()]){return ExpantaNum(DEVreq["v"+version][player.dev.total.toNumber()])}
        else{return ExpantaNum("10{10}10")}
    }, // Can be a function that takes requirement increases into account
    trueResource: "开发点", // Name of prestige currency
    trueBaseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 10, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for dev points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    clickables: {
        11: {
            canClick(){return player.dev.upgrades!=[]},
            display() {return `重置升级 返回你使用的 ${format(player.dev.total.sub(player.dev.points))} ${tmp[layer].resource}`},
            onClick(){player.dev.upgrades=[];player.dev.points=player.dev.total;for (let x = 9; x >= 0; x--) rowReset(x, "dev");player.points = new ExpantaNum(0);player.dev.activeChallenge=null}
        }
    },
    upgrades: {
        11: {
            description: "点数显示有点问题。修复一下。注：此类升级可能需要重新进入对应节点才能生效。",
            cost(){return hasChallenge("dev", 11) ? new OmegaNum(0) : new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(1)},
        },
        12: {
            description: "点数名称有点问题。修复一下。并且添加重置按钮的文字。",
            cost(){return hasChallenge("dev", 12) ? new OmegaNum(0) : new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(2)}
        },
        13: {
            description: "gameloop好像有点问题。让它循环起来。",
            cost(){return new OmegaNum(2)},
            unlocked(){return player.dev.total.gte(3)},
        },
        14: {
            description: "制作节点“P”。",
            cost(){return new OmegaNum(2)},
            unlocked(){return player.dev.total.gte(4)},
        },
        15: {
            description: "制作节点“P”的前5个升级。同时，解锁开发挑战11。（要不是少了devU11要很迷才不会有这个",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(5)},
        },
        21: {
            description: "开启开发者加速以便调试游戏。注：升级价格同样增加。该升级不能中途购买。",
            cost(){return new OmegaNum(2).add(isable(player.p.total.eq(0)))},
            unlocked(){return player.dev.total.gte(6)},
            effect(){return ExpantaNum(10).pow(player.dev.total.sub(4).sqrt().sub(1)).toNumber()}
        },
        22: {
            description: "制作节点“P”的第6至8升级。",
            cost(){return new OmegaNum(5)},
            unlocked(){return player.dev.total.gte(7)},
            effect(){return ExpantaNum(10).pow(player.dev.total.sub(4).sqrt().sub(1)).toNumber()}
        },
        23: {
            description: "制作节点“P”的前8个升级，但你只能在所有p升级中选择5个，以加强趣味性。注：和devU14和U22冲突。",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(7)},
            effect(){return hasUpgrade("dev",23) ? 5-player.p.upgrades.length : true}
        },
        24: {
            description: "开启开发挑战12.",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(7)},
        },
        25: {
            description: "开启开发挑战13...?",
            cost(){return new OmegaNum(3)},
            unlocked(){return player.dev.total.gte(8)},
        },
    },

    challenges: {
        11: {
            name: "AntiLooperrrr",
            challengeDescription: "因为挑战出了bug，devU13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留dev11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
        12: {
            name: "Looperrrr",
            challengeDescription: "因为刷新功能时出了bug，刷新不能产生任何效果。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `loop的速度x20。同时，dev12效果被保留。`},
            unlocked(){return hasUpgrade("dev",24)}
        },
        21: {
            name: "buggy",
            challengeDescription: "游戏全是bug。现在你将获得以下效果：<br />1.刷新效果乘以一个不稳定的小于等于0.2的数<br />2.所有p挑战效果起效<br />3.点数越多loop效率越低<br />4.开局解锁p挑战(不会重复产生debuff)，但重置p升级后会失效，且目标降至1e12<br />5.p点指数x1.1<br />6.p点效果^1.2",
            onEnter(){player.p.upgrades=[23]},
            canComplete(){return player.points.gte(1e13)},
            goalDescription(){return format(ExpantaNum(1e13))+"点数"},
            rewardDisplay(){return `开启最后两个p升级。`},
            unlocked(){return hasUpgrade("dev",25)}
        },
    },

    //inportant!!!
    update(diff){
        if(hasUpgrade("dev",11)||hasChallenge("dev",11)){
            shownum = true
        }else{
            shownum = false
        }
        if(hasUpgrade("dev",12)||hasChallenge("dev",12)){
            modInfo.pointsName="点数"
            showprestigetext = true
            for(i in layerslist) {
            tmp[layerslist[i]].resource=tmp[layerslist[i]].trueResource
            tmp[layerslist[i]].baseResource=tmp[layerslist[i]].trueBaseResource
            }
        }
        else{
            modInfo.pointsName="undefined"
            showprestigetext = false
            for(i in layerslist){
            tmp[layerslist[i]].resource="undefined"
            tmp[layerslist[i]].baseResource="undefined"
            }
        }
        player.devSpeed=1
        if(hasUpgrade("dev",21)) player.devSpeed*=upgradeEffect("dev",21)
        if(inChallenge("dev",21)){
            layers.p.challenges[11].goal = ExpantaNum(1e12)
            layers.p.challenges[12].goal = ExpantaNum(1e12)
        }else{
            layers.p.challenges[11].goal = ExpantaNum(1e20)
            layers.p.challenges[12].goal = ExpantaNum(1e20)
        }
    }
})

function calcLoopTimeBoost(){
    var tb = 1
    if(hasChallenge("dev",12))  tb*=20
    if(player.dev.trueDevMode) tb*=10
    if(inChallenge("dev",21)&&player.points.log10().toNumber()) tb/=player.points.add(10).log10().toNumber()
    return tb
}
function calcRefreshTimeBoost(){
    var tb = 1
    if((!hasChallenge("dev", 11)&&inChallenge("dev", 11))||hasChallenge("dev", 11)) tb*=100
    if(inChallenge("dev",12)) tb = 0
    if(player.dev.trueDevMode) tb*=10
    if(inChallenge("dev",21)) tb*=Math.random()/5
    return tb
}
/*
addLayer("v", {
    name: "version", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "V", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
    branches:["dev"],
    requires(){
        if(VERSIONreq["v"+version]){return ExpantaNum(VERSIONreq["v"+version])}
        else{return ExpantaNum("10{10}10")}
    }, // Can be a function that takes requirement increases into account
    trueResource: "版本更新点", // Name of prestige currency
    trueBaseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 11, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for update", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.dev.total.gte(12)},
    clickables: {
        11: {
            canClick(){return player.v.upgrades!=[]},
            display() {return `重置升级 返回你使用的 ${format(player.v.total.sub(player.v.points))} ${tmp[layer].resource}`},
            onClick(){player.v.upgrades=[];player.v.points=player.v.total;for (let x = 10; x >= 0; x--) rowReset(x, "v");player.points = new ExpantaNum(0);player.v.activeChallenge=null}
        }
    },
    upgrades: {
        11: {
            title: "next update is in 5 hours",
            description: "解锁“更新”节点",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(1)},
        },
    },
    challenges: {
        11: {
            name: "AntiLooperrrr",
            challengeDescription: "因为挑战出了bug，devU13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留dev11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
    },

    //inportant!!!
    update(diff){
        version = VERSIONchange[player.v.total]
    }
})

addLayer("u", {
    name: "update", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "lime",
    trueResource: "更新时间", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 11, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "v", description: "V: Reset for update", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.dev.total.gte(12)},
    clickables: {
        11: {
            canClick(){return player.v.upgrades!=[]},
            display() {return `重置升级 返回你使用的 ${format(player.v.total.sub(player.v.points))} ${tmp[layer].resource}`},
            onClick(){player.v.upgrades=[];player.v.points=player.v.total;for (let x = 10; x >= 0; x--) rowReset(x, "v");player.points = new ExpantaNum(0);player.v.activeChallenge=null}
        }
    },
    upgrades: {
        11: {
            description: "next update is in 5 hours。",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(1)},
        },
    },
    challenges: {
        11: {
            name: "AntiLooperrrr",
            challengeDescription: "因为挑战出了bug，devU13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留dev11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
    },

    //inportant!!!
    update(diff){
        version = VERSIONchange[player.v.total]
    }
})
*/