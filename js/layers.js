var version = 0
var DEVreq = {
    v0:[0.2,3,4,30,90,1e10]
}
var shownum = false
var showprestigetext = false
var layerslist=["p","dev"]

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#4BDC13",
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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("dev",14)},
    effect(){return player.p.points.pow(0.5).add(1)},
    effectDescription(){return `加成点数获取x${format(layers.p.effect(),1)}`},
    deactivated(){return !hasUpgrade("dev",14)},

    upgrades: {
        11: {
            description: "p11:p点获取量基于点数的数量级提升。",
            cost(){return new OmegaNum(9)},
            unlocked(){return hasUpgrade("dev",15)},
            effect(){return player.points.max(1).log10().max(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",11),1)}`}
        },
        12: {
            description: "p12:点数加成自身。",
            cost(){return new OmegaNum(25)},
            unlocked(){return hasUpgrade("dev",15)},
            effect(){return player.points.add(1).log10().add(1).pow(2).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",12),1)}`}
        },
        13: {
            description: "p13:重置点再次加成点数。",
            cost(){return new OmegaNum(128)},
            unlocked(){return hasUpgrade("dev",15)},
            effect(){return player.p.points.add(1).pow(2).log10().add(1).pow(upgradeEffect("p",14))},
            effectDisplay(){return `当前效果：x${format(upgradeEffect("p",13),1)}`}
        },
        14: {
            description: "p14:重置点改善前三个升级。",
            cost(){return new OmegaNum(8192)},
            unlocked(){return hasUpgrade("dev",15)},
            effect(){return hasUpgrade("p",14) ? player.p.points.add(1).log10().add(1).pow(2).log10().div(5).add(1).pow(upgradeEffect("p",15)) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(player.p.points.add(1).log10().add(1).pow(2).log10().div(5).add(1).pow(upgradeEffect("p",15)),2)}`}
        },
        15: {
            description: "p15:点数改善p14。",
            cost(){return new OmegaNum(131072)},
            unlocked(){return hasUpgrade("dev",15)},
            effect(){return hasUpgrade("p",15) ? player.points.add(1).log10().add(1).pow(2).log10().div(10).add(1) : new ExpantaNum(1)},
            effectDisplay(){return `^${format(player.points.add(1).log10().add(1).pow(2).log10().div(10).add(1),2)}`}
        },
    },
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
            onClick(){player.dev.upgrades=[];player.dev.points=player.dev.total;for (let x = 9; x >= 0; x--) rowReset(x, layer);player.points = new ExpantaNum(0)}
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
            cost(){return new OmegaNum(1)},
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
            description: "制作节点“P”的前5个升级。同时，开启开发挑战1。（要不是少了devU11要很迷才不会有这个",
            cost(){return new OmegaNum(1)},
            unlocked(){return player.dev.total.gte(5)},
        },
    },

    challenges: {
        11: {
            name: "AntiLooperrrr",
            challengeDescription: "不管怎么样，反正就是devU13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留devU11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
    },

    //inportant!!!
    update(diff){
        if(hasUpgrade("dev",11)||hasChallenge("dev",11)){
            shownum = true
        }else{
            shownum = false
        }
        if(hasUpgrade("dev",12)){
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
    }
})


