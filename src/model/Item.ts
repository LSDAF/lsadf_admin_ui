export enum ItemType {
  BOOTS = "boots",
  CHESTPLATE = "chestplate",
  GLOVES = "gloves",
  HELMET = "helmet",
  SHIELD = "shield",
  SWORD = "sword",
}

export enum ItemRarity {
  NORMAL = "NORMAL",
  RARE = "RARE",
  MAGIC = "MAGIC",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
  MYTHIC = "MYTHIC",
}

export enum ItemStatistic {
  ATTACK_ADD = "attack_add",
  ATTACK_MULT = "attack_mult",
  CRIT_CHANCE = "crit_chance",
  CRIT_DAMAGE = "crit_damage",
  HEALTH_ADD = "health_add",
  HEALTH_MULT = "health_mult",
  RESISTANCE_ADD = "resistance_add",
  RESISTANCE_MULT = "resistance_mult",
}

export interface ItemStat {
  statistic: ItemStatistic;
  baseValue: number;
}

export interface Item {
  id: string;
  gameSaveId: string;
  clientId: string;
  blueprintId: string;
  type: ItemType;
  itemRarity: ItemRarity;
  isEquipped: boolean;
  level: number;
  mainStat: ItemStat;
  additionalStats: ItemStat[];
}
