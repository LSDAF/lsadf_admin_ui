export interface GameMetadata {
  id: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
  nickname: string;
}

export interface Characteristics {
  attack: number;
  critChance: number;
  critDamage: number;
  health: number;
  resistance: number;
}

export interface Currency {
  gold: number;
  diamond: number;
  emerald: number;
  amethyst: number;
}

export interface Stage {
  currentStage: number;
  maxStage: number;
  wave: number;
}

export interface GameSave {
  metadata: GameMetadata;
  characteristics: Characteristics;
  currency: Currency;
  stage: Stage;
}
